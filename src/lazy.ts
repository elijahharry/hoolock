import apply from "./shared/apply";
import { Fn } from "./types";

export interface Lazy<A extends any[], R> {
  (...args: A): R;
  revalidate(): void;
}

export type LazyFn<F extends Fn> = Lazy<Parameters<F>, ReturnType<F>>;

export type RevalidateCallback<A extends any[]> = (...args: A) => void;

type Ref<T> = { current: T };

const lazy = <F extends Fn>(target: F): LazyFn<F> => {
  const get = {} as Ref<(args: Parameters<F>) => ReturnType<F>>;

  const lazy = ((...args: Parameters<F>) => get.current(args)) as LazyFn<F>;
  lazy.revalidate = () => {
    get.current = (args) => {
      const value = apply(target, args);
      get.current = () => value;
      return value;
    };
  };

  lazy.revalidate();

  return lazy;
};

export default lazy;
export type { Fn };
