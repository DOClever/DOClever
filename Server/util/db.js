/**
 * Created by sunxin on 16/4/15.
 */
var mongoose = require('mongoose');
var data=require("./../../config.json");
require("../third/schemaExtend");
var util=require("./util");
mongoose.Promise = require('bluebird');
var db=mongoose.createConnection(data.db,{
    server: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 300000,
            connectTimeoutMS : 30000
        }
    }
});
module.exports=db;


