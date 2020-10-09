/* eslint-disable */

import readline from "readline";
import { parse } from "./lib/parser";
import { createReplEnv } from "./lib/environment";
import {
  logicBuiltIns,
  mathBuiltIns,
  betaEnvBuiltIns,
  stringBuiltIns,
} from "./lib/env/env";
import { evalExpression } from "./lib/runtime";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function repl(): any {
  const replEnv = createReplEnv(
    logicBuiltIns,
    mathBuiltIns,
    betaEnvBuiltIns,
    stringBuiltIns
  );
  const readlines = (): any => {
    rl.question("> ", (input: string) => {
      try {
        const parsedInput = parse(input);
        console.log(evalExpression(parsedInput, replEnv));
      } catch (e) {
        console.error("\x1b[31m", e.message, "\x1b[0m"); // display the error in red!
      }
      readlines();
    });
  };
  readlines();
}

repl();
