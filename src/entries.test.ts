import entries from "./entries";
import { Entry, Mapped } from "./types";

describe("entries", () => {
  const validate = <T extends Mapped>(object: T, ...expected: Entry[]) => {
    const result = entries(object);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expected);
    return result;
  };

  it("returns entries", () => {
    validate({ a: 1, b: "2" }, ["a", 1], ["b", "2"]);
  });

  it("returns number keys as strings", () => {
    validate({ 1: 1, 2: 2 }, ["1", 1], ["2", 2]);
  });

  it("returns empty array for empty object", () => {
    validate({});
  });

  it("does not return symbol properties", () => {
    validate({ [Symbol.for("a")]: 1, a: 2 }, ["a", 2]);
    validate({ [Symbol.for("b")]: 1 });
  });

  it("does not return non-enumerable properties", () => {
    const obj = { a: 1 };
    Object.defineProperty(obj, "b", { value: 2, enumerable: false });
    validate(obj, ["a", 1]);
  });
});
