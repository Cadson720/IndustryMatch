module.exports = {
    testEnvironment: "jsdom", // or "node" depending on your environment
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
};
