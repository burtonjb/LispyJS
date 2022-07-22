import { expect } from "chai";
import "mocha";

import { internalCompile } from "../src/lib/compiler";
import { parse } from "../src/lib/parser";

describe("Compiler", () => {
  it("Compiles simple numeric expression", () => {
    const exp = `
    1
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`1`);
  });

  it("Compiles simple variable lookup", () => {
    const exp = `
    a
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`a`);
  });

  it("Compiles a simple define statement", () => {
    const exp = `
    (define a 1)
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`let a = 1;\n`);
  });

  it("Compiles a define and then a set statement", () => {
    const exp = `
      (set! a 2)
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`a = 2;\n`);
  });

  it("Compiles a quote with a single character", () => {
    const exp = `
      'a
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`"a"`);
  });

  it("Compiles a quote with multiple characters", () => {
    const exp = `
      (quote (a b c))
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`["a", "b", "c"]`);
  });

  it("Compiles an if statement", () => {
    const exp = `
      (if (equals 1 2) (define a 1) (define a 3))
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(
      `if (equals(1,2))\n\t{let a = 1;\n}\n\telse{let a = 3;\n}\n`
    );
  });

  it("Compiles a begin statement", () => {
    const exp = `
      (begin 
        (define a 1)  
        (define b 2)
      )
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(
      `let a = 1;
let b = 2;
`
    );
  });

  it("Compiles a function call", () => {
    const exp = `
      (sum 1 2 3)
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`sum(1,2,3)`);
  });

  it("Compiles a lambda expression", () => {
    const exp = `
      (lambda (x y) (sum x y))
    `;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(`(x, y) => {return sum(x,y);}
`);
  });

  it("Compiles a lambda expression and sets it to a variable", () => {
    const exp = `
      (define f (lambda (x y) (sum x y)))
`;
    const result = internalCompile(parse(exp));
    expect(result).to.eql(
      `let f = (x, y) => {return sum(x,y);}
;
`
    );
  });
});
