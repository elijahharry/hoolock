const isPlainObject = (
  value: any
): value is Record<string | number | symbol, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

export default isPlainObject;
