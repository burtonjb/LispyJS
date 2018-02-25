/*
* This file handles all the parsing required to covert from strings to scheme expressions
*/

"use strict";

function tokenize(str) {
	str = str.replace(/\n/g, '');
	var l = str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(" ");
	return l.map(function(x) {return x.trim()}).filter(function(x) {return x.length > 0;});
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

function pretty_print(parsed_input, indent = 0) {
	formattedInputString+= "\n";
	for (var i = 0; i < indent; i++) {
		formattedInputString += "\t";
	}
	formattedInputString+="(";
	for (var i = 0; i < parsed_input.length; i++) {
		if (typeof(parsed_input[i]) !== 'object') {
			formattedInputString += " ";
			formattedInputString += parsed_input[i];			
		} else {
			pretty_print(parsed_input[i], indent+1);
			formattedInputString += ")";
		}
	}
	if (indent === 0) {
		formattedInputString += "\n)";
	}
	return formattedInputString;
};
