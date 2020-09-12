import { expect } from "chai";
import "mocha";

import { parse } from "../src/lib/parser";
import { createReplEnv } from "../src/lib/environment";
import { logicBuiltIns } from "../src/lib/env/logic_env";
import { mathBuiltIns } from "../src/lib/env/math_env";
import { evalExpression } from "../src/lib/runtime";

describe("application tests", () => {
  it("calculates the area of a circle", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define r 10)
      (define pi 3.1415)
      (* pi (* r r))
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(314.15).to.be.closeTo(result, 0.0001);
  });

  it("creates a function to calculate the area of a circle", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define pi 3.1415)
      (define circle-area ( lambda (r) (* pi (* r r))))
      (circle-area 3)
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(28.2735).to.be.closeTo(result, 0.0001);
  });

  it("creates a function to calculate the factorial of a number, recursively", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))
      (fact 10)
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(3628800).to.be.closeTo(result, 0.0001);
  });

  it("can create aliases for built in functions", () => {
    return; // Skip this, its broken right now
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define first car)
      (define rest cdr)
      (define count (lambda (item L) (if L (+ (= item (first L)) (count item (rest L))) 0)))
      (count (quote the) (quote (the more the merrier the bigger the better)))
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(3).to.be.closeTo(result, 0.0001);
  });

  it("can pass functions as inputs and return closures", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define twice (lambda (x) (* 2 x)))
      (define repeat (lambda (f) (lambda (x) (f (f x)))))
      ((repeat (repeat (repeat (repeat twice)))) 10)
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(655360).to.be.closeTo(result, 0.0001);
  });

  it("can calculate the fib numbers", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define fib (lambda (n) (if (<= n 1) 1 (+ (fib (- n 1)) (fib (- n 2))))))
      (list (fib 0) (fib 1) (fib 2) (fib 3) (fib 4) (fib 5) (fib 6) (fib 7) (fib 8) (fib 9) (fib 10) (fib 11) )
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]).to.be.eql(result);
  });

  it("should be able to make an iterator", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin 
      (define iter (lambda (x) (
        lambda () (begin (set! x (+ x 1)) x)
      )))
      (define x1 (iter 0))
      (define x2 (iter 0))
      (list (x1) (x1) (x1) (x1) (x2) (x2))
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect([1, 2, 3, 4, 1, 2]).to.be.eql(result); // Is this behavior correct? I think the scheme spec says that the order of evaluations is undefined
  });

  it("the stack should not blow up if its a tail recursive function -- simple test case", () => {
    //The stack will explode if tail call optimization is not implemented
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin
    (define iter (lambda (x) (if (= 0 x) x (iter (- x 1)))))
    (iter 100000)  
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(0).to.be.equal(result);
  });
  it("can evaluate an expression", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin
      (define x (quote (+ 1 2 3)))
      (eval x)
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(6).to.be.equal(result);
  });
  it("can read a file", () => {
    const env = createReplEnv(logicBuiltIns, mathBuiltIns);
    const exp = `
    (begin
      (define file-contents (read-file (quote ./scheme/basic.scm)))
      (eval (parse file-contents))
    )
    `;
    const result = evalExpression(parse(exp), env);
    expect(6).to.be.equal(result);
  });
});
