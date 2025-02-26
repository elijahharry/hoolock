import { Fn } from "./types";

const isFunction = (value: any): value is Fn => typeof value === "function";

export default isFunction;
