import { expression, list } from "./types";

export function internalCompile(exp: expression): string {
  if (typeof exp == "string") {
    return `${exp}`;
  } else if (!Array.isArray(exp)) {
    return `${exp}`;
  }

  exp = exp as list;

  const car = exp[0];
  const cdr = exp.slice(1);

  if (car == "define") {
    const vari = cdr[0];
    const val = internalCompile(cdr[1]);
    return `let ${vari} = ${val};\n`;
  } else if (car == "set!") {
    const vari = cdr[0];
    const val = internalCompile(cdr[1]);
    return `${vari} = ${val};\n`;
  } else if (car == "quote") {
    if (Array.isArray(cdr[0])) {
      const vals = (cdr[0] as any).map((v: expression) => `"${v}"`);
      return `[${vals.join(", ")}]`;
    } else return `"${cdr[0]}"`;
  } else if (car == "if") {
    const condition = internalCompile(cdr[0]);
    const trueBranch = internalCompile(cdr[1]);
    const falseBranch = internalCompile(cdr[2]);
    return `if (${condition})\n\t{${trueBranch}}\n\telse{${falseBranch}}\n`;
  } else if (car == "begin") {
    let out = "";
    cdr.forEach((v: expression) => {
      out += internalCompile(v);
    });
    return out;
  } else if (car == "lambda") {
    const paramNames = cdr[0] as list;
    const body = internalCompile(cdr[1]);
    return `(${paramNames.join(", ")}) => {return ${body};}\n`;
  } else {
    // assume its a function call
    const f = car;
    const args = cdr;
    return `${f}(${args})`;
  }
}

/*
 * This takes in an s-expression and outputs a string that is the transpiled javascript
 * Ideally it should output a list of tokens that get converted to javascript, but I'm pretty lazy
 */

export function compile(exp: expression): string {
  let out = `
/* built-ins */
let sum = (...args) => args.reduce((acc, cur) => acc + cur);
let sub = (...args) => args.reduce((acc, cur) => acc - cur);
let equals = (...args) => args.every((val, i, arr) => val === arr[0]);
/* end built-ins */

`; // these are somewhat different than what I defined earlier, but naming functions +, -, or = will result in syntax errors in javascript. I guess there could be a translation step, but I don't really think its necessary right now

  out += internalCompile(exp);
  return out;
}
