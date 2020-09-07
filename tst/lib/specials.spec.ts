import { expect } from "chai";
import "mocha";

import { parse } from "../../src/lib/parser";
import { define, set, quote } from "../../src/lib/specials";
import { list } from "../../src/lib/types";
import { createBaseEnv, Environment } from "../../src/lib/environment";
import { evalIf } from "../../src/lib/checkedSpecials";

describe("define", () => {
  it("should set a symbols value in the environment", () => {
    const env = new Environment({}, null);
    const exp = parse("(define a 1)");
    const actual = define(exp as list, env);
    expect(1).to.equal(env.map["a"]);
    expect(1).to.equal(actual);
  });
  it("should set the value in the current environment", () => {
    const parent = new Environment({}, null);
    const child = new Environment({}, parent);
    const exp = parse("(define a 1)");
    define(exp as list, child);
    expect(1).to.equal(child.map["a"]);
    expect(parent.map["a"]).to.be.undefined;
  });
});

describe("set!", () => {
  it("should override a symbols value in the environment", () => {
    const env = new Environment({ a: 1 }, null);
    const exp = parse("(set! a 2)");
    const actual = set(exp as list, env);
    expect(2).to.equal(env.map["a"]);
    expect(2).to.equal(actual);
  }),
    it("should set the value in the environment where the symbol is defined -- child env", () => {
      const parent = new Environment({}, null);
      const child = new Environment({ a: 1 }, parent);
      const exp = parse("(set! a 2)");
      set(exp as list, child);
      expect(2).to.equal(child.map["a"]);
      expect(parent.map["a"]).to.be.undefined;
    });
  it("should set the value in the environment where the symbol is defined -- parent env", () => {
    const parent = new Environment({ a: 1 }, null);
    const child = new Environment({}, parent);
    const exp = parse("(set! a 2)");
    set(exp as list, child);
    expect(2).to.equal(parent.map["a"]);
    expect(child.map["a"]).to.be.undefined;
  });
});

describe("quote", () => {
  it("should return the following s-expression, unevaluated", () => {
    const env = new Environment({}, null);
    const exp = parse("(quote (a 2))");
    const actual = quote(exp as list, env);
    expect(["a", 2]).to.eql(actual);
  });
});

describe("if", () => {
  it("should return the true expression if true", () => {
    const env = createBaseEnv();
    const exp = parse("(if (= 1 1) 1 2)");
    const actual = evalIf(exp as list, env);
    expect(1).to.equal(actual);
  });
  it("should return the false expression if false", () => {
    const env = createBaseEnv();
    const exp = parse("(if (= 1 2) 1 2)");
    const actual = evalIf(exp as list, env);
    expect(2).to.equal(actual);
  });
  it("should return the expression and not evaluate", () => {
    const env = createBaseEnv();
    const exp = parse("(if (= 1 1) (+ 1 0) (+ 2 0))");
    const actual = evalIf(exp as list, env);
    expect(["+", 1, 0]).to.eql(actual);
  });
});
