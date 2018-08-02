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
            phone:{
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
            },
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.projectList]
    },
    {
        "method":"GET",
        "path":"/admin/project",
        "param": {
            id:String,
            category:Number
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
            public:{
                type:Number,
                optional:1
            },
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.projectEdit]
    },
    {
        "method":"DELETE",
        "path":"/admin/project",
        "param": {
            id:String,
            category:Number
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
    {
        "method":"GET",
        "path":"/admin/userprojectlist",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userProjectList]
    },
    {
        "method":"GET",
        "path":"/admin/userteamlist",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userTeamList]
    },
    {
        "method":"DELETE",
        "path":"/admin/userproject",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userRemoveProject]
    },
    {
        "method":"DELETE",
        "path":"/admin/userteam",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userRemoveTeam]
    },
    {
        "method":"PUT",
        "path":"/admin/userprojectown",
        "param": {
            id:String,
            user:String,
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.userTransferProject]
    },
    {
        "method":"PUT",
        "path":"/admin/userteamown",
        "param": {
            id:String,
            user:String
        },
        "data":String,
        admin:1,
        handle:[admin.userTransferTeam]
    },
    {
        "method":"PUT",
        "path":"/admin/userquitproject",
        "param": {
            id:String,
            user:String
        },
        "data":String,
        admin:1,
        handle:[admin.userQuitProject]
    },
    {
        "method":"PUT",
        "path":"/admin/userquitteam",
        "param": {
            id:String,
            user:String
        },
        "data":String,
        admin:1,
        handle:[admin.userQuitTeam]
    },
    {
        "method":"GET",
        "path":"/admin/userteamuser",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.userTeamUser]
    },
    {
        "method":"POST",
        "path":"/admin/project",
        "param": {
            name:String,
            dis:{
                type:String,
                optional:1
            },
            public:{
                type:Number,
                optional:1
            },
            owner:{
                type:String
            },
            users:{
                type:String,
                optional:1
            },
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.addProject]
    },
    {
        "method":"PUT",
        "path":"/admin/projectuser",
        "param": {
            id:String,
            users:String,
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.setProjectUser]
    },
    {
        "method":"POST",
        "path":"/admin/team",
        "param": {
            name:String,
            dis:{
                type:String,
                optional:1
            },
            owner:{
                type:String
            },
            users:{
                type:String,
                optional:1
            },
        },
        "data":String,
        admin:1,
        handle:[admin.addTeam]
    },
    {
        "method":"GET",
        "path":"/admin/teamuserlist",
        "param": {
            id:{
                type:String,
            },
        },
        "data":String,
        admin:1,
        handle:[admin.getTeamUserList]
    },
    {
        "method":"PUT",
        "path":"/admin/team",
        "param": {
            id:{
                type:String,
            },
            name:String,
            dis:{
                type:String,
                optional:1
            }
        },
        "data":String,
        admin:1,
        handle:[admin.editTeam]
    },
    {
        "method":"POST",
        "path":"/admin/teamgroup",
        "param": {
            id:{
                type:String,
                optional:1
            },
            group:{
                type:String,
                optional:1
            },
            name:String
        },
        "data":String,
        admin:1,
        handle:[admin.addTeamGroup]
    },
    {
        "method":"POST",
        "path":"/admin/addteamuser",
        "param": {
            id:String,
            group:{
                type:String,
            },
            user:String,
            role:Number
        },
        "data":String,
        admin:1,
        handle:[admin.addTeamUser]
    },
    {
        "method":"DELETE",
        "path":"/admin/teamgroup",
        "param": {
            group:{
                type:String
            },
        },
        "data":String,
        admin:1,
        handle:[admin.removeTeamGroup]
    },
    {
        "method":"DELETE",
        "path":"/admin/teamuser",
        "param": {
            id:String,
            user:String
        },
        "data":String,
        admin:1,
        handle:[admin.removeTeamUser]
    },
    {
        "method":"PUT",
        "path":"/admin/teamuser",
        "param": {
            id:String,
            user:String,
            role:Number
        },
        "data":String,
        admin:1,
        handle:[admin.setTeamUserRole]
    },
    {
        "method":"PUT",
        "path":"/admin/moveteamuser",
        "param": {
            id:String,
            user:String,
            group:String
        },
        "data":String,
        admin:1,
        handle:[admin.moveTeamUser]
    },
    {
        "method":"PUT",
        "path":"/admin/teampullproject",
        "param": {
            id:String,
            project:String,
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.pullTeamProject]
    },
    {
        "method":"PUT",
        "path":"/admin/teampushproject",
        "param": {
            id:String,
            project:String,
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.pushTeamProject]
    },
    {
        "method":"POST",
        "path":"/admin/projectuserrole",
        "param": {
            id:String,
            user:String,
            role:{
                type:Number,
                optional:1
            },
            option:{
                type:String,
                optional:1
            },
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.setProjectUserRole]
    },
    {
        "method":"DELETE",
        "path":"/admin/projectuser",
        "param": {
            id:String,
            user:String,
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.removeProjectUser]
    },
    {
        "method":"GET",
        "path":"/admin/projectuserlist",
        "param": {
            id:String,
            category:Number
        },
        "data":String,
        admin:1,
        handle:[admin.projectUserList]
    },
    {
        "method":"GET",
        "path":"/admin/searchuser",
        "param": {
            user:String
        },
        "data":String,
        admin:1,
        handle:[admin.searchUser]
    },
    {
        "method":"GET",
        "path":"/admin/teamprojectlist",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.teamProjectList]
    },
    {
        "method":"GET",
        "path":"/admin/statisticlist",
        "param": {
            start:String,
            end:String
        },
        "data":String,
        admin:1,
        handle:[admin.statisticList]
    },
    {
        "method":"GET",
        "path":"/admin/setting",
        "param": {

        },
        "data":String,
        admin:1,
        handle:[admin.getSetting]
    },
    {
        "method":"PUT",
        "path":"/admin/basicinfo",
        "param": {
            register:Number
        },
        "data":String,
        admin:1,
        handle:[admin.setBasicInfo]
    },
    {
        "method":"PUT",
        "path":"/admin/connectinfo",
        "param": {
            db:String,
            file:String,
            port:String
        },
        "data":String,
        admin:1,
        handle:[admin.setConnectInfo]
    },
    {
        "method":"PUT",
        "path":"/admin/backup",
        "param": {
            dbpath:String,
            backpath:String,
            hours:String,
            host:String,
            name:String,
            user:{
                type:String,
                optional:1
            },
            pass:{
                type:String,
                optional:1
            },
            authdb:{
                type:String,
                optional:1
            },
            immediate:Number
        },
        "data":String,
        admin:1,
        handle:[admin.backup]
    },
    {
        "method":"PUT",
        "path":"/admin/restore",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.restore]
    },
    {
        "method":"GET",
        "path":"/admin/backuplist",
        "param": {
            page:Number
        },
        "data":String,
        admin:1,
        handle:[admin.backupList]
    },
    {
        "method":"DELETE",
        "path":"/admin/backup",
        "param": {
            id:String
        },
        "data":String,
        admin:1,
        handle:[admin.removeBackup]
    },
];

module.exports=interface;











