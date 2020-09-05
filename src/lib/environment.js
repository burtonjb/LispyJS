// Call this a JS function for now. The raw functions here should eventually be replaced with a 'native' lambda type

import { NativeLambda } from "./lambda";

class Environment {
  constructor(map, parent) {
    this.map = map
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
}

/*
 * Create a very basic default environment. 
 */ 
function createBaseEnv() {
  const builtIns = {
    "car": (args) => args[0],
    "cdr": (args) => args.slice(1),
    "begin": (args) => args[args.length - 1],
    "+": (args) => args.reduce((acc, cur) => acc + cur),
    "-": (args) => args.reduce((acc, cur) => acc - cur),
    "=": (args) => args.every( (val, i, arr) => val === arr[0])
  };
  for (const [key, value] of Object.entries(builtIns)) {
    builtIns[key] = new NativeLambda(value);
  };
  return new Environment(builtIns, null);
}

function createReplEnv(...modules) {
  const builtIns = createBaseEnv().map;

  modules.forEach(m => {
    for (const [key, value] of Object.entries(m)) {
      if (builtIns[key] == undefined) {
        builtIns[key] = new NativeLambda(value);
      } else {
        console.error(`field ${key} is already defined. Skipping`);
      }
    };
  })

  return new Environment(builtIns, null);
}

export { Environment, createBaseEnv, createReplEnv };
