import forKeys from "./forKeys";
import { Mapped } from "./types";

describe("forKeys", () => {
  const callback = jest.fn();

  beforeEach(() => {
    callback.mockClear();
  });

  const validate = <T extends Mapped>(
    object: T,
    ...expected: Array<keyof T | string>
  ) => {
    forKeys(object, callback);
    expect(callback).toHaveBeenCalledTimes(expected.length);
    for (const key of expected) {
      expect(callback).toHaveBeenCalledWith(key);
    }
  };

  it("iterates over string keys", () => {
    validate({ a: 1, b: 2 }, "a", "b");
  });

  it("iterates over number keys", () => {
    validate({ 1: 1, 2: 2 }, "1", "2");
  });

  it("iterates over mixed keys", () => {
    validate({ a: 1, 1: 2 }, "a", "1");
  });

  it("does not iterate over symbol keys", () => {
    validate({ [Symbol.for("a")]: 1, a: 2 }, "a");
  });

  it("does not iterate over non-enumerable properties", () => {
    const object = Object.defineProperties(
      { a: 1 },
      {
        b: { value: 2 },
        c: { value: 3, enumerable: true },
      }
    );

    validate(object, "a", "c");
  });
});
