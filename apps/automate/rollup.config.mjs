import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs", // Output as CommonJS
    },
  ],
  plugins: [resolve(), commonjs(), json(), typescript()],
  external: [], // List dependencies here if bundling a package
};
