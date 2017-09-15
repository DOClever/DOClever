/**
 * Created by sunxin on 2017/4/13.
 */
var statusClass=require("./status");
var status=new statusClass();
var interface=[
    {
        "method":"POST",
        "path":"/status/save",
        "param": {
            id:{
                type:String,
                optional:1
            },
            name:{
                type:String,
                optional:1
            },
            project:{
                type:String,
                optional:1
            },
            data:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[status.validate,status.save]
    },
    {
        "method":"DELETE",
        "path":"/status/remove",
        "param": {
            id:{
                type:String,
            },
        },
        "data":String,
        user:1,
        handle:[status.validate,status.remove]
    },
    {
        "method":"GET",
        "path":"/status/list",
        "param": {
            id:{
                type:String,
            },
        },
        "data":String,
        user:1,
        handle:[status.validate,status.list]
    },
    {
        "method":"GET",
        "path":"/status/exportjson",
        "param": {
            id:{
                type:String,
            },
        },
        "data":String,
        user:1,
        handle:[status.validate,status.exportJSON]
    },
    {
        "method":"POST",
        "path":"/status/importjson",
        "param": {
            project:{
                type:String,
            },
            json:{
                type:String
            }
        },
        "data":String,
        user:1,
        handle:[status.validate,status.importJSON]
    },
];

module.exports=interface;