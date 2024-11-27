/**
 * Converts a Uint8Array to a hex string.
 *
 * @param key - The key to convert.
 * @returns The converted hex string.
 */
export const convertStringToHex = (key: Uint8Array): string => {
  return Buffer.from(key).toString("hex");
};
