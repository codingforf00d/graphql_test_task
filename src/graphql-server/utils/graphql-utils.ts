import _ from "lodash";
import assertNode from "assert";

type assert = (value: unknown, message?: string | Error) => asserts value;
export const assert: assert = assertNode;

export function mappingResultForDataLoader<T>(
  ids: ReadonlyArray<number>,
  result: T[],
  key: keyof T,
  many: true
): Array<T[] | null>;
export function mappingResultForDataLoader<T>(
  ids: ReadonlyArray<number>,
  result: T[],
  key: keyof T,
  many: false
): Array<T | null>;
export function mappingResultForDataLoader<T>(
  ids: ReadonlyArray<number>,
  result: T[] = [],
  key: keyof T,
  many = false
): Array<T | T[] | null> {
  const map = _.groupBy(result, key);

  return ids.map((id) => {
    const arr: T | T[] | null = _.get(map, id, null);

    if (many) {
      return arr;
    }

    if (arr) {
      return arr[0];
    }

    return null;
  });
}

export function mappingNotNullResultForDataLoader<T>(
  ids: ReadonlyArray<number>,
  result: T[],
  key: keyof T,
  many: false
): Array<T>;
export function mappingNotNullResultForDataLoader<T>(
  ids: ReadonlyArray<number>,
  result: T[],
  key: keyof T,
  many: true
): Array<T[]>;
export function mappingNotNullResultForDataLoader<T>(
  ids: ReadonlyArray<number>,
  result: T[] = [],
  key: keyof T,
  many = false
): Array<T | T[]> {
  const map = _.groupBy(result, key);

  return ids.map((id) => {
    const arr: T | T[] | null = _.get(map, id, null);
    assert(arr, `Empty data for ${new String(key)}=${id}`);

    return many ? arr : arr[0];
  });
}
