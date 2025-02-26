import isObject from "./isObject";
import toPath from "./shared/toPath";
import type { Path, Defined } from "./types";

function get<T extends object, K extends keyof T>(
  target: T,
  path: K | [K] | readonly [K]
): T[K];
function get<T extends object, K extends keyof T, DV>(
  target: T,
  path: K | [K] | readonly [K],
  defaultValue: DV
): Defined<T[K]> | DV;
function get<T extends object, K extends keyof T, K2 extends keyof T[K]>(
  target: T,
  path: [K, K2] | readonly [K, K2]
): T[K][K2];
function get<T extends object, K extends keyof T, K2 extends keyof T[K], DV>(
  target: T,
  path: [K, K2] | readonly [K, K2],
  defaultValue: DV
): Defined<T[K][K2]> | DV;
function get<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
>(target: T, path: [K, K2, K3] | readonly [K, K2, K3]): T[K][K2][K3];
function get<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
>(target: T, path: [K, K2, K3] | readonly [K, K2, K3]): T[K][K2][K3];
function get<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  DV,
>(
  target: T,
  path: [K, K2, K3] | readonly [K, K2, K3],
  defaultValue: DV
): Defined<T[K][K2][K3]> | DV;
function get<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  K4 extends keyof T[K][K2][K3],
>(
  target: T,
  path: [K, K2, K3, K4] | readonly [K, K2, K3, K4]
): T[K][K2][K3][K4];
function get<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  K4 extends keyof T[K][K2][K3],
  DV,
>(
  target: T,
  path: [K, K2, K3, K4] | readonly [K, K2, K3, K4],
  defaultValue: DV
): Defined<T[K][K2][K3][K4]> | DV;
function get(target: object, path: Path, defaultValue?: any): any;
function get(obj: object, path: Path, defaultValue?: any): any {
  for (const key of toPath(path)) {
    if (!isObject(obj)) return defaultValue;
    obj = obj[key as keyof typeof obj];
  }
  return obj === void 0 ? defaultValue : (obj as any);
}

export default get;
export type { Path, Defined };
