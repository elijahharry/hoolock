import forEntries from "./forEntries";
import { Entry, Mapped } from "./types";

describe("forEntries", () => {
  const callback = jest.fn();

  beforeEach(() => {
    callback.mockClear();
  });

  const validate = <T extends Mapped>(object: T, ...expected: Array<Entry>) => {
    forEntries(object, callback);
    expect(callback).toHaveBeenCalledTimes(expected.length);
    for (const entry of expected) {
      expect(callback).toHaveBeenCalledWith(entry);
    }

    return null;
  };

  it("iterates over string entries", () => {
    validate({ a: 1, b: 2 }, ["a", 1], ["b", 2]);
  });

  it("iterates over numbered entries", () => {
    validate({ 1: 1, 2: 2 }, ["1", 1], ["2", 2]);
  });

  it("iterates over mixed entries", () => {
    validate({ a: 1, 1: 2 }, ["a", 1], ["1", 2]);
  });

  it("does not iterate over symbol entries", () => {
    validate({ [Symbol.for("a")]: 1, a: 2 }, ["a", 2]);
  });

  it("does not iterate over non-enumerable entries", () => {
    const object = Object.defineProperties(
      { a: 1 },
      {
        b: { value: 2 },
        c: { value: 3, enumerable: true },
      }
    );

    validate(object, ["a", 1], ["c", 3]);
  });
});
