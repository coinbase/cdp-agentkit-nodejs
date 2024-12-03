import baseConfig from "../../../jest.config.base.js";

export default {
  ...baseConfig,
  /*
   * Override any settings specific to the chatbot tests if needed
   * For example, we might want to adjust the coverage paths since
   * the files are in the root of the example directory rather than src/
   */
  collectCoverageFrom: ["./*.ts"],
};
