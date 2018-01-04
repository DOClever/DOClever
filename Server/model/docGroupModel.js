/**
 * Created by sunxin on 2017/7/7.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    parent:{
        type:mongoose.Schema.ObjectId,
        ref:"DocGroup"
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"DocProject"
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
    childDoc:{
        type:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"Doc"
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
var dbManage=db.model("DocGroup",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;