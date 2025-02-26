import isArray from "./isArray";
import isFunction from "./isFunction";

type ShapeDynamicValues<K extends PropertyKey, T> = (key: K) => T;

type ShapeStaticValues<T> = {
  value: T;
};

type ShapeValues<K extends PropertyKey, T> =
  | ShapeDynamicValues<K, T>
  | ShapeStaticValues<T>;

function shape<T>(length: number, values: ShapeValues<number, T>): T[];
function shape<T, K extends string | number | symbol>(
  keys: K[],
  values: ShapeValues<K, T>
): Record<K, T>;
function shape<T>(
  properties: number | Array<string | number | symbol>,
  values: ShapeValues<string | number | symbol, T> | ShapeValues<number, T>
): T[] | Record<string | number | symbol, T> {
  const generate = (
    isFunction(values) ? values : () => values.value
  ) as ShapeDynamicValues<string | number | symbol, T>;

  if (isArray(properties)) {
    const result: Record<string | number | symbol, T> = {};
    for (const property of properties) {
      result[property] = generate(property);
    }
    return result;
  }

  const result: T[] = [];
  for (let i = 0; i < properties; i++) {
    result[i] = generate(i);
  }

  return result;
}

export default shape;
export type { ShapeValues, ShapeStaticValues, ShapeDynamicValues };
