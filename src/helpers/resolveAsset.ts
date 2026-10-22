import { staticFile } from "remotion";
import { isExternalUrl, toStaticPath } from "./assets";

/**
 * Resolves a timeline asset path. External URLs pass through; everything else is
 * looked up in the project's `public/` folder with Remotion's `staticFile()`, which
 * works in the Studio, in renders, and when the site is deployed under a sub-path.
 */
export function resolveAsset(src: string): string {
  return isExternalUrl(src) ? src : staticFile(toStaticPath(src));
}
