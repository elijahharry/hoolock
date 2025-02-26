import forEntries from "./forEntries";
import apply from "./shared/apply";
import { AnyArray, Falsey, Nilable } from "./types";

export interface ClassMap {
  [key: string]: true | Falsey;
}

export type ClassPrimitive = string | Falsey;

export type ClassValue =
  | ClassMap
  | ClassPrimitive
  | ClassValue[]
  | readonly ClassValue[]
  | (() => ClassValue);

const resolveClasses = (obj: any, classes: string[]): any => {
  if (obj) {
    switch (typeof obj) {
      case "string":
        return classes.push(obj);
      case "object":
        if (obj !== null) {
          if (Array.isArray(obj)) {
            return resolveClassesArray(obj, classes);
          }
          forEntries(obj, ([key, value]) => {
            if (value && key) {
              classes.push(key);
            }
          });
        }
        return;
      case "function":
        return resolveClasses(obj(), classes);
      default:
        return;
    }
  }
};

const resolveClassesArray = (values: ClassValue[], classes: string[]): void =>
  values.forEach((value) => resolveClasses(value, classes));

const classes = /* @__PURE__ */ (() => {
  const classes = (...args: ClassValue[]): string =>
    apply(classes.list, args).join(" ");

  classes.list = (...args: ClassValue[]): string[] => {
    const classes: string[] = [];
    resolveClassesArray(args, classes);
    return classes;
  };

  return classes;
})();

export default classes;
