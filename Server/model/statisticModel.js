var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    date:String,
    interface:{
        type:Number,
        default:0
    },
    project:{
        type:Number,
        default:0
    },
    team:{
        type:Number,
        default:0
    },
    user:{
        type:Number,
        default:0
    },
    userRegister:{
        type:Number,
        default:0
    },
    userLogin:{
        type:Number,
        default:0
    },
},{
    timestamps:true
});

var dbManage=db.model("Statistic",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;