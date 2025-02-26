import lazy, { Lazy } from "./lazy";
import { Fn } from "./types";

describe("lazy", () => {
  const mock = <A extends any[], R>(target: Fn<A, R>) => {
    const mock = jest.fn(target);
    return [lazy(mock), mock] as const;
  };

  const repeat = (times: number, callback: () => any) => {
    for (let i = 0; i < times; i += 1) {
      callback();
    }
  };

  it("does not immediately call the target function", () => {
    const [, target] = mock(() => 42);
    expect(target).not.toHaveBeenCalled();
  });

  it("calls and stores the result of the target function", () => {
    let i = 0;
    const [lazy, target] = mock(() => (i += 1));
    repeat(4, () => expect(lazy()).toBe(1));
    expect(target).toHaveBeenCalledTimes(1);
  });

  it("passes args to the target function", () => {
    let i = 0;

    const [lazy, target] = mock((x: number, s: string) =>
      [(i += 1) * x, s].join("")
    );

    repeat(2, () => expect(lazy(2, "foo")).toBe("2foo"));
    repeat(2, () => expect(lazy(3, "bar")).toBe("2foo"));

    expect(target).toHaveBeenCalledTimes(1);
    expect(target).toHaveBeenCalledWith(2, "foo");
  });

  it('resets when the "revalidate" method is called', () => {
    let i = 0;
    const [lazy, target] = mock(() => (i += 1));

    repeat(2, () => expect(lazy()).toBe(1));

    lazy.revalidate();

    repeat(2, () => expect(lazy()).toBe(2));

    expect(target).toHaveBeenCalledTimes(2);
  });
});
