/**
 * Created by sunxin on 2017/6/25.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    module:{
        type:mongoose.Schema.ObjectId,
        ref:"TestModuleVersion"
    },
    id:String,
    version:{
        type:mongoose.Schema.ObjectId,
        ref:"Version"
    }
},{
    timestamps:true
});

var dbManage=db.model("TestGroupVersion",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;