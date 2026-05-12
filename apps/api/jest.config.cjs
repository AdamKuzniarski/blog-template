const baseConfig = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      ...baseConfig,
      displayName: 'unit',
      rootDir: '.',
      roots: ['<rootDir>/src'],
      testRegex: '.*\\.spec\\.ts$',
      collectCoverageFrom: ['src/**/*.(t|j)s'],
      coverageDirectory: '<rootDir>/coverage',
    },
    {
      ...baseConfig,
      displayName: 'integration',
      rootDir: '.',
      roots: ['<rootDir>/test'],
      testMatch: [
        '<rootDir>/test/integration/**/*.spec.ts',
        '<rootDir>/test/integration/**/*-spec.ts',
        '<rootDir>/test/integration/**/*.integration-spec.ts',
      ],
      testTimeout: 60000,
    },
    {
      ...baseConfig,
      displayName: 'e2e',
      rootDir: '.',
      roots: ['<rootDir>/test'],
      testRegex: '.e2e-spec.ts$',
    },
  ],
};
