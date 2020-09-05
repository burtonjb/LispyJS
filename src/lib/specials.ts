import { expression, environment, list } from "./types";
import { evalExpression } from "./runtime";

export function define(exp: list, env: environment): expression {
  const symbol = exp[1];
  const cdr = exp[2];
  const val = evalExpression(cdr, env);
  env[symbol as string] = val;
  return val;
}

export function set(exp: list, env: environment): expression {
  const symbol = exp[1];
  const cdr = exp[2];
  const val = evalExpression(cdr, env);
  env[symbol as string] = val;
  return val;
}

export function quote(exp: list, env: environment): expression {
  return exp[1];
}

export function evalIf(exp: list, env: environment): expression {
  const test = exp[1];
  const trueExpression = exp[2];
  const falseExpression = exp[3];
  if (evalExpression(test, env)) {
    return evalExpression(trueExpression, env);
  } else {
    return evalExpression(falseExpression, env);
  }
}
