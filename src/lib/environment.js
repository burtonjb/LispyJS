// Call this a JS function for now. The raw functions here should eventually be replaced with a 'native' lambda type

import { NativeLambda } from "./lambda";
import { parse } from "./parser";
import { readFileSync, writeFileSync } from "fs";
import { compile, internalCompile } from "./compiler";

class Environment {
  constructor(map, parent) {
    this.map = map;
    this.parent = parent;
  }

  find(arg) {
    if (this.map[arg] == undefined) {
      if (this.parent) {
        return this.parent.find(arg);
      } else {
        return undefined;
      }
    }
    return this;
  }

  getRoot() {
    if (this.parent) {
      return this.parent.getRoot();
    }
    return this;
  }
}

/*
 * Create a very basic default environment.
 */

function createBaseEnv() {
  const builtIns = {
    // This should probably go into a different file
    list: (args) => args,
    nil: [],

    "+": (args) => args.reduce((acc, cur) => acc + cur),
    "-": (args) => args.reduce((acc, cur) => acc - cur),
    "=": (args) => args.every((val, i, arr) => val === arr[0]),

    "read-file": (args) => readFileSync(args[0], "utf8"),
    "write-file": (args) => writeFileSync(args[0], args[1], "utf8"),

    parse: (args) => parse(args[0]),
    compile: (args) => compile(args[0]),
    "internal-compile": (args) => internalCompile(args[0]),

    assert: (args) => {
      if (!args[0]) throw Error(args.slice(1));
    }, // if args[0] is not true, then throw an exception. The exception message is the rest of the args

    print: (args) => {
      console.log(args[0]);
      return args[0];
    },
    printv: (args) => {
      console.log(args);
      return args;
    },
    printflat: (args) => {
      console.log(`${args}`);
      return args[0];
    },

    "#t": true,
    "#f": false,

    exit: (args) => {
      process.exit(args[0]);
    },
  };
  for (const [key, value] of Object.entries(builtIns)) {
    if (typeof value == "function") {
      builtIns[key] = new NativeLambda(value);
    }
  }
  return new Environment(builtIns, null);
}

function createReplEnv(...modules) {
  const builtIns = createBaseEnv().map;

  modules.forEach((m) => {
    for (const [key, value] of Object.entries(m)) {
      if (builtIns[key] == undefined) {
        if (typeof value == "function") {
          // Do not wrap constants in lambdas.
          builtIns[key] = new NativeLambda(value);
        }
      } else {
        console.error(`field ${key} is already defined. Skipping`);
      }
    }
  });

  return new Environment(builtIns, null);
}

export { Environment, createBaseEnv, createReplEnv };
