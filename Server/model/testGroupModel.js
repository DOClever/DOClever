/**
 * Created by sunxin on 2017/4/25.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    module:{
        type:mongoose.Schema.ObjectId,
        ref:"TestModule"
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"TestProject"
    },
    id:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

var dbManage=db.model("TestGroup",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;