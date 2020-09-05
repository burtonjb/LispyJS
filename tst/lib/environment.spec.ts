import { expect } from "chai";
import "mocha";

import { createBaseEnv, Environment } from "../../src/lib/environment";

describe("Environment", () => {
  it("can be created", () => {
    expect(createBaseEnv()).to.not.null;
  });
  it("should have addition defined", () => {
    expect(createBaseEnv().map["+"]).to.be.not.undefined;
  });
  it("finds stuff in current scope if defined", () => {
    const parent = new Environment({ a: 1 }, null);
    const child = new Environment({ b: 1 }, parent);
    expect(child.find("b")).to.equal(child);
  });
  it("finds stuff in parent scope if defined there", () => {
    const parent = new Environment({ a: 1 }, null);
    const child = new Environment({ b: 1 }, parent);
    expect(child.find("a")).to.equal(parent);
  });
  it("should create the repl env");
});
