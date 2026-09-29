/**
 * localStorage can throw (private mode, blocked cookies, quota). Every access in
 * the app goes through these helpers so a storage failure degrades to "no memory"
 * instead of a crash.
 */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the feature simply won't persist.
  }
}
