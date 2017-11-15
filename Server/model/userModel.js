/**
 * Created by sunxin on 2016/11/8.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    password:String,
    sex:String,
    age:Number,
    company:String,
    photo:String,
    phone:String,
    state:{
        type:Number,
        default:1
    },
    qq:String,
    email:String,
    loginCount:{
        type:Number,
        default:0
    },
    lastLoginDate:Date,
    question:String,
    answer:String,
    qqId:String,
    sendInfo:{
        user:{
            type:String,
            default:""
        },
        password:{
            type:String,
            default:""
        },
        smtp:{
            type:String,
            default:""
        },
        port:{
            type:Number,
            default:465
        }
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt",
    "lastLoginDate"
]);
var dbManage=db.model("User",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;