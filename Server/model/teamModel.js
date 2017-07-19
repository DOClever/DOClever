/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    dis:String,
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    notice:{
        type:[{
            content:String,
            date:String
        }],
        default:[]
    },
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Team",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;