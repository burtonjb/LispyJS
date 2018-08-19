/*
 * This file will handle creating the standard environment 
 */

"use strict";

//Environment classes and functions
function Environment(environment, parent) {
    this.env = environment; //this should be an object
    this.parent = parent //this is an Environment
}

//returns the most child environment that has the argument defined
Environment.prototype.find = function(arg) {
    if (this.env[arg] === undefined) {
        return this.parent.find(arg);
    } else {
        return this.env;
    }
};

Environment.prototype.get_env = function() {
    return this.env;
}

function new_env(env, parent) {
    var env = new Environment(env, parent);
    return env;
}

function create_lambda_env(parent_env, param_names, values, lambda) {
    var newEnvironment = new_env({}, parent_env);
    if (values.length !== param_names.length) {
        //TODO: investigate whether I should actually be checking the argument lengths? (does scheme's lambdas actually check that the number of args in function sig = number of input args?)
        throw "RuntimeError: called lambda " + lambda.body + " with wrong number of args. Got: " + values.length + ", expected: " + param_names.length;
    }
    for (var i = 0; i < param_names.length; i++) {
        newEnvironment.env[param_names[i]] = values[i];
    }
    return newEnvironment;
}

function global_env() {
    return new_env(standard_env(), {
        'find': function(arg) {
            throw "RuntimeException: RuntimeError: behavior for expression '" + arg + "' is not defined";
        }
    });
}

//Standard environment - all built in functions
function standard_env() {
    //TODO: add importing functionality
    //TODO: split this up into modules

    //TODO: add in stuff to throw errors if the number of args is wrong for some of these functions
    //TODO: add in some type checking in here

    //These are helper methods
    var eq = function(args) {
        if (args.length < 2) {
            throw "RuntimeException: args to eq is less than 2. Args: " + args;
        }
        for (var i = 0; i < args.length - 1; i++) {
            if (args[i] === undefined) {
                return false;
            }
            if (args[i] !== args[i + 1]) {
                return false;
            }
        }
        return true;
    };
    var greater_than = function(args) {
        for (var i = 0; i < args.length - 1; i++) {
            if (args[i] <= args[i + 1]) {
                return false;
            }
            return true;
        }
    };
    var greater_than_or_equal = function(args) {
        for (var i = 0; i < args.length - 1; i++) {
            if (args[i] < args[i + 1]) {
                return false;
            }
            return true;
        }
    };

    //Standard functions in scheme are defined here
    var standard_env = {
        //basic math functions
        //TODO: these should throw if the input is not a number?
        '+': function(args) {
            return args.reduce(function(acc, currentVal) {
                return acc + currentVal;
            });
        },
        '*': function(args) {
            return args.reduce(function(acc, currentVal) {
                return acc * currentVal;
            });
        },
        '/': function(args) {
            return args.reduce(function(acc, currentVal) {
                return acc / currentVal;
            });
        },
        '-': function(args) {
            //minus is defined as first value - rest of args. 
            return args.reduce(function(acc, currentVal) {
                return acc - currentVal;
            });
        },
        'abs': function(args) {
            return Math.abs(args);
        },
        'expt': function(args) {
            return Math.pow(args[0], args[1]);
        },
        'round': function(args) {
            return Math.round(args);
        },
        //TODO: For max and min - throw an error if NaN?
        'max': function(args) {
            return Math.max(...args);
        },
        'min': function(args) {
            return Math.min(...args);
        },

        //Comparison operators
        '=': function(args) {
            return eq(args);
        },
        '>': function(args) {
            return greater_than(args);
        },
        '>=': function(args) {
            return greater_than_or_equal(args)
        },
        '<': function(args) {
            return !(greater_than_or_equal(args));
        },
        '<=': function(args) {
            return !(greater_than(args));
        },
        'eq?': function(args) {
            return args[0] === args[1];
        },
        'equal?': function(args) {
            return eq(args);
        },

        //Logical operators
        'not': function(args) {
            return !args[0];
        },
        'and': function(args) {
            return args.reduce(function(a, c) {
                return a && c;
            });
        },
        'or': function(args) {
            return args.reduce(function(a, c) {
                return a || c;
            });
        },
        'true': true,
        'false': false,
        'null': null,

        //list functions
        'list': function(args) {
            return [...args];
        },
        'apply': function(args) {
            //takes in a list as arguments to a function
            var proc = args[0];
            var a = args[1];
            return proc(a);
        },
        'car': function(args) {
            return args[0][0];
        },
        'cdr': function(args) {
            var a = [];
            for (var i = 1; i < args[0].length; i++) {
                a.push(args[0][i]);
            }
            return a;
        },
        'cons': function(args) {
            //TODO: fix the datatypes here. A pair of numbers cons'd together returns a pair, not a list
            var l1 = args[0];
            var l2 = args[1];
            if (Array.isArray(l2)) {
                var a = [];
                for (var i = 0; i < l2.length; i++) {
                    a.push(l2[i]);
                }
                a.unshift(l1);
                return a;
            } else {
                var a = [];
                a.push(l2);
                a.unshift(l1);
                return a;
            }
        },
        'length': function(args) {
            return args[0].length;
        },

        'map': function(args) {
            var proc = args[0];
            var a = args[1];
            var mapped_list = []
            for (var i = 0; i < a.length; i++) {
                mapped_list.push(proc.apply(null, [a[i]]));
            }
            return mapped_list;
        },
        'filter': function(args) {
            var proc = args[0];
            var a = args[1];
            var mapped_list = []
            for (var i = 0; i < a.length; i++) {
                if (proc.apply(null, [a[i]])) {
                    mapped_list.push(a[i]);
                }
            }
            return mapped_list;
        },
        'reduce-left': function(args) {
            var proc = args[0];
            var l = args[1];
            var a = l[0]; //a (accumulator) can be the first element because the first operation of reduce should f(l[0], identity), which should be l[0]
            for (var i = 1; i < l.length; i++) {
                a = proc.apply(null, [a, l[i]]);
            }
            return a;
        },
        'reduce-right': function(args) {
            var proc = args[0];
            var l = args[1];
            var a = l[l.length - 1]; //same comment as reduce-left
            for (var i = l.length - 2; i >= 0; i--) {
                a = proc.apply(null, [a, l[i]]);
            }
            return a;
        },

        //Type checking functions
        'number?': function(args) {
            return (typeof(args) === 'number');
        },
        'lambda?': function(args) {
            return (typeof(args) === "function"); //TODO: double check this
        },
        'list?': function(args) {
            return Array.isArray(args[0]);
        },
        'symbol?': function(args) {
            //TODO
            throw "NotImplemented!";
        },
        'null?': function(args) {
            return args === null;
        },

        //metaprogramming
        'eval': function(args) {
            return s_eval(args[0]);
        },

        //custom functions
        'val': function(args) {
            return args[0];
        },
        'print': function(args) {
            console.log(args);
            return args;
        }
    }
    return standard_env;
};