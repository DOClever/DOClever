/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    dis:{
        type:String,
        default:""
    },
    fromType:String,    //User,Project,Team,DocProject,TestProject
    from:{
        type:mongoose.Schema.ObjectId,
        refPath:"fromType"
    },
    toType:String,      //Team,User,Project,DocProject,TestProject
    to:{
        type:mongoose.Schema.ObjectId,
        refPath:"toType"
    },
    type:Number,       //0 拉人  1 拉项目  2 人员申请加入  3  项目申请加入 4 拉文档  5 文档申请加入 6 拉测试  7 测试申请加入
    state:Number,     //0 申请中  1 同意  2 拒绝  3 忽略
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    editor:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    relatedData:mongoose.Schema.Types.Mixed
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Apply",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;