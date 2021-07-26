const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    mode: "development",
    entry: {
        index: './src/index.js',
    },
    resolve: {
        fallback: {
            util: require.resolve("util/")
        }
    },
    plugins: [
        new NodePolyfillPlugin()
    ]
};
