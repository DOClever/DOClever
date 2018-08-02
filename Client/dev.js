/**
 * Created by sunxin on 16/8/22.
 */
var path = require('path')
var webpack = require('webpack');
var publicPath = 'http://localhost:10000/html/dist';
var hotMiddlewareScript = 'webpack-hot-middleware/client?http://localhost:10000';
module.exports = {
    entry: {
        vendor:["vue","vuex",path.join(__dirname,"./web/common/js/common.js"),path.join(__dirname,"./web/common/js/net"),path.join(__dirname,"./web/common/js/local"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        login:[path.join(__dirname,"./web/controller/login/login"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        register:[path.join(__dirname,"./web/controller/register/register"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        reset:[path.join(__dirname,"./web/controller/reset/reset"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        console:[path.join(__dirname,"./web/controller/console/console"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        share:[path.join(__dirname,"./web/controller/share/share"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        admin:[path.join(__dirname,"./web/controller/admin/admin"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        adminlogin:[path.join(__dirname,"./web/controller/admin/adminlogin"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        public:[path.join(__dirname,"./web/controller/public/public"),hotMiddlewareScript,'webpack/hot/only-dev-server'],
        read:[path.join(__dirname,"./web/controller/read/read"),hotMiddlewareScript,'webpack/hot/only-dev-server']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath:publicPath,
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
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].bundle.js'}),
        //new BundleAnalyzerPlugin()
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
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /index\.js/,
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
                loader: "url-loader?limit=30000",
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
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, '../node_modules')],
    },
}