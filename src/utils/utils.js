/**
 * Combines multiple class names into a single string.
 * Handles conditional classes and ignores falsy values like `undefined`, `null`, `false`, etc.
 *
 * @param  {...any} classes - The class names to combine.
 * @returns {string} - The combined class name string.
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  