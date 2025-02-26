const isStrictEqual = /* @__PURE__ */ ((): ((x: any, y: any) => boolean) => {
  if (Object && typeof Object.is === "function") return Object.is.bind(Object);
  return (x: any, y: any) =>
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
})();

export default isStrictEqual;
