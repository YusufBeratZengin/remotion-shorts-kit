import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root.js";

// Register Remotion Root for CLI and Studio
registerRoot(RemotionRoot);

// Re-export everything for library usage
export * from "./schema.js";
export * from "./helpers/index.js";
export * from "./components/index.js";
export * from "./compositions/index.js";
export * from "./examples/index.js";
export { RemotionRoot };
