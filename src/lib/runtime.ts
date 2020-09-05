import { expression, environment, list } from "./types";
import { isString, isNumber } from "./helpers";

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
    // constant number
  } else if (isNumber(exp)) {
    return exp;
  }

  // function call
  else {
    exp = exp as list; /* The variable reference/constant expression cases above would
      return early if EXP was an atom. It got to here, but TS's type checking is breaking down now*/

    const func = evalExpression(exp[0], env) as any; //The first element could be an expression so evaluate that expression
    const args = exp.slice(1).map((a) => evalExpression(a, env)); //each arg could also be an expression so evaluate each arg
    return func(args);
  }
}

export { evalExpression };
