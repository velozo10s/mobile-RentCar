/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',

  // Mantén los globals de Jest (expect, test, jest, etc.)
  injectGlobals: true,

  // Aquí cargamos tu archivo de configuración después de que Jest ya definió expect
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        'react-native',
        '@react-native',
        'react-clone-referenced-element',
        '@react-navigation',
        'react-native-reanimated',
        'react-native-gesture-handler',
        'mobx',
        'mobx-react-lite',
      ].join('|') +
      ')/)',
  ],

  moduleNameMapper: {
    '^react-dom$': '<rootDir>/__mocks__/react-dom.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
};
