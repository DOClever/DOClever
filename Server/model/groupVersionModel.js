/**
 * Created by sunxin on 2016/11/17.
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
    type:{
        type:Number,
        default:0      //0 普通 1 回收站
    },
    id:String,
    version:{
        type:mongoose.Schema.ObjectId,
        ref:"Version"
    },
    parent:String,
},{
    timestamps:true
});

var dbManage=db.model("GroupVersion",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;