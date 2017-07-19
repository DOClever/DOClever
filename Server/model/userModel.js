/**
 * Created by sunxin on 2016/11/8.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    password:String,
    sex:String,
    age:Number,
    company:String,
    photo:String,
    state:{
        type:Number,
        default:1
    },
    qq:String,
    email:String,
    loginCount:{
        type:Number,
        default:0
    },
    lastLoginDate:Date,
    question:String,
    answer:String
},{
    timestamps:true
});

var dbManage=db.model("User",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;