/**
 * Created by sunxin on 2017/4/13.
 */
var testClass=require("./test");
var test=new testClass();
var interface=[
    {
        "method":"POST",
        "path":"/test/test",
        "param": {
            id:{
                type:String,
                optional:1
            },
            name:{
                type:String,
                optional:1
            },
            group:{
                type:String,
                optional:1
            },
            remark:{
                type:String,
                optional:1
            },
            status:{
                type:Number,
                optional:1
            },
            code:{
                type:String,
                optional:1
            },
            ui:{
                type:String,
                optional:1
            },
            output:{
                type:String,
                optional:1
            },
            user:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.save]
    },
    {
        "method":"GET",
        "path":"/test/list",
        "param": {
            project:{
                type:String,
            },
            user:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.list]
    },
    {
        "method":"GET",
        "path":"/test/info",
        "param": {
            project:{
                type:String,
            },
            only:{
                type:Number,
                optional:1
            },
            user:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.info]
    },
    {
        "method":"POST",
        "path":"/test/module",
        "param": {
            project:{
                type:String,
                optional:1
            },
            name:{
                type:String
            },
            module:{
                type:String,
                optional:1
            },
            user:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.saveModule]
    },
    {
        "method":"POST",
        "path":"/test/group",
        "param": {
            module:{
                type:String,
                optional:1
            },
            name:{
                type:String
            },
            group:{
                type:String,
                optional:1
            },
            project:{
                type:String,
                optional:1
            },
            user:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.saveGroup]
    },
    {
        "method":"DELETE",
        "path":"/test/module",
        "param": {
            module:{
                type:String,
            },
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.removeModule]
    },
    {
        "method":"DELETE",
        "path":"/test/group",
        "param": {
            group:{
                type:String,
            },
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.removeGroup]
    },
    {
        "method":"DELETE",
        "path":"/test/test",
        "param": {
            id:{
                type:String,
            },
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.removeTest]
    },
    {
        "method":"GET",
        "path":"/test/test",
        "param": {
            id:{
                type:String,
            },
            project:{
                type:String,
                optional:1
            },
            type:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.testInfo]
    },
    {
        "method":"PUT",
        "path":"/test/status",
        "param": {
            id:{
                type:String,
            },
            status:{
                type:Number
            },
            output:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.setStatus]
    },
    {
        "method":"PUT",
        "path":"/test/output",
        "param": {
            id:{
                type:String,
            },
            output:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.setOutput]
    },
    {
        "method":"PUT",
        "path":"/test/move",
        "param": {
            id:{
                type:String,
            },
            group:{
                type:String,
            }
        },
        "data":String,
        user:1,
        handle:[test.validateUser,test.moveTest]
    },
    {
        "method":"GET",
        "path":"/test/projectlist",
        "param": {

        },
        "data":String,
        user:1,
        handle:[test.projectList]
    },
    {
        "method":"POST",
        "path":"/test/project",
        "param": {
            project:{
                type:String,
                optional:1
            },
            name:String,
            dis:{
                type:String,
                optional:1
            },
            team:{
                type:String,
                optional:1
            },
        },
        "data":String,
        user:1,
        handle:[test.saveProject]
    },
    {
        "method":"DELETE",
        "path":"/test/project",
        "param": {
            project:String
        },
        "data":String,
        user:1,
        handle:[test.removeProject]
    },
    {
        "method":"PUT",
        "path":"/test/handleapply",
        "param": {
            project:String,
            apply:String,
            state:{
                type:Number,
                in:[1,2]
            }
        },
        "data":{

        },
        user:1,
        handle:[test.handleApply]
    },
    {
        "method":"PUT",
        "path":"/test/owner",
        "param": {
            project:String,
            user:String
        },
        "data":{

        },
        user:1,
        handle:[test.setOwner]
    },
    {
        "method":"GET",
        "path":"/test/filterlist",
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
        "data":String,
        user:1,
        handle:[test.filterList]
    },
    {
        "method":"POST",
        "path":"/test/user",
        "param": {
            project:String,
            user:String
        },
        "data":String,
        user:1,
        handle:[test.addUser]
    },
    {
        "method":"DELETE",
        "path":"/test/user",
        "param": {
            project:String,
            user:String
        },
        "data":String,
        user:1,
        handle:[test.removeUser]
    },
    {
        "method":"PUT",
        "path":"/test/user",
        "param": {
            project:String,
            user:String
        },
        "data":String,
        user:1,
        handle:[test.setUser]
    },
    {
        "method":"GET",
        "path":"/test/users",
        "param": {
            project:String,
        },
        "data":String,
        user:1,
        handle:[test.getUsers]
    },
    {
        "method":"DELETE",
        "path":"/test/quit",
        "param": {
            project:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[test.quit]
    },
    {
        "method":"GET",
        "path":"/test/interfacelist",
        "param": {

        },
        "data":{

        },
        user:1,
        handle:[test.interfaceList]
    },
    {
        "method":"GET",
        "path":"/test/interface",
        "param": {
            interface:String,
            only:{
                type:Number,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[test.interfaceInfo]
    },
    {
        "method":"GET",
        "path":"/test/urllist",
        "param": {
            project:String,
            user:String,
            urls:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[test.urlList]
    },
    {
        "method":"GET",
        "path":"/test/interfaceproject",
        "param": {
            project:String,
            version:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[test.interfaceProject]
    },
    {
        "method":"POST",
        "path":"/test/collection",
        "param": {
            collection:{
                type:String,
                optional:1
            },
            project:{
                type:String,
                optional:1
            },
            name:String,
            output:{
                type:String,
                optional:1
            },
            test:{
                type:String,
                optional:1
            },
            user:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[test.saveCollection]
    },
    {
        "method":"GET",
        "path":"/test/collectionlist",
        "param": {
            project:String,
            user:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[test.collectionList]
    },
    {
        "method":"GET",
        "path":"/test/collection",
        "param": {
            collection:String
        },
        "data":{

        },
        user:1,
        handle:[test.collectionInfo]
    },
    {
        "method":"DELETE",
        "path":"/test/collection",
        "param": {
            collection:String
        },
        "data":{

        },
        user:1,
        handle:[test.removeCollection]
    },
    {
        "method":"GET",
        "path":"/test/cooperation",
        "param": {
            project:String,
        },
        "data":{

        },
        user:1,
        handle:[test.cooperationInfo]
    },
    {
        "method":"POST",
        "path":"/test/cooperation",
        "param": {
            project:String,
            users:String
        },
        "data":{

        },
        user:1,
        handle:[test.editCooperation]
    },
    {
        "method":"GET",
        "path":"/test/allgrouplist",
        "param": {

        },
        "data":{

        },
        user:1,
        handle:[test.getAllGroupList]
    },
    {
        "method":"GET",
        "path":"/test/alllist",
        "param": {

        },
        "data":{

        },
        user:1,
        handle:[test.getAllList]
    },
    {
        "method":"GET",
        "path":"/test/exportproject",
        "param": {
            project:String
        },
        "data":{

        },
        user:1,
        handle:[test.exportProject]
    },
    {
        "method":"POST",
        "path":"/test/importproject",
        "param": {
            content:String,
            team:{
                type:String,
                optional:1
            },
            project:{
                type:String,
                optional:1
            }
        },
        "data":{

        },
        user:1,
        handle:[test.importProject]
    },
    {
        "method":"GET",
        "path":"/test/exportmodule",
        "param": {
            module:String
        },
        "data":{

        },
        user:1,
        handle:[test.exportModule]
    },
    {
        "method":"POST",
        "path":"/test/importmodule",
        "param": {
            content:String,
            project:String
        },
        "data":{

        },
        user:1,
        handle:[test.importModule]
    },
    {
        "method":"GET",
        "path":"/test/exportgroup",
        "param": {
            group:String
        },
        "data":{

        },
        user:1,
        handle:[test.exportGroup]
    },
    {
        "method":"POST",
        "path":"/test/importgroup",
        "param": {
            content:String,
            module:String
        },
        "data":{

        },
        user:1,
        handle:[test.importGroup]
    },
    {
        "method":"GET",
        "path":"/test/exporttest",
        "param": {
            test:String
        },
        "data":{

        },
        user:1,
        handle:[test.exportTest]
    },
    {
        "method":"POST",
        "path":"/test/importtest",
        "param": {
            content:String,
            group:String
        },
        "data":{

        },
        user:1,
        handle:[test.importTest]
    },
    {
        "method":"POST",
        "path":"/test/pastetest",
        "param": {
            test:String,
            group:String
        },
        "data":{

        },
        user:1,
        handle:[test.pasteTest]
    },
];

module.exports=interface;








