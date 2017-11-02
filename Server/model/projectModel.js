/**
 * Created by sunxin on 2016/11/15.
 */
var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    dis:{
        type:String,
        default:""
    },
    baseUrls:{
        type:mongoose.Schema.Types.Mixed,  //{remark,"",url:"",env:[{key,value,remark}]}
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
            option:Object,
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
    team:{
        type:mongoose.Schema.ObjectId,
        ref:"Team"
    },
    source:Object,     //{type:Number,url:String}   0,swagger,1,rap,2,postman
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
var dbManage=db.model("Project",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;