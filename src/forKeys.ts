import isOwnProperty from "./shared/isOwnProperty";
import { KeyOf, Mapped } from "./types";

const forKeys = <T extends Mapped>(
  object: T,
  callback: (key: KeyOf<T>) => void
) => {
  for (let key in object)
    if (isOwnProperty(object, key)) {
      callback(key as KeyOf<T>);
    }
};

export default forKeys;
export type { Mapped, KeyOf };
