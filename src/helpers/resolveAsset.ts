import { staticFile } from "remotion";
import { isExternalUrl, toStaticPath } from "./assets.js";

/**
 * Resolves a timeline asset path. External URLs pass through; everything else is
 * looked up in the project's `public/` folder with Remotion's `staticFile()`, which
 * works in the Studio, in renders, and when the site is deployed under a sub-path.
 */
export function resolveAsset(src: string): string {
  if (isExternalUrl(src)) return src;
  const name = toStaticPath(src);
  // Studio and CLI renders expose the public-file manifest. Player/SSR do not;
  // preserve staticFile's URL behavior in those environments.
  if (
    typeof window !== "undefined" &&
    window.remotion_staticFiles &&
    !window.remotion_staticFiles.some((file) => file.name === name)
  ) {
    throw new Error(
      `Missing asset: public/${name}. Add the file to your project's public/ directory.`,
    );
  }
  return staticFile(name);
}
