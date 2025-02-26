const isString = (value: any): value is string =>
  typeof value === "string" || value instanceof String;

export default isString;
