const isArray = /* @__PURE__ */ Array.isArray.bind(Array) as (
  value: any
) => value is any[];

export default isArray;
