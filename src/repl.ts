/* eslint-disable */

import readline from "readline";
import { parse } from "./lib/parser";
import { createReplEnv, Environment } from "./lib/environment";
import { logicBuiltIns } from "./lib/env/logic_env";
import { mathBuiltIns } from "./lib/env/math_env";
import { evalExpression } from "./lib/runtime";
import { readFileSync } from "fs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loadFiles(replEnv: Environment): any {
  const filenames = process.argv.slice(2);
  filenames.forEach((name) => {
    console.log(`Loading script ${name}`);
    const fileContents = readFileSync(name, "utf8");
    const parsedFile = parse(fileContents);
    console.log(evalExpression(parsedFile, replEnv));
  });
}

function repl(): any {
  const replEnv = createReplEnv(logicBuiltIns, mathBuiltIns);
  loadFiles(replEnv);
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
