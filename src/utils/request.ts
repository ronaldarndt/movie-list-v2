import { env } from "./config.js";
import { toCamelCaseObject } from "./transformations.js";

export async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  return toCamelCaseObject(await res.json()) as T;
}

export async function tmdbRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await request<T>(`${env.TMDB_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${env.TMDB_TOKEN}`
    }
  });

  return res;
}
