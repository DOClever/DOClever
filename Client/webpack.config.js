/**
 * Created by sunxin on 16/8/22.
 */
var path = require('path')
var webpack = require('webpack');
//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    entry: {
        vendor:["vue","vuex","./web/common/common","./web/util/net","./web/util/local"],
        index:"./web/index",
        login:"./web/login/login",
        register:"./web/register/register",
        person:"./web/person/person",
        project:"./web/project/project",
        projectinfo:"./web/projectinfo/projectinfo",
        reset:"./web/reset/reset",
        about:"./web/about/about",
        help:"./web/help/help",
        donate:"./web/donate/donate",
        share:"./web/share/share",
        team:"./web/team/team",
        registerqq:"./web/register/registerqq",
        admin:"./web/admin/admin",
        adminlogin:"./web/admin/adminlogin",
        custom:"./web/custom/custom",
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            Vue:"vue",
            Vuex:"vuex",
            $:require.resolve("./web/common/common.js"),
            net:require.resolve("./web/util/net"),
            session:require.resolve("./web/util/local"),
            helper:require.resolve("./web/util/helper"),
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
                loader:"vue-loader",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /helper\.js/,
                loader:"babel-loader?cacheDirectory",
                include: path.resolve(__dirname, 'web/util')
            },
            {
                test: /index\.js/,
                loader:"babel-loader?cacheDirectory",
                include: path.resolve(__dirname, 'web')
            },
            {
                test: /\.html$/,
                loader: "html?attrs=img:src img:data-src",
                include: path.resolve(__dirname, 'web')
            }
         ]
    },
    //devtool: 'cheap-eval-source-map',
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
            "vue": path.join(__dirname, 'node_modules/vue/dist/vue.min'),
            "vuex": path.join(__dirname, 'node_modules/vuex/dist/vuex.min')
        }
    }
}