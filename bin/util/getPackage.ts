import path from "path";
import fs from "fs";
import { withCache } from "./withCache";
import { name as ROOT_NAME } from "../../package.json";
import { getUtilNames } from "./getUtilNames";

export interface File {
  rel: string;
  abs: string;
}

export interface DistConfig {
  dir: string;
  types: File;
  require: File;
  import: File;
}

export interface PackageConfig {
  name: string;
  description: string;
  dir: string;
  pkgJson: typeof import("../../package.json");
  tsConfig: string;
  readMe: string;
  entries: string;
  dist: DistConfig;
  src: string;
  index: string;
  utilsCount: number;
}

const mainDir = () => {
  let currentDir = __dirname;

  while (true) {
    try {
      const contents = fs.readFileSync(
        path.resolve(currentDir, "package.json"),
        "utf8"
      );
      if (contents) {
        const parsed = JSON.parse(contents);
        if (parsed.name === ROOT_NAME) {
          return [currentDir, parsed] as const;
        }
      }
    } catch (e) {}

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  throw new Error("Could not locate main package dir");
};

/** Returns information regarding the 'master' package/workspace. */
export const getPackage = withCache((): PackageConfig => {
  const [dir, pkgJson] = mainDir();

  const distDir = path.resolve(dir, "dist");

  const distFiles = {
    types: "index.d.ts",
    require: "index.js",
    import: "index.mjs",
  };

  const utilsCount = getUtilNames(path.resolve(dir, "src")).length,
    description =
      pkgJson.description ?? `Suite of ${utilsCount} lightweight utilities.`;

  return {
    name: pkgJson.distName ?? ROOT_NAME.split("-")[0],
    dir,
    pkgJson,
    readMe: path.resolve(dir, "README.md"),
    tsConfig: path.resolve(dir, "tsconfig.json"),
    entries: path.resolve(dir, "entries.json"),
    src: path.resolve(dir, "src"),
    index: path.resolve(dir, "src/index.ts"),
    dist: {
      dir: distDir,
      ...(Object.fromEntries(
        Object.entries(distFiles).map(([key, file]): [string, File] => [
          key,
          {
            rel: file,
            abs: path.resolve(distDir, file),
          },
        ])
      ) as {
        [K in keyof typeof distFiles]: File;
      }),
    },
    description,
    utilsCount,
  };
});

export type Package = ReturnType<typeof getPackage>;

export const getPackageVersion = withCache(() => {
  const main = getPackage();
  return main.pkgJson.version;
});
