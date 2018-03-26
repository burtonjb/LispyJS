/*
 * This file will handle creating the standard environment and eventually the dynamic scoping for the environments (to be refactored)
 */

"use strict";

function standard_env() {
    //TODO: add in stuff to throw errors if the number of args is wrong for some of these functions
    //TODO: add in some type checking in here

    //These are helper methods
    var eq = function(args) {
        //TODO: do I want to fix the fact that if you pass less than 2 args, this will just return true?
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
        'begin': function(args) {
            return args[args.length - 1];
        },

        //basic math functions
        //TODO: these should throw if the input is not a number
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
            return Math.max(...args); //Using cool js spread syntax here
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
        'true': function(args) {
            return true;
        },
        'false': function(args) {
            return false;
        },
        'null': function(args) {
            return null;
        },

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
                mapped_list.push(proc([a[i]]));
            }
            return mapped_list;
        },
        'filter': function(args) {
            var proc = args[0];
            var a = args[1];
            var mapped_list = []
            for (var i = 0; i < a.length; i++) {
                if (proc([a[i]])) {
                    mapped_list.push(a[i]);
                }
            }
            return mapped_list;
        },
        'reduce-left': function(args) {
            //FIXME: this and reduce-right would be broken for multiplication
            var proc = args[0];
            var l = args[1];
            var a = proc([null, l[0]]);
            for (var i = 1; i < l.length; i++) {
                a = proc([a, l[i]]);
            }
            return a;
        },
        'reduce-right': function(args) {
            var proc = args[0];
            var l = args[1];
            var a = proc([l[l.length - 1], null]);
            for (var i = l.length - 2; i >= 0; i--) {
                a = proc([a, l[i]]);
            }
            return a;
        },

        //Type checking functions
        'number?': function(args) {
            return (typeof(args) === 'number');
        },
        'procedure?': function(args) {
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
        }
    }
    return standard_env;
};

function new_env(env, parent) {
    var find = function(env, parent) {
        //returns the env that has the key, not the value
        return function(arg) {
            if (env[arg] === undefined) {
                return parent.find(arg);
            } else {
                return env;
            }
        }
    };
    var find_this_level = function(env) {
        //returns the env that has the key, not the value
        return function(arg) {
            return env;
        }
    }
    var env = {
        'find': find(env, parent),
        'find_this_level': find_this_level(env),
        '_env': env,
        '_parent': parent
    }
    return env;
}

function global_env() {
    return new_env(standard_env(), {
        'find': function(arg) {
            throw "RuntimeException: RuntimeError: behavior for expression '" + arg + "' is not defined";
        }
    });
}