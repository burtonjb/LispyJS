/*
 * This file will handle creating the standard environment and eventually the lexical scoping for the environments
 */

"use strict";

function standard_env() {
    var eq = function(args) {
        //TODO: do I want to fix the fact that if you pass less than 2 args, this will just return true?
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

    var standard_env = {
        'begin': function(args) {
            return args[args.length - 1];
        },
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
        '==': function(args) {
            return eq(args);
        },
        '!=': function(args) {
            return !eq(args);
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
        'val': function(args) {
            return args;
        },
        '-': function(args) {
            //minus is defined as first value - rest of args. 
            return args.reduce(function(acc, currentVal) {
                return acc - currentVal;
            });
        }
    }
    return standard_env;
};

function new_env(env, parent) {
    var find = function(env, parent) {
        return function(arg) {
            if (env[arg] === undefined) {
                return parent.find(arg);
            } else {
                return env[arg];
            }
        }
    };
    var set = function(env) {
        return function(key, value) {
            env[key] = value;
        }
    };
    var find_this_level = function(env) {
        return function(arg) {
            return env[arg];
        }
    }
    var env = {
        'find': find(env, parent),
        'set': set(env),
        'find_this_level': find_this_level(env),
        '_env': env,
        '_parent': parent
    }
    return env;
}

function global_env() {
    return new_env(standard_env(), {'find': function(arg) {
        throw "RuntimeException: RuntimeError: behavior for expression '" + arg + "' is not defined";
    }
});
}