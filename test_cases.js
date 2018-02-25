//This file has the application test cases.
//I don't know if I'll actually do it in a smart way, but at least there will be some 
//tests somewhere (since this is getting pretty complicated)

//these will eventually be copied to the UI too, so its not wasted effort!
"use strict";

var test_cases = {
	'add': {'input': '(begin( + 1 1))',
			'expected': '2'},
	'multiply' : {'input': '(begin( * 10 5))',
			'expected': '50'},
	'equals_is_equal':  {'input': '( begin(if (== 1 1) 10 0))',
			'expected': '10'},
	'equals_not_equal': {'input': '( begin( if( == 10 1) 10 0))',
			'expected': '0'},
	'greater': {'input': '( begin( if( > 2 1) 10 0))',
			'expected': '10'},
	'greater_equals': {'input': '( begin( if( >= 2 2) 10 0))',
			'expected': '10'},
	'less': { 'input': '( begin( if( < 1 2) 10 0))',
			'expected': '10'},
	'less_equals': {'input': '( begin( if( <= 2 2) 10 0))',
			'expected': '10'},
	'val': {'input': '( begin( define r 10)( val r))',
			'expected': '10'},
	'vars based on other vars': {'input': '( begin( define r 10)( define l (+ r 2))( val l))',
			'expected': '12'
		}
	};

var keys = Object.keys(test_cases); 
for (var i = 0; i < keys.length; i++) {
	var test_case = test_cases[keys[i]];
	var out = s_eval(parse(test_case.input));
	if (test_case.expected != out) {
		//I'll only print failures for now
		alert("Warning, test case for " + keys[i] + " failed!");
	} 
}
console.log("All test cases completed");

