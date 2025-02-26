import path from "path";
import { getPackage } from "./getPackage";
import fs from "fs";

const makeDir = (dir: string) => {
  try {
    fs.rmSync(dir, { recursive: true });
  } catch (e) {}

  return dir;
};

const createCacheDir = (...sub: string[]) => {
  return makeDir(path.join(getPackage().dir, ".cache", ...sub));
};

export default createCacheDir;
