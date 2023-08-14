module.exports = {
  "{src,apps,libs,test}/**/*.{ts,tsx,scss}": [
    "eslint --fix",
    "stylelint --fix",
  ],
};
