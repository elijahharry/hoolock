import pathTrie, { PathTrie } from "./shared/pathTrie";
import emptyObjectFrom from "./shared/emptyObjectFrom";
import deepClone from "./shared/deepClone";
import cloneSimple from "./shared/cloneSimple";
import iterateProperties from "./shared/iterateProperties";
import type { Path, Mapped } from "./types";

function omitRecursive(
  target: Mapped,
  source: Mapped,
  trie: PathTrie,
  clone: <T>(value: T) => T
) {
  iterateProperties(source, (key, value) => {
    const node = trie[key];
    if (node) {
      if (node.target) {
        // If it's a target, then it's meant to be omitted
        return;
      }

      if (node.nodes) {
        // If it has nodes, then we only want to copy the
        // shape of the object, as it's children may be omitted
        if (!(typeof value === "object" && value !== null)) {
          // If it's not an object, then we cannot traverse down it.
          // Maybe copy the whole value instead here? Not sure.
          return;
        }
        return omitRecursive(
          (target[key] ??= emptyObjectFrom(value)),
          value,
          node.nodes,
          clone
        );
      }
    }
    // Otherwise, we can simply copy the entire value
    target[key] = clone(value);
  });

  return target;
}

function omit<T extends object, K extends Array<keyof T>>(
  source: T,
  ...keys: K
): Omit<T, K[number]>;
function omit<T extends object>(source: T, ...paths: Path[]): Partial<T>;
function omit(source: object, ...paths: Path[]): object {
  return omitRecursive(
    emptyObjectFrom(source),
    source,
    pathTrie(paths),
    deepClone(cloneSimple)
  );
}

export default omit;
export type { Path };
