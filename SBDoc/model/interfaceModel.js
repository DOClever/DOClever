/**
 * Created by sunxin on 2016/11/17.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"Project"
    },
    group:{
        type:mongoose.Schema.ObjectId,
        ref:"Group"
    },
    url:String,
    remark:String,
    method:String,
    header:{
        type:[],
        default:[]
    },
    queryParam:{
        type:[],
        default:[]
    },
    bodyParam:{
        type:[],
        default:[]
    },
    outParam:{
        type:[],
        default:[]
    },
    restParam:{
        type:[],
        default:[]
    },
    bodyInfo:Object,
    outInfo:Object,
    owner:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    editor:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    mock:String,
    finish:{
        type:Number,
        default:0
    },
    before:Object,
    after:Object,
    id:String
},{
    timestamps:true
});
model.configOutputField(null,[
    "createdAt",
    "updatedAt"
]);
var dbManage=db.model("Interface",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;