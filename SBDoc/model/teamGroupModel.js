/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    users:{
        type:[{
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User"
            },
            role:Number,   // 0 管理员  1 普通成员 2 拥有者
            _id:false
        }],
        default:[]
    },
    team:{
        type:mongoose.Schema.ObjectId,
        ref:"Team"
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("TeamGroup",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;