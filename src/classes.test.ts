import classes from "./classes";

describe("classes", () => {
  it("merges classes", () => {
    expect(classes("a", "b", "c")).toBe("a b c");
  });

  it("excludes bad values", () => {
    expect(
      classes(
        "a",
        0,
        false,
        "b",
        // @ts-expect-error
        true,
        null,
        undefined,
        {},
        [],
        500,
        void 0,
        "c"
      )
    ).toBe("a b c");
  });

  it("merges nested classes", () => {
    expect(classes("a", ["b", ["c"]])).toBe("a b c");
  });

  it("merges object keys", () => {
    expect(
      classes("a", {
        b: true,
        c: true,
        d: false,
      })
    ).toBe("a b c");
  });

  it("merges the results of functions", () => {
    expect(
      classes(
        "a",
        () => "b",
        () => ["c", "d"]
      )
    ).toBe("a b c d");
  });

  it("merges the results of recursive functions", () => {
    expect(
      classes(
        () => () => () => "a",
        () => ["b", () => () => ["c"]]
      )
    ).toBe("a b c");
  });

  it("lists classes", () => {
    expect(classes.list("a", "b", "c")).toEqual(["a", "b", "c"]);
  });
});
