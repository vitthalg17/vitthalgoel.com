import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The pre-Next.js site, kept for reference; it isn't built or served.
    "legacy_vitthalgoel.com/**",
    // Vendored WebGL scene (adapted from exteestudio/venom-button), kept close to upstream.
    "lib/venom-button.js",
  ]),
]);

export default eslintConfig;
