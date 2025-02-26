const isSymbol = (value: any): value is symbol => typeof value === "symbol";

export default isSymbol;
