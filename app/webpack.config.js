const path = require('path');
var webpack = require('webpack');

// Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        port: process.env.PORT || 8610
    },
    devtool: 'cheap-module-source-map',
    entry: {
        lib: ['react', 'react-dom'],
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    node: {
      fs: "empty",
      tls: "empty",
      net: "empty"
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src/'),
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                loader: 'file-loader?name=./dev/view/scss/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"',
            'process.env.DEBUG': Boolean(process.env.DEBUG)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            filename: 'lib.min.js'
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            title: 'anno'
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/css/font-awesome.min.css',
                to: 'static/css/font-awesome.min.css'
            },
            {
                from: 'src/fonts',
                to: 'static/fonts'
            },
            {
                from: 'src/components/code-mode/lib/',
                to: 'lib'
            },
            {
                from: 'src/components/cmd-mode/lib/bootstrap.min.css',
                to: 'static/css'
            },
            {
                from: 'src/components/cmd-mode/lib/bootstrap.min.js',
                to: 'static/js'
            },
            {
                from: 'src/components/cmd-mode/lib/jquery-2.1.3.min.js',
                to: 'static/js'
            },
            {
                from: 'src/components/code-mode/js/blockly-extend/constants.js',
                to: 'static/js'
            }
        ])
    ].concat(process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ] : [])
}
