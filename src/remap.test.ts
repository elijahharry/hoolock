import entries from "./entries";
import remap, { Remap } from "./remap";
import { Entry, Mapped } from "./types";

describe("remap", () => {
  const createValidate = (
    ...targets: Array<((r: Remap) => any) | [name: string, (r: Remap) => any]>
  ) => {
    const formattedTargets = targets.map(
      (t): [string | undefined, (r: Remap) => any] => {
        if (Array.isArray(t)) return t as any;
        return [, t];
      }
    );

    return (
      name: string,
      input: Mapped,
      callback: (entry: Entry) => any,
      expected: { [key: string]: any }
    ) => {
      formattedTargets.forEach(([targetName, target]) => {
        it([name, targetName].filter(Boolean).join(" "), () => {
          const fn = jest.fn(callback);
          const remapped = target(remap(input))(fn);

          const _entries = entries(input);
          expect(fn).toHaveBeenCalledTimes(_entries.length);
          for (const e of _entries) {
            expect(fn).toHaveBeenCalledWith(e);
          }

          expect(remapped).toEqual(expected);
        });
      });

      it(name, () => {});
    };
  };

  const validate = {
    entries: createValidate((r) => r.entries, ["(root)", (r) => r]),
    values: createValidate((r) => r.values),
  };

  describe("object with string keys", () => {
    const object = { a: 0, b: 1, c: 2 };

    validate.values("values", object, ([, value]) => value * 10, {
      a: 0,
      b: 10,
      c: 20,
    });

    validate.entries(
      "entries",
      object,
      ([key, value]) => [`${key}*10`, value * 10],
      {
        "a*10": 0,
        "b*10": 10,
        "c*10": 20,
      }
    );
  });

  describe("object with number keys", () => {
    const object = { 0: "a", 1: "b", 2: "c" };

    validate.values("values", object, ([, value]) => value.toUpperCase(), {
      0: "A",
      1: "B",
      2: "C",
    });

    validate.entries(
      "entries",
      object,
      ([key, value]) => [`${key}UP`, value.toUpperCase()],
      {
        "0UP": "A",
        "1UP": "B",
        "2UP": "C",
      }
    );
  });

  validate.values("ignores symbol keys", { [Symbol()]: 0 }, () => 1, {});

  validate.entries(
    "excludes nil entries",
    { a: 0, b: 1, c: 2, d: 3 },
    ([key, value]) => {
      switch (key) {
        case "a":
          return;
        case "b":
          return null;
        case "c":
          return undefined;
        case "d":
          return [key, value * 10];
      }
    },
    { d: 30 }
  );

  {
    const type =
      <T extends {}>() =>
      <U>(_: EnforceType<T, U>) => {};

    type<{ a: string; "0": string }>()(
      remap({ a: 1, 0: 2 }).values(([, value]) => value.toString())
    );

    type<{ a: string; b: string }>()(
      remap({ a: 1, b: 2 }).entries(([key, value]) => [
        key as "a" | "b",
        value.toString(),
      ])
    );
    ``;

    type<{ [key: string]: string }>()(
      remap({ a: 1, b: 1 }).entries(([key, value]) => {
        if (key === "a") return [key, value.toString()];
      })
    );

    type<{}>()(remap({ a: 1, b: 1 }).entries(() => null));
  }
});
