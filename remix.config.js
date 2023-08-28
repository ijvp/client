/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverModuleFormat: "cjs",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    v2_headers: true
  },
  serverDependenciesToBundle: [
    "axios",
    "@shopify/polaris-viz",
    "@shopify/polaris-viz-core",
    "d3-array",
    "d3-color",
    "d3-format",
    "d3-interpolate",
    "d3-path",
    "d3-shape",
    "d3-scale",
    "d3-time",
    "d3-time-format",
    "internmap"
  ],
  tailwind: true
};
