import { expression, environment, list } from "./types";
import { evalExpression } from "./runtime";
import { Lambda } from "./lambda";

export function define(exp: list, env: environment): expression {
  const symbol = exp[1];
  const cdr = exp[2];
  const val = evalExpression(cdr, env);
  env.map[symbol as string] = val;
  return val;
}

export function set(exp: list, env: environment): expression {
  const symbol = exp[1];
  const cdr = exp[2];
  const val = evalExpression(cdr, env);
  const definedEnv = env.find(symbol); // the environment where the variable was defined
  if (definedEnv == undefined) {
    return undefined;
  }
  definedEnv.map[symbol as string] = val;
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

export function createLambda(exp: list, env: environment): Lambda {
  const paramNames = exp[1] as list;
  const body = exp[2] as list;
  return new Lambda(paramNames, body, env);
}
