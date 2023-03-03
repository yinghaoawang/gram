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
        before: function(app, server) {
        app.get('/', function(req, res) {
            res.redirect('/gram'); // here you can try any of the Express JS res options mentioned in the answer below: 
        });
        },
        publicPath: '/gram',
        historyApiFallback: {
            index: '/gram/index.html'
        },
        proxy: {
            "/gram-api": {
                changeOrigin: true,
                target: "http://0.0.0.0:1240/",
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
