/**
 * Created by sunxin on 16/8/22.
 */
var path = require('path')
var webpack = require('../../Client/node_modules/webpack')
module.exports = {
    entry: {
        vendor:["vue","vuex","./common/common"],
        index:"./index",
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue:"vue",
            Vuex:"vuex",
            $:require.resolve("./common/common.js"),
            helper:require.resolve("./util/helper"),
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
            output: {
                comments: false,  // remove all comments
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.vue$/,
                //loaders: ["happypack/loader"]
                loader:"vue-loader"
            },
            {
                test: /\.html$/,
                loader: "html?attrs=img:src img:data-src"
            }
         ]
    },
    //devtool: 'module-source-map',
    devtool: 'source-map',
    resolveLoader:{
        modules: [
            path.join(__dirname,'../../Client/node_modules')
        ]
    },
    resolve: {
        alias: {
            "vue": path.join(__dirname, '../../Client/node_modules/vue/dist/vue.min'),
            "vuex": path.join(__dirname, '../../Client/node_modules/vuex/dist/vuex.min')
        },
        modules: [
            path.join(__dirname,'../../Client/node_modules')
        ]
    }
}