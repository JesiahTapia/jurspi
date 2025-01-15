import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest']
  },
  transformIgnorePatterns: [
    'node_modules/(?!(mongodb-memory-server|mongodb-memory-server-core)/)'
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.ts'
  ],
  testTimeout: 60000
}

export default createJestConfig(config) 