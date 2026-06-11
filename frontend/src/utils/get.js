// ==========================================
// src/utils/get.js
// ==========================================
// Custom lightweight implementation of lodash/es-toolkit get
// Used as a Vite alias to resolve CommonJS compatibility errors in Recharts.

export function get(object, path, defaultValue) {
  if (object == null) return defaultValue;

  const pathArray = Array.isArray(path)
    ? path
    : typeof path === "string"
    ? path.replace(/\[(\d+)\]/g, ".$1").split(".")
    : [path];

  let current = object;
  for (const key of pathArray) {
    if (current == null) return defaultValue;
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

export default get;
