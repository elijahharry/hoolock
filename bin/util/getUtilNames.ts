import { readdirSync } from "fs";

const getUtilNames = (src: string) => {
  const ents = readdirSync(src, { withFileTypes: true });
  const test = /\.test\.ts$/,
    ts = /\.ts$/;

  const names: string[] = [];

  ents.forEach((ent) => {
    if (!ent.isFile()) return;
    let { name } = ent;
    if (test.test(name) || !ts.test(name)) return;
    name = name.replace(ts, "");
    if (name === "index") return;
    names.push(name);
  });

  return names;
};

export { getUtilNames };
