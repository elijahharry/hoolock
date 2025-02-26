import isArray from "./isArray";
import isRegExp from "./isRegExp";
import type { MaybeArray } from "./types";

namespace RegexFlag {
  export type Known = "g" | "i" | "m" | "s" | "u" | "y";
}
type RegexFlag = RegexFlag.Known | (string & {});

const regex = /* @__PURE__ */ (() => {
  const extractSource = (exp: RegExp | string) =>
    isRegExp(exp) ? exp.source : exp;

  function regex(exp: MaybeArray<RegExp | string>, flag?: RegexFlag) {
    const source = isArray(exp)
      ? exp.map(extractSource).join("")
      : extractSource(exp);

    return new RegExp(source, flag);
  }

  const escExp = /[\\^$*+?.()|[\]{}]/g;

  regex.escape = (str: string) => str.replace(escExp, "\\$&");

  return regex;
})();

export default regex;
export type { RegexFlag, MaybeArray };

// regex
