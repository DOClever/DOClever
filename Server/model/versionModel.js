/**
 * Created by sunxin on 2017/4/13.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    version:String,
    dis:{
        type:String,
        default:""
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    baseUrls:{
        type:mongoose.Schema.Types.Mixed,
        default:[]
    },
    before:{
        type:String,
        default:""
    },
    after:{
        type:String,
        default:""
    },
    source:Object
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Version",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;