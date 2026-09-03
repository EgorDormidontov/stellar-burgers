/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices$': '<rootDir>/src/services/slices',
    '^@selectors$': '<rootDir>/src/services/selectors'
  },
  collectCoverageFrom: [
    'src/services/slices/ingredientsSlice.ts',
    'src/services/slices/constructorSlice.ts'
  ],
  coverageDirectory: 'coverage'
};
