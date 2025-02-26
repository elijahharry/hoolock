import path from "path";
import { getPackage } from "./getPackage";
import { withCache } from "./withCache";
import { existsSync, readdirSync } from "fs";
import { getUtilNames } from "./getUtilNames";

export interface OutFile {
  rel: string;
  abs: string;
}

export interface EntryOutput
  extends Record<"import" | "require" | "types", OutFile> {}

export interface Entry {
  input: string;
  output: EntryOutput;
}

export interface UtilEntry extends Entry {
  name: string;
}

export interface Entries {
  barrel: Entry;
  utils: UtilEntry[];
}

const getEntries = withCache(() => {
  const { dist, src } = getPackage();

  const outfile = (rel: string): OutFile => {
    const abs = path.join(dist.dir, rel);
    return { rel, abs };
  };

  const entry = (srcName: string, outputName: string = srcName): Entry => {
    const input = path.resolve(src, `./${srcName}.ts`);
    const output: EntryOutput = {
      types: outfile(`${outputName}.d.ts`),
      import: outfile(`${outputName}.mjs`),
      require: outfile(`${outputName}.js`),
    };
    return { input, output };
  };

  const utils = getUtilNames(src).map(
    (name): UtilEntry => ({
      name,
      ...entry(name),
    })
  );

  return {
    barrel: entry("index"),
    utils,
  };
});

export default getEntries;
