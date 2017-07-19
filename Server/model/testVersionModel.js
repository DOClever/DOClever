/**
 * Created by sunxin on 2017/6/25.
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
    module:{
        type:mongoose.Schema.ObjectId,
        ref:"TestModuleVersion"
    },
    group:{
        type:mongoose.Schema.ObjectId,
        ref:"TestGroupVersion"
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
    output:{
        type:String,
        default:""
    },
    id:String,
    version:{
        type:mongoose.Schema.ObjectId,
        ref:"Version"
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("TestVersion",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;