import cloneSimple from "./shared/cloneSimple";
import deepClone from "./shared/deepClone";
import isReactElement from "./shared/isReactElement";
import iterateOwnEnumerableProperties from "./shared/iterateProperties";
import type { Mapped } from "./types";

function isMergable(source: any): source is Mapped {
  return (
    typeof source === "object" &&
    source !== null &&
    !(
      isReactElement.Object(source) ||
      source instanceof Function ||
      source instanceof Date ||
      source instanceof RegExp ||
      source instanceof Promise ||
      source instanceof Error
    )
  );
}

function _merge(target: Mapped, source: Mapped) {
  if (Array.isArray(source)) {
    if (Array.isArray(target)) {
      source.forEach((value) => target.push(value));
      return target;
    }
  } else if (!Array.isArray(target)) {
    let current: any;
    iterateOwnEnumerableProperties(source, (key, value) => {
      if (
        isMergable(value) &&
        key in target &&
        isMergable((current = target[key]))
      ) {
        value = _merge(current, value);
      }
      target[key] = value;
    });
    return target;
  }
  return source;
}

function merge<T extends {}, U>(source1: T, source2: U): T & U;
function merge<T extends {}, U, V>(
  source1: T,
  source2: U,
  source3: V
): T & U & V;
function merge<T extends {}, U, V, W>(
  source1: T,
  source2: U,
  source3: V,
  source4: W
): T & U & V & W;
function merge<T extends {}, U, V, W, X>(
  source1: T,
  source2: U,
  source3: V,
  source4: W,
  source5: X
): T & U & V & W & X;
function merge<T extends {}>(source: T): T;
function merge(source: any, ...sources: any[]): any;
function merge(...sources: any[]): any {
  let result: Mapped | undefined, source: any;
  const clone = deepClone(cloneSimple);
  for (source of sources)
    if (isMergable(source)) {
      source = clone(source);
      result = result ? _merge(result, source) : source;
    }

  return result ?? {};
}

export default merge;
