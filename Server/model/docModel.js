/**
 * Created by sunxin on 2017/7/7.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    group:{
        type:mongoose.Schema.ObjectId,
        ref:"DocGroup"
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"DocProject"
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    editor:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        default:""
    },
    img:{
        type:Array,
        default:[]
    },
    file:{
        type:Array,
        default:[]
    },
    interface:{
        type:[
            {
                type:mongoose.Schema.ObjectId
            }
        ],
        default:[]
    }
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Doc",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;