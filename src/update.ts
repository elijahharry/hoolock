import targetPath from "./shared/targetPath";
import type { Path } from "./types";

interface UpdateContext<T = any> {
  key: PropertyKey;
  value: T;
  /** Path to the property being updated. */
  path: PropertyKey[];
  /** Target object that is being updated (last object in the path). This is the object the property is directly on. */
  target: object;
}

type Updater<T = any> = ({ key, value, target, path }: UpdateContext<T>) => any;

function update<T extends object, K extends keyof T>(
  target: T,
  path: K | [K] | readonly [K],
  updater: Updater<T[K]>,
  createParent?: (() => object) | boolean
): T;
function update<T extends object, K extends keyof T, K2 extends keyof T[K]>(
  target: T,
  path: [K, K2] | readonly [K, K2],
  updater: Updater<T[K][K2]>,
  createParent?: (() => object) | boolean
): T;
function update<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
>(
  target: T,
  path: [K, K2, K3] | readonly [K, K2, K3],
  updater: Updater<T[K][K2][K3]>,
  createParent?: (() => object) | boolean
): T;
function update<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  K4 extends keyof T[K][K2][K3],
>(
  target: T,
  path: [K, K2, K3, K4] | readonly [K, K2, K3, K4],
  updater: Updater<T[K][K2][K3][K4]>,
  createParent?: (() => object) | boolean
): T;
function update<T extends object>(
  target: T,
  path: Path,
  updater: Updater<any>,
  createParent?: (() => object) | boolean
): T;
function update(
  source: object,
  pathlike: Path,
  updater: Updater<any>,
  createParent?: (() => object) | boolean
): any {
  const { target, key, path } = targetPath(source, pathlike, createParent),
    value = target[key];

  target[key] = updater({
    target,
    path,
    key,
    value,
  });

  return source;
}

export type { Updater, UpdateContext, Path };
export default update;
