/**
 * Created by sunxin on 16/8/22.
 */
var path = require('path')
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    entry: {
        vendor:["vue","vuex","./web/common/js/common.js","./web/common/js/net","./web/common/js/local"],
        login:["./web/controller/login/login"],
        register:["./web/controller/register/register"],
        reset:["./web/controller/reset/reset"],
        console:["./web/controller/console/console"],
        share:["./web/controller/share/share"],
        admin:["./web/controller/admin/admin"],
        adminlogin:["./web/controller/admin/adminlogin"],
        public:["./web/controller/public/public"],
        read:["./web/controller/read/read"]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: 'chunk[id].js?[chunkhash]'
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue:"vue",
            Vuex:"vuex",
            $:require.resolve("./web/common/js/common.js"),
            net:require.resolve("./web/common/js/net"),
            session:require.resolve("./web/common/js/local"),
            helper:require.resolve("./web/common/js/helper"),
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
                options: {
                    loaders: {
                        js: 'babel-loader'
                    }
                }
            },
            {
                test: /helper\.js/,
                loader:"babel-loader?cacheDirectory",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.jsx$/,
                loader:"babel-loader?cacheDirectory",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.html$/,
                loader: "html-loader?attrs=img:src img:data-src",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                loader: "url-loader?limit=50000",
                include: path.resolve(__dirname, 'web')
            }
         ]
    },
    //devtool: 'cheap-module-eval-source-map',
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'web'),path.resolve(__dirname, 'web/resource'),path.resolve(__dirname, 'web/common'),path.resolve(__dirname, '../node_modules')],
        alias: {
            "vue": path.join(__dirname, '../node_modules/vue/dist/vue.min'),
            "vuex": path.join(__dirname, '../node_modules/vuex/dist/vuex.min')
        }
    }
}