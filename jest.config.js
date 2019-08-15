module.exports = {
  roots: [
    '<rootDir>/tests',
    '<rootDir>/src'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}
