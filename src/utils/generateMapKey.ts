interface ItemWithId {
  id?: string;
}

/**
 * Generate a stable key for any item in React lists
 * Uses the item's ID if available, otherwise creates a stable key based on specified properties
 *
 * @param item - The item object
 * @param index - The index in the array (used only as part of composite key)
 * @param keyProperties - Array of property names to use for key generation (optional)
 * @returns A stable key string for React rendering
 */
export const generateMapKey = <T extends ItemWithId>(
  item: T,
  index: number,
  keyProperties?: (keyof T)[]
): string => {
  if (item.id) {
    return item.id;
  }

  // For items without IDs, create a stable key based on specified properties
  // If no properties specified, use all enumerable properties
  const properties = keyProperties || (Object.keys(item) as (keyof T)[]);

  const contentHash = properties
    .map(prop => {
      const value = item[prop];
      if (Array.isArray(value)) {
        return `${String(prop)}:${value.length}`;
      }
      return `${String(prop)}:${String(value)}`;
    })
    .concat(`index:${index}`) // Use index as last resort, but only as part of a composite key
    .join('|');

  return `temp-${contentHash}`;
};
