const isNumber = (obj: any): obj is number =>
  typeof obj === "number" && isFinite(obj);

export default isNumber;
