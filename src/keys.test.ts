import keys from "./keys";
import { Mapped } from "./types";

describe("keys", () => {
  const validate = <T extends Mapped>(object: T, ...expected: string[]) => {
    const result = keys(object);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expected);
    return result;
  };

  const type =
    <T extends string>() =>
    <U>(_: EnforceType<T[], U>) => {};

  it("returns keys", () => {
    const result = validate({ a: 1, b: "2" }, "a", "b");

    type<"a" | "b">()(result);

    type<"a" | "b" | `${number}`>()(
      keys<
        { a: number; b: string } & {
          [key: number]: any;
        }
      >(
        // @ts-expect-error
        {}
      )
    );
  });

  it("returns number keys as strings", () => {
    const keys = validate({ 1: 1, 2: 2 }, "1", "2");
    type<"1" | "2">()(keys);
  });

  it("returns empty array for empty objects", () => {
    const keys = validate({});
    // Should always fallback to the default key type (string)
    type<string>()(keys);
  });

  it("does not return symbol keys", () => {
    const a = validate({ [Symbol.for("a")]: 1, a: 2 }, "a");
    type<"a">()(a);

    const b = validate({ [Symbol.for("b")]: 1 });
    type<string>()(b);
  });

  it("does not return non-enumerable properties", () => {
    const obj = { a: 1 };
    Object.defineProperty(obj, "b", { value: 2, enumerable: false });
    const entries = validate(obj, "a");
    type<"a">()(entries);
  });
});
