import getEntries, { EntryOutput } from "../util/getEntries";
import { getPackage } from "../util/getPackage";
import { readdirSync } from "fs";
import path from "path";

const IGNORE = ["node_modules", "package.json", "README.md"],
  COPY_FIELDS = ["license", "author", "repository", "bugs", "homepage"];

export const createPackageJson = () => {
  const { pkgJson: pkg, name, description, dist } = getPackage(),
    entries = getEntries();

  const copiedFields = COPY_FIELDS.reduce<Record<string, any>>((acc, field) => {
    if (field in pkg) acc[field] = pkg[field as keyof typeof pkg];
    return acc;
  }, {});

  const rootOutput = entries.barrel.output;
  const rootEntries = {
    main: rootOutput.require.rel,
    module: rootOutput.import.rel,
    types: rootOutput.types.rel,
  };

  const createExportEntry = (name: string, ouput: EntryOutput) => {
    const key = [".", name].filter(Boolean).join("/"),
      rel = (key: keyof EntryOutput) => `./${ouput[key].rel}`;
    return [
      key,
      {
        types: rel("types"),
        import: rel("import"),
        require: rel("require"),
      },
    ];
  };

  const exports = Object.fromEntries([
    createExportEntry("", entries.barrel.output),
    ...entries.utils.map((util) => createExportEntry(util.name, util.output)),
  ]);

  const pkgJson = {
    name,
    version: pkg.version,
    description,
    ...rootEntries,
    ...copiedFields,
    exports,
    sideEffects: false,
  };

  const IGNORE_FILES = new Set(IGNORE.map((file) => path.join(dist.dir, file)));
  const extractFiles = (dir: string): string[] => {
    const files: string[] = [],
      childFiles: string[] = [];

    readdirSync(dir, { withFileTypes: true }).forEach((file) => {
      const filePath = path.join(dir, file.name);
      if (IGNORE_FILES.has(filePath)) return;
      if (file.isDirectory()) {
        return childFiles.push(...extractFiles(filePath));
      }
      if (file.isFile()) {
        files.push(path.relative(dist.dir, filePath));
      }
    });
    files.sort();
    return files.concat(childFiles);
  };

  return pkgJson;
};
