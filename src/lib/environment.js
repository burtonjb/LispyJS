// Call this a JS function for now. The raw functions here should eventually be replaced with a 'native' lambda type

function createReplEnv() {
  return {
    "car": (args) => args[0],
    "cdr": (args) => args.slice(1),
    "+": (args) => args.reduce((acc, cur) => acc + cur),
    "=": (args) => args.every( (val, i, arr) => val === arr[0])
  };
}

export { createReplEnv };
