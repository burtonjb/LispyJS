# LispyJS
The project is a scheme interpreter, written in javascript.
Its based on the R5S5 spec, mostly because that one has/had a nice PDF for the language spec

Its hosted as a static website that you can find here: https://burtonjb.github.io/LispyJS/

# Overview
Scheme is primarily a functional programming language and is a dialect of lisp. 

It has very simple syntax based on s-expressions which are just paranthesized lists.

## Language features
### Simplicity. 

The language is a simple language and pretty easy to implement. This is great for me, as I'll be implementing it.

In the somewhat outdated R5S5 spec, 14 of the 23 s-expression syntatic constructs can be defined in terms of the fundamental constructs

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

## Sources:
* https://schemers.org/Documents/Standards/R5RS/r5rs.pdf
* http://norvig.com/lispy.html
* https://geoffreylitt.com/2018/01/15/adding-tail-calls-optimization-to-a-lisp-interpreter.html
