const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Ignore directories
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/utils/test-utils.js",
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
  ],
  // If using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "@/middleware/(.*)$": "<rootDir>/middleware/$1",
    "@/hocs/(.*)$": "<rootDir>/hocs/$1",
    "@/hooks/(.*)$": "<rootDir>/hooks/$1",
    "@/utils/(.*)$": "<rootDir>/utils/$1",
    "@/styles/(.*)$": "<rootDir>/styles/$1",
    "@/config/(.*)$": "<rootDir>/config/$1",
    "@/context/(.*)$": "<rootDir>/context/$1",
    "@/pages/(.*)$": "<rootDir>/pages/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
