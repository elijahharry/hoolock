import cloneComplex from "./shared/cloneComplex";
import returnInitialArgument from "./shared/returnInitialArgument";

const clone = <T>(obj: T): T => cloneComplex(obj, returnInitialArgument);

export default clone;
