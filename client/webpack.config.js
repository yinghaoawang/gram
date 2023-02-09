const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:  './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/gram',
        filename: 'index_bundle.js',
    },
    module : {
        rules: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
            { test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
        ],
    },
    cache: false,
    devServer: {
        historyApiFallback: true,
        proxy: {
            "/api": {
                changeOrigin: true,
                target: "http://0.0.0.0:1240",
            }
        }
    },

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
        })
    ],
}
