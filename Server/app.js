var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var util=require("./util/util");
var app = express();
var argv=require("yargs").argv;
if(argv.webpack)
{
    var webpack = require('../node_modules/webpack'),
        webpackDevMiddleware = require('../node_modules/webpack-dev-middleware'),
        webpackHotMiddleware = require('../node_modules/webpack-hot-middleware'),
        webpackDevConfig = require('./admin/dev');
    var compiler = webpack(webpackDevConfig);
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true,
            chunks: false
        }
    }));
    app.use(webpackHotMiddleware(compiler));
}
(async function () {
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
    app.use("/user",checkFormDataUser(path.join(con.filePath,"img")),checkParam("user"),checkUser);
    app.use("/project",checkFormDataUser(path.join(con.filePath,"img")),checkParam("project"),checkUser);
    app.use("/group",checkFormDataUser(path.join(con.filePath,"img")),checkParam("group"),checkUser);
    app.use("/interface",checkFormDataUser(path.join(con.filePath,"img")),checkParam("interface"),checkUser);
    app.use("/status",checkFormDataUser(path.join(con.filePath,"img")),checkParam("status"),checkUser);
    app.use("/test",checkFormDataUser(path.join(con.filePath,"img")),checkParam("test"),checkUser);
    app.use("/team",checkFormDataUser(path.join(con.filePath,"img")),checkParam("team"),checkUser);
    app.use("/version",checkFormDataUser(path.join(con.filePath,"img")),checkParam("version"),checkUser);
    app.use("/poll",checkFormDataUser(path.join(con.filePath,"img")),checkParam("poll"),checkUser);
    app.use("/article",checkFormDataUser(path.join(con.filePath,"img")),checkParam("article"),checkUser);
    app.use("/message",checkFormDataUser(path.join(con.filePath,"img")),checkParam("message"),checkUser);
    app.use("/template",checkFormDataUser(path.join(con.filePath,"img")),checkParam("template"),checkUser);
    app.use("/example",checkFormDataUser(path.join(con.filePath,"img")),checkParam("example"),checkUser);
    app.use("/doc",checkFormDataUser(path.join(con.filePath,"img")),checkParam("doc"),checkUser);
    app.use("/command",checkFormDataUser(path.join(con.filePath,"img")),checkParam("command"),checkUser);
    app.use("/admin",checkFormDataUser(path.join(con.filePath,"img")),checkParam("admin"),checkAdmin);
    app.use("/mock",checkFormDataUser(path.join(con.filePath,"temp")),mock);
    app.use("/html",express.static(path.join(__dirname, '../Client')));
    app.use("/node_modules",express.static(path.join(__dirname, '../node_modules')));
    app.use("/img",express.static(path.join(con.filePath,"img")));
    app.use("/resource",express.static(path.join(__dirname,"resource")));
    app.use("/",function (req,res) {
        res.redirect("/html/web/controller/login/login.html");
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
})();


module.exports = app;
