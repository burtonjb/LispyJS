import { expect } from "chai";
import "mocha";

import { Lambda } from "../../src/lib/lambda";
import { Environment, createBaseEnv } from "../../src/lib/environment";
import { parse } from "../../src/lib/parser";
import { list } from "../../src/lib/types";

describe("lambda", () => {
  it("should evaluate an expression", () => {
    const paramNames = parse("(x y)") as list;
    const body = parse("(+ x y)") as list;
    const env = new Environment({}, createBaseEnv());
    const lambda = new Lambda(paramNames, body, env);
    expect(lambda.call(parse("( 1 2 )") as list)).to.equal(3);
  });
});
