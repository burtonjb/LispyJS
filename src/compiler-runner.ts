import { readFileSync, writeFileSync } from "fs";
import { compile } from "./lib/compiler";
import { parse } from "./lib/parser";

function compileFile(): any {
  const filename = process.argv[2];
  const outpath = process.argv[3];
  const fileContents = readFileSync(filename, "utf8");
  const parsedFile = parse(fileContents);
  const output = compile(parsedFile) + "\n";
  writeFileSync(outpath, output, "utf-8");
}

compileFile();

/* You can run this script with npx ts-node src/compiler-runner.ts SRC_FILE_PATH DEST_FILE_PATH 
e.g. 'npx ts-node src/compiler-runner.ts scheme/compiler-test/compiler-test.scm scheme/compiler-test/compiler-test.output.js'
*/
