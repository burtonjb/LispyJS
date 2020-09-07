# LispyJS
The project is a scheme interpreter, written in javascript.
Its based on the R5RS spec, mostly because that one has/had a nice PDF for the language spec

Its hosted as a static website that you can find here: https://burtonjb.github.io/LispyJS/

# Overview
Scheme is primarily a functional programming language and is a dialect of lisp. 

It has very simple syntax based on s-expressions which are just paranthesized lists.

## Language features
### Simplicity. 

The language is a simple language and pretty easy to implement. This is great for me, as I'll be implementing it.

In the somewhat outdated R5RS spec, 14 of the 23 s-expression syntatic constructs can be defined in terms of the fundamental constructs

fundamental: `define`, `lambda`, `quote`, `if`, `define-syntax`, `let-syntax`, `letrec-syntax`, `syntax-rules`, `set!`

derived: `do`, `let`, `let*`, `letrec`, `cond`, `case`, `and`, `or`, `begin`, `named let`, `delay`, `unquote`, `unquote-splicing`, `quasiquote`

### Lexical (static) scoping

The language is lexically scoped. Name resolution depends on where the named variable is defined, not where the named variable is used. 
This is nice as name resolution can be determined before runtime. 

For example, suppose you have the following code block:
```
( begin
 ( define x 1)
 ( define f ( lambda () ( + x 1)))
 ( f )  ; f being called here always returns 2, no matter the scoping style
 (( lambda () (begin  ; this weird syntax defines a lambda and then immediately calls it
    ( define x 3)
    ( f ))
    ))
)
```

Using lexical scoping, the parent scope of f would be set when the lambda was CREATED, and would use the value of x equal to 1. The output would be 2.
Using dynamic scoping, the parent scope of f would be set when the lambda was CALLED, and would use the value of x equal to 3. The output would be 4.

### Other language features
* dynamically typed
* garbage collected
* proper tail call elimination
* functions as first class variables
* continuations as first class variables 
* eager evaluation (arguments to functions are eagerly evaluated)

# Components

## Parser
The parser is pretty simple. 
Its made up of a:
* tokenizer - which converts the input string into a list of tokens (and cleans up some of the whitespace, and potentially comments later)
* parser - which converts the list of tokens into a s-expression. It will recursively create lists and sublists of tokens. It checks that the number of open and close tokens match. 

## Repl
The repl right now is really simple. It takes in an input string and outputs the corresponding s-expression.

## Very simple evaluator and environment 
An expression is a command that is evaluated. The slightly complicated part is that the expression must be evaluated in an environment. 

For example: `(+ 1 2)` will pretty obviously return 3, but what about variable lookups like `x` or function calls like `(f args)`

These need to be evaluated in an environment where the values of `x`, `f`, and `args` are defined. An environment is a mapping of names to values. 

### Environment
In scheme, an environment has two components:
1. The mapping of names to values
2. The parent environment

Parts of the evaluation step will look up values in the current environment. If they don't exist, then the parent will be checked. 

There's also a root environment, where native method calls will be defined. 

### Evaluate
The evaluation of an expression in scheme is matched against a couple patterns.
1. Check if the expression is a variable reference or a constant
2. Check if the expression is a fundamental special form
3. Assume its a function call of the form `(f args)`

As of now, evaluate is really simple.

There are currently no special forms defined, so it only supports variable look ups, constants, and built-in functions. 

One thing to note is that evalExpression is using the javascript call stack. I may want to create my own stack and use that, as I think it will make it easier to support blocks and call/cc.


### Evaluate - special forms
The next step is to support some of the simpler special forms. 
The simplest forms that don't require any large modifications are `define`, `quote`, `if`, `set!`

| form | syntax| semantics| example | 
|--|--|--|--|
| define |  (define variable expression )| defines a variable and sets the variable's value to the evaluated expression *in the current environment* | (define x 28) => sets x to 28 in the current scope. Will error if x is already bound |
| set! | (set! symbol expression) | sets the value of symbol to the value of the evaluated expression *in the environment that it is defined* | (set! x 1) => sets x to 1 in the scope that x was bound. Errors if x was not already bound |
| quote | (quote expression ) | returns the expression, doesn't evaluate it | (quote (a b c)) => (a b c) |
| if | (if test true-exp false-exp) |  evaluate test. If true evaluate and return true-exp, otherwise evaluate and return false-exp | (if (= a b) (+ a b) (- a b) ) |

Note that the results of `define` and `set` are unspecified. In my implementation, they will return the value of the variable so you can do stuff like `(define x (define y 100))` to set both x and y to 100.

At this point `set!` and `define` are partially implemented, but they will need to change when the `lambda` special form is created.

I've also set up two types of special form functions - raw functions (in special.js) which contain the implementation of the function, and checked functions, which will throw errors if some of the preconditions are violated. I found the checked ones hard to read, but easier to use (the program will fail with an error instead of doing something random). 

remaining forms are: `lambda`, `define-syntax`, `let-syntax`, `letrec-syntax`, `syntax-rules` and they require much more work.

