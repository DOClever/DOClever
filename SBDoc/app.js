var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var checkUser=require("./routes/checkUser");
var checkParam=require("./routes/checkParam");
var checkFormDataUser=require("./routes/checkFormDataUser");
var con=require("./../config.json");
var util=require("./util/util");
var proxy=require("./routes/proxy/proxy");
var mock=require("./routes/mock/mock")
var app = express();
util.createDir(con.filePath)
util.createDir(con.imgPath)
util.createDir(con.tempPath)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.disable('etag');
app.all('*', function(req, res, next) {
    next();
});
app.use(logger('dev'));
app.use("/proxy",proxy);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookie: {maxAge: 1000*3600*6 },
  resave:true,
  saveUninitialized:false,
  secret: 'SBDoc'
}))
app.use("/user",checkFormDataUser(con.imgPath),checkParam("user"),checkUser);
app.use("/project",checkFormDataUser(con.imgPath),checkParam("project"),checkUser);
app.use("/group",checkFormDataUser(con.imgPath),checkParam("group"),checkUser);
app.use("/interface",checkFormDataUser(con.imgPath),checkParam("interface"),checkUser);
app.use("/status",checkFormDataUser(con.imgPath),checkParam("status"),checkUser);
app.use("/test",checkFormDataUser(con.imgPath),checkParam("test"),checkUser);
app.use("/mock",checkFormDataUser(con.tempPath),mock);
app.use("/html",express.static(path.join(__dirname, '../SBDocClient')));
app.use("/img",express.static(con.imgPath));
app.use("/",function (req,res) {
    res.redirect("/html/web/index.html");
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

module.exports = app;
