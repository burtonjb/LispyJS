import { expression, environment, list } from "./types";
import { isString } from "./helpers";
import { isArray } from "util";
import { define, set, quote, evalIf, createLambda } from "./checkedSpecials";
import { NativeLambda, Lambda } from "./lambda";

/*
 * This function evaluates an expression in an environment
 */
function evalExpression(exp: expression, env: environment): any {
  while (true) {
    // handle null/undefined case
    if (exp == null || exp == undefined) {
      return exp;
    }

    // Variable reference
    if (isString(exp)) {
      if (env.find(exp as string) == undefined) {
        console.error(exp);
        return undefined; // Should throw on unbound symbol?
      }
      return env.find(exp as string).map[exp as string];
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
      exp = evalIf(exp as list, env);
      continue;
    } else if (car == "lambda") {
      return createLambda(exp as list, env);
    } else if (car == "eval") {
      return evalExpression(evalExpression(cdr[0], env), env.getRoot());
    }

    //debug commands
    else if (car == ".env") {
      return env;
    }

    // function call
    else {
      const evaluated = (exp as any).map((e: expression) =>
        evalExpression(e, env)
      );
      const car = evaluated[0];
      const cdr = evaluated.slice(1);
      if (car instanceof NativeLambda) {
        //built-in function call, call it
        return car.call(cdr);
      } else if (car instanceof Lambda) {
        // custom lambda, replace current expression and env
        exp = car.body;
        env = car.createLambdaEnv(cdr);
        continue;
      } else {
        //What to do if it isn't one of these types?
        throw new Error("Preventing an infinite loop right now.");
      }
    }
  }
}

export { evalExpression };
