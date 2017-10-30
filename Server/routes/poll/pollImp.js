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
            test:String,
            immediate:Number
        },
        "data":String,
        user:1,
        handle:poll.save
    },
    {
        "method":"DELETE",
        "path":"/poll/item",
        "param": {
            project:{
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
            project:{
                type:String,
            }
        },
        "data":String,
        user:1,
        handle:poll.info
    },
];

module.exports=interface;