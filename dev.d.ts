declare type EnforceType<T, U> =
  Exclude<U, T> extends never
    ? Exclude<T, U> extends never
      ? U
      : never
    : never;
