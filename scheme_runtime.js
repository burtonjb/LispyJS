/*
 * This file handles the actual runtime for the scheme environment including walking the AST
 */

"use strict";

//TODO: clean this up, move logic out to separate functions at least.
//FIXME: investigate why lists are being passed around as lists of lists instead of just lists
function s_eval(expression, environment = global_env()) {
    
    //Primitive symbols
    if (typeof(expression) === 'string') {
        return find_variable_reference(expression, environment);
    } else if (typeof(expression) === 'number') {
        return expression;

    //constant 
    } else if (!Array.isArray(expression)) {
        return expression;
    }

    //predefined operations
    var operation = expression[0];
    if (operation === 'if') {
        return evaluate_if_statement(expression, environment);
    } else if (operation === 'define') {
        define_value(expression, environment);
    } else if (operation === 'quote') {
        return expression[1]; //return the first argument from quote
    } else if (operation === 'set!') {
        set_value(expression, environment);
    } else if (expression[0] === 'lambda') {
        return create_lambda(expression, environment);

    //debug statements. I think they're currently broken and need to return a function or something
    //FIXME: test and check these
    } else if (expression[0] === 'debug.logEnv') {
        console.log(environment);
    } else if (expression[0] === 'debug.log') {
        var args = [];
        for (var i = 1; i < expression.length; i++) {
            console.log(s_eval(expression[i], environment));
        }
    }
    //function call
    else {
        //Any other case is a procedure call
        var proc = s_eval(expression[0], environment);
        var args = [];
        for (var i = 1; i < expression.length; i++) {
            args.push(s_eval(expression[i], environment));
        }
        try {
            return proc(args);
        } catch (e) {
            console.log(e);
            throw "RuntimeError: behavior for expression '" + expression[0] + "' is not defined (context is: " + expression + ").\n Base exception was: " + e;
        }
    }
}