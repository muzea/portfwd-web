const key = "config";

export function set(value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function get(): any {
  const res = localStorage.getItem(key);
  if (res === null) {
    return null;
  }
  return JSON.parse(res);
}

export function clear() {
  localStorage.clear();
}
