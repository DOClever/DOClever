/**
 * Created by sunxin on 16/8/22.
 */
var path = require('path')
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    entry: {
        vendor:["vue","vuex","./web/common/js/adapt"],
        login:"./web/basic/login/login"
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue:"vue",
            Vuex:"vuex",
            _$:require.resolve("./web/common/js/common.js"),
            _net:require.resolve("./web/common/js/net.js"),
            _session:require.resolve("./web/common/js/local"),
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,  // remove all comments
        //     }
        // }),
        new UglifyJsPlugin({
            cache:true,
            parallel:true
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].bundle.js'}),
        //new BundleAnalyzerPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.vue$/,
                loader:"vue-loader?cacheDirectory",
                include: path.resolve(__dirname, 'web'),
            },
            {
                test: /\.html$/,
                loader: "html-loader?attrs=img:src img:data-src",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                loader: "url-loader?limit=500000",
                include: path.resolve(__dirname, 'web')
            }
         ]
    },
    target: "electron-renderer",
    //devtool: 'cheap-module-eval-source-map',
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
            "vue": path.join(__dirname, 'node_modules/vue/dist/vue.min'),
            "vuex": path.join(__dirname, 'node_modules/vuex/dist/vuex.min')
        }
    }
}