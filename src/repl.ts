/* eslint-disable */

import readline from "readline";
import { parse } from "./lib/parser";
import { createReplEnv } from "./lib/environment";
import { evalExpression } from "./lib/runtime";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function repl(): any {
  const replEnv = createReplEnv();
  const readlines = (): any => {
    rl.question("> ", (input: string) => {
      try {
        const parsedInput = parse(input);
        console.log(evalExpression(parsedInput, replEnv));
      } catch (e) {
        console.warn(e.message);
      }
      readlines();
    });
  };

  readlines();
}

repl();