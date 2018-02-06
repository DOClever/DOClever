var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
    interfaceType:{
        type:String,
        default:"Interface"
    },
    interface:{
        type:mongoose.Schema.ObjectId,
        refPath:"interfaceType"
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    paramId:String,
    param:Object
},{
    timestamps:true,
    strict: false
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Example",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;