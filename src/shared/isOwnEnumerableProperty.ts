import isEnumerableProperty from "./isEnumerableProperty";
import isOwnProperty from "./isOwnProperty";

const isOwnEnumerableProperty = (object: {}, key: PropertyKey) =>
  isOwnProperty(object, key) && isEnumerableProperty(object, key);

export default isOwnEnumerableProperty;
