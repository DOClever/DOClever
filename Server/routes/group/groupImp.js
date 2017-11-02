/**
 * Created by sunxin on 2016/11/17.
 */
var groupClass=require("./group");
var group=new groupClass();
var interface=[
    {
        "method":"POST",
        "path":"/group/create",
        "param": {
            name:{
                type:String,
                optional:1
            },
            id:{
                type:String,
                optional:1
            },
            group:{
                type:String,
                optional:1
            },
            import:{
                type:Number,
                optional:1
            },
            parent:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[group.validateUser,group.create]
    },
    {
        "method":"DELETE",
        "path":"/group/item",
        "param": {
            group:{
                type:String
            }
        },
        "data":String,
        user:1,
        handle:[group.validateUser,group.remove]
    },
    {
        "method":"GET",
        "path":"/group/exportjson",
        "param": {
            group:{
                type:String
            }
        },
        "data":String,
        user:1,
        handle:[group.validateUser,group.exportJSON]
    },
    {
        "method":"POST",
        "path":"/group/importjson",
        "param": {
            id:{
                type:String
            },
            json:{
                type:String
            },
            group:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[group.validateUser,group.importJSON]
    },
    {
        "method":"PUT",
        "path":"/group/move",
        "param": {
            group:{
                type:String
            },
            to:{
                type:String,
                optional:1
            },
            index:{
                type:Number,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[group.validateUser,group.move]
    },
    {
        "method":"PUT",
        "path":"/group/merge",
        "param": {
            group:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:[group.validateUser,group.merge]
    },
];

module.exports=interface;