export type Nil = null | void | undefined;
export type Nilable<T> = T | Nil;

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type FlattenIntersection<T> = { [K in keyof T]: T[K] } & {};

export type FlatUnionToIntersection<U> = FlattenIntersection<
  UnionToIntersection<U>
>;

export interface Property {
  /** The property's value. */
  value: any;
  /** The property's key. */
  key: PropertyKey;
  /** Source object this property is from. */
  source: object;
  /** Target object this property is being set on. */
  target: object;
  /** Path to this property (array of keys). */
  path: PropertyKey[];
}

export type Defined<T> = Exclude<T, undefined>;

export type AnyArray<T> = T[] | readonly T[];

export type MaybeArray<T> = T | T[];

export namespace Path {
  export type Part = string | number | symbol;
}

export type Path = Path.Part | Path.Part[] | readonly Path.Part[];

export type PartialDeep<T> =
  T extends Array<any>
    ? PartialDeep<T[number]>[]
    : T extends object
      ? { [K in keyof T]?: PartialDeep<T[K]> }
      : T;

export type ParentObjectCreator = () => object;

export type Mapped<K extends PropertyKey = PropertyKey, V = any> = Record<K, V>;

export type Visited = WeakMap<Mapped, Mapped>;

export type Key = string | number;

export type KeyOf<T extends Mapped> =
  Extract<keyof T, Key> extends never
    ? string
    : StringifyKey<Extract<keyof T, Key>>;

export type StringifyKey<T> = T extends string
  ? T
  : T extends number
    ? `${T}`
    : string;

export type Entry<K extends Key = string, V = any> = [key: K, value: V];

export type EntryOf<T extends Mapped> = Entry<string, T[keyof T]>;

export type MapEntry<E extends Entry> = UnionToIntersection<
  E extends Entry<infer K, infer V>
    ? {
        [key in K]: V;
      }
    : {}
>;

export type Fn<A extends any[] = any[], R = any> = (...args: A) => R;

export type ParameterAt<F extends Fn, I extends number> = Parameters<F>[I];

export type Falsey = false | 0 | "" | null | undefined | void;
