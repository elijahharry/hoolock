import forEntries from "./forEntries";
import apply from "./shared/apply";
import emptyObjectFrom from "./shared/emptyObjectFrom";
import { Mapped, Entry, Nilable, EntryOf, MapEntry, Nil } from "./types";

export interface RemapEntries<T extends Mapped = Mapped> {
  <E extends Nilable<Entry>>(
    entry: (entry: EntryOf<T>) => E
  ): Exclude<E, Nil> extends never ? {} : MapEntry<Exclude<E, Nil>>;
}

export interface RemapValues<T extends Mapped = Mapped> {
  <V>(value: (entry: EntryOf<T>) => V): { [K in keyof T]: V };
}

export interface Remap<T extends Mapped = Mapped> extends RemapEntries<T> {
  entries: RemapEntries<T>;
  values: RemapValues<T>;
}

const remap = <T extends Mapped>(target: T): Remap<T> => {
  const remap = ((...args) => apply(remap.entries, args)) as Remap<T>;

  remap.entries = (entry: (entry: EntryOf<T>) => Nilable<Entry>) => {
    const remmaped = emptyObjectFrom(target);
    forEntries(target, (e) => {
      const save = entry(e);
      if (save) remmaped[save[0]] = save[1];
    });
    return remmaped;
  };

  // @ts-expect-error
  remap.values = (value: (entry: EntryOf<T>) => any) =>
    remap.entries((e) => [e[0], value(e)]);

  return remap;
};

export default remap;
export type { Mapped, Entry, Nilable, EntryOf, MapEntry, Nil };
