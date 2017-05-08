/**
 * Created by sunxin on 2016/11/20.
 */
var inter=require("./interface");
var interface=[
    {
        "method":"POST",
        "path":"/interface/create",
        "param": {
            name:{
                type:String,
                optional:1
            },
            project:{
                type:String
            },
            group:{
                type:String,
                optional:1
            },
            url:{
                type:String,
                optional:1
            },
            remark:{
                type:String,
                optional:1
            },
            finish:{
                type:Number,
                optional:1
            },
            before:{
                type:String,
                optional:1
            },
            after:{
                type:String,
                optional:1
            },
            method:{
                type:String,
                uppercase:1,
                validate:{
                    in:["GET","POST","PUT","DELETE"]
                }
            },
            header:{
                type:String,   //json字符串
                optional:1
            },
            queryparam:{
                type:String,   //json字符串
                optional:1,
                rename:"queryParam"
            },
            bodyparam:{
                type:String,   //json字符串
                optional:1,
                rename:"bodyParam"
            },
            outparam:{
                type:String,   //json字符串
                optional:1,
                rename:"outParam"
            },
            restparam:{
                type:String,   //json字符串
                optional:1,
                rename:"restParam"
            },
            bodyinfo:{
                type:String,   //json字符串
                optional:1,
                rename:"bodyInfo"
            },
            outinfo:{
                type:String,   //json字符串
                optional:1,
                rename:"outInfo"
            },
            id:{
                type:String,
                optional:1
            },
        },
        "data":String,
        user:1,
        handle:inter.create
    },
    {
        "method":"DELETE",
        "path":"/interface/item",
        "param": {
            id:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:inter.remove
    },
    {
        "method":"DELETE",
        "path":"/interface/destroyitem",
        "param": {
            id:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:inter.destroy
    },
    {
        "method":"PUT",
        "path":"/interface/move",
        "param": {
            id:{
                type:String
            },
            group:{
                type:String
            }
        },
        "data":String,
        user:1,
        handle:inter.move
    },
    {
        "method":"GET",
        "path":"/interface/item",
        "param": {
            id:{
                type:String
            },
            group:{
                type:String,
                optional:1
            },
            run:{
                optional:1,
                type:Number
            }
        },
        "data":String,
        user:1,
        handle:inter.info
    },
    {
        "method":"GET",
        "path":"/interface/exportjson",
        "param": {
            id:{
                type:String
            }
        },
        "data":String,
        user:1,
        handle:inter.exportJSON
    },
    {
        "method":"POST",
        "path":"/interface/importjson",
        "param": {
            id:{
                type:String
            },
            json:{
                type:String
            }
        },
        "data":String,
        user:1,
        handle:inter.importJSON
    },
];

module.exports=interface;