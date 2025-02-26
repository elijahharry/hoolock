import compareObjects from "./shared/compareObjects";
import completeCompare from "./shared/completeCompare";

const isEqual = /* @__PURE__ */ ((): ((
  compare: any,
  against: any
) => boolean) => {
  type Visited = WeakMap<object, object>;
  type Same = (a: any, b: any) => boolean;
  const compare = completeCompare<[Visited, Same]>((a, b, visited, same) => {
    if (visited.has(a)) return visited.get(a) === b;
    visited.set(a, b);
    const areSame = compareObjects(a, b, same);
    visited.delete(a);
    return areSame;
  });
  return (a, b) => {
    const visited: Visited = new WeakMap(),
      same: Same = (a, b) => compare(a, b, visited, same);
    return same(a, b);
  };
})();

export default isEqual;
