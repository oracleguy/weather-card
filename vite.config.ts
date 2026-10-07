import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "skyscoop-card",
    },
    outDir: "dist",
    target: "es2022",
  },
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
  },
});