### Evaluate - special forms - lambda 
| form | syntax| semantics| example | 
|--|--|--|--|
| lambda |  (lambda args body )| creates a lambda function, with arguments *args* and function body *body*  | (lambda (x) (+ x x)) => creates a function that returns the input added to itself. |

A couple things need to change to support this change.

Starting off, there needs to be a 'Lambda' class. This class will have 3 properties:
1. List of parameter names
2. function body
3. the parent environment. This needs to be saved when the lambda is created for the language to be lexically scoped. If instead this was passed in when the lambda was classed it would be dynamically scoped (pretty cool how this small change can change a large property of the language :) )

The lambda will have one method - call. It will create a new child environment, bind the input args to the parameter names and then evaluate the body of the lambda in the new env. 

The input args can have one of the following forms:
1. the proc takes in a fixed number of args
2. the proc takes in any number of args and the sequence is converted into a list
3. the proc takes in n mandatory args and then a tail that is converted into a list

I'm only implementing the first case for now.

The second thing that needs to change is the Environment. It now has to has to actually have its own scope and also the parent scope. There is then a find function which will return the Environment in which the key is defined (or undef if there is no definition)

This environment change means that `set!` will need to be updated and more tests will need to be added for `define`.

In addition, the variable reference semi-special form will need to be updated to search through the environments to find the one where the value is defined. 

### Checkin - what can you do with lispy with the current implementation
The language should now be turin complete! It supports assignment, branching and iteration through recursion.

You can check the test cases in `appl.spec.ts` or `sicp.spec.ts` to see what the language can support. Some examples are:
* defining variables
* creating functions
* defining *recursive* functions
* can pass functions as data and return functions as data (and supports functional closures)
* chapter 1.1 examples of **The Structure and Interpretation of Computer Programs (SICP)**

That's pretty good!

Limitations:
* its still missing some of the fundamental standard forms: `define-syntax`, `let-syntax`, `letrec-syntax`, `syntax-rules`
* it doesn't support tail call elimination, so recursion right now is limited
* (Almost) no error reporting or recovery. There's probably some error messages lying around that I haven't cleaned up, but it should be better thought out

### Tail call optimization
A tail call is a function call that is performed as the final action of a function. 

Tail calls can be implmeneted without adding a new stack frame to the call stack. Instead the frame of the current procedure is replaced with the frame of the tail call, modified as needed. 

The scheme language spec requires tail call optimization to be implemented and its the only way to do infinite loops with recursion (if it wasn't implemented the stack would blow up eventually)

Consider the two following implmentations of a function to calculate a factorial (examples are from wikipedia):

The below function is not tail recursive:
```
(define (factorial n)
 (if (= n 1)
    1
    (* n (factorial (- n 1)))))
```

The stack would look like:
```
  call factorial (4)
   call fact-iter (1 4)
    call fact-iter (4 3)
     call fact-iter (12 2)
      call fact-iter (24 1)
      return 24
     return 24
    return 24
   return 24
  return 24
``` 
when called. 

Rewritten to be tail recursive:
```
(define (factorial n)
  (fact-iter 1 n))
(define (fact-iter product n)
  (if (< n 2)
      product
      (fact-iter (* product n)
                 (- n 1))))
```

```
  call factorial (4)
   call fact-iter (1 4)
   replace arguments with (4 3)
   replace arguments with (12 2)
   replace arguments with (24 1)
   return 24
  return 24
```

Instead of recursively calling `evalExpression` the following changes are required:
* evalExpression should loop.
* instead of `if` calling eval on the true/false condition, the current expression is set to the unevaluated value of the branch chosen
* (optional, which I've opted not to do) convert `begin` to a special form which takes the rest of the expression, calls evalExpression on the rest and then returns the last result. 
* Procedures:
        
        The procedure evaluation is currently:
        1. Evaluate 'car' in the current expression. Assume its a function call.
        2. evaluate each of the 'cdr' in the current expression. They are function arguments [this weirdness is for cases like `((f-maker) (arg-maker 1) (arg-maker 2))`

        Something similar is still done, but its more complicated.
        
        1. Evaluate each of the expressions and store them
        2. again, assume the car is the function, and the cdr are args
        3. switch on the type of car - if its a builtIn function call it.
            Otherwise its a custom lambda. Replace the current expression with the body of the lambda and the current environment with a new environment with the parent of the envionrment being the lambda environment and the arg bindings being the evaluated args from (new)step 2. Then go back to the beginning of eval.

I added a simple test case to verify that tail call optimization works for at least really simple tail calls. 

### Parsing, fileIO (just I) and eval. 

This change adds some wrappers around already defined methods and some file utilities.

functions:
* parse: str => s-expression. Converts the input string into a parsed s-expression
* slurp: file path => string. Reads in the contents of the file in the path into a string.

| form | syntax| semantics| example | 
|--|--|--|--|
| eval |  (eval expression [initial-env])| evaluates the expression in the initial user environment | (eval (quote (x))) => evaluates x as if it was an input command|


## Sources:
* https://schemers.org/Documents/Standards/R5RS/r5rs.pdf
* http://norvig.com/lispy.html
* https://geoffreylitt.com/2018/01/15/adding-tail-calls-optimization-to-a-lisp-interpreter.html
