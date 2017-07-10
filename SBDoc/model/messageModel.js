/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    dis:{
        type:String,
        default:""
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    type:Number,  //0 个人申请消息  1  项目申请消息
    read:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Message",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;