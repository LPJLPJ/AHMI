var path = require('path');
var webpack = require('webpack');

module.exports = {
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
        simulator: "./src/js/simulator.js",
        // simulator:"../public/ide/modules/ide/js/parts/simulator"
    },
    output: {
        path: path.join(__dirname,'../public/ide/modules/ide/js/parts/simulator/'),
        filename: "[name].bundle.js",
        publicPath: '/'
    },
    // plugins: [
    //     new webpack.HotModuleReplacementPlugin()
    // ],
    module: {
        loaders: [
            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: "url?limit=100000"},
            {test: /\.css$/, exclude: /(node_modules|bower_components)/, loader: "style!css"},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    compact: false,
                    presets: ['react']
                }
            }


        ]
    }
};