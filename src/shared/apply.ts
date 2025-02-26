import { Fn } from "../types";

const apply = <F extends Fn>(fn: F, args: Parameters<F>) =>
  fn.apply(null, args) as ReturnType<F>;

export default apply;
