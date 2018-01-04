var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var async=require("asyncawait/async");
var await=require("asyncawait/await");
var util=require("./util/util");
var app = express();
// var webpack = require('../Client/node_modules/webpack'),
//     webpackDevMiddleware = require('../Client/node_modules/webpack-dev-middleware'),
//     webpackHotMiddleware = require('../Client/node_modules/webpack-hot-middleware'),
//     webpackDevConfig = require('../Client/dev');
// var compiler = webpack(webpackDevConfig);
// app.use(webpackDevMiddleware(compiler, {
//
//     // public path should be the same with webpack config
//     publicPath: webpackDevConfig.output.publicPath,
//     noInfo: true,
//     stats: {
//         colors: true,
//         chunks: false
//     }
// }));
// app.use(webpackHotMiddleware(compiler));
(async (function () {
    await (util.init());
    var checkUser=require("./routes/checkUser");
    var checkAdmin=require("./routes/checkAdmin");
    var checkParam=require("./routes/checkParam");
    var checkFormDataUser=require("./routes/checkFormDataUser");
    var con=require("./../config.json");
    var proxy=require("./routes/proxy/proxy");
    var mock=require("./routes/mock/mock");
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');
    app.disable('etag');
    app.all('*', function(req, res, next) {
        next();
    });
    app.use(logger('dev'));
    app.use("/proxy",proxy);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false,limit:"100000kb" }));
    app.use(cookieParser());
    app.use(session({
        cookie: {maxAge: 1000*3600*6 },
        resave:true,
        saveUninitialized:false,
        secret: 'DOClever'
    }))
    app.use("/user",checkFormDataUser(con.imgPath),checkParam("user"),checkUser);
    app.use("/project",checkFormDataUser(con.imgPath),checkParam("project"),checkUser);
    app.use("/group",checkFormDataUser(con.imgPath),checkParam("group"),checkUser);
    app.use("/interface",checkFormDataUser(con.imgPath),checkParam("interface"),checkUser);
    app.use("/status",checkFormDataUser(con.imgPath),checkParam("status"),checkUser);
    app.use("/test",checkFormDataUser(con.imgPath),checkParam("test"),checkUser);
    app.use("/team",checkFormDataUser(con.imgPath),checkParam("team"),checkUser);
    app.use("/version",checkFormDataUser(con.imgPath),checkParam("version"),checkUser);
    app.use("/poll",checkFormDataUser(con.imgPath),checkParam("poll"),checkUser);
    app.use("/article",checkFormDataUser(con.imgPath),checkParam("article"),checkUser);
    app.use("/message",checkFormDataUser(con.imgPath),checkParam("message"),checkUser);
    app.use("/template",checkFormDataUser(con.imgPath),checkParam("template"),checkUser);
    app.use("/example",checkFormDataUser(con.imgPath),checkParam("example"),checkUser);
    app.use("/doc",checkFormDataUser(con.imgPath),checkParam("doc"),checkUser);
    app.use("/admin",checkFormDataUser(con.imgPath),checkParam("admin"),checkAdmin);
    app.use("/mock",checkFormDataUser(con.tempPath),mock);
    app.use("/html",express.static(path.join(__dirname, '../Client')));
    app.use("/img",express.static(con.imgPath));
    app.use("/",function (req,res) {
        res.redirect("/html/web/controller/index/index.html");
    });
// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}))();


module.exports = app;
