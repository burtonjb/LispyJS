"use strict";

//TODO: refactor this class. Instead of just returning the functions to the global namespace, return them to a namespaced object 
//using IIFE. See below comments for example
/*
var runtime_functions = (function() {return functions})();
*/

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

function lambda(expression, env) {
    this.params = expression[1];
    this.body = expression[2];
    this.env = env;
}
lambda.prototype.call = function(args) {
    return s_eval(this.body, create_lambda_env(this.env, this.params, args))
}