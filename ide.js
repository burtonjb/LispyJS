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
    var keys = Object.keys(display_test_cases);
    for (var i = 0; i < keys.length; i++) {
        var option = document.createElement("option");    
        option.value = display_test_cases[keys[i]].input;
        option.text = keys[i];
        testCaseSelector.appendChild(option);
    }
}

function saveHistory(inputCode) {
    var storage = window.localStorage;
    var code = storage.getItem('code') || "[]"; //get value from storage or set to empty array
    code = JSON.parse(code);
    code.push(inputCode);
    var history = code;
    code = JSON.stringify(code);
    storage.setItem('code', code);
    updateHistoryList(history);
}

function clearHistory() {
    window.localStorage.clear();
}

function getHistory() {
    return JSON.parse(window.localStorage.getItem('code'));
}

function updateHistoryList(history) {
    var historyList = document.getElementById('code-history-list');
    while (historyList.firstChild) { //clear all child elements
        historyList.removeChild(historyList.firstChild);
    }
    for (var i = 0; i < history.length; i++) { //append all elements to the list
        var item = document.createElement('li');
        item.innerText = history[i];
        item.addEventListener('click', function (data, context) {
            textInput.value = this.innerText;
            formatInput();
        });
        historyList.appendChild(item);
    }
}

function pretty_print(parsed_input, indent = 0) {
    formattedInputString += "\n";
    for (var i = 0; i < indent; i++) {
        formattedInputString += " ";
    }
    formattedInputString += "(";
    for (var i = 0; i < parsed_input.length; i++) {
        if (typeof(parsed_input[i]) !== 'object') {
            formattedInputString += " ";
            formattedInputString += parsed_input[i];
        } else {
            pretty_print(parsed_input[i], indent + 1);
            formattedInputString += ")";
        }
    }
    if (indent === 0) {
        formattedInputString += "\n)";
    }
    return formattedInputString;
};

var runButton = document.getElementById("btn-run");
var formatButton = document.getElementById("btn-format");
var unformatButton = document.getElementById("btn-unformat");
var textInput = document.getElementById("ta-program");
var textOutput = document.getElementById("ta-output");
var testCaseSelector = document.getElementById("select-test-cases");
var clearHistoryButton = document.getElementById('clear-history');
var saveButton = document.getElementById('btn-save');

runButton.onclick = function() {
    var input = textInput.value;
    try {
        var out = s_eval(parse(input));
        console.log(out);
        textOutput.value = out;
    } catch (e) {
        textOutput.value = e;
        throw e;
    }
}

saveButton.onclick = function() {
    var input = textInput.value;
    saveHistory(input);
}

//Also this function seems to work, but no guarantees. I expect it to explode in weird ways in the future.
formatButton.onclick = function() {
    formatInput();
}

unformatButton.onclick = function() {
    var input = textInput.value;
    var out = input.replace(/\n/g, '').replace(/\t/g, '').replace(/\s+/g,' ');
    textInput.value = out;
}

testCaseSelector.onchange = function () {
    var index = testCaseSelector.selectedIndex;
    var option = testCaseSelector.getElementsByTagName('option')[index];
    textInput.value = option.value;
    formatInput();
}

clearHistoryButton.onclick = function () {
    clearHistory();
    updateHistoryList([]);
}

formatInput();

populateTestCasesSelector();

updateHistoryList(getHistory()||[]);