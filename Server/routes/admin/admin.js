var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var blue=require("bluebird");
var fs=blue.promisifyAll(require("fs"));
var admin=require("../../model/adminModel")
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var interface=require("../../model/interfaceModel")
var groupVersion=require("../../model/groupVersionModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var statusVersion=require("../../model/statusVersionModel")
var testVersion=require("../../model/testVersionModel")
var testModuleVersion=require("../../model/testModuleVersionModel")
var testGroupVersion=require("../../model/testGroupVersionModel")
var test=require("../../model/testModel")
var testModule=require("../../model/testModuleModel")
var testGroup=require("../../model/testGroupModel")
var group=require("../../model/groupModel")
var status=require("../../model/statusModel")
var poll=require("../../model/pollModel")
var version=require("../../model/versionModel")
var statistic=require("../../model/statisticModel")
var template=require("../../model/templateModel")
var example=require("../../model/exampleModel")
var info=require("../../model/infoModel")
var docProject=require("../../model/docProjectModel")
var config=require("../../../config.json")
var uuid=require("uuid");
var path=require("path");
var objectId = require('mongoose').Types.ObjectId;
function Admin()
{
    this.teamUserList=async ( (teamId)=> {
        let arrUser=await (teamGroup.findAsync({
            team:teamId
        }))
        let arr=[];
        arrUser.forEach(function (obj) {
            return obj.users.forEach(function (obj) {
                arr.push(obj.user.toString());
            })
        })
        return arr;
    })
    this.existUserInTeam=async ( (teamId,userId)=>{
        let arrUser=await (teamGroup.findAsync({
            team:teamId
        }))
        let bFind=false;
        for(let obj of arrUser) {
            for (let obj1 of obj.users) {
                if(obj1.user.toString()==userId.toString())
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                break;
            }
        }
        if(bFind)
        {
            return true;
        }
        else
        {
            return false;
        }
    })
    this.login=async ((req,res)=>{
        try
        {
            let obj=await (admin.findOneAndUpdateAsync({
                name:req.clientParam.name,
                password:req.clientParam.password
            },{
                lastLoginDate:Date.now(),
                $inc:{
                    loginCount:1
                }
            },{
                new:true
            }))
            if(obj)
            {
                req.session.admin=obj._id;
                util.ok(res,"ok")
            }
            else
            {
                util.throw(e.adminNotFound,"用户没有找到!")
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.logout=async ((req,res)=>{
        try
        {
            req.session.admin=null;
            delete req.session.admin;
            util.ok(res,"退出成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userStatistics=async ((req,res)=>{
        try
        {
            let obj={};
            obj.total=await (user.countAsync());
            var date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            obj.register=await (user.countAsync({
                createdAt:{
                    $gt:date
                }
            }))
            obj.login=await (user.countAsync({
                lastLoginDate:{
                    $gt:date
                }
            }))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userList=async ((req,res)=>{
        try
        {
            let arr,query={},sort,type=req.clientParam.type;
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if(type==0)
            {
                query={
                    createdAt:{
                        $gt:date
                    }
                }
                sort="-createdAt";
            }
            else if(type==1)
            {
                query={
                    lastLoginDate:{
                        $gt:date
                    }
                }
                sort="-lastLoginDate"
            }
            else if(type==2)
            {
                sort="-loginCount"
            }
            else if(type==3)
            {
                query={
                    name:new RegExp(req.clientParam.key?req.clientParam.key:"","i")
                };
                sort="name";
            }
            else if(type==4)
            {
                let today=new Date();
                let t=today.getTime()-1000*60*60*24*10;
                var newDay=new Date(t);
                query={
                    lastLoginDate:{
                        $gt:newDay
                    },
                    loginCount:{
                        $gte:10
                    }
                };
                sort="name";
                arr=await (user.findAsync(query,"name photo createdAt lastLoginDate loginCount state",{
                    sort:sort
                }));
                let ret=[];
                for(let obj of arr)
                {
                    let bOK=false;
                    let arrProject=await (project.findAsync({
                        $or:[
                            {
                                owner:obj._id
                            },
                            {
                                "users.user":obj._id
                            }
                        ]
                    }))
                    for(let obj1 of arrProject)
                    {
                        let count=await (interface.countAsync({
                            project:obj1._id
                        }));
                        if(count>=5)
                        {
                            bOK=true;
                            break;
                        }
                    }
                    if(bOK)
                    {
                        ret.push(obj);
                    }
                }
                ret=ret.slice(req.clientParam.page*10,10+req.clientParam.page*10);
                util.ok(res,ret,"ok");
                return;
            }
            arr=await (user.findAsync(query,"name photo createdAt lastLoginDate loginCount state",{
                sort:sort,
                skip:10*req.clientParam.page,
                limit:10
            }))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userInfo=async ((req,res)=>{
        try
        {
            let obj=await (user.findOneAsync({
                _id:req.clientParam.id
            }));
            if(!obj)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            else
            {
                util.ok(res,obj,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userCreate=async ((req,res)=>{
        try
        {
            if(req.clientParam.id)
            {
                let update={};
                for(let key in req.clientParam)
                {
                    if(key!="id")
                    {
                        update[key]=req.clientParam[key];
                    }
                }
                let ret=await (user.findOneAsync({
                    name:update.name,
                    _id:{
                        $ne:req.clientParam.id
                    }
                }));
                if(ret)
                {
                    util.throw(e.duplicateUser,"用户名重复");
                }
                let obj=await (user.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },update,{
                    new:false
                }));
                if(!obj)
                {
                    util.throw(e.userNotFound,"用户不存在");
                }
                else if(req.clientParam.photo && obj.photo && req.clientParam.photo!=obj.photo)
                {
                    util.delImg(obj.photo);
                }
                obj=await (user.findOneAsync({
                    _id:req.clientParam.id
                },"-password"))
                util.ok(res,obj,"ok");
            }
            else
            {
                let obj={};
                for(let key in req.clientParam)
                {
                    obj[key]=req.clientParam[key];
                }
                if(!obj.name || !obj.password)
                {
                    util.throw(e.paramWrong,"姓名密码不能为空");
                }
                let ret=await (user.findOneAsync({
                    name:obj.name
                }));
                if(ret)
                {
                    util.throw(e.duplicateUser,"用户名重复");
                }
                obj=await (user.createAsync(obj));
                delete obj._doc.password;
                util.ok(res,obj,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userRemove=async ((req,res)=>{
        try
        {
            let arrProject=await (project.findAsync({
                owner:req.clientParam.id
            }));
            let arrTeam=await (teamGroup.findAsync({
                owner:req.clientParam.id
            }))
            let arrDoc=await (docProject.findAsync({
                owner:req.clientParam.id
            }))
            if(arrProject.length>0 || arrTeam.length>0 || arrDoc.length>0)
            {
                util.throw(e.systemReason,"该账户下有项目或者团队，请先解除关联");
            }
            await (project.updateAsync({
                "users.user":req.clientParam.id
            },{
                $pull:{
                    users:{
                        user:req.clientParam.id
                    }
                }
            }))
            await (teamGroup.updateAsync({
                "users.user":req.clientParam.id
            },{
                $pull:{
                    users:{
                        user:req.clientParam.id
                    }
                }
            }))
            await (docProject.updateAsync({
                "users":req.clientParam.id
            },{
                $pull:{
                    users:req.clientParam.id
                }
            }))
            await (user.removeAsync({
                _id:req.clientParam.id
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.projectStatistics=async ((req,res)=>{
        try
        {
            let obj={};
            obj.total=await (project.countAsync());
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            obj.today=await (project.countAsync({
                createdAt:{
                    $gt:date
                }
            }))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.projectList=async ((req,res)=>{
        try
        {
            let arr,query={},sort,type=req.clientParam.type;
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if(type==0)
            {
                query={
                    createdAt:{
                        $gt:date
                    }
                }
                sort="-createdAt";
            }
            else if(type==1)
            {
                query={
                    name:new RegExp(req.clientParam.key?req.clientParam.key:"","i")
                };
                sort="name";
            }
            arr=await (project.findAsync(query,null,{
                sort:sort,
                skip:10*req.clientParam.page,
                limit:10,
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }))
            arr=await (project.populateAsync(arr,{
                path:"team",
                select:"name"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.projectInfo=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            },"",{
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }));
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            else
            {
                obj=await (project.populateAsync(obj,{
                    path:"team",
                    select:"name"
                }))
                util.ok(res,obj,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.projectEdit=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAndUpdateAsync({
                _id:req.clientParam.id
            },{
                name:req.clientParam.name,
                dis:req.clientParam.dis,
                public:req.clientParam.public
            },{
                new:true
            }))
            if(obj)
            {
                util.ok(res,obj,"ok");
            }
            else
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.projectRemove=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await (interface.removeAsync({
                project:req.clientParam.id
            }));
            await (version.removeAsync({
                project:req.clientParam.id
            }));
            await (interfaceVersion.removeAsync({
                project:req.clientParam.id
            }));
            await (interfaceSnapshot.removeAsync({
                project:req.clientParam.id
            }));
            await (group.removeAsync({
                project:req.clientParam.id
            }))
            await (groupVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (status.removeAsync({
                project:req.clientParam.id
            }))
            await (statusVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (test.removeAsync({
                project:req.clientParam.id
            }))
            await (testVersion.removeAsync({
                project:req.clientParam.id
            }))
            let arrTestModule=await (testModule.findAsync({
                project:req.clientParam.id
            }))
            for(let obj of arrTestModule)
            {
                await (testGroup.removeAsync({
                    module:obj._id
                }))
            }
            arrTestModule=await (testModuleVersion.findAsync({
                project:req.clientParam.id
            }))
            for(let obj of arrTestModule)
            {
                await (testGroupVersion.removeAsync({
                    module:obj._id
                }))
            }
            await (testModule.removeAsync({
                project:req.clientParam.id
            }))
            await (testModuleVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (poll.removeAsync({
                project:req.clientParam.id
            }))
            await (template.removeAsync({
                project:req.clientParam.id
            }))
            await (example.removeAsync({
                project:req.clientParam.id
            }))
            await (project.removeAsync({
                _id:req.clientParam.id
            }))
            util.ok(res,"删除成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.teamStatistics=async ((req,res)=>{
        try
        {
            let obj={};
            obj.total=await (team.countAsync());
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            obj.today=await (team.countAsync({
                createdAt:{
                    $gt:date
                }
            }))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.teamList=async ((req,res)=>{
        try
        {
            let arr,query={},sort,type=req.clientParam.type;
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            if(type==0)
            {
                query={
                    createdAt:{
                        $gt:date
                    }
                }
                sort="-createdAt";
            }
            else if(type==1)
            {
                query={
                    name:new RegExp(req.clientParam.key?req.clientParam.key:"","i")
                };
                sort="name";
            }
            arr=await (team.findAsync(query,null,{
                sort:sort,
                skip:10*req.clientParam.page,
                limit:10,
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }))
            for(let obj of arr)
            {
                let arr1=await (teamGroup.findAsync({
                    team:obj._id
                }))
                let count=0;
                for(let o of arr1)
                {
                    count+=o.users.length;
                }
                obj._doc.userCount=count;
                obj._doc.projectCount=await (project.countAsync({
                    team:obj._id
                }))
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.teamInfo=async ((req,res)=>{
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id
            },"",{
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }));
            if(!obj)
            {
                util.throw(e.projectNotFound,"团队不存在");
            }
            else
            {
                util.ok(res,obj,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.teamRemove=async ((req,res)=>{
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id
            }));
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await (project.updateAsync({
                team:obj._id
            },{
                $unset:{
                    team:null
                }
            },{
                multi:true
            }));
            await (teamGroup.removeAsync({
                team:obj._id
            }))
            await (obj.removeAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.interfaceStatistics=async ((req,res)=>{
        try
        {
            let obj={};
            obj.total=await (interface.countAsync());
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            obj.today=await (interface.countAsync({
                createdAt:{
                    $gt:date
                }
            }))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.editPassword=async ((req,res)=>{
        try
        {
            if(req.adminInfo.password!=req.clientParam.old)
            {
                util.throw(e.passwordWrong,"原密码错误");
            }
            req.adminInfo.password=req.clientParam.password;
            await (req.adminInfo.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userProjectList=async ((req,res)=>{
        try
        {
             let ret={};
             let arrOwn=await (project.findAsync({
                 owner:req.clientParam.id
             },"",{
                 sort:"name",
                 populate:{
                     path:"team",
                     select:"name"
                 }
             }))
            for(let obj of arrOwn)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
             ret.own=arrOwn;
             let arrManage=await (project.findAsync({
                 users:{
                     $elemMatch:{
                         role:0,
                         user:req.clientParam.id
                     }
                 }
             },"",{
                 sort:"name",
                 populate:{
                     path:"team",
                     select:"name"
                 }
             }))
            arrManage=await (project.populateAsync(arrManage,{
                path:"owner",
                select:"name"
            }))
            for(let obj of arrManage)
            {
                obj._doc.role=0;
                obj._doc.userCount=obj.users.length+1;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
                for(let obj1 of obj.users)
                {
                    if(obj1.user.toString()==req.clientParam.id)
                    {
                        obj._doc.option=obj1.option
                        break;
                    }
                }
                delete obj._doc.users
            }
            let arrJoin=await (project.findAsync({
                users:{
                    $elemMatch:{
                        role:1,
                        user:req.clientParam.id
                    }
                }
            },"",{
                sort:"name",
                populate:{
                    path:"team",
                    select:"name"
                }
            }))
            arrJoin=await (project.populateAsync(arrJoin,{
                path:"owner",
                select:"name"
            }))
            for(let obj of arrJoin)
            {
                obj._doc.role=1;
                obj._doc.userCount=obj.users.length+1;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
                for(let obj1 of obj.users)
                {
                    if(obj1.user.toString()==req.clientParam.id)
                    {
                        obj._doc.option=obj1.option
                        break;
                    }
                }
                delete obj._doc.users
            }
            arrManage=arrManage.concat(arrJoin);
            ret.join=arrManage;
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userTeamList=async ((req,res)=>{
        try
        {
            let ret={};
            let arr=await (team.findAsync({
                owner:req.clientParam.id
            },"",{
                sort:"name",
                populate:{
                    path:"owner",
                    select:"name"
                }
            }))
            ret.own=arr;
            let arrTeam=[];
            let arrTemp=await (teamGroup.findAsync({
                users:{
                    $elemMatch:{
                        user:req.clientParam.id,
                        role:0
                    }
                }
            },"",{
                sort:"-createdAt"
            }))
            for(let obj of arrTemp)
            {
                if(arrTeam.indexOf(obj.team.toString())==-1)
                {
                    arrTeam.push(obj.team);
                }
            }
            arr=await (team.findAsync({
                _id:{
                    $in:arrTeam
                }
            },"",{
                sort:"name",
                populate:{
                    path:"owner",
                    select:"name"
                }
            }))
            for(let obj of arr)
            {
                obj._doc.role=0;
            }
            ret.join=arr;
            arrTemp=await (teamGroup.findAsync({
                users:{
                    $elemMatch:{
                        user:req.clientParam.id,
                        role:1
                    }
                }
            },"",{
                sort:"-createdAt"
            }))
            arrTeam=[];
            for(let obj of arrTemp)
            {
                if(arrTeam.indexOf(obj.team.toString())==-1)
                {
                    arrTeam.push(obj.team);
                }
            }
            arr=await (team.findAsync({
                _id:{
                    $in:arrTeam
                }
            },"",{
                sort:"name",
                populate:{
                    path:"owner",
                    select:"name"
                }
            }))
            for(let obj of arr)
            {
                obj._doc.role=1;
            }
            ret.join=ret.join.concat(arr);
            let arrRet=[ret.own,ret.join];
            for(let model of arrRet)
            {
                for(let obj of model)
                {
                    let arr=await (teamGroup.findAsync({
                        team:obj._id
                    }))
                    let count=0;
                    for(let o of arr)
                    {
                        count+=o.users.length;
                    }
                    obj._doc.userCount=count;
                    obj._doc.projectCount=await (project.countAsync({
                        team:obj._id
                    }))
                }
            }
            util.ok(res,ret,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userRemoveProject=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await (interface.removeAsync({
                project:req.clientParam.id
            }));
            await (version.removeAsync({
                project:req.clientParam.id
            }));
            await (interfaceVersion.removeAsync({
                project:req.clientParam.id
            }));
            await (interfaceSnapshot.removeAsync({
                project:req.clientParam.id
            }));
            await (group.removeAsync({
                project:req.clientParam.id
            }))
            await (groupVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (status.removeAsync({
                project:req.clientParam.id
            }))
            await (statusVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (test.removeAsync({
                project:req.clientParam.id
            }))
            await (testVersion.removeAsync({
                project:req.clientParam.id
            }))
            let arrTestModule=await (testModule.findAsync({
                project:req.clientParam.id
            }))
            for(let obj of arrTestModule)
            {
                await (testGroup.removeAsync({
                    module:obj._id
                }))
            }
            arrTestModule=await (testModuleVersion.findAsync({
                project:req.clientParam.id
            }))
            for(let obj of arrTestModule)
            {
                await (testGroupVersion.removeAsync({
                    module:obj._id
                }))
            }
            await (testModule.removeAsync({
                project:req.clientParam.id
            }))
            await (testModuleVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (poll.removeAsync({
                project:req.clientParam.id
            }))
            await (project.removeAsync({
                _id:req.clientParam.id
            }))
            util.ok(res,"删除成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userRemoveTeam=async ((req,res)=>{
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id
            }));
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await (project.updateAsync({
                team:obj._id
            },{
                $unset:{
                    team:null
                }
            },{
                multi:true
            }));
            await (teamGroup.removeAsync({
                team:obj._id
            }))
            await (obj.removeAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userTransferProject=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            req.obj=obj;
            obj=await (user.findOneAsync({
                name:req.clientParam.user
            }))
            if(!obj)
            {
                util.throw(e.userNotFound,"用户没有找到");
                return;
            }
            let bInTeam=false;
            if(req.obj.team)
            {
                let bIn=await (this.existUserInTeam(req.obj.team,obj._id));
                if(!bIn)
                {
                    util.throw(e.userNotInTeam,"用户不在团队里");
                }
                else
                {
                    bInTeam=true;
                }
            }
            let bFind=false;
            for(let o of req.obj.users)
            {
                if(o.user.toString()==obj._id.toString())
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                await (project.updateAsync({
                    _id:req.clientParam.id
                },{
                    owner:obj._id,
                    $pull:{
                        "users":{
                            user:obj._id
                        }
                    }
                }))
            }
            else
            {
                if(bInTeam || !req.obj.team)
                {
                    req.obj.owner=obj._id;
                    await (req.obj.saveAsync());
                }
                else
                {
                    util.throw(e.userNotInProject,"用户不在项目里");
                }
            }
            util.ok(res,obj,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userTransferTeam=async ((req,res)=>{
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.teamNotFound,"团队不存在");
                return;
            }
            req.team=obj;
            let u=await (user.findOneAsync({
                name:req.clientParam.user
            }));
            if(!u)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            let bExist=await (this.existUserInTeam(obj._id,u._id));
            if(!bExist)
            {
                util.throw(e.userNotInTeam,"用户不在团队内");
            }
            await (teamGroup.findOneAndUpdateAsync({
                team:req.clientParam.id,
                "users.user":req.team.owner
            },{
                "users.$.role":0
            }))
            await (teamGroup.findOneAndUpdateAsync({
                team:req.clientParam.id,
                "users.user":u._id
            },{
                "users.$.role":2
            }))
            req.team.owner=u._id;
            await (req.team.saveAsync());
            util.ok(res,u,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userQuitProject=async ((req,res)=>{
        try
        {
            let userInfo=await (user.findOneAsync({
                _id:req.clientParam.user
            }))
            if(!userInfo)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            }));
            if(obj.owner.toString()==req.clientParam.id)
            {
                util.throw(e.userForbidden,"创建的项目不能退出");
            }
            let index=-1;
            for(let i=0;i< obj.users.length;i++)
            {
                let u=obj.users[i];
                if(u.user.toString()==userInfo._id.toString())
                {
                    index=i;
                    break;
                }
            }
            if(index==-1)
            {
                util.throw(e.projectNotFound,"你已经不在该项目里了");
            }
            else
            {
                obj.users.splice(index,1);
                await (obj.saveAsync());
                util.ok(res,"退出成功");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userQuitTeam=async ((req,res)=>{
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.teamNotFound,"团队不存在");
                return;
            }
            req.team=obj;
            let arr=await (project.findAsync({
                team:req.team._id,
                owner:req.clientParam.user
            }))
            if(arr.length>0)
            {
                util.throw(e.userInProject,"用户仍然拥有团队的项目");
                return;
            }
            await (project.updateAsync({
                team:req.team._id,
                "users.user":req.clientParam.user
            },{
                $pull:{
                    users:{
                        user:req.clientParam.user
                    }
                }
            }, {
                multi: true
            }));
            await (teamGroup.updateAsync({
                team:req.team._id
            },{
                "$pull":{
                    "users":{
                        user:req.clientParam.user
                    }
                }
            },{
                multi:true
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.userTeamUser=async ((req,res)=>{
        try
        {
            let ret=await (teamGroup.findAsync({
                team:req.team._id
            },null,{
                sort:"name",
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.addProject=async ((req,res)=>{
        try
        {
            let update={
                name:req.clientParam.name
            };
            if(req.clientParam.dis)
            {
                update.dis=req.clientParam.dis;
            }
            update.owner=req.clientParam.owner;
            if(req.clientParam.public)
            {
                update.public=req.clientParam.public;
            }
            if(req.clientParam.users)
            {
                let users=JSON.parse(req.clientParam.users);
                update.users=users;
            }
            let obj=await (project.createAsync(update));
            let query={
                name:"未命名",
                project:obj._id,
                id:uuid()
            }
            await (group.createAsync(query))
            query={
                name:"#回收站",
                project:obj._id,
                type:1,
                id:uuid()
            }
            await (group.createAsync(query))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.setProjectUser=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            req.obj=obj;
            let objUser=JSON.parse(req.clientParam.users);
            for(let obj of objUser)
            {
                if(obj.user==req.obj.owner.toString())
                {
                    util.throw(e.userForbidden,"用户列表里还有拥有者");
                }
                else if(req.obj.team)
                {
                    let bExist=await (this.existUserInTeam(req.obj.team,obj.user));
                    if(!bExist)
                    {
                        util.throw(e.userNotInTeam,"用户不在团队内");
                    }
                }
            }
            req.obj.users=objUser;
            await (req.obj.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.addTeam=async ((req,res)=>{
        try
        {
            let u=await (user.findOneAsync({
                _id:req.clientParam.owner
            }))
            if(!u)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            let obj=await (team.createAsync({
                name:req.clientParam.name,
                dis:req.clientParam.dis,
                owner:req.clientParam.owner
            }));
            let objGroup=await (teamGroup.createAsync({
                name:"未命名",
                team:obj._id,
                users:[
                    {
                        user:req.clientParam.owner,
                        role:2
                    }
                ]
            }))
            if(req.clientParam.users)
            {
                let users=JSON.parse(req.clientParam.users);
                for(let obj of users)
                {
                    objGroup.users.push(obj);
                }
                await (teamGroup.updateAsync({
                    _id:objGroup._id
                },{
                    users:objGroup.users
                }))
            }
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.addTeamGroup=async ((req,res)=>{
        try
        {
            let obj;
            if(req.clientParam.group)
            {
                obj=await (teamGroup.findOneAndUpdateAsync({
                    _id:req.clientParam.group
                },{
                    name:req.clientParam.name
                },{
                    new:true
                }))
            }
            else
            {
                obj=await (teamGroup.createAsync({
                    name:req.clientParam.name,
                    team:req.clientParam.id
                }))
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.addTeamUser=async ((req,res)=>{
        try
        {
            let u=await (user.findOneAsync({
                name:req.clientParam.user
            }))
            if(!u)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            if(await (this.existUserInTeam(req.clientParam.id,u._id)))
            {
                util.throw(e.userAlreadyInTeam,"用户已经在团队里了");
            }
            else
            {
                await (teamGroup.findOneAndUpdateAsync({
                    _id:req.clientParam.group
                },{
                    $addToSet:{
                        users:{
                            user:u._id,
                            role:req.clientParam.role
                        }
                    }
                }))
                util.ok(res,{
                    user:u,
                    role:1
                },"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.removeTeamGroup=async ((req,res)=>{
        try
        {
            let obj=await (teamGroup.findOneAsync({
                _id:req.clientParam.group
            }));
            if(!obj)
            {
                util.throw(e.groupNotFound,"部门不存在");
            }
            else if(obj.users.length>0)
            {
                util.throw(e.teamGroupNotEmpty,"不能删除非空部门");
            }
            await (obj.removeAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.removeTeamUser=async ((req,res)=>{
        try
        {
            let arr=await (project.findAsync({
                team:req.clientParam.id,
                owner:req.clientParam.user
            }))
            if(arr.length>0)
            {
                util.throw(e.userInProject,"用户仍然拥有团队中的项目");
                return;
            }
            await (project.updateAsync({
                team:req.clientParam.id,
                "users.user":req.clientParam.user
            },{
                $pull:{
                    users:{
                        user:req.clientParam.user
                    }
                }
            },{
                multi:true
            }))
            await (teamGroup.updateAsync({
                team:req.clientParam.id
            },{
                "$pull":{
                    "users":{
                        user:req.clientParam.user
                    }
                }
            },{
                multi:true
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.pullTeamProject=async ((req,res)=>{
        try
        {
            let objProject=await (project.findOneAsync({
                _id:req.clientParam.project
            },"",{
                populate:{
                    path:"owner",
                    select:"name"
                }
            }))
            if(!objProject)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            let objTeam=await (team.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!objTeam)
            {
                util.throw(e.projectNotFound,"团队不存在");
                return;
            }
            let arrTeamUser=await (this.teamUserList(objTeam._id));
            let arrProjectUser=objProject.users.map(function (obj) {
                return obj.user.toString();
            });
            arrProjectUser.push(objProject.owner._id.toString());
            let arr=[];
            for(let o of arrProjectUser)
            {
                if(arrTeamUser.indexOf(o)==-1)
                {
                    arr.push(o);
                }
            }
            if(arr.length>0)
            {
                arr=arr.map(function (obj) {
                    return {
                        user:obj,
                        role:1
                    }
                })
                let objGroup=await (teamGroup.findOneAndUpdateAsync({
                    name:"未命名",
                    team:objTeam._id
                },{
                    name:"未命名",
                    team:objTeam._id,
                    $addToSet:{
                        users:{
                            $each:arr
                        }
                    }
                },{
                    upsert:true,
                    setDefaultsOnInsert:true
                }))
            }
            objProject.team=objTeam._id;
            await (objProject.saveAsync());
            objProject._doc.userCount=objProject.users.length+1;
            delete objProject._doc.users;
            objProject._doc.interfaceCount=await (interface.countAsync({
                project:objProject._id
            }))
            util.ok(res,objProject,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.pushTeamProject=async ((req,res)=>{
        try
        {
            let obj=await (project.findOneAndUpdateAsync({
                _id:req.clientParam.project,
                team:req.clientParam.id
            },{
                $unset:{
                    team:null
                }
            }))
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.setTeamUserRole=async ((req,res)=>{
        try
        {
            let objTeam=await (team.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!objTeam)
            {
                util.throw(e.projectNotFound,"团队不存在");
                return;
            }
            req.team=objTeam;
            await (teamGroup.updateAsync({
                team:req.team._id,
                "users.user":req.clientParam.user
            },{
                "users.$.role":req.clientParam.role
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.setProjectUserRole=async ((req,res)=>{
        try
        {
            let objProject=await (project.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!objProject)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            let u=await (user.findOneAsync({
                [objectId.isValid(req.clientParam.user)?"_id":"name"]:req.clientParam.user
            }));
            if(!u)
            {
                util.throw(e.userNotFound,"用户不存在");
                return;
            }
            if(objProject.owner.toString()==u._id.toString())
            {
                util.throw(e.systemReason,"用户已经是所有者了");
                return;
            }
            let bIn=false;
            for(let obj of objProject.users)
            {
                if(obj.user.toString()==u._id.toString())
                {
                    bIn=true;
                    break;
                }
            }
            if(bIn)
            {
                let update={
                    "users.$.role":req.clientParam.role
                }
                if(req.clientParam.option)
                {
                    update["users.$.option"]=JSON.parse(req.clientParam.option);
                }
                else
                {
                    update["$unset"]={
                        "users.$.option":1
                    }

                }
                await (project.findOneAndUpdateAsync({
                    _id:req.clientParam.id,
                    "users.user":u._id
                },update))
            }
            else
            {
                let update={
                    user:u._id,
                    role:req.clientParam.role
                }
                if(req.clientParam.option)
                {
                    update.option=JSON.parse(req.clientParam.option);
                }
                await (project.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },{
                    $addToSet:{
                        users:update
                    }
                }))
                if(objProject.team)
                {
                    let bExist=await (this.existUserInTeam(objProject.team,u._id));
                    if(!bExist)
                    {
                        let objGroup=await (teamGroup.findOneAndUpdateAsync({
                            name:"未命名",
                            team:objProject.team
                        },{
                            name:"未命名",
                            team:objProject.team,
                            $addToSet:{
                                users:{
                                    user:u._id,
                                    role:0
                                }
                            }
                        },{
                            upsert:true,
                            setDefaultsOnInsert:true
                        }))
                    }
                }
                let ret={
                    user:u,
                    role:req.clientParam.role
                };
                if(req.clientParam.option)
                {
                    ret.option=JSON.parse(req.clientParam.option)
                }
                util.ok(res,ret,"ok");
            }
            util.ok(res,"ok");
            return;
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.removeProjectUser=async ((req,res)=>{
        try
        {
            let objProject=await (project.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!objProject)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            await (project.findOneAndUpdateAsync({
                _id:req.clientParam.id
            },{
                $pull:{
                    users:{
                        user:req.clientParam.user
                    }
                }
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.searchUser=async ((req,res)=>{
        try
        {
            let reg=new RegExp("^"+req.clientParam.user,"i");
            let arr=await (user.findAsync({
                name:reg
            },"name",{
                sort:"name",
                limit:20
            }))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.projectUserList=async ((req,res)=>{
        try
        {
            let objProject=await (project.findOneAsync({
                _id:req.clientParam.id
            },null,{
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            if(!objProject)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            util.ok(res,objProject.users,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.editTeam=async ((req,res)=>{
        try
        {
            let objTeam=await (team.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!objTeam)
            {
                util.throw(e.projectNotFound,"团队不存在");
                return;
            }
            objTeam.name=req.clientParam.name;
            if(req.clientParam.dis!==undefined)
            {
                objTeam.dis=req.clientParam.dis
            }
            await (objTeam.saveAsync());
            util.ok(res,objTeam,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.moveTeamUser=async ((req,res)=>{
        try
        {
            let obj=await (teamGroup.findOneAndUpdateAsync({
                team:req.clientParam.id,
                "users.user":req.clientParam.user
            },{
                $pull:{
                    "users":{
                        user:req.clientParam.user
                    }
                }
            }));
            if(!obj)
            {
                util.throw(e.userNotInTeam,"用户不在团队内");
            }
            let role;
            for(let o of obj.users)
            {
                if(o.user.toString()==req.clientParam.user)
                {
                    role=o.role;
                    break;
                }
            }
            let update={
                user:req.clientParam.user,
                role:role
            };
            obj=await (teamGroup.findOneAndUpdateAsync({
                _id:req.clientParam.group
            },{
                $addToSet:{
                    users:update
                }
            }));
            if(!obj)
            {
                util.throw(e.groupNotFound,"部门不存在");
            }
            update.user=await (user.findOneAsync({
                _id:update.user
            },"name photo"))
            util.ok(res,update,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.getTeamUserList=async ((req,res)=>{
        try
        {
            let arrUser=await (teamGroup.findAsync({
                team:req.clientParam.id
            },"",{
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            let arr=[];
            arrUser.forEach(function (obj) {
                arr.push({
                    users:obj.users,
                    _id:obj._id,
                    name:obj.name
                })
            })
            util.ok(res,arr,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.teamProjectList=async ((req,res)=>{
        try
        {
            let arr=await (project.findAsync({
                team:req.clientParam.id
            },null,{
                populate:{
                    path:"owner",
                    select:"name"
                },
                sort:"name"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
            util.ok(res,arr,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.statisticList=async ((req,res)=>{
        try
        {
            let arr=await (statistic.findAsync({
                date:{
                    $gte:req.clientParam.start,
                    $lte:req.clientParam.end
                }
            },null,{
                sort:"-date"
            }))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.getSetting=async ((req,res)=>{
        try
        {
            let ret={};
            let objInfo=await (info.findOneAsync());
            ret.info={
                version:objInfo.version,
                register:objInfo.register
            }
            ret.connect={
                db:config.db,
                filePath:config.filePath,
                port:config.port
            };
            ret.db=objInfo.db;
            ret.files=[];
            if(objInfo.db.backPath)
            {
                ret.files=await (fs.readdirAsync(objInfo.db.backPath))
                ret.files=ret.files.filter(function (obj) {
                    if(obj.indexOf("@")>-1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                ret.files.sort(function (obj1,obj2) {
                    if(obj1>obj2)
                    {
                        return -1
                    }
                    else if(obj1<obj2)
                    {
                        return 1
                    }
                    else
                    {
                        return 0;
                    }
                })
                ret.files=ret.files.slice(0,10);
            }
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.setBasicInfo=async ((req,res)=>{
        try
        {
            let obj=await (info.findOneAsync());
            obj.register=req.clientParam.register;
            await (obj.saveAsync());
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.setConnectInfo=async ((req,res)=>{
        try
        {
            let obj={
                db:req.clientParam.db,
                filePath:req.clientParam.file,
                port:req.clientParam.port
            }
            await (fs.writeFileAsync(path.join(__dirname,"../../../config.json"),JSON.stringify(obj)));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.backup=async ((req,res)=>{
        try
        {
            let obj=await (info.findOneAsync());
            obj.db={
                dbPath:req.clientParam.dbpath,
                backPath:req.clientParam.backpath,
                hours:JSON.parse(req.clientParam.hours),
                host:req.clientParam.host,
                name:req.clientParam.name
            }
            if(req.clientParam.user)
            {
                obj.db.user=req.clientParam.user;
                obj.db.pass=req.clientParam.pass;
                obj.db.authDb=req.clientParam.authdb;
            }
            await (obj.saveAsync());
            if(req.clientParam.immediate)
            {
                await (util.backup(obj.db,obj.version))
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.restore=async ((req,res)=>{
        try
        {
            let obj=await (info.findOneAsync());
            await (util.restore(obj.db,req.clientParam.id))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.backupList=async ((req,res)=>{
        try
        {
            let ret=[];
            let objInfo=await (info.findOneAsync());
            if(objInfo.db.backPath)
            {
                ret=await (fs.readdirAsync(objInfo.db.backPath))
                ret=ret.filter(function (obj) {
                    if(obj.indexOf("@")>-1)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                ret.sort(function (obj1,obj2) {
                    if(obj1>obj2)
                    {
                        return -1
                    }
                    else if(obj1<obj2)
                    {
                        return 1
                    }
                    else
                    {
                        return 0;
                    }
                })
                ret=ret.slice(req.clientParam.page*10,10);
            }
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.removeBackup=async ((req,res)=>{
        try
        {
            let objInfo=await (info.findOneAsync());
            let backPath=path.join(objInfo.db.backPath,req.clientParam.id);
            if(fs.existsSync(backPath))
            {
                util.removeFolder(backPath);
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
}
module.exports=Admin;










