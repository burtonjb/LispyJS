import { expect } from "chai";
import "mocha";
import { Environment } from "../src/lib/environment";
import { parse } from "../src/lib/parser";

import {
  typeCheck,
  orTypeFormatter,
  basicType,
  builtInTypeMap,
  functionFormatter,
} from "../src/type-check";

describe("Simple type checking algorithm", () => {
  it("Can determine the type of a number", () => {
    const exp = `
    1
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.number).to.eql(result);
  });

  it("Can determine the type of a string", () => {
    const exp = `
    'a
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.string).to.eql(result);
  });

  it("Can determine the type of a list", () => {
    const exp = `
    (quote (a b c))
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.list).to.eql(result);
  });

  it("Can determine the type of an if statement if both paths same types", () => {
    const exp = `
    (if (#t) 1 1)
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.number).to.eql(result);
  });

  it("Can determine the type of an if statement if both paths different types", () => {
    const exp = `
    (if (#t) 1 'a)
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(orTypeFormatter(basicType.number, basicType.string)).to.eql(result);
  });

  it("Can define variables and they will have types", () => {
    const exp = `
    (define a 1)
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.number).to.eql(result);
    expect({ a: basicType.number }).to.eql(map);
  });

  it("Can set variables to other variables and the types will propegate", () => {
    const exp = `
    (begin
      (define a 1)
      (define b a)
    )
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.number).to.eql(result);
    expect({ a: basicType.number, b: basicType.number }).to.eql(map);
  });

  it("will return no type if the variable is not set", () => {
    const exp = `
    a
    `;
    const map = {};
    const result = typeCheck(parse(exp), new Environment(map, null));
    expect(basicType.undef).to.eql(result);
  });

  it("Will return the type of a function", () => {
    const exp = `
      +
    `;
    const result = typeCheck(parse(exp), new Environment(builtInTypeMap, null));
    expect(functionFormatter(basicType.number)).to.eql(result);
  });

  it("Will return the returnType of an invoked function", () => {
    const exp = `
    (+ 1 2)
  `;
    const result = typeCheck(parse(exp), new Environment(builtInTypeMap, null));
    expect(basicType.number).to.eql(result);
  });

  it("Will be able to define a function", () => {
    const exp = `
    (lambda (x y) 1)
  `;
    const result = typeCheck(parse(exp), new Environment(builtInTypeMap, null));
    expect(functionFormatter(basicType.number)).to.eql(result);
  });
  it("Will be able to define a function", () => {
    const exp = `
    (lambda (x y) (list 1 2))
  `;
    const result = typeCheck(parse(exp), new Environment(builtInTypeMap, null));
    expect(functionFormatter(basicType.list)).to.eql(result);
  });
  it("Will be able to get the type of a user defined function", () => {
    const exp = `
    (begin 
      (define f (lambda (x y) (+ x y)))
      (define ans (f 1 2))
    )
    `;
    const map: any = new Object(builtInTypeMap);
    const result = typeCheck(parse(exp), new Environment(map, null));

    expect(basicType.number).to.eql(result);
    expect(functionFormatter(basicType.number)).to.eql(map["f"]);
    expect(basicType.number).to.eql(map["ans"]);
  });
});
