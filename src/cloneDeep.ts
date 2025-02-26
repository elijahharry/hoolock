import cloneComplex from "./shared/cloneComplex";
import deepClone from "./shared/deepClone";

const cloneDeep = <T>(source: T) => deepClone(cloneComplex)(source);

export default cloneDeep;
