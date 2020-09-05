import { expression } from "./types";

function isString(a: expression): boolean {
  return typeof a == "string";
}

function isNumber(a: expression): boolean {
  return typeof a == "number";
}

export { isString, isNumber };
