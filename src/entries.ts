import forEntries from "./forEntries";
import listify from "./shared/listify";

const entries = /* @__PURE */ (() => listify(forEntries))();

export default entries;
