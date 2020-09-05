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


## Sources:
* https://schemers.org/Documents/Standards/R5RS/r5rs.pdf
* http://norvig.com/lispy.html
* https://geoffreylitt.com/2018/01/15/adding-tail-calls-optimization-to-a-lisp-interpreter.html
