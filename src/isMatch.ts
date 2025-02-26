import areObjectsEqual from "./shared/compareObjects";
import wrapObjectEquality from "./shared/completeCompare";
import isStrictEqual from "./isStrictEqual";

const isMatch = /* @__PURE__ */ ((): ((
  compare: any,
  against: any
) => boolean) => {
  return wrapObjectEquality((a, b) => areObjectsEqual(a, b, isStrictEqual));
})();

export default isMatch;
