/** @type {import('jest').Config} */

import { createRequire } from "module";

const require = createRequire(import.meta.url);

const config = {
  prettierPath: require.resolve("prettier-2"),
};

export default config;
