import { randomUUID } from "crypto";
import { useStage } from "./stage";
import getEntries from "./util/getEntries";
import * as rollup from "./bundle/rollup";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { TreeshakingPreset } from "rollup";
import { getPackage } from "./util/getPackage";
import parseVariableDeclarations from "./util/parseVariablesDeclarations";
import chalk from "chalk";

useStage(
  {
    tsup: "latest",
    rollup: "latest",
  },
  async ({ dir }) => {
    const { name } = getPackage();

    {
      const pkgJsonPath = path.join(dir, "node_modules", name, "package.json"),
        pkgJson = require(pkgJsonPath);

      delete pkgJson.sideEffects;

      writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    }

    const build = async (
      code: string,
      treeshaking: TreeshakingPreset,
      id: string = randomUUID()
    ) => {
      const inputPath = path.join(dir, `./${id}.js`),
        outputPath = path.join(dir, `./dist/${id}.js`);

      writeFileSync(inputPath, code);

      await rollup.build(
        {
          input: inputPath,
          treeshake: treeshaking,
          plugins: [
            rollup.nodeResolve({
              rootDir: dir,
            }),
          ],
        },
        {
          file: outputPath,
          format: "esm",
        }
      );

      return parseVariableDeclarations(
        readFileSync(outputPath, "utf-8"),
        "module"
      );
    };

    const testTreeShaking = async (util: string): Promise<string[]> => {
      const [base, compare] = await Promise.all(
        [
          `import ${util} from "${name}/${util}";`,
          `import { ${util} } from "${name}";`,
        ].map((importer) =>
          build([importer, `export { ${util} };`].join("\n"), "safest", util)
        )
      );

      const extraDeclarations = compare.filter((c) => {
        for (const b of base)
          if (b.kind === c.kind && b.name === c.name) {
            return false;
          }
        return true;
      });

      if (extraDeclarations.length) {
        return [
          chalk.bold.red(util) + chalk.bold(" is not treeshakable: "),
          chalk.dim(
            "The following variables were not removed: " +
              extraDeclarations.map((d) => d.name).join(", ")
          ),
        ];
      }

      return [chalk.bold.green(util) + chalk.bold(" is treeshakable")];
    };

    const { utils } = getEntries();

    await Promise.all(
      utils.map(async ({ name }) => {
        const logs = await testTreeShaking(name);
        console.log(logs.map((log) => "  " + log).join("\n"));
      })
    );
  }
);

export {};
