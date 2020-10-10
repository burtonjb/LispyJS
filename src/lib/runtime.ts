import { expression, environment, list } from "./types";
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
    if (typeof exp == "string") {
      if (env.find(exp as string) == undefined) {
        return undefined; // Should throw on unbound symbol?
      }
      return env.find(exp as string).map[exp as string];
    }
    // constant
    else if (!Array.isArray(exp)) {
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
    } else if (car == "begin") {
      const evaluated = (exp as any)
        .slice(1, exp.length - 1)
        .map((e: expression) => evalExpression(e, env));
      exp = exp[exp.length - 1];
      continue;
    } else if (car == "eval") {
      // This functionality was reversed engineered from biwascheme
      if (exp.length != 2) {
        throw new Error(
          `Wrong number of args to eval (takes 1). Expression was ${exp}`
        );
      }
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
      // TODO: change this to if lambda -> lambda stuff, else -> call NativeLambda. Don't do what I have.
      if (car instanceof NativeLambda) {
        //built-in function call, call it
        return car.call(cdr);
      } else if (car instanceof Lambda) {
        // custom lambda, replace current expression and env
        exp = car.body;
        env = car.createLambdaEnv(cdr);
        continue;
      } else {
        throw new Error(`Error: ${exp} is not callable`);
      }
    }
  }
}

export { evalExpression };
