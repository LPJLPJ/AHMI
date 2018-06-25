var path = require('path');
var webpack = require('webpack');
// var Uglify = require("uglifyjs-webpack-plugin");
module.exports = {
    mode: 'development',
    entry: {
        //webpackDevServer:'webpack-dev-server/client?http://localhost:4000',
        //webpackHot:'webpack/hot/only-dev-server',
        //index:"./src/js/index.js",
        //signup:"./src/js/signup.js",
        //welcome:"./src/js/welcome.js",
        //register:"./src/js/register.js",
        //login:"./src/js/login.js",
        //personal:"./src/js/personal.js",
        // test:"./src/js/test.js",
        simulator: path.join(__dirname,'src','js','simulator'),
        // simulator:"../public/ide/modules/ide/js/parts/simulator"
    },
    output: {
        path: path.join(__dirname,'../src/public/ide/modules/ide/js/parts/simulator/'),
        filename: "[name].bundle.js",
        publicPath: '/'
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin()
        // new Uglify({
        //     // sourceMap: true,
        //     uglifyOptions: {
        //         output: {
        //             beautify: false, // comment out or set to false for production
        //         },
        //     },
        // }),
    ],
    module: {
        rules: [
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: "url?limit=100000"},
            {test: /\.css$/, exclude: /(node_modules|bower_components)/, loader: "style!css"},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    compact: false,
                    presets: ['react']
                }
            }

        ]
    }
};