import forEntries from "./forEntries";
import forKeys from "./forKeys";
import isFunction from "./isFunction";
import apply from "./shared/apply";
import copyProperties from "./shared/copyProperties";
import { Fn, ParameterAt } from "./types";

export type Memo<F extends Fn, K = any> = F & {
  cache: Map<K, ReturnType<F>>;
};

function memoize<F extends Fn>(fn: F): Memo<F, ParameterAt<F, 0>>;
function memoize<F extends Fn, I extends number>(
  fn: F,
  key: I
): Memo<F, ParameterAt<F, I>>;
function memoize<F extends Fn, K>(
  fn: F,
  key: (...args: Parameters<F>) => K
): Memo<F, K>;
function memoize<F extends Fn>(
  fn: F,
  key?: number | ((...args: Parameters<F>) => any)
): Memo<F>;
function memoize<F extends Fn>(
  fn: F,
  key: number | ((...args: Parameters<F>) => any) = 0
): Memo<Fn> {
  const resolve: (...args: Parameters<F>) => any = isFunction(key)
    ? key
    : (...args) => args[key];

  const memo = ((...args: Parameters<F>) => {
    const [key, cache] = [apply(resolve, args), memo.cache];
    if (cache.has(key)) return cache.get(key)!;
    const value = apply(fn, args);
    cache.set(key, value);
    return value;
  }) as Memo<F>;

  copyProperties(memo, fn);

  memo.cache = new Map();

  return memo;
}

export default memoize;
export type { Fn, ParameterAt };
