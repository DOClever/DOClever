var mongoose = require('mongoose');
var mongoomise=require("mongoomise")
var db=require("../util/db.js");
var model=new mongoose.Schema({
    name:String,
    dis:{
        type:String,
        default:""
    },
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
    team:{
        type:mongoose.Schema.ObjectId,
        ref:"Team"
    },
    cooperation:{
        type:[
            {
                user:{
                    type:mongoose.Schema.ObjectId,
                    ref:"User"
                },
                users:{
                    type:[
                        {
                            type:mongoose.Schema.ObjectId,
                            ref:"User"
                        }
                    ],
                    default:[]
                },
                _id:false
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
var dbManage=db.model("TestProject",model);
mongoomise.promisifyAll(dbManage,require("bluebird"));
module.exports=dbManage;