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

    var env = {
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
        }
    }
    return env;
}

var global_env = standard_env();