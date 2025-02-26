import type { Mapped, Visited } from "../types";
import isClonable from "./isClonable";
import copyProperties from "./copyProperties";
import emptyObjectFrom from "./emptyObjectFrom";

type Recurse = <T>(obj: T) => T;

function create(source: Mapped, recurse: Recurse, cloned?: Visited): Mapped {
  if (source instanceof Set) {
    const target = new Set();
    if (cloned) cloned.set(source, target);
    source.forEach((item) => target.add(recurse(item)));
    return target;
  }
  if (source instanceof Map) {
    const target = new Map();
    if (cloned) cloned.set(source, target);
    source.forEach((value, key) => target.set(recurse(key), recurse(value)));
    return target;
  }
  if (source instanceof Date) {
    return new Date(+source);
  }
  if (source instanceof RegExp) {
    const regex = new RegExp(source.source, source.flags);
    if (source.lastIndex) regex.lastIndex = source.lastIndex;
    return regex;
  }
  if (source instanceof Error) {
    return Object.create(source);
  }
  if (source instanceof Promise) {
    return new Promise((resolve, reject) => {
      source.then(
        (value) => {
          resolve(recurse(value));
        },
        (err) => {
          reject(recurse(err));
        }
      );
    });
  }
  return emptyObjectFrom(source);
}

function cloneComplex(source: any, recurse: Recurse, cloned?: Visited) {
  if (isClonable(source)) {
    let target = cloned && cloned.get(source);
    if (target) return target;
    target = create(source, recurse, cloned);
    if (cloned) cloned.set(source, target);
    copyProperties(target, source, recurse);
    return target;
  }
  return source;
}

export default cloneComplex;
