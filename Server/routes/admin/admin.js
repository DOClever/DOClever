var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var fs=require("fs");
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
function Admin()
{
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
                $or:[
                    {
                        owner:req.clientParam.id
                    },
                    {
                        "users.user":req.clientParam.id
                    }
                ]
            }));
            let arrTeam=await (teamGroup.findAsync({
                "users.user":req.clientParam.id
            }))
            if(arrProject.length>0 || arrTeam.length>0)
            {
                util.throw(e.systemReason,"该账户与项目团队有关联，暂不能删除");
            }
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
}
module.exports=Admin;










