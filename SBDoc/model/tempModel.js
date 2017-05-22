/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
},{
    timestamps:true
});

var dbManage=db.model("Temp",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;