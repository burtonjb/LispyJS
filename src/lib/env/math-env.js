export const mathBuiltIns = {
  "*": (args) => args.reduce((acc, cur) => acc * cur),
  "/": (args) => args.reduce((acc, cur) => acc / cur),
  "%": (args) => args[0] % args[1],
};
