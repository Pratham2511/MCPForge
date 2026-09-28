import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/unit/**/*.test.ts", "test/e2e/**/*.test.ts"],
    testTimeout: 200_000,
    hookTimeout: 30_000,
    // e2e needs the built dist; ensure `npm run build` runs before e2e in CI
  },
});
