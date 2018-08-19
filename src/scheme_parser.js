/*
 * This file handles all the parsing required to covert from strings to scheme expressions
 */

"use strict";

function tokenize(str) {
    str = str.replace(/\n/g, '');
    var l = str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(" ");
    return l.map(function(x) {
        return x.trim()
    }).filter(function(x) {
        return x.length > 0;
    });
}

function parse(str) {
    return read_from_tokens(tokenize(str));
}

function read_from_tokens(tokens, parsed_tokens = []) {
    if (tokens.length === 0) {
        var i_slice = Math.max(0, parsed_tokens.length - 5);
        throw "ParseError: there were no tokens found. Last 5 read tokens were: " + parsed_tokens.slice(i_slice, parsed_tokens.length);
    }
    var token = tokens.shift();
    parsed_tokens.push(token);
    if (token === "(") {
        var child_tokens = [];
        while (tokens[0] != ')') {
            child_tokens.push(read_from_tokens(tokens, parsed_tokens));
        }
        tokens.shift(); //remove the last ")"
        return child_tokens;
    } else if (token === ")") {
        throw "ParseError: unexpected ')";
    } else {
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