import * as rollup from "./rollup";
import { cleanDir } from "../util/cleanDir";
import { getPackage } from "../util/getPackage";
import getEntries from "../util/getEntries";
import { OutputOptions } from "rollup";
import { writeFileSync } from "fs";

export type BundledFile = {
  rel: string;
  abs: string;
};

export type BundledFiles = {
  import: BundledFile;
  require: BundledFile;
  types: BundledFile;
};

const createNameChunk = () => {
  let abc = "abcdefghijklmnopqrstuvwxyz",
    ABC = abc + abc.toUpperCase();

  const chunkNameMap = new Map<string, string>();
  const usedChunkNames = new Set<string>();
  const createChunkName = () => {
    let name: string;
    do {
      name = Array.from(
        { length: 6 },
        () => ABC[(Math.random() * ABC.length) | 0]
      ).join("");
    } while (usedChunkNames.has(name));
    usedChunkNames.add(name);
    return name;
  };
  const getChunkName = (name: string) =>
    (chunkNameMap.has(name)
      ? chunkNameMap
      : chunkNameMap.set(name, createChunkName())
    ).get(name)!;

  return getChunkName;
};

export const bundle = async () => {
  const pkg = getPackage(),
    entries = getEntries();

  writeFileSync(
    entries.barrel.input,
    [
      "// This barrel entry is auto-generated during bundling.",
      "",
      `export type * from "./types";`,
      ...entries.utils.flatMap((util) => {
        const rel = JSON.stringify(`./${util.name}`);

        return [
          "",
          `export { default as ${util.name} } from ${rel};`,
          `export type * from ${rel};`,
        ];
      }),
    ].join("\n")
  );

  const input: Record<string, string> = {
    index: entries.barrel.input,
  };

  entries.utils.forEach((util) => {
    input[util.name] = util.input;
  });

  await cleanDir(pkg.dist.dir);

  const chunkDirname = "shared",
    chunkHash = createNameChunk();

  const nameChunk = (id: string, ext?: string) =>
    [chunkDirname, "/", chunkHash(id), ext ? `.${ext}` : ""].join("");

  {
    // Bundle types
    const chunkFileNames: string[] = [];
    const matchImport = /import[\s\S]*from\s+['"](.*)['"]/g;
    const suffixed = /\.([cm])?js$/;

    await rollup.build(
      {
        input,
        plugins: [
          rollup.dts(),
          {
            name: "dts-import-fix",
            generateBundle(_, bundle) {
              Object.values(bundle).forEach((chunk) => {
                if (chunk.type !== "chunk") return;
                const cleaned = chunk.code.replace(
                  matchImport,
                  (match: string, importPath: string) => {
                    const cleanedImportPath = importPath.replace(suffixed, ""),
                      quote = match[match.length - 1];

                    return [
                      match.slice(0, match.length - (importPath.length + 2)),
                      quote,
                      cleanedImportPath,
                      quote,
                    ].join("");
                  }
                );
                chunk.code = cleaned;
              });
            },
          },
        ],
      },
      {
        dir: pkg.dist.dir,
        // file: dist.types.abs,
        format: "es",
        chunkFileNames: (content) =>
          nameChunk(content.moduleIds.join(""), "d.ts"),
      }
    );
  }

  {
    // const abc = "abcdefghijklmnopqrstuvwxyz".split("");

    await rollup.build(
      {
        input,
        plugins: [
          rollup.commonjs(),
          rollup.nodeResolve(),
          rollup.typescript2({
            abortOnError: false,
            tsconfig: pkg.tsConfig,
            tsconfigOverride: {
              compilerOptions: {
                declaration: false,
                declarationMap: false,
              },
            },
          }),
          rollup.comments(),
        ],
      },
      [
        {
          format: "cjs",
          dir: pkg.dist.dir,
          ext: "js",
        },
        {
          format: "esm",
          dir: pkg.dist.dir,
          ext: "mjs",
        },
      ].map(
        ({ ext, ...output }): OutputOptions => ({
          ...(output as OutputOptions),
          entryFileNames: `[name].${ext}`,
          chunkFileNames: ({ name }) => nameChunk(name, ext),
        })
      )
    );
  }
};
