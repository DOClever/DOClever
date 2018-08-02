/**
 * Created by sunxin on 2016/11/16.
 */
var projectClass=require("./project");
var project=new projectClass();
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
            },
            team:{
                optional:1,
                type:String
            },
            public:{
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
            },
            option:{
                type:String,
                optional:1
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
            },
            option:{
                type:String,
                optional:1
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
        "method":"GET",
        "path":"/project/filterlist",
        "param": {
            team:{
                type:String,
                optional:1
            },
            name:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.filterList]
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
        handle:[project.inProject,project.url]
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
        handle:[project.inProject,project.groupList]
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
            },
            sort:{
                type:Number,   //不存在或者为0 名称  1 修改时间 2 自定义
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.interfaceList]
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
        handle:[project.inProject,project.addUrl]
    },
    {
        "method":"GET",
        "path":"/project/exportjson",
        "param": {
            id:{
                type:String
            },
            version:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.exportJSON]
    },
    {
        "method":"GET",
        "path":"/project/exporthtml",
        "param": {
            id:{
                type:String
            },
            version:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.exportHTML]
    },
    {
        "method":"POST",
        "path":"/project/importjson",
        "param": {
            json:{
                type:String
            },
            team:{
                type:String,
                optional:1
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
        handle:[project.inProject,project.setInject]
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
    {
        "method":"PUT",
        "path":"/project/owner",
        "param": {
            id:String,
            user:String
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.setOwner]
    },
    {
        "method":"GET",
        "path":"/project/applylist",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.applyList]
    },
    {
        "method":"PUT",
        "path":"/project/handleapply",
        "param": {
            id:String,
            apply:String,
            state:{
                type:Number,
                in:[1,2]
            }
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.handleApply]
    },
    {
        "method":"PUT",
        "path":"/project/user",
        "param": {
            id:String,
            user:String
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.setUser]
    },
    {
        "method":"GET",
        "path":"/project/users",
        "param": {
            id:String,
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.getUsers]
    },
    {
        "method":"POST",
        "path":"/project/importrap",
        "param": {
            json:{
                type:String
            },
            team:{
                type:String,
                optional:1
            },
            bodytype:{
                type:Number     //0 urlencoded  1  json
            }
        },
        "data":{

        },
        user:1,
        handle:[project.importRap]
    },
    {
        "method":"POST",
        "path":"/project/importswagger",
        "param": {
            json:{
                type:String,
                optional:1
            },
            team:{
                type:String,
                optional:1
            },
            url:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.importSwagger]
    },
    {
        "method":"PUT",
        "path":"/project/updateswagger",
        "param": {
            id:String,
            json:{
                type:String,
                optional:1
            },
            url:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.validateUser,project.updateSwagger]
    },
    {
        "method":"POST",
        "path":"/project/importpostman",
        "param": {
            json:{
                type:String
            },
            team:{
                type:String,
                optional:1
            },
            baseurl:String,
            ignore:Number
        },
        "data":{

        },
        user:1,
        handle:[project.importPostman]
    },
    {
        "method":"GET",
        "path":"/project/exportdocx",
        "param": {
            id:{
                type:String
            },
            version:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[project.inProject,project.exportDocx]
    },
];

module.exports=interface;