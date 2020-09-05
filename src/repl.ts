import readline from "readline";
import { parse } from "./lib/parser";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function readlines(): any {
  rl.question("> ", (answer: string) => {
    try {
      console.log(parse(answer));
    } catch (e) {
      console.warn(e.message);
    }
    readlines();
  });
}

readlines();
