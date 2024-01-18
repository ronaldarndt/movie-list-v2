import { camelCase } from "tiny-case";

export function transformObjectCasing(
  obj: object,
  transformFn: (key: string) => string,
): unknown {
  if (Array.isArray(obj)) {
    return obj.map((v: object) => transformObjectCasing(v, transformFn));
  }

  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const entries = Object.entries(obj).map(([key, v]) => [
    transformFn(key),
    transformObjectCasing(v as object, transformFn),
  ]);

  return Object.fromEntries(entries);
}

export function toCamelCaseObject(obj: object): unknown {
  return transformObjectCasing(obj, camelCase);
}
