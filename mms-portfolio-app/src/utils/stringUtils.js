/**
 * Parse a comma-separated string, ignoring commas that are escaped with a backslash
 * @param {string} str - The string to parse
 * @returns {string[]} Array of parsed items
 */
export const parseEscapedCommaList = (str) => {
  if (!str || typeof str !== "string") return [];

  // Use a unique placeholder unlikely to appear in real data
  const PLACEHOLDER = "__ESCAPED_COMMA__";
  // Replace all \,(comma) with placeholder
  const replaced = str.replace(/\\,/g, PLACEHOLDER);
  // Split on unescaped commas
  const items = replaced.split(",");
  // Restore placeholder to comma and trim whitespace
  return items
    .map((item) =>
      item.replace(new RegExp(PLACEHOLDER, "g"), ",").replace(/\\/g, "").trim()
    )
    .filter((item) => item.length > 0);
};

/**
 * Convert an array to a comma-separated string, escaping commas with backslashes
 * @param {string[]} arr - The array to convert
 * @returns {string} Comma-separated string with escaped commas
 */
export const arrayToEscapedCommaString = (arr) => {
  if (!Array.isArray(arr)) return "";

  return arr
    .map((item) => {
      if (typeof item === "string" && item.includes(",")) {
        // Escape commas in the item
        return item.replace(/,/g, "\\,");
      }
      return item;
    })
    .join(", ");
};
