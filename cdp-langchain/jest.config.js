import baseConfig from "../jest.config.base.js";

export default {
  ...baseConfig,
  coveragePathIgnorePatterns: ["node_modules", "dist", "docs", "index.ts"],
  coverageThreshold: {
    "./src/**": {
      branches: 50,
      functions: 50,
      statements: 50,
      lines: 50,
    },
  },
};
