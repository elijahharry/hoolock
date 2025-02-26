const isDefined = <T>(value: T): value is Exclude<T, undefined | void> =>
  typeof value !== "undefined";

export default isDefined;
