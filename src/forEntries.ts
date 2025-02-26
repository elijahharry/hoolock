import forKeys from "./forKeys";
import { EntryOf, Mapped } from "./types";

const forEntries = <T extends Mapped>(
  object: T,
  callback: (entry: EntryOf<T>) => void
) => {
  forKeys(object, (key) => {
    callback([key, object[key]]);
  });
};

export default forEntries;
export type { EntryOf, Mapped };
