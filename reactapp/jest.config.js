module.exports = {
  testEnvironment: 'jsdom',
  // Fix: Allow ESM in node_modules (esp. axios 1.x+)
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)' // transform axios so ESM import works
  ],
};
