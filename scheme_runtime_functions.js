"use strict";

function find_variable_reference(expression, environment) {
    try {
        return environment.find(expression)[expression];
    } catch (e) {
        console.log(e);
        throw "RuntimeError: expression '" + expression[0] + "' is not defined (context is: " + expression + ").";
    }
}

function evaluate_if_statement(expression, environment) {
    var _ = expression[0]; //this is just 'if', so it gets thrown out
    var test = expression[1]; //this is the test method (==, >, <, ...);
    var then_body = expression[2]; //this is the expression for the then statement	
    if (expression.length < 3) {
        throw "RuntimeError: else statement for if must be defined for expression: " + expression;
    }
    var else_body = expression[3]; //this is the expression for the else statement
    var exp;
    if (s_eval(test, environment)) {
        exp = then_body;
    } else {
        exp = else_body;
    }
    return exp; 
}

function define_value(expression, environment) {
    var _ = expression[0]; //this is 'define'. It just gets thrown out
    var symbol = expression[1]; // this is the name for the variable
    var value = expression[2]; // this is the value for the variable
    if (environment.find_this_level(symbol)[symbol] === undefined) { //define will only be able to define undefined stuff
        var val = s_eval(value, environment);
        environment.find_this_level(symbol)[symbol] = val;
        return val;
    } else {
        throw "RuntimeError: symbol " + symbol + " is already defined";
    }
}

function set_value(expression, environment) {
    var symbol = expression[1];
    var value = expression[2];
    if (environment.find(symbol)[symbol] !== undefined) { //set will only be able to set stuff that's already defined
        environment.find(symbol)[symbol] = value;
        return value;
    } else {
        throw "RuntimeError: symbol " + symbol + " has not been defined";
    }
}

function create_lambda(expression, env) {
    var params = expression[1];
    var body = expression[2];
    return (function() {
        var parent_env = env;
        return function(l_args) {
            var newEnvironment = new_env({}, parent_env);
            if (l_args.length !== params.length) {
                //TODO: investigate whether I should actually be checking the argument lengths? (does scheme's lambdas actually check that the number of args in function sig = number of input args?)
                throw "RuntimeError: called lambda " + body + " with the wrong arguments ( " + l_args + " )";
            }
            for (var i = 0; i < params.length; i++) {
                newEnvironment._env[params[i]] = l_args[i];
            }
            return s_eval(body, newEnvironment);
        }
    })();
}