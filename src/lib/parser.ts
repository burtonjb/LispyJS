import { expression, atom } from "./types";

class ParseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function atomize(token: string): atom {
  // Try to convert a in input to a number. If it succeeds assume its a number.
  const tryFloat = Number.parseFloat(token);
  if (Number.isNaN(tryFloat)) {
    // javascript...
    return token;
  }
  return tryFloat;
}

/*
 * This function takes in an input string and outputs a tokenized list of strings
 *
 * e.g. if the input is "(define x 2)" the output would be: ["(", "define", "x", "2", ")"]
 */
function tokenize(input: string): Array<string> {
  const removeComments = input.replace(/;.*/gi, " ");
  const fixWhitespace = removeComments.replace(/\n/g, " ").replace(/\s+/g, " ");
  const addSpacesOnBrackets = fixWhitespace
    .replace(/\(/gi, " ( ")
    .replace(/\)/gi, " ) ");
  return addSpacesOnBrackets.split(" ").filter((c) => c.length > 0);
}

function constructExpressionInternal(tokens: Array<string>): expression {
  const token = tokens.shift();
  if (token == undefined) {
    throw new ParseError(`Unclosed opening parens`);
  }
  if (token == "(") {
    //start of (sub) list
    const exp = [];
    while (tokens[0] != ")") {
      // end of (sub) list
      exp.push(constructExpressionInternal(tokens));
    }
    tokens.shift();
    return exp;
  } else if (token == ")") {
    throw new ParseError("Unexpected closing parens");
  } else {
    return atomize(token);
  }
}

/*
 * This function takes in an array of tokens and outputs a s-expression.
 * It adds additional error checking and error messaging compared to
 * constructExpressionInternal
 */
function constructExpression(tokens: Array<string>): expression {
  if (tokens.length == 0) {
    throw new ParseError("No input supplied");
  }
  const exp = constructExpressionInternal(tokens);
  if (tokens.length != 0) {
    throw new ParseError(
      `Remaining tokens after closing parens were: ${tokens}`
    );
  }
  return exp;
}

/*
 * Wrapper function for first tokenizing the input and then returning the s-epression.
 */

function parse(input: string): expression {
  const tokens = tokenize(input);
  return constructExpression(tokens);
}

/*
 * Pretty prints (maybe just prints) an s-expression
 */

function formatExpression(input: expression): string {
  if (input == null || input == undefined) {
    return "";
  }
  if (typeof input == "number" || typeof input == "string") {
    return `${input} `;
  } else {
    //its an array
    let s = "";
    while (input.length > 0) {
      const val = input.shift();
      if (val == undefined) {
        //empty list, return nothing
        s += " ";
      }
      const out = formatExpression(val as expression);
      s += `${out} `;
    }
    return `( ${s} )`;
  }
}

export { tokenize, constructExpression, parse };
