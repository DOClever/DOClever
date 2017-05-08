/**
 * Created by sunxin on 2016/11/15.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    dis:String,
    baseUrls:{
        type:[String],
        default:[]
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    users:{
        type:[{
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User"
            },
            role:Number,   // 0 管理员  1 观察者
            _id:false
        }],
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
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Project",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;