const isPromise = <T = any>(value: any): value is Promise<T> =>
  value instanceof Promise;

export default isPromise;
