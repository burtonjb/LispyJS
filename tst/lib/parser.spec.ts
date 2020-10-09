import { expect } from "chai";
import "mocha";

import { tokenize, constructExpression, parse } from "../../src/lib/parser";

describe("tokenize", () => {
  it("will tokenize an expression", () => {
    const actual = tokenize("(this  is     expression)");
    expect(["(", "this", "is", "expression", ")"]).to.eql(actual);
  });
  it("will expand out quotes", () => {
    const actual = tokenize("'x");
    expect(["(", "quote", "x", ")"]).to.eql(actual);
  });
});

describe("constructExpression", () => {
  it("will throw with an empty input", () => {
    expect(() => constructExpression([])).to.throw();
  });
  it("will throw with just a closing brace", () => {
    expect(() => constructExpression([")"])).to.throw();
  });
  it("will throw with just an opening brace", () => {
    expect(() => constructExpression(["("])).to.throw();
  });
  it("will pass with an number atom", () => {
    expect(constructExpression(["1"])).to.eql(1);
  });
  it("will pass with a string atom", () => {
    expect(constructExpression(["test"])).to.eql("test");
  });
  it("will pass with an empty list", () => {
    expect(constructExpression(["(", ")"])).to.eql([]);
  });
  it("will pass with list", () => {
    expect(constructExpression(["(", "+", "1", "2", ")"])).to.eql(["+", 1, 2]);
  });
});

describe("parse", () => {
  it("will pass with a nested list", () => {
    expect(parse("( + 1 ( + 2 3))")).to.eql(["+", 1, ["+", 2, 3]]);
  });
  it("will error if there are too many closing braces", () => {
    expect(() => parse("(+ 1 2))")).to.throw();
  });
});
