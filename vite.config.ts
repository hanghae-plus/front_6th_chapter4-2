import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";

const base = process.env.NODE_ENV === "production" ? "/front_6th_chapter4-2/" : "";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base,
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        reportsDirectory: "./.coverage",
        reporter: ["lcov", "json", "json-summary"],
      },
    },
  }),
);
