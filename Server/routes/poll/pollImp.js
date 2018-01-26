/**
 * Created by sunxin on 2017/7/5.
 */
var pollClass=require("./poll");
var poll=new pollClass();
var interface=[
    {
        "method":"POST",
        "path":"/poll/save",
        "param": {
            id:{
                type:String,
                optional:1
            },
            project:{
                type:String,
            },
            users:{
                type:String,
            },
            date:{
                type:String,
            },
            time:{
                type:String,
            },
            user:{
                type:String,
            },
            password:{
                type:String,
            },
            smtp:{
                type:String,
            },
            port:{
                type:Number,
            },
            url:{
                type:String,
            },
            immediate:Number,
            phoneinfo:String,
            failsend:Number,
            collection:String,
            interproject:{
                type:String,
                optional:1
            },
            owner:String
        },
        "data":String,
        user:1,
        handle:poll.save
    },
    {
        "method":"DELETE",
        "path":"/poll/item",
        "param": {
            id:{
                type:String,
            }
        },
        "data":String,
        user:1,
        handle:poll.remove
    },
    {
        "method":"GET",
        "path":"/poll/item",
        "param": {
            id:{
                type:String,
            }
        },
        "data":String,
        user:1,
        handle:poll.info
    },
];

module.exports=interface;