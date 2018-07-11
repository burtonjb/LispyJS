/*
 * This file handles the actual runtime for the scheme environment including walking the AST
 */

"use strict";

//TODO: clean this up, move logic out to separate functions at least.
//FIXME: investigate why lists are being passed around as lists of lists instead of just lists
function s_eval(expression, environment = global_env()) {
    while (true) {
        //console.log(expression, environment);
        //Primitive symbols
        if (typeof(expression) === 'string') {
            return find_variable_reference(expression, environment);
        } else if (typeof(expression) === 'number') {
            return expression;

            //this path is for a constant
        } else if (!Array.isArray(expression)) {
            return expression;
        }

        //predefined operations
        var operation = expression[0];
        if (operation === 'if') {
            expression = evaluate_if_statement(expression, environment);
            continue; // add some tail call optimization.
        } else if (operation === 'define') {
            return define_value(expression, environment);
        } else if (operation === 'quote') {
            return expression[1]; //return the first argument from quote
        } else if (operation === 'set!') {
            return set_value(expression, environment);
        } else if (expression[0] === 'lambda') {
            return create_lambda(expression, environment);
        }

        //debug statements. I think they're currently broken and need to return a function or something
        //FIXME: test and check these
        else if (expression[0] === 'debug.logEnv') {
            console.log(environment);
            return;
        } else if (expression[0] === 'debug.log') {
            var args = [];
            for (var i = 1; i < expression.length; i++) {
                console.log(s_eval(expression[i], environment));
            }
            return;
        }
        //function call
        else {
            //Any other case is a procedure call
            var expressions = [];
            var all = [];
            for (var i = 0; i < expression.length; i++) {
                var e = expression[i];
                var v = s_eval(e, environment);
                expressions.push(v);
                all.push(v);
            }
            var proc = expressions.shift(); //the first in the expressions can be a proc
            var args = expressions; //other stuff in the expressions list are the args.
            if (typeof(proc) === "function") {  //This is wrong. It should keep passing the proc to each loop until it hits a function that exists in environment
                expression = proc(args);
            } else {
                return all;
            }
            environment = new_env(args, environment);
            continue;
        }
    }
}