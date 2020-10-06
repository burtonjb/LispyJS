export const stringBuiltIns = {
  join: (args) => args[0].join(args[1]), // args[0] = list to join, args[1] = join_char
  join_space: (args) => args[0].join(" "),
  template: (args) => {
    const out = args[0];
    args.slice(1).forEach((element) => {
      out = out.replace("{}", element);
    });
    return out;
  },
};
