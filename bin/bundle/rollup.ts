import commonjsPlugin from "@rollup/plugin-commonjs";
import dtsPlugin from "rollup-plugin-dts";
import { rollup, InputOptions, OutputOptions } from "rollup";
import cleanup from "rollup-plugin-cleanup";
import rollupNodeResolve, {
  RollupNodeResolveOptions,
} from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import rollupTypescript2 from "rollup-plugin-typescript2";
import _resolve from "resolve";

export const build = async (
  inputOptions: InputOptions,
  outputOptions: OutputOptions | OutputOptions[]
) => {
  const outputs = Array.isArray(outputOptions)
    ? outputOptions
    : [outputOptions];
  try {
    const bundle = await rollup(inputOptions);
    return Promise.all(outputs.map((output) => bundle.write(output)));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const resolvePlugin = <T>(plugin: T) => {
  if (typeof plugin === "function") return plugin;
  return (plugin as any).default as T;
};

export const commonjs = resolvePlugin(commonjsPlugin),
  dts = resolvePlugin(dtsPlugin);

export const nodeResolve = (options?: RollupNodeResolveOptions) =>
  resolvePlugin(rollupNodeResolve)({
    ...(options || {}),
    exportConditions: ["node"],
    extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
  });

export const comments = () =>
  resolvePlugin(cleanup)({
    comments: /_PURE/,
    extensions: ["js", "jsx", "ts", "tsx"],
  });

export const replace = (
  replacements: Record<string, string | (() => string)>
) =>
  resolvePlugin(rollupReplace)({
    preventAssignment: true,
    values: replacements,
  });

export const typescript2 = resolvePlugin(rollupTypescript2);
