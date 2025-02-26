const isNil = (obj: any): obj is null | undefined | void =>
  typeof obj === "undefined" || obj === null;

export default isNil;
