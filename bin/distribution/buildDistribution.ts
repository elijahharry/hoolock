import { readFile } from "fs/promises";
import { getPackage } from "../util/getPackage";
import { createPackageJson } from "./createPackageJson";
import fs from "fs";
import path from "path";

const writeDistribution = async (
  ...rewrites: [relativePath: string, content: string][]
) => {
  const dist = getPackage().dist;

  for (const [file, content] of rewrites) {
    await fs.promises.writeFile(path.join(dist.dir, file), content);
  }

  return dist;
};

export const buildDistribution = async () => {
  const pkgJson = createPackageJson(),
    readMe = getPackage().readMe;

  await writeDistribution(
    ["package.json", JSON.stringify(pkgJson, null, 2)],
    ["README.md", await readFile(readMe, "utf8")]
  );
};
