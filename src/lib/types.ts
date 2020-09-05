/*
 * This file defines types used in the interpreter.
 * While some of these types are currently just aliases for built-in types, I'm expecting the them to eventually be not just aliases,
 * so it will make changing the types in the future much easier
 */

export type sym = string; // immutable string
export type num = number; // number
export type atom = string | number | null | undefined; //An atom is either a number of a string. Its a singular value
export type list = Array<atom> | Array<list>;
export type expression = atom | list | Array<expression>; //a (s) expression can either be a single value or a list. It can either be '5' or '(+ 5 2)' for example
export type environment = { [key: string]: any }; // the env is a mapping of var->val. Represented as an object
