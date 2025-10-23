export function removeDuplicatesByKey<T extends Record<string, unknown>>(
  arrays: T[][],
  key: keyof T,
): T[] {
  const uniqueItems = new Map<T[keyof T], T>();

  for (const array of arrays) {
    for (const item of array) {
      uniqueItems.set(item[key], item);
    }
  }

  return Array.from(uniqueItems.values());
}
