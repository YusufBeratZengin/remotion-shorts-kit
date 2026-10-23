import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// NodeNext library sources name their emitted .js files. Resolve those imports
// back to TypeScript when the same sources run in Studio or the CLI.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    extensionAlias: {
      ...config.resolve?.extensionAlias,
      ".js": [".js", ".ts", ".tsx"],
    },
  },
}));
