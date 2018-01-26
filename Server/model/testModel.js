/**
 * Created by sunxin on 2016/11/8.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"TestProject"
    },
    module:{
        type:mongoose.Schema.ObjectId,
        ref:"TestModule"
    },
    group:{
        type:mongoose.Schema.ObjectId,
        ref:"TestGroup"
    },
    remark:String,
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    editor:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    status:{
        type:Number,
        default:0     //0 无状态  1 已通过  2 未通过
    },
    code:{
        type:String,
        default:""
    },
    ui:{
        type:Array,
        default:[]
    },
    output:{
        type:String,
        default:""
    },
    id:String,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true,
    minimize: false
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Test",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;