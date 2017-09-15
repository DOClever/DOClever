/**
 * Created by sunxin on 2017/6/23.
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
    groupType:String,
    group:{
        type:mongoose.Schema.ObjectId,
        refPath:"groupType"
    },
    url:String,
    remark:String,
    method:String,
    param:Array,
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    editor:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    mock:String,
    finish:{
        type:Number,
        default:0
    },
    before:Object,
    after:Object,
    id:String,
    snapshot:{
        type:String,
        default:""
    },
    snapshotCreator:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    version:{
        type:mongoose.Schema.ObjectId,
        ref:"Version"
    }
},{
    timestamps:true,
    strict: false
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("InterfaceSnapshot",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;