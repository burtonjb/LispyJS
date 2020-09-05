import { expect } from "chai";
import "mocha";

import { parse } from "../../src/lib/parser";
import { define, set, quote } from "../../src/lib/specials";
import { list, environment } from "../../src/lib/types";
import { createReplEnv } from "../../src/lib/environment";
import { evalIf } from "../../src/lib/checkedSpecials";

describe("define", () => {
  it("should set a symbols value in the environment", () => {
    const env: environment = {};
    const exp = parse("(define a 1)");
    const actual = define(exp as list, env);
    expect(1).to.equal(env["a"]);
    expect(1).to.equal(actual);
  });
  it("should set the value in the current environment");
});

describe("set!", () => {
  it("should override a symbols value in the environment", () => {
    const env = { a: 1 };
    const exp = parse("(set! a 2)");
    const actual = set(exp as list, env);
    expect(2).to.equal(env["a"]);
    expect(2).to.equal(actual);
  }),
    it("should set the value in the environment where the symbol is defined");
});

describe("quote", () => {
  it("should return the following s-expression, unevaluated", () => {
    const env = {};
    const exp = parse("(quote (a 2))");
    const actual = quote(exp as list, env);
    expect(["a", 2]).to.eql(actual);
  });
});

describe("if", () => {
  it("should return the true expression if true", () => {
    const env = createReplEnv();
    const exp = parse("(if (= 1 1) 1 2)");
    const actual = evalIf(exp as list, env);
    expect(1).to.equal(actual);
  });
  it("should return the false expression if false", () => {
    const env = createReplEnv();
    const exp = parse("(if (= 1 2) 1 2)");
    const actual = evalIf(exp as list, env);
    expect(2).to.equal(actual);
  });
  it("should evaluate the expression before returning", () => {
    const env = createReplEnv();
    const exp = parse("(if (= 1 1) (+ 1 0) (+ 2 0))");
    const actual = evalIf(exp as list, env);
    expect(1).to.equal(actual);
  });
});
