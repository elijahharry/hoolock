import isArray from "./isArray";

type FlattenFully<T extends unknown[]> = T extends (infer R)[]
  ? R extends unknown[]
    ? FlattenFully<R>
    : R
  : T;

type Flatten<Arr, Depth extends number> = {
  done: Arr;
  recur: Arr extends ReadonlyArray<infer InnerArr>
    ? FlatArray<
        InnerArr,
        [
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
        ][Depth]
      >
    : Arr;
}[Depth extends -1 ? "done" : "recur"];

const noRecurse = (() => false) as unknown as typeof isArray;

const flattener = (
  target: any[],
  source: any[],
  stop: undefined | { depth: number }
) => {
  const recurse = !(stop && stop.depth-- <= 0) ? isArray : noRecurse;
  for (const element of source)
    if (recurse(element)) flattener(target, element, stop);
    else target.push(element);
  return target;
};

function flatten<T extends unknown[]>(array: T): FlattenFully<T>[];
function flatten<T extends unknown[], D extends number>(
  array: T,
  depth: D
): Flatten<T, D>[];
function flatten(array: any[], depth?: number): any[] {
  return flattener(
    [],
    array,
    typeof depth === "number" ? { depth } : undefined
  );
}

export default flatten;
export type { Flatten, FlattenFully };
