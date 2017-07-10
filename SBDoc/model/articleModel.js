/**
 * Created by sunxin on 2017/7/7.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    title:String,
    content:{
        type:String,
        default:""
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Article",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;