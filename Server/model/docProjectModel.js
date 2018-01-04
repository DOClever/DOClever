/**
 * Created by sunxin on 2017/7/7.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    dis:String,
    users:{
        type:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"User"
            }
        ],
        default:[]
    },
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    totalSize:Number,
    useSize:{
        type:Number,
        default:0
    },
    childGroup:{
        type:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"DocGroup"
            }
        ],
        default:[]
    },
    team:{
        type:mongoose.Schema.ObjectId,
        ref:"Team"
    },
    publicTeam:{
        type:Number,
        default:0
    },
    public:{
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
var dbManage=db.model("DocProject",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;