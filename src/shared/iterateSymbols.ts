import { Mapped } from "../types";
import isEnumerableProperty from "./isEnumerableProperty";

const iterateSymbols = (object: Mapped, callback: (symbol: symbol) => void) => {
  for (let key of Object.getOwnPropertySymbols(object))
    if (isEnumerableProperty(object, key)) {
      callback(key);
    }
};

export default iterateSymbols;
