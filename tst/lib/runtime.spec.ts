import { expect } from "chai";
import "mocha";

import { parse } from "../../src/lib/parser";
import { evalExpression } from "../../src/lib/runtime";
import { createReplEnv } from "../../src/lib/environment";

describe("evalExpression", () => {
  it("supports variable reference", () => {
    const exp = parse("a");
    const env = { a: "value" };
    const actual = evalExpression(exp, env);
    expect("value").to.equal(actual);
  });
  it("supports constant numbers", () => {
    const exp = parse("2");
    const env = { a: "value" };
    const actual = evalExpression(exp, env);
    expect(2).to.equal(actual);
  });
  it("supports function calls", () => {
    const exp = parse("(+ 1 2)");
    const env = createReplEnv();
    const actual = evalExpression(exp, env);
    expect(3).to.equal(actual);
  });
});
