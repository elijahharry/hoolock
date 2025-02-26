import emptyObjectFrom from "./emptyObjectFrom";
import copyProperties from "./copyProperties";
import isClonable from "./isClonable";
import returnInitialArgument from "./returnInitialArgument";
import type { Mapped, Visited } from "../types";

type Recurse = <T>(obj: T) => T;

function createCached<T extends Mapped>(
  object: T,
  recurse: Recurse = returnInitialArgument,
  visited: Visited
): T {
  if (visited.has(object)) return visited.get(object)!;
  const clone = emptyObjectFrom(object);
  visited.set(object, clone);
  copyProperties(clone, object, recurse);
  return clone;
}

function cloneSimple<T = any>(
  object: T,
  recurse: Recurse = returnInitialArgument,
  visited?: Visited
): T {
  if (isClonable(object)) {
    const clone = visited
      ? createCached(object, recurse, visited)
      : copyProperties(emptyObjectFrom(object), object, recurse);
    return clone;
  }
  return object;
}

export default cloneSimple;
