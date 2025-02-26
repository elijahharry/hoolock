import forKeys from "./forKeys";
import listify from "./shared/listify";

const keys = /* @__PURE__ */ (() => listify(forKeys))();

export default keys;
export type * from "./forKeys";
