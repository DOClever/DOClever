var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
    url:String,
    remark:String,
    method:String,
    param:Array,
    version:{
        type:mongoose.Schema.ObjectId,
        ref:"Version"
    },
},{
    timestamps:true,
    strict: false
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Template",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;