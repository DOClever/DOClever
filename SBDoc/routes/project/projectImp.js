/**
 * Created by sunxin on 2016/11/16.
 */
var project=require("./project");
var interface=[
    {
        "method":"POST",
        "path":"/project/create",
        "param": {
            name:{
                type:String
            },
            dis:{
                optional:1,
                type:String
            },
            id:{
                optional:1,
                type:String
            },
            import:{
                type:Number,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[project.validateUser,project.create]
    },
    {
        "method":"POST",
        "path":"/project/member",
        "param": {
            id:{
                type:String
            },
            user:{
                type:String
            },
            role:{
                type:Number,
                validate:{
                    in:[0,1]
                }
            }
        },
        "data":String,
        user:1,
        handle:[project.validateUser,project.addMember]
    },
    {
        "method":"PUT",
        "path":"/project/role",
        "param": {
            id:{
                type:String
            },
            user:{
                type:String
            },
            role:{
                type:Number,
                validate:{
                    in:[0,1]
                }
            }
        },
        "data":String,
        user:1,
        handle:[project.validateUser,project.role]
    },
    {
        "method":"DELETE",
        "path":"/project/member",
        "param": {
            id:{
                type:String
            },
            user:{
                type:String
            },
        },
        "data":String,
        user:1,
        handle:[project.validateUser,project.removeMember]
    },
    {
        "method":"GET",
        "path":"/project/list",
        "param": {

        },
        "data":{

        },
        user:1,
        handle:[project.list]
    },
    {
        "method":"PUT",
        "path":"/project/url",
        "param": {
            id:{
                type:String
            },
            urls:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.url]
    },
    {
        "method":"GET",
        "path":"/project/info",
        "param": {
            id:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.info]
    },
    {
        "method":"GET",
        "path":"/project/group",
        "param": {
            id:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.group]
    },
    {
        "method":"GET",
        "path":"/project/interface",
        "param": {
            id:{
                type:String
            },
            group:{            //group存在获取group下的接口，不存在获取未分组的接口
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.interface]
    },
    {
        "method":"DELETE",
        "path":"/project/clear",
        "param": {
            id:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.clear]
    },
    {
        "method":"DELETE",
        "path":"/project/item",
        "param": {
            id:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.removeProject]
    },
    {
        "method":"DELETE",
        "path":"/project/quit",
        "param": {
            id:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.quit]
    },
    {
        "method":"PUT",
        "path":"/project/addurl",
        "param": {
            id:{
                type:String
            },
            url:{
                type:String,
            }
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.addUrl]
    },
    {
        "method":"GET",
        "path":"/project/exportjson",
        "param": {
            id:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.exportJSON]
    },
    {
        "method":"POST",
        "path":"/project/importjson",
        "param": {
            json:{
                type:String
            }
        },
        "data":{

        },
        user:1,
        handle:[project.importJSON]
    },
    {
        "method":"PUT",
        "path":"/project/inject",
        "param": {
            id:{
                type:String
            },
            before:{
                type:String,
                optional:1
            },
            after:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.setInject]
    },
    {
        "method":"GET",
        "path":"/project/urllist",
        "param": {
            id:String
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.urlList]
    },
    {
        "method":"GET",
        "path":"/project/importmember",
        "param": {
            id:String
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.getImportMember]
    },
    {
        "method":"POST",
        "path":"/project/importmember",
        "param": {
            id:String,
            data:String
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.importMember]
    },
];

module.exports=interface;