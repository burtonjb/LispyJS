/*
 * This file handles the actual runtime for the scheme environment including walking the AST
 * Tail call optimization has been implemented, that's why there's a while true loop
 */

"use strict";

function s_eval(expression, environment = global_env()) {
    while (true) {
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
            continue; 
        } else if (operation === 'define') {
            return define_value(expression, environment);
        } else if (operation === 'quote') {
            return expression[1]; //return the first argument from quote (the first s-expression passed to quote). Do not evaluate it
        } else if (operation === 'set!') {
            return set_value(expression, environment);
        } else if (expression[0] === 'lambda') {
            return new lambda(expression, environment);
        } else if (expression[0] === 'begin') { 
            for (var i = 1; i < expression.length - 1; i++) {
                s_eval(expression[i], environment);
            }
            expression = expression[expression.length - 1];
            continue;
        }

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
            var evaluations = [];
            for (var i = 0; i < expression.length; i++) {
                var e = expression[i];
                var v = s_eval(e, environment);
                evaluations.push(v);
            }
            var all = evaluations.slice();
            var proc = evaluations.shift(); //the first in the expressions can be a proc
            var args = evaluations; //other stuff in the expressions list are the args.
            if (proc instanceof lambda) {
                expression = proc.body;
                environment = create_lambda_env(proc.env, proc.params, args, proc);
                continue;
            } else //proc is a function, evaluate it
                try {
                   return proc(args);
                } catch (e) {
                    console.log(e, expression, evaluations);
                    throw "expression '" + proc + "'' is not a function. Context is: " + all;
                }
        }
    }
}