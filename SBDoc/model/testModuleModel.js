/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
    id:String
},{
    timestamps:true
});

var dbManage=db.model("TestModule",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;