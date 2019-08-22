# LispyJS
The project is a scheme interpreter, written in javascript

Its hosted as a static website that you can find here: https://burtonjb.github.io/LispyJS/

## Components
### Parser
The parser is really simple. It tokenizes, replacing all whitespace groups with a single space (matching \s+). The parser then takes all the tokens and converts them into s-expressions (nested lists and/or atoms). An atom is a singular string/number, and a list is represented as a javascript list.

### Variable Binding
Binding variables/the symbol table is defined in the environment class. There is a global environment, which stores all the system defined functions and values (functions like +, - and values like true/false). The implementation is a simple map, and users can define new values with the 'define' keyword. If the value has been already set, the user must use the 'set!' keyword to override the value. 
In addition to the global environment, there are function/lambda scoped environments. These are scoped to the function and will alias anything in the global environment. If something isn't found in the local environment it will go to the scope of the calling function, which will check the scope of its caller, until the value is found or the value is not found in the global environment. 

If you have a callstack like
|---|---|
|f1|a,b|
|f2|x,y|
|global|z|

and you want to use variable x in f1, the environment for f1 will not find the value, but it will use the value bound in f2. If you were to use something not declared, then it would search the f1 env, then the f2 env and then the global env. It would not be found and throw an error.

### Eval (named s_eval as eval is a function in javascript)
The s_eval function is the main function in the scheme interpreter. It checks the type of the input, if its not a list/s-expression, it returns the value. If it is an s-expression, it will evaluate it. There are some special forms ('define', 'if', 'quote', 'set!', 'lambda', etc) which have special logic. If the input is a list and not a special case, then the interpreter will treat the first value (car) in the s-exp. as a value to look up in the current environment and the rest of the values (cdr) as arguments to that function. 

#### Function declaration/lambda
There is a special form - lambda, which is used to declare a function. The lambda has 3 components:
1. a list of parameters
1. a body (the contents of the function)
1. an environment (the variables in scope for the function)

An example lambda and the usage would be like
(define f (lambda (x) (+ x 1)))
(f 3) ; returns 4
which would bind a function to the name 'f' which adds 1 to the input argument

Lambdas are allowed to be recursive, and with being allowed to define variables makes the language turing complete.

An example of a recusive function would be:
(define f ( lambda ( x acc) (if ( = x 0) acc ( f ( - x ) ( + acc x)))))
Which sums up all the numbers from 0 to x (and stores them in 'acc', the accumulator).

The interpreter doesn't support iteration, but there is a way to prevent the stack from blowing up. This is covered in the 'tail call optimization' section.

##### Higher order functions
The interpreter supports some of the simpler high order functions that act on lists. It supports
1. map
1. filter
1. reduce (reduce-right and reduce-left)

These methods take in a function and list, and outputs the results.
( define l1 ( list 1 2 3)) -> create the list
( define l2 ( map ( lambda ( x) ( * x 2)) l1))  -> l2 = 2, 4, 6 [doubles all the values]
( define l3 ( filter ( lambda ( x) ( < x 5)) l2)) -> l3 = 2, 4 [filters out all values greater than 5]
( reduce-left ( lambda ( x c) ( + x c)) l1) -> returns 6 [sums up all values in l1]

In fact, functions are first-class citizens and they can be passed to other functions. You can make a function called 'call-twice' which will just call the passed in function twice (if you wanted, for whatever reason)

##### Closures
javascript supports closures, so closure support is provided out of the box.

You can do something like:
(define gen (lambda ( x) ( lambda ( y) ( + x y)))))
When gen is called, it will return a function that adds the arg gen was called with with its own input argument.
For example:
(define add-twelve (gen 12)) 
will create a function that adds 12 to its input argument

#### Tail call optimization
Tail call optimization is a trick to prevent the stack from blowing up when the program recurses too much. The interpreter avoids creating a new stack frame if a calling function is simply returning the value from the called function. 

The way I implemented it was if the proc is a lambda, switch the current expression to the one of the lambda, and switch the current environment to the one defined in the lambda. It basically converts recursive calls to iterative calls (fiddling with the program counter/pointer and the current values)

The scheme language spec requires implementers to implement tail-call optimization/tail call elimination.

#### Call with current continuation/Call-cc
TODO!

## Sources:
* http://www.r6rs.org/
* http://norvig.com/lispy.html
* http://norvig.com/lispy2.html
* https://geoffreylitt.com/2018/01/15/adding-tail-calls-optimization-to-a-lisp-interpreter.html
