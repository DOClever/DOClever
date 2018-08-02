/**
 * Created by sunxin on 16/8/22.
 */
var path = require('path')
var webpack = require('webpack');
var publicPath="http://localhost:8081/dist";
var entryPath='webpack-dev-server/client?http://localhost:8081/';
module.exports = {
    entry: {
        vendor:["vue","vuex","./web/common/js/adapt",entryPath,'webpack/hot/dev-server'],
        login:["./web/basic/login/login.js",entryPath,'webpack/hot/dev-server'],
        index:["./web/console/index.js",entryPath,'webpack/hot/dev-server'],
        read:["./web/console/read/read.js",entryPath,'webpack/hot/dev-server'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath:publicPath
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue:"vue",
            Vuex:"vuex",
            _$:require.resolve("./web/common/js/common.js"),
            _net:require.resolve("./web/common/js/net"),
            _session:require.resolve("./web/common/js/local"),
            $:require.resolve("./web/console/common/js/common.js"),
            net:require.resolve("./web/console/common/js/net.js"),
            session:require.resolve("./web/console/common/js/local"),
            helper:require.resolve("./web/console/common/js/helper"),
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].bundle.js'}),
        //new BundleAnalyzerPlugin()
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
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
                test: /\.html$/,
                loader: "html-loader?attrs=img:src img:data-src",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                loader: "url-loader?limit=30000",
                include: path.resolve(__dirname, 'web')
            }
        ]
    },
    target: "electron-renderer",
    //devtool: '#cheap-module-eval-source-map',
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'web/console'),path.resolve(__dirname, 'node_modules')],
        alias: {
            "vue": path.join(__dirname, 'node_modules/vue/dist/vue.min'),
            "vuex": path.join(__dirname, 'node_modules/vuex/dist/vuex.min')
        }
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, 'node_modules')],
    },
}