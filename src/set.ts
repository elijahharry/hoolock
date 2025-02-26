import targetPath from "./shared/targetPath";
import type { Path } from "./types";

function set<T extends object, K extends keyof T>(
  target: T,
  path: K | [K] | readonly [K],
  value: T[K],
  createParent?: (() => object) | boolean
): T;
function set<T extends object, K extends keyof T, K2 extends keyof T[K]>(
  target: T,
  path: [K, K2] | readonly [K, K2],
  value: T[K][K2],
  createParent?: (() => object) | boolean
): T;
function set<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
>(
  target: T,
  path: [K, K2, K3] | readonly [K, K2, K3],
  value: T[K][K2][K3],
  createParent?: (() => object) | boolean
): T;
function set<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  K4 extends keyof T[K][K2][K3],
>(
  target: T,
  path: [K, K2, K3, K4] | readonly [K, K2, K3, K4],
  value: T[K][K2][K3][K4],
  createParent?: (() => object) | boolean
): T;
function set<T extends object>(
  target: T,
  path: Path,
  value: any,
  createParent?: (() => object) | boolean
): T;
function set(
  obj: object,
  path: Path,
  value: any,
  createParent?: (() => object) | boolean
): any {
  const { target, key } = targetPath(obj, path, createParent);
  target[key] = value;
  return obj;
}

export default set;
export type { Path };
