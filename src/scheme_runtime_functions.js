"use strict";

//TODO: refactor this class. Instead of just returning the functions to the global namespace, return them to a namespaced object 
//using IIFE. See below comments for example
/*
var runtime_functions = (function() {return functions})();
*/


//For all these methods the first parameter is the method (so 'if', 'define', etc)
function find_variable_reference(expression, environment) {
    try {
        return environment.find(expression)[expression];
    } catch (e) {
        console.log(e);
        throw "RuntimeError: expression '" + expression[0] + "' is not defined (context is: " + expression + ").";
    }
}

function evaluate_if_statement(expression, environment) {
    //if statements example: (if (= x 1) (+ x 1) (- x 1))
    if (expression.length != 4) {
        throw "RuntimeError: wrong number of arguments passed to if statement: " + expression;
    }
    var test = expression[1]; //this is the test method (=, >, <, ...);
    var then_body = expression[2]; //this is the expression for the then statement	
    var else_body = expression[3]; //this is the expression for the else statement
    if (s_eval(test, environment)) {
        return then_body;
    } else {
        return else_body;
    }
}

function define_value(expression, environment) {
    var symbol = expression[1]; // this is the name for the variable
    var value = expression[2]; // this is the value for the variable
    if (environment.get_env()[symbol] === undefined) { //define will only be able to define undefined stuff
        var val = s_eval(value, environment);
        environment.get_env()[symbol] = val;
        return val; //return the value so you can have (define x (define y 100))
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

function lambda(expression, env) {
    this.params = expression[1];
    this.body = expression[2];
    this.env = env;
}
lambda.prototype.apply = function(context, args) {
    //the context param is not used here, but its used in function.apply and I need the signatures to match
    return s_eval(this.body, create_lambda_env(this.env, this.params, args))
}