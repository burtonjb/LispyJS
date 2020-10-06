/* eslint-disable */

import { parse } from "./lib/parser";
import { createReplEnv } from "./lib/environment";
import { logicBuiltIns, mathBuiltIns, betaEnvBuiltIns } from "./lib/env/env";
import { evalExpression } from "./lib/runtime";
import { readFileSync } from "fs";

/*
 * Read in scheme scripts from the command line args and evaluate them.
 * FIXME: display a nice message if args aren't provided
 */
function loadFiles(): any {
  const replEnv = createReplEnv(logicBuiltIns, mathBuiltIns, betaEnvBuiltIns);
  const filenames = process.argv.slice(2);
  filenames.forEach((name) => {
    try {
      console.log(`Loading script ${name}`);
      const fileContents = readFileSync(name, "utf8");
      const parsedFile = parse(fileContents);
      console.log(evalExpression(parsedFile, replEnv));
    } catch (e) {
      console.error(`Error in loading file ${name}`, e);
    }
  });
}

loadFiles();
