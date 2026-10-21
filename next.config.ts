<<<<<<< HEAD

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/static/calccalc",
=======
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
>>>>>>> 1cdddc42ccedf0f06e386f31b69235b74d14ea73
};

export default nextConfig;
