import { defineConfig, ViteUserConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()] as ViteUserConfig["plugins"],
  test: {
    globals: true,
    setupFiles: "src/__tests__/setup.ts",
  },
});
