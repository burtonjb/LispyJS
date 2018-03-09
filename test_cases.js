//This file has the application test cases.
//I don't know if I'll actually do it in a smart way, but at least there will be some 
//tests somewhere (since this is getting pretty complicated)
"use strict";

var test_cases = {
    'sample': {
        'input': '(begin (define r 10) (define pi 3.1415) (* pi (* r r)))',
        'expected': '314.15000000000003'
    },
    'add': {
        'input': '(begin( + 1 1))',
        'expected': '2'
    },
    'multiply': {
        'input': '(begin( * 10 5))',
        'expected': '50'
    },
    'equals_is_equal': {
        'input': '( begin(if (== 1 1) 10 0))',
        'expected': '10'
    },
    'equals_not_equal': {
        'input': '( begin( if( == 10 1) 10 0))',
        'expected': '0'
    },
    'greater': {
        'input': '( begin( if( > 2 1) 10 0))',
        'expected': '10'
    },
    'greater_equals': {
        'input': '( begin( if( >= 2 2) 10 0))',
        'expected': '10'
    },
    'less': {
        'input': '( begin( if( < 1 2) 10 0))',
        'expected': '10'
    },
    'less_equals': {
        'input': '( begin( if( <= 2 2) 10 0))',
        'expected': '10'
    },
    'val': {
        'input': '( begin( define r 10)( val r))',
        'expected': '10'
    },
    'vars based on other vars': {
        'input': '( begin( define r 10)( define l (+ r 2))( val l))',
        'expected': '12'
    },
    'not equals': {
        'input': '( begin( if( != 2 1) 10 0))',
        'expected': '10'
    },
    'lambda': {
        'input': '( begin ( define add  ( lambda   ( x y)   ( + x y))) ( add 10 20))',
        'expected': '30'
    },
    'minus': {
        'input': '( begin (- 10 2))',
        'expected': '8'
    },
    'upto': {
        'input': '( begin ( define upto  ( lambda   ( a)   ( if    ( <= a 1) a    ( + a     ( upto      ( - a 1)))))) ( upto 5))',
        'expected': '15'
    },
    'dynamic_scoping': {
        'input': '( begin (define x 33) ( define add  ( lambda   ( x y)   ( + x y))) ( define sum (add (add 10 20) (add 30 40))) ( + x sum))',
        'expected': '133'
    },
    'fib_example': {
        'input': '( begin ( define fib ( lambda ( a) ( if ( equal? a 0) 0 ( if ( equal? 1 a) 1 ( + ( fib ( - a 2)) ( fib ( - a 1))))))) ( fib 10))',
        'expected': '55'
    }
};

var keys = Object.keys(test_cases);
for (var i = 0; i < keys.length; i++) {
    var test_case = test_cases[keys[i]];
    try {
        var out = s_eval(parse(test_case.input));
    } catch (e) {
        console.log(e);
        console.log(test_case.input);
    }
    if (test_case.expected != out) {
        //I'll only print failures for now
        console.log(test_case.expected, out);
        alert("Warning, test case for " + keys[i] + " failed!");
    }
}
console.log("All test cases completed");