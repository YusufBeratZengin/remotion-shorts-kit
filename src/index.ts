import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Register Remotion Root for CLI and Studio
registerRoot(RemotionRoot);

// Re-export everything for library usage
export * from "./schema";
export * from "./helpers";
export * from "./components";
export * from "./compositions";
export * from "./examples";
export { RemotionRoot };
