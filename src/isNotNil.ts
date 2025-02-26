import isNil from "./isNil";

const isNotNil = <T>(value: T): value is Exclude<T, null | undefined | void> =>
  !isNil(value);

export default isNotNil;
