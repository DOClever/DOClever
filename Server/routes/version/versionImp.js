/**
 * Created by sunxin on 2017/6/26.
 */
var versionClass=require("./version");
var version=new versionClass();
var interface=[
    {
        "method":"POST",
        "path":"/version/save",
        "param": {
            id:{
                type:String,
                optional:1
            },
            project:String,
            version:String,
            dis:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[version.validateVersion,version.save]
    },
    {
        "method":"GET",
        "path":"/version/list",
        "param": {
            project:String,
            page:Number
        },
        "data":{

        },
        user:1,
        handle:[version.validateVersion,version.list]
    },
    {
        "method":"DELETE",
        "path":"/version/item",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[version.validateVersion,version.remove]
    },
    {
        "method":"PUT",
        "path":"/version/roll",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[version.validateVersion,version.roll]
    },
];

module.exports=interface;