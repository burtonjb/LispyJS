// There built-ins are probably not correct.
// Either I haven't looked up the spec, or they behave different than
// either biwascheme or mitscheme
export const betaEnvBuiltIns = {
  car: (args) => args[0][0],
  cdr: (args) => args[0].slice(1),
  cdrf: (args) => {
    const out = args[0].slice(1);
    if (out.length == 1) return out[0];
    return out;
  },
  cons: (args) => {
    const out = args.slice(1);
    out.unshift(args[0]);
    return out;
  },
  "empty?": (args) => args[0].length == 0,

  //FIXME: these are not implemented correctly. It should be defined as per http://people.csail.mit.edu/jaffer/r5rs_8.html.
  "<=": (args) => args.every((val, i, arr) => val >= arr[0]),
  ">=": (args) => args.every((val, i, arr) => val <= arr[0]),
  "<": (args) => args[0] < args[1],
  ">": (args) => args[0] > args[1],

  not: (args) => !args,

  undefined: undefined,
  null: null,
};
