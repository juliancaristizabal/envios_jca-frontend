module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '^auth/AuthApp$': '<rootDir>/src/__mocks__/AuthApp.tsx',
    '^dashboard/DashboardApp$': '<rootDir>/src/__mocks__/DashboardApp.tsx',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/index.ts', '!src/bootstrap.tsx'],
};
