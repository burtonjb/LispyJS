//This file has the application test cases.
//I don't know if I'll actually do it in a smart way, but at least there will be some 
//tests somewhere (since this is getting pretty complicated)

//TODO: move some of the test cases to another html file so that I won't
//be running ALL the test cases everytime I load the page

"use strict";

var display_test_cases = {
    'sample': {
        'input': '(begin (define r 10) (define pi 3.1415) (* pi (* r r)))',
        'expected': 314.15000000000003
    },
    'fib_example': {
        'input': '( begin ( define fib ( lambda ( a) ( if ( equal? a 0) 0 ( if ( equal? 1 a) 1 ( + ( fib ( - a 2)) ( fib ( - a 1))))))) ( fib 10))',
        'expected': 55
    },
    'logical_operators': {
        'input': '( begin (define a (= 1 1)) (define b (> 2 1)) (define c (< 2 3)) (define d (>= 2 2)) (define x (and a b c d)) (define f (= 1 2)) (define g (not f)) (define y (or f g)) (and x y))',
        'expected': true
    },
    'higher order list functions': {
        'input': '( begin ( define l1 ( list 1 2 3)) ( define l2 ( map ( lambda ( x) ( * x 2)) l1)) ( define l3 ( filter ( lambda ( x) ( < x 5)) l2)) ( define l4 ( apply + l3)) ( val l4))',
        'expected': 6
    }
};

(function testCases() {
    //wrap in a function so not to polute the global namespace

    //Custom 'equals' function (for lists and maps)
    function listEquals(expected, actual) {
        if (expected.legnth != actual.length) {
            return false;
        } else {
            for (var i = 0; i < expected.length; i++) {
                if (expected[i] != actual[i]) {
                    return false
                }
            }
        }
        return true;
    }

    var trivial_test_cases = {
        'begin': {
            'input': '( begin ( + 10 0))',
            'expected': 10
        },

        //Math test cases
        //TODO: test edge cases when non-numbers are passed
        '+': {
            'input': '( + 10 1)',
            'expected': 11
        },
        '*': {
            'input': '( * 10 2)',
            'expected': 20
        },
        '/': {
            'input': '(/ 10 2)',
            'expected': 5
        },
        '-': {
            'input': '(- 10 2)',
            'expected': 8
        },
        'abs': {
            'input': '(abs -2)',
            'expected': 2
        },
        'expt': {
            'input': '(expt 2 8)',
            'expected': 256
        },
        'round': {
            'input': '(round 2.56)',
            'expected': 3
        },
        'max': {
            'input': '(max 5 6 7)',
            'expected': 7
        },

        //FIXME: add more test cases for logic operators here
        '=': {
            'input': '(= 1 1)',
            'expected': true
        },
        '>': {
            'input': '(> 3 1)',
            'expected': true
        },

        //List test cases
        //TODO: test case for apply and map
        'car': {
            'input': '( begin (define l (list 1 2 3)) (car l))',
            'expected': 1
        },
        'cdr': {
            'input': '( begin ( define l ( list 1 2 3)) ( cdr l))',
            'expected': [2, 3],
            'custom_equality': listEquals
        },
        'cons_2_values': {
            'input': '(cons 1 2)',
            'expected': [1, 2],
            'custom_equality': listEquals
        },
        'cons_list_push': {
            'input': '(cons 1 (list 2 3))',
            'expected': [1, 2, 3],
            'custom_equality': listEquals
        },
        'cons_list_val_1': {
            'input': '( cons (list 1 2) 3))',
            'expected': [1, 2, 3],
            'custom_equality': listEquals
        },
        'length': {
            'input': '( length ( list 5 6 7 8))',
            'expected': 4
        },
        'apply': {
            'input': '( apply * ( list 1 2 3 4))',
            'expected': 24
        },
        'map': {
            'input': '( map ( lambda ( x) ( + x 1)) ( list 1 2 3 4))',
            'expected': [2, 3, 4, 5],
            'custom_equality': listEquals
        },
        'map_2': {
            'input': '( map ( lambda ( x) ( = x 1)) ( list 1 2 1 4))',
            'expected': [true, false, true, false],
            'custom_equality': listEquals
        },
        'filter': {
            'input': '( filter ( lambda ( x) ( = x 1)) ( list 1 2 3 4))',
            'expected': [1],
            'custom_equality': listEquals  
        },
        'filter_2': {
            'input': '( filter ( lambda ( x) ( = x 1)) ( list 1 2 1 4))',
            'expected': [1, 1],
            'custom_equality': listEquals  
        },

        //type test cases
        'list': {
            'input': '( begin (define l (list 1 2 3)) (val l))',
            'expected': [1, 2, 3],
            'custom_equality': listEquals
        },
        'number': {
            'input': '( begin ( define x 10) ( val x))',
            'expected': 10
        }

    }; //these test cases will not be displayed in the UI (because they are trivial), but will still be run

    var test_cases = {};
    Object.assign(test_cases, display_test_cases, trivial_test_cases);
    var keys = Object.keys(test_cases);
    var failures = false;
    for (var i = 0; i < keys.length; i++) {
        var test_case = test_cases[keys[i]];
        try {
            var out = s_eval(parse(test_case.input));
        } catch (e) {
            console.log(e);
            console.log(test_case.input);
        }
        if (test_case.custom_equality === undefined) {
            if (test_case.expected != out) {
                //I'll only print failures for now
                failures = true;
                console.log("Warning, test case for " + keys[i] + " failed!")
                console.log(test_case.expected, out);
            }
        } else {
            test_case.custom_equality(test_case.expected, out);
        }
    }
    if (failures === true) {
        alert("Test cases failed (check console)");
    }
    console.log("All test cases completed");
})();