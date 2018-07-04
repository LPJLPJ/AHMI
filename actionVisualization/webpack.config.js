var path = require('path');
// var Uglify = require("uglifyjs-webpack-plugin");
module.exports = {
    mode: 'development',
    entry: {
        actionVisualizer: path.join(__dirname,'index')
    },
    output: {
        path: path.join(__dirname,'../src/public/ide/modules/ide/js/parts/actionVisualization/'),
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
            {test: /\.css$/, loader: ['style-loader', 'css-loader']},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    compact: false,
                    presets: ['react','es2015'],
                    plugins:[["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]]
                }
            }

        ]
    }
};