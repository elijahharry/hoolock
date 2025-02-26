const isObject = (value: any): value is object => {
  const type = typeof value;
  return (type === "object" && value !== null) || type === "function";
};

export default isObject;
