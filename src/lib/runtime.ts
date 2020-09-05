import { expression, environment, list } from "./types";
import { isString } from "./helpers";
import { isArray } from "util";
import { define, set, quote, evalIf } from "./checkedSpecials";

/*
 * This function evaluates an expression in an environment
 */
function evalExpression(exp: expression, env: environment): expression {
  // handle null/undefined case
  if (exp == null || exp == undefined) {
    return exp;
  }

  // Variable reference
  if (isString(exp)) {
    return env[exp as string];
  }
  // constant
  else if (!isArray(exp)) {
    return exp;
  }
  exp = exp as list; /* The variable reference/constant expression cases above would
      return early if EXP was an atom. It got to here, but TS's type checking is breaking down now*/

  const car = exp[0];
  const cdr = exp.slice(1);

  if (car == "define") {
    return define(exp as list, env);
  } else if (car == "set!") {
    return set(exp as list, env);
  } else if (car == "quote") {
    return quote(exp as list, env);
  } else if (car == "if") {
    return evalIf(exp as list, env);
  }

  // function call
  else {
    const func = evalExpression(car, env) as any; //The first element could be an expression so evaluate that expression
    const args = cdr.map((a) => evalExpression(a, env)); //each arg could also be an expression so evaluate each arg
    return func(args);
  }
}

export { evalExpression };
