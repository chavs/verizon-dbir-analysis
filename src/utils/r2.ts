import type { Env } from '../types';

export async function getR2Text(env: Env, key: string): Promise<string | null> {
  try {
    const obj = await env.DBIR_PDFS.get(key);
    if (!obj) return null;
    return await obj.text();
  } catch {
    return null;
  }
}

export function topicR2Key(topicId: string, filename: string): string {
  return `${topicId}/${filename}`;
}

export function dbirTextKey(year: number): string {
  return `02-extracted/text/${year}-dbir.txt`;
}
