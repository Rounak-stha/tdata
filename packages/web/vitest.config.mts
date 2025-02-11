import { defineConfig, ViteUserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()] as ViteUserConfig["plugins"],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "src/__tests__/setup.ts",
  },
});
