const isMap = <K = any, V = any>(map: any): map is Map<K, V> =>
  map instanceof Map;

export default isMap;
