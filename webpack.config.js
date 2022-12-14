const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'index_bundle.js',
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html')
    })],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    }
};