module.exports = {
    target: "webworker",
    context: __dirname,
    entry: "./src/index.js",
    mode: "production",
    optimization: {
        minimize: true
    }
}
