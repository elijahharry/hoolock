import isNotNil from "../isNotNil";
import { Fn, Nilable } from "../types";
import apply from "./apply";

const mergeFn = <F extends Fn>(target: F, secondary: Nilable<F>): F => {
  if (isNotNil(secondary))
    return ((...args: Parameters<F>) => (
      apply(secondary, args), apply(target, args)
    )) as F;
  return target;
};

export default mergeFn;
