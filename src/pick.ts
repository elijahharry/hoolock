import cloneSimple from "./shared/cloneSimple";
import deepClone from "./shared/deepClone";
import emptyObjectFrom from "./shared/emptyObjectFrom";
import iterateProperties from "./shared/iterateProperties";
import pathTrie, { PathTrie } from "./shared/pathTrie";
import type { Mapped, Path } from "./types";

function pickRecursive(
  target: Mapped,
  source: Mapped,
  trie: PathTrie,
  clone: <T>(value: T) => T
) {
  iterateProperties(source, (key, value) => {
    const node = trie[key];
    if (node) {
      if (node.target) {
        // If the node is a target, then we want to copy the entire value
        return (target[key] = clone(value));
      }
      // Otherwise, check to see if the node has any children
      if (node.nodes) {
        // If it does, then we want to copy the shape of the object,
        // and traverse down to pick the children
        if (!(typeof value === "object" && value !== null)) {
          // If it's not an object, then we cannot traverse down it.
          // Maybe copy the whole value instead here? Not sure.
          return;
        }
        return pickRecursive(
          (target[key] ??= emptyObjectFrom(value)),
          value,
          node.nodes,
          clone
        );
      }
    }
  });
  return target;
}

function pick<T extends object, K extends Array<keyof T>>(
  source: T,
  ...keys: K
): Pick<T, K[number]>;
function pick<T extends object>(source: T, ...paths: Path[]): Partial<T>;
function pick(source: object, ...paths: Path[]): object {
  return pickRecursive(
    emptyObjectFrom(source),
    source,
    pathTrie(paths),
    deepClone(cloneSimple)
  );
}

export default pick;
export type { Path };
