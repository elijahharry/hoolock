import forKeys from "../forKeys";
import { Mapped } from "../types";
import iterateSymbols from "./iterateSymbols";

export type PropertiesCallback = (key: string | symbol, value: any) => void;

const iterateProperties = (object: Mapped, callback: PropertiesCallback) => {
  const withCallback = (key: string | symbol) => callback(key, object[key]);
  forKeys(object, withCallback);
  iterateSymbols(object, withCallback);
};

export default iterateProperties;
