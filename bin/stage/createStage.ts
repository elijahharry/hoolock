import shell from "shelljs";
import { getPackage } from "../util/getPackage";
import fs from "fs";
import path from "path";
import createCacheDir from "../util/createCacheDir";
import { TsConfigJson } from "type-fest";
import { bundle } from "../bundle";
import { randomUUID } from "crypto";

export type Stage = {
  name: string;
  format: "cjs" | "esm";
  contents: string;
};

const packageDist = async (testDir: string) => {
  const dist = getPackage().dist;

  if (
    [dist.import, dist.require, dist.types].some(
      (file) => !fs.existsSync(file.abs)
    )
  ) {
    console.log("\nCould not find dist, building now...");
    await bundle();
    console.log("Done bundling, prepping tests...");
  }

  const res = shell.exec(
    "npm pack --pack-destination=" + JSON.stringify(testDir),
    {
      cwd: dist.dir,
      silent: true,
    }
  );

  if (res.code !== 0) {
    console.error("Error packing distribution.");
    console.error(res.stderr);
    process.exit(1);
  }

  const tgz = res.stdout.trim(),
    tgzPath = path.join(testDir, tgz);

  // Need to rename it to something random, otherwise npm will cache the old tarball
  const tarball = path.join(testDir, randomUUID() + ".tgz");
  await fs.promises.rename(tgzPath, tarball);

  return tarball;
};

export const createStage = async (deps: Record<string, string> = {}) => {
  const testDir = createCacheDir("stage-" + randomUUID());

  try {
    await fs.promises.rm(testDir, {
      recursive: true,
    });
  } catch (e) {}

  await fs.promises.mkdir(testDir, {
    recursive: true,
  });

  const tarball = await packageDist(testDir);

  const { name } = getPackage();

  await fs.promises.writeFile(
    path.join(testDir, "package.json"),
    JSON.stringify(
      {
        name: "staging",
        private: true,
        version: "1.0.0",
        devDependencies: {
          ...(deps || {}),
          [name]: "file:" + tarball,
        },
      },
      null,
      2
    )
  );

  const tsConfig: TsConfigJson = {
    compilerOptions: {
      composite: false,
      declaration: true,
      declarationMap: true,
      esModuleInterop: true,
      inlineSources: false,
      isolatedModules: true,
      moduleResolution: "node",
      noUnusedLocals: false,
      noUnusedParameters: false,
      preserveWatchOutput: true,
      skipLibCheck: true,
      strict: true,
      lib: ["ESNext"],
      target: "esnext",
      module: "esnext",
      noEmit: true,
      resolveJsonModule: true,
      allowJs: true,
    },
    exclude: ["node_modules"],
    include: ["*.ts", "*.js", "*.tsx", "*.jsx", "*.mjs", "*.cjs"],
  };

  await fs.promises.writeFile(
    path.join(testDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2)
  );

  const res = shell.exec("npm i", {
    cwd: testDir,
    silent: true,
  });

  if (res.code !== 0) {
    console.error("Error installing test dependencies.");
    console.error(res.stderr);
    process.exit(1);
  }

  return testDir as string;
};
