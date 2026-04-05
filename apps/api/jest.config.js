module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/app.ts',
    '!src/docs/**',
    '!src/types/**',
    '!src/composition/**'
  ],
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage'
};
