var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    version:String,
    register:{
        type:Number,
        default:1
    },
    db:{
        dbPath:{
            type:String,
            default:""
        },
        backPath:{
            type:String,
            default:""
        },
        hours:{
            type:Array,
            default:[]
        },
        host:{
            type:String,
            default:""
        },
        name:{
            type:String,
            default:""
        },
        user:{
            type:String,
            default:""
        },
        pass:{
            type:String,
            default:""
        },
        authDb:{
            type:String,
            default:""
        }
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Info",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;