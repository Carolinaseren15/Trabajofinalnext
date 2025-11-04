import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export function readJSON<T>(path: string, def: T): T {
  try {
    if (!existsSync(path)) {
      const dir = dirname(path);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(path, JSON.stringify(def, null, 2));
      return def;
    }
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch {
    return def;
  }
}

export function writeJSON<T>(path: string, data: T) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}
