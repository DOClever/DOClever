var adminClass=require("./admin");
var admin=new adminClass();
var interface=[
    {
        "method":"POST",
        "path":"/admin/login",
        "param": {
            name:String,
            password:String
        },
        "data":String,
        handle:[admin.login]
    },
    {
        "method":"POST",
        "path":"/admin/logout",
        "param": {

        },
        "data":String,
        handle:[admin.logout]
    },
    {
        "method":"GET",
        "path":"/admin/userstatistics",
        "param": {

        },
        "data":String,
        admin:1,
        handle:[admin.userStatistics]
    },
    {
        "method":"GET",
        "path":"/admin/userlist",
        "param": {
            type:Number,       //0  今日注册   1  今天登陆   2 登陆最多 3  用户搜索
            page:Number,
            key:{
                type:String,
                optional:1
            }
        },
        "data":String,
        admin:1,
        handle:[admin.userList]
    },
    {
        "method":"GET",
        "path":"/admin/userinfo",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userInfo]
    },
    {
        "method":"POST",
        "path":"/admin/user",
        "param": {
            id:{
                type:String,
                optional:1
            },
            name:String,
            password:String,
            sex:{
                type:String,
                optional:1
            },
            age:{
                type:Number,
                optional:1
            },
            company:{
                type:String,
                optional:1
            },
            photo:{
                type:String,
                optional:1
            },
            qq:{
                type:String,
                optional:1
            },
            email:{
                type:String,
                optional:1
            },
            state:{
                type:Number,
                optional:1
            },
            question:String,
            answer:String,
        },
        "data":String,
        admin:1,
        handle:[admin.userCreate]
    },
    {
        "method":"DELETE",
        "path":"/admin/user",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userRemove]
    },
    {
        "method":"GET",
        "path":"/admin/projectstatistics",
        "param": {

        },
        "data":String,
        admin:1,
        handle:[admin.projectStatistics]
    },
    {
        "method":"GET",
        "path":"/admin/projectlist",
        "param": {
            type:Number,       //0  今日创建   1  项目搜索
            page:Number,
            key:{
                type:String,
                optional:1
            }
        },
        "data":String,
        admin:1,
        handle:[admin.projectList]
    },
    {
        "method":"GET",
        "path":"/admin/project",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.projectInfo]
    },
    {
        "method":"PUT",
        "path":"/admin/project",
        "param": {
            id:String,
            name:String,
            dis:{
                type:String,
                optional:1
            },
            public:Number
        },
        "data":String,
        admin:1,
        handle:[admin.projectEdit]
    },
    {
        "method":"DELETE",
        "path":"/admin/project",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.projectRemove]
    },
    {
        "method":"GET",
        "path":"/admin/teamstatistics",
        "param": {

        },
        "data":String,
        admin:1,
        handle:[admin.teamStatistics]
    },
    {
        "method":"GET",
        "path":"/admin/teamlist",
        "param": {
            type:Number,       //0  今日创建   1  团队搜索
            page:Number,
            key:{
                type:String,
                optional:1
            }
        },
        "data":String,
        admin:1,
        handle:[admin.teamList]
    },
    {
        "method":"GET",
        "path":"/admin/teaminfo",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.teamInfo]
    },
    {
        "method":"DELETE",
        "path":"/admin/team",
        "param": {
            id:String,
        },
        "data":String,
        admin:1,
        handle:[admin.teamRemove]
    },
    {
        "method":"GET",
        "path":"/admin/interfacestatistics",
        "param": {

        },
        "data":String,
        admin:1,
        handle:[admin.interfaceStatistics]
    },
    {
        "method":"PUT",
        "path":"/admin/password",
        "param": {
            old:String,
            password:String
        },
        "data":String,
        admin:1,
        handle:[admin.editPassword]
    },
];

module.exports=interface;











