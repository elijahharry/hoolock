import { bundle } from "./bundle";
import { buildDistribution } from "./distribution";
import out from "./util/out";

const build = async () => {
  const start = Date.now();
  await bundle();
  await buildDistribution();

  out.success(
    "Bundled in %s",
    out.color.green(((Date.now() - start) / 1000).toFixed(2) + "s") +
      "\n  " +
      out.color.dim("Run distribution tests before publishing!")
  );
};

build();
