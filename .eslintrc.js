module.exports = {
  root: true,
  extends: '@react-native',

  rules: {
    'react-hooks/static-components': [
      'warn',
      {
        allowAsProps: true,
      },
    ],
  },
};