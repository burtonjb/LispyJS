import { expect } from "chai";
import "mocha";

import { parse } from "../../src/lib/parser";
import { evalExpression } from "../../src/lib/runtime";
import { createBaseEnv, Environment } from "../../src/lib/environment";
import { Lambda } from "../../src/lib/lambda";

describe("evalExpression", () => {
  it("supports variable reference", () => {
    const exp = parse("a");
    const env = new Environment({ a: "value" }, null);
    const actual = evalExpression(exp, env);
    expect("value").to.equal(actual);
  });
  it("supports constant numbers", () => {
    const exp = parse("2");
    const env = new Environment({ a: "value" }, null);
    const actual = evalExpression(exp, env);
    expect(2).to.equal(actual);
  });
  it("supports function calls", () => {
    const exp = parse("(+ 1 2)");
    const env = createBaseEnv();
    const actual = evalExpression(exp, env);
    expect(3).to.equal(actual);
  });
  it("supports variable binding", () => {
    const exp = parse("(define a 1)");
    const env = createBaseEnv();
    const actual = evalExpression(exp, env);
    expect(1).to.equal(actual);
    expect(1).to.equal(env.map.a);
  });
  it("supports set!ing values", () => {
    const exp = parse("(set! a 1)");
    const env = createBaseEnv();
    env.map["a"] = 0;
    const actual = evalExpression(exp, env);
    expect(1).to.equal(actual);
    expect(1).to.equal(env.map.a);
  });
  it("supports quote", () => {
    const exp = parse("(quote (a b c))");
    const env = createBaseEnv();
    const actual = evalExpression(exp, env);
    expect(["a", "b", "c"]).to.eql(actual);
  });
  it("supports if", () => {
    const exp = parse("(if (= 1 1) 1 2)");
    const env = createBaseEnv();
    const actual = evalExpression(exp, env);
    expect(1).to.eql(actual);
  });
  it("supports creating and running lambdas", () => {
    const exp = parse("(lambda (x) (+ x 1))");
    const env = createBaseEnv();
    const actual = evalExpression(exp, env) as Lambda;
    expect(["x"]).to.eql(actual.paramNames);
    expect(["+", "x", 1]).to.eql(actual.body);
    expect(env).to.equal(actual.parentEnv);
  });
});
