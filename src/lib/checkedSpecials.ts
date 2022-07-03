import { list, environment, expression } from "./types";
import { isString } from "util";

import * as raw from "./specials";
import { Lambda } from "./lambda";

export class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DefineError extends RuntimeError {
  constructor(message: string) {
    super(message);
  }
}

export class SetError extends RuntimeError {
  constructor(message: string) {
    super(message);
  }
}

export class QuoteError extends RuntimeError {
  constructor(message: string) {
    super(message);
  }
}

export class IfError extends RuntimeError {
  constructor(message: string) {
    super(message);
  }
}

export class LambdaError extends RuntimeError {
  constructor(message: string) {
    super(message);
  }
}
export function define(exp: list, env: environment): expression {
  if (exp.length != 3) {
    throw new DefineError(
      `Incorrect number of arguments to define. Expression was: ${exp}`
    );
  }
  const symbol = exp[1];
  if (typeof symbol != "string") {
    throw new DefineError(
      `Unable to bind variable to non-symbolic value. Expression was: ${exp}`
    );
  }
  if (env.map[symbol as string] != undefined) {
    throw new DefineError(
      `Unable to bind variable. Variable [(${symbol})] already defined. Expression was: ${exp}`
    );
  }
  return raw.define(exp, env);
}

export function set(exp: list, env: environment): expression {
  const symbol = exp[1];
  if (exp.length != 3) {
    throw new SetError(
      `Incorrect number of arguments to set!. Expression was: ${exp}`
    );
  }
  if (!(typeof symbol === "string")) {
    throw new SetError(
      `Unable to set! variable to non-symbolic value. Expression was: ${exp}`
    );
  }
  if (env.find(symbol as string) == undefined) {
    throw new SetError(
      `Unable to set variable. Variable not already defined. Expression was: ${exp}`
    );
  }
  return raw.set(exp, env);
}

export function quote(exp: list, env: environment): expression {
  if (exp.length != 2) {
    throw new QuoteError(
      `Incorrect number of arguments to quote. It only takes 1. Expression was: ${exp}`
    );
  }
  return raw.quote(exp, env);
}

export function evalIf(exp: list, env: environment): expression {
  if (exp.length != 4) {
    throw new IfError(
      `Incorrect number of arguments to if. It takes 4. Expression was: ${exp}`
    );
  }
  return raw.evalIf(exp, env);
}

export function createLambda(exp: list, env: environment): Lambda {
  if (exp.length != 3) {
    throw new LambdaError(
      `Incorrect number of arguments to lambda. It takes 3. Expression was ${exp}`
    );
  }
  return raw.createLambda(exp, env);
}
