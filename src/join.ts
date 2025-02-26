import isString from "./isString";

const join = /* @__PURE__ */ (() => {
  const isJoinNotEmpty = (el: any): boolean => {
    if (typeof el === "string") return el.length > 0;
    if (typeof el === "undefined" || el === null) return false;
    if (Array.isArray(el)) {
      return cleanJoinEmpties(el).length > 0;
    }
    return true;
  };

  const cleanJoinEmpties = (elements: any[]): any[] =>
    elements.filter(isJoinNotEmpty);

  const joinUniqueEndDelimiter = (
    elements: any[],
    delimiter: string,
    lastDelimiter: string
  ) => {
    if (elements.length > 2) {
      let last = elements.pop()!;
      return [elements.join(delimiter), last].join(lastDelimiter);
    }
    return elements.join(lastDelimiter);
  };

  const joinSameDelimiter = (elements: any[], delimiter: string) =>
    elements.join(delimiter);

  const join = (
    elements: any[],
    delimiter: string = "",
    lastDelimiter?: string
  ) => {
    if (isString(lastDelimiter)) {
      return joinUniqueEndDelimiter(
        cleanJoinEmpties(elements),
        delimiter,
        lastDelimiter
      );
    }
    return joinSameDelimiter(cleanJoinEmpties(elements), delimiter);
  };

  /**
   * Create a custom join function that utilizes predefined delimiters. The returned function will have an `(...args)` signature.
   * @example
   * ```js
   * import join from "hoolock/join";
   *
   * const joinAmpersand = join.preset(", ", " & ");
   *
   * joinAmpersand("Gorillas", "Orangutans", "Gibbons");
   * // -> "Gorillas, Orangutans & Gibbons";
   * ```
   */
  join.preset = (delimiter: string, lastDelimiter?: string) => {
    if (isString(lastDelimiter)) {
      return (...elements: any[]) =>
        joinUniqueEndDelimiter(
          cleanJoinEmpties(elements),
          delimiter,
          lastDelimiter
        );
    }
    return (...elements: any[]) =>
      joinSameDelimiter(cleanJoinEmpties(elements), delimiter);
  };

  return join;
})();

export default join;
