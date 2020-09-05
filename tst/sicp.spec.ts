import { expect } from "chai";
import "mocha";

import { parse } from "../src/lib/parser";
import { createReplEnv } from "../src/lib/environment";
import { logicBuiltIns } from "../src/lib/env/logic_env";
import { mathBuiltIns } from "../src/lib/env/math_env";
import { evalExpression } from "../src/lib/runtime";

describe("example code in SICP should run", () => {
  describe("chapter 1", () => {
    it("adds numbers", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (+ 137 349 )
    `;
      const result = evalExpression(parse(exp), env);
      expect(486).to.be.closeTo(result, 0.0001);
    });

    it("multiplies numbers", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (* 25 4 12 )
    `;
      const result = evalExpression(parse(exp), env);
      expect(1200).to.be.closeTo(result, 0.0001);
    });

    it("does some random math", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (+ (* 3 (+ (* 2 4) (+ 3 5))) (+ (- 10 7) 6))
    `;
      const result = evalExpression(parse(exp), env);
      expect(57).to.be.closeTo(result, 0.0001);
    });

    it("can calculate the circumference of a circle", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (begin 
        (define pi 3.14159)
        (define radius 10)
        (define circumference (* 2 pi radius))
        circumference
    )
    `;
      const result = evalExpression(parse(exp), env);
      expect(62.8318).to.be.closeTo(result, 0.0001);
    });

    it("should define a function to square numbers", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (begin 
        (define square (lambda (x) (* x x)))
        (square 21)
    )
    `;
      const result = evalExpression(parse(exp), env);
      expect(441).to.be.closeTo(result, 0.0001);
    });

    it("should add results from a function call together", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (begin 
        (define square (lambda (x) (* x x)))
        (define sum-of-squares (lambda (x y)
            (+ (square x) (square y))))
        (sum-of-squares 3 4)
    )
    `;
      const result = evalExpression(parse(exp), env);
      expect(25).to.be.closeTo(result, 0.0001);
    });

    it("should support defining an abs function", () => {
      //TODO: cond is used in the book, but I haven't implemented it. Fix this if I do implement it

      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
      (begin 
          (define abs (lambda (x) (
              if (<= x 0) 
              (* -1 x)
              x
          )))
          (+ (abs 10) (abs -11))
      )
      `;
      const result = evalExpression(parse(exp), env);
      expect(21).to.be.closeTo(result, 0.0001);
    });

    it("should evaluate when a number is between 5 and 10", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
    (begin 
        (define x 7)
        (and (>= x 5) (<= x 10))
    )
    `;
      const result = evalExpression(parse(exp), env);
      expect(true).to.be.equal(result);

      const exp2 = `
    (begin 
        (define y 11)
        (and (>= y 5) (<= y 10))
    )
    `;
      const result2 = evalExpression(parse(exp2), env);
      expect(false).to.be.equal(result2);
    });
    it("Newton's method square root function", () => {
      const env = createReplEnv(logicBuiltIns, mathBuiltIns);
      const exp = `
      (begin 
        (define abs 
          (lambda (x) 
            (if (<= x 0) 
              (* -1 x) 
              x
        )))
        
        (define method 
          (lambda (initial-guess func derivative) 
            (- initial-guess (/ (func initial-guess) (derivative initial-guess)
        ))))
        
        (define newton     
          (lambda (_z fu fu_prime eps) 
            (begin 
              (define og _z)         
              (define ng (method og fu fu_prime))         
              (if (<= (abs (- og ng)) eps)           
                ng                
                (newton ng fu fu_prime eps)
        ))))
        
        (define sqrt 
          (lambda (a) 
          (newton 1 
            (lambda (x) (- (* x x) a))          
            (lambda (x) (* 2 x))      
            0.000001    
        )))
        
        (sqrt 90)
        )
      `;
      const result = evalExpression(parse(exp), env);
      expect(9.4868).to.be.closeTo(result, 0.0001);
    });
  });
});
