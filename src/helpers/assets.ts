/**
 * Returns true for absolute URLs that must be used as-is (http, https, data, blob).
 */
export function isExternalUrl(src: string): boolean {
  return /^(https?:|data:|blob:)/i.test(src);
}

/**
 * Converts a user-supplied path such as "/narration.mp3" or "./img/bg.png" into a
 * path relative to the Remotion `public/` folder, suitable for `staticFile()`.
 */
export function toStaticPath(src: string): string {
  return src.replace(/^(\.\/|\/)+/, "");
}
