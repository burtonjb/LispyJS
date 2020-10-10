/* eslint-disable */

import { parse } from "./lib/parser";
import { Environment } from "./lib/environment";
import { environment, expression, list } from "./lib/types";
import { readFileSync } from "fs";

enum basicType {
  undef = "undefined",
  list = "list",
  number = "number",
  string = "string",
  boolean = "boolean",
  or = "|", // This is probably not a basic type, but not going to change it now.
}

type func = {
  returnType: basicType | func;
};

type Type = basicType | func;

const orTypeFormatter = (...args: Type[]): Type => {
  return args.join(basicType.or) as basicType.or;
};

const functionFormatter = (t: Type): Type => {
  return { returnType: t };
};

/*
 * Incomplete type mapping of the built in functions
 */
const builtInTypeMap = {
  "+": { returnType: basicType.number },
  "-": { returnType: basicType.number },
  list: { returnType: basicType.list },
  "=": { returnType: basicType.boolean },
};

/*
 * Accepts an AST.
 * Inplace edits a symbol table to annotate every type.
 * Reusing the env class, but in this case it will be a map of symbol to Type.
 */
function typeCheck(exp: expression, env: environment): Type {
  if (exp == null || exp == undefined) {
    return basicType.undef;
  }
  //variable reference, return the Type of the variable (stored in the env)
  if (typeof exp == "string") {
    if (env.find(exp as string) == undefined) {
      return basicType.undef;
    }
    return env.find(exp).map[exp as string];
  }
  // constant (1 2 3)
  else if (!Array.isArray(exp)) {
    return typeof exp as basicType;
  }
  exp = exp as list;

  const car = exp[0];
  const cdr = exp.slice(1);

  if (car == "define") {
    env.map[cdr[0] as string] = typeCheck(cdr[1], env); // assign the Type of the symbol to the rest of the define statement
    return env.map[cdr[0] as string];
  } else if (car == "set!") {
    env.map[cdr[0] as string] = typeCheck(cdr[1], env); // same as define, skipping the checks because I'm lazy
    return env.map[cdr[0] as string];
  } else if (car == "quote") {
    if (Array.isArray(cdr[0])) return basicType.list;
    else return basicType.string;
  } else if (car == "if") {
    const trueBranchType = typeCheck(cdr[1], env);
    const falseBranchType = typeCheck(cdr[2], env);
    if (trueBranchType == falseBranchType) return trueBranchType;
    else return orTypeFormatter(trueBranchType, falseBranchType); // one way of checking types. I personally don't think its too smart, but its quick and flexible
  } else if (car == "begin") {
    const types = (exp as any)
      .slice(1)
      .map((e: expression) => typeCheck(e, env));
    return types[types.length - 1];
  } else if (car == "lambda") {
    // pretty dumb way to do type annotations on lambdas, but w/e
    return functionFormatter(typeCheck(exp[2], new Environment({}, env)));
  } else {
    // assume its a function call
    const f = env.find(car as string).map[car as string];
    if (f.returnType) return f.returnType;
    // return the type of the invoked function.
    else return basicType.undef; // it wasn't a function call...
  }
}

function loadFiles(): any {
  const filenames = process.argv.slice(2);
  filenames.forEach((name) => {
    try {
      console.log(`Loading script ${name}`);
      const fileContents = readFileSync(name, "utf8");
      const parsedFile = parse(fileContents);
      const map = {};
      const annotated = typeCheck(parsedFile, new Environment(map, null));
      console.log(annotated, map);
    } catch (e) {
      console.error(`Error in loading file ${name}`, e);
    }
  });
}

loadFiles();

export {
  typeCheck,
  Type,
  orTypeFormatter,
  basicType,
  func,
  builtInTypeMap,
  functionFormatter,
};
