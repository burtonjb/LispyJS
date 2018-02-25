"use strict";

function tokenize(str) {
	var l = str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(" ");
	return l.filter(function(x) {return x.length > 0;});
}

function parse(str) {
	return read_from_tokens(tokenize(str));
}

function read_from_tokens(tokens) {
	if (tokens.length === 0) {
		throw "ParseError: there were no tokens found";
	}
	var token = tokens.shift();
	if (token === "(") {
		var child_tokens = [];
		while (tokens[0] != ')') {
			child_tokens.push(read_from_tokens(tokens));
		}
		tokens.shift(); //remove the last ")"
		return child_tokens;
	}
	else if (token === ")") {
		throw "ParseError: unexpected ')";
	}
	else {
		return atomize(token);
	}
}

function atomize(str) {
	var n = Number(str);
	if (Number.isNaN(n)) {
		return str;
	}
	return n;
}

function pretty_print(parsed_input) {
	//TODO: fill this in!
};


var program = "(begin (define r 10) (define pi 3.1415) (* pi (* r r)))";
console.log(program);
console.log(tokenize(program));
console.log(parse(program));