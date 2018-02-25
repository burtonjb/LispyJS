/*
 * This file will handle all the ui related stuff to get the scheme environment running
 */
"use strict";

var formattedInputString; //FIXME: fix the global variable!

function formatInput() {
    try {
        formattedInputString = "";
        var input = textInput.value;
        var out = pretty_print(parse(input));
        textInput.value = out;
    } catch (e) {
        console.log("formatting error!");
        console.log(e);
    }

}

function populateTestCasesSelector() {
    var keys = Object.keys(test_cases);
    for (var i = 0; i < keys.length; i++) {
        var option = document.createElement("option");    
        option.value = test_cases[keys[i]].input;
        option.text = keys[i];
        testCaseSelector.appendChild(option);
    }
}

var runButton = document.getElementById("btn-run");
var formatButton = document.getElementById("btn-format");
var unformatButton = document.getElementById("btn-unformat");
var textInput = document.getElementById("ta-program");
var textOutput = document.getElementById("ta-output");
var testCaseSelector = document.getElementById("select-test-cases");

runButton.onclick = function() {
    var input = textInput.value;
    try {
        var out = s_eval(parse(input));
        textOutput.value = out;
    } catch (e) {
        textOutput.value = e;
    }
}

//Also this function seems to work, but no guarantees. I expect it to explode in weird ways in the future.
formatButton.onclick = function() {
    formatInput();
}

unformatButton.onclick = function() {
    var input = textInput.value;
    var out = input.replace(/\n/g, '').replace(/\t/g, '');
    textInput.value = out;
}

testCaseSelector.onchange = function () {
    var index = testCaseSelector.selectedIndex;
    var option = testCaseSelector.getElementsByTagName('option')[index];
    textInput.value = option.value;
    formatInput();
}

formatInput();

populateTestCasesSelector();