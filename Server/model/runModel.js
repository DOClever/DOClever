/**
 * Created by sunxin on 2016/11/17.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    host:String,
    path:String,
},{
    timestamps:true
});

var dbManage=db.model("Run",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;
