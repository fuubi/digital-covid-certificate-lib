const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
        new NodePolyfillPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: require.resolve('./node_modules/html5-qrcode/dist/html5-qrcode.min.js'),
                to: 'html5-qrcode.min.css'
            }]
        })
    ]
};
