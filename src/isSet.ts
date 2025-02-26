const isSet = <T = any>(value: any): value is Set<T> => value instanceof Set;

export default isSet;
