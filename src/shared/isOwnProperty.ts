const isOwnProperty = (object: {}, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(object, key);

export default isOwnProperty;
