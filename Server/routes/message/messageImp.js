/**
 * Created by sunxin on 2017/7/7.
 */
var messageClass=require("./message");
var message=new messageClass();
var interface=[
    {
        "method":"DELETE",
        "path":"/message/item",
        "param": {
            id:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:[message.remove]
    },
    {
        "method":"GET",
        "path":"/message/list",
        "param": {
            page:Number
        },
        "data":String,
        user:1,
        handle:[message.list]
    },
    {
        "method":"DELETE",
        "path":"/message/clear",
        "param": {

        },
        "data":String,
        user:1,
        handle:[message.clear]
    },
    {
        "method":"GET",
        "path":"/message/new",
        "param": {

        },
        "data":String,
        user:1,
        handle:[message.newMsg]
    },
    {
        "method":"GET",
        "path":"/message/applylist",
        "param": {

        },
        "data":String,
        user:1,
        handle:[message.applyList]
    },
];

module.exports=interface;