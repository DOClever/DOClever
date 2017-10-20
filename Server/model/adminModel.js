var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    password:String,
    lastLoginDate:Date,
    loginCount:{
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
var dbManage=db.model("Admin",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;