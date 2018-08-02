var docClass=require("./doc");
var doc=new docClass();
var interface=[
    {
        "method":"POST",
        "path":"/doc/project",
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
            public:{
                type:Number,
                optional:1
            },
            publicteam:{
                type:Number,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[doc.saveProject]
    },
    {
        "method":"GET",
        "path":"/doc/projectlist",
        "param": {

        },
        "data":String,
        user:1,
        handle:[doc.projectList]
    },
    {
        "method":"GET",
        "path":"/doc/project",
        "param": {
            project:String
        },
        "data":String,
        handle:[doc.projectInfo]
    },
    {
        "method":"DELETE",
        "path":"/doc/project",
        "param": {
            project:String
        },
        "data":String,
        user:1,
        handle:[doc.removeProject]
    },
    {
        "method":"POST",
        "path":"/doc/group",
        "param": {
            group:{
                type:String,
                optional:1
            },
            project:String,
            name:String,
            parent:{
                type:String,
                optional:1
            }
        },
        "data":String,
        user:1,
        handle:[doc.saveGroup]
    },
    {
        "method":"DELETE",
        "path":"/doc/group",
        "param": {
            group:String
        },
        "data":String,
        user:1,
        handle:[doc.removeGroup]
    },
    {
        "method":"POST",
        "path":"/doc/doc",
        "param": {
            id:{
                type:String,
                optional:1
            },
            name:String,
            group:String,
            project:String,
        },
        "data":String,
        user:1,
        handle:[doc.saveDoc]
    },
    {
        "method":"GET",
        "path":"/doc/doc",
        "param": {
            id:String,
        },
        "data":String,
        handle:[doc.docInfo]
    },
    {
        "method":"DELETE",
        "path":"/doc/doc",
        "param": {
            id:String,
        },
        "data":String,
        user:1,
        handle:[doc.removeDoc]
    },
    {
        "method":"PUT",
        "path":"/doc/movegroup",
        "param": {
            group:String,
            to:{
                type:String,
                optional:1
            },
            index:Number
        },
        "data":String,
        user:1,
        handle:[doc.moveGroup]
    },
    {
        "method":"PUT",
        "path":"/doc/movedoc",
        "param": {
            id:String,
            to:String,
            index:Number
        },
        "data":String,
        user:1,
        handle:[doc.moveDoc]
    },
    {
        "method":"POST",
        "path":"/doc/user",
        "param": {
            project:String,
            user:String
        },
        "data":String,
        user:1,
        handle:[doc.addUser]
    },
    {
        "method":"DELETE",
        "path":"/doc/user",
        "param": {
            project:String,
            user:String
        },
        "data":String,
        user:1,
        handle:[doc.removeUser]
    },
    {
        "method":"PUT",
        "path":"/doc/user",
        "param": {
            project:String,
            user:String
        },
        "data":String,
        user:1,
        handle:[doc.setUser]
    },
    {
        "method":"DELETE",
        "path":"/doc/quit",
        "param": {
            project:{
                type:String
            },
        },
        "data":{

        },
        user:1,
        handle:[doc.quit]
    },
    {
        "method":"PUT",
        "path":"/doc/owner",
        "param": {
            project:String,
            user:String
        },
        "data":{

        },
        user:1,
        handle:[doc.setOwner]
    },
    {
        "method":"GET",
        "path":"/doc/structure",
        "param": {
            project:String
        },
        "data":String,
        handle:[doc.structure]
    },
    {
        "method":"GET",
        "path":"/doc/filterstructure",
        "param": {
            project:String,
            key:{
                type:String,
                optional:1
            },
            type:String
        },
        "data":String,
        handle:[doc.filterStructure]
    },
    {
        "method":"GET",
        "path":"/doc/filterlist",
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
        handle:[doc.filterList]
    },
    {
        "method":"PUT",
        "path":"/doc/handleapply",
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
        handle:[doc.handleApply]
    },
    {
        "method":"GET",
        "path":"/doc/interface",
        "param": {
            id:{
                type:String
            }
        },
        "data":String,
        handle:[doc.getInterface]
    },
    {
        "method":"GET",
        "path":"/doc/interfaceInfo",
        "param": {
            id:{
                type:String
            }
        },
        "data":String,
        handle:[doc.getInterfaceInfo]
    },
    {
        "method":"GET",
        "path":"/doc/exportpdf",
        "param": {
            project:{
                type:String
            }
        },
        "data":String,
        handle:[doc.exportPdf]
    },
];

module.exports=interface;