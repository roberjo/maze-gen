export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    },
    './src/core/': {
      statements: 90,
      branches: 85,
      functions: 85,
      lines: 90
    },
    './src/ai/': {
      statements: 90,
      branches: 85,
      functions: 85,
      lines: 90
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/main.ts',
    '!src/effects/**/*',
    '!src/ui/**/*',
    '!src/visualization/**/*'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
}; 