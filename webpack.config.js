const {resolve} = require("path");
const config = {
    mode: "development",
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: ["node_modules"],
    },
    entry: {
        install: ["./src/installServiceWorker.ts"],
        worker: ["./src/service.ts"]
    },
    output: {
        path: resolve("./build"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    }
};
module.exports = config;
