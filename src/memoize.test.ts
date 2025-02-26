import memoize, { Fn, Memo } from "./memoize";

describe("memoize", () => {
  const repeat = (times: number, fn: () => void) => {
    for (let i = 0; i < times; i++) {
      fn();
    }
  };

  it("creates a memo", () => {
    const memo = memoize((x: number) => x);
    expect(memo).toBeInstanceOf(Function);
    expect(memo.cache).toBeInstanceOf(Map);
  });

  const expectCache = <F extends Fn, K>(
    memo: Memo<F, K>,
    ...entries: [K, ReturnType<F>][]
  ) => {
    const cache = memo.cache;
    expect(cache.size).toBe(entries.length);
    entries.forEach(([key, value]) => {
      expect(cache.has(key)).toBe(true);
      expect(cache.get(key)).toBe(value);
    });
  };

  it("caches the result of the function call", () => {
    const double = jest.fn((x: number) => x * 2);
    const memo = memoize(double);

    repeat(3, () => expect(memo(2)).toBe(4));
    repeat(3, () => expect(memo(3)).toBe(6));

    expect(double).toHaveBeenCalledTimes(2);

    expectCache(memo, [2, 4], [3, 6]);
  });

  it("uses a custom key resolver", () => {
    const multiply = jest.fn((x: number, y: number) => x * y);
    const key = jest.fn((x: number, y: number) => `${x}-${y}`);
    const memo = memoize(multiply, key);

    repeat(2, () => expect(memo(2, 3)).toBe(6));
    expect(multiply).toHaveBeenCalledTimes(1);

    repeat(2, () => expect(memo(3, 4)).toBe(12));
    expect(multiply).toHaveBeenCalledTimes(2);

    expect(key).toHaveBeenCalledTimes(4);

    expectCache(memo, ["2-3", 6], ["3-4", 12]);
  });

  it("uses an index as a key resolver", () => {
    const multiply = jest.fn((x: number, y: number) => x * y);
    const memo = memoize(multiply, 1);

    repeat(2, () => expect(memo(2, 3)).toBe(6));
    repeat(2, () => expect(memo(5, 3)).toBe(6));
    expect(multiply).toHaveBeenCalledTimes(1);

    repeat(2, () => expect(memo(3, 2)).toBe(6));
    expect(multiply).toHaveBeenCalledTimes(2);

    expectCache(memo, [3, 6], [2, 6]);
  });

  it("copies enumerable properties from the original function", () => {
    const x = (v: number) => {
      return v * x.default;
    };
    x.default = 2;
    x.three = (v: number) => v * 3;
    Object.defineProperty(x, "hidden", { value: "hidden" });
    const memo = memoize(x);

    expect(memo(2)).toBe(4);

    expect(memo).toHaveProperty("default");
    expect(memo.default).toBe(2);

    expect(memo).toHaveProperty("three");
    expect(memo.three).toBeInstanceOf(Function);
    expect(memo.three(2)).toBe(6);

    expect(memo).not.toHaveProperty("hidden");
  });
});
