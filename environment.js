"use strict";

function standard_env() {
	var env = {
		'+': function (args) {
			return args[0] + args[1];
		},
		'*': function (args) {
			return args[0] * args[1];
		},
		'begin': function (args) {
			return args[args.length-1];
		}
	}
	return env;
}

var global_env = standard_env();