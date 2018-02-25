/*
 * This file handles the actual runtime for the scheme environment including walking the AST
 */

function s_eval(expression, environment = standard_env()) {
    if (typeof(expression) === 'string') {
        //this is a variable reference
        return environment[expression];
    } else if (typeof(expression) === 'number') {
        return expression;
    } else if (expression[0] === 'if') {
        var _ = expression[0]; //this is 'if'. It just gets thrown out.
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
        return s_eval(exp, environment)
    } else if (expression[0] === 'define') {
        var _ = expression[0]; //this is 'define'. It just gets thrown out
        var symbol = expression[1]; // this is the name for the variable
        var value = expression[2]; // this is the value for the variable
        if (environment[symbol] === undefined) {
            environment[symbol] = s_eval(value, environment);
        } else {
            throw "RuntimeError: symbol " + symbol + " is already defined";
        }
    } else {
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
            throw "RuntimeError: behavior for expression '" + expression[0] + "' is not defined (context is: " + expression + ").";
        }
    }
}