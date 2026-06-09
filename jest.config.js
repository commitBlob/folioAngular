module.exports = {
  preset: 'jest-preset-angular',
  setupTestFrameworkScriptFile: '<rootDir>/src/setup-jest.ts',
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      tsConfigFile: 'src/tsconfig.spec.json'
    },
    __TRANSFORM_HTML__: true
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'lcovonly', 'text-summary'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.routes.ts',
    '!src/**/*.spec.ts',
    '!src/testing/**'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90
    }
  }
};
