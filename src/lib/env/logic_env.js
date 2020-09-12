export const logicBuiltIns = {
    "and": (args) => args.every( (val, i, arr) => val === true),
    "or": (args) => args.some( (val, i, arr) => val === true),
    "not": (args) => !args, //TODO: probably not right...
    
    //FIXME: these are not implemented correctly. It should be defined as per http://people.csail.mit.edu/jaffer/r5rs_8.html.
    "<=": (args) => args.every( (val, i, arr) => val >= arr[0]), 
    ">=": (args) => args.every( (val, i, arr) => val <= arr[0]),
    "<": (args) => args[0] < args[1], 
    ">": (args) => args[0] > args[1], 
}