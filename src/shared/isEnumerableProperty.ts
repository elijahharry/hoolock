const isEnumerableProperty = (object: {}, key: PropertyKey) =>
  Object.prototype.propertyIsEnumerable.call(object, key);

export default isEnumerableProperty;
