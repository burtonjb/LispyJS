export const logicBuiltIns = {
  and: (args) => args.every((val, i, arr) => val === true),
  or: (args) => args.some((val, i, arr) => val === true),
};
