var e=require("../../util/error.json");
var util=require("../../util/util");
var blue=require("bluebird");
var fs=blue.promisifyAll(require("fs"));
var config=require("../../../config.json")
var admin=require("../../model/adminModel")
var uuid=require("uuid");
var path=require("path");
var objectId = require('mongoose').Types.ObjectId;
function Admin()
{
    this.admin=require("./common");
    this.login=async (req,res)=>{
        try
        {
            let obj=await (this.admin.handleLogin(req.clientParam.name,req.clientParam.password))
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
    }
    this.logout=async (req,res)=>{
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
    }
    this.userStatistics=async (req,res)=>{
        try
        {
            let obj=await (this.admin.userStatistics());
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userList=async (req,res)=>{
        try
        {
            let arr=await (this.admin.userList(req.clientParam.type,req.clientParam.key,req.clientParam.page))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userInfo=async (req,res)=>{
        try
        {
            let obj=await (this.admin.getUserInfo(req.clientParam.id))
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
    }
    this.userCreate=async (req,res)=>{
        try
        {
            let obj=await (this.admin.userCreate());
            if(obj)
            {
                util.ok(res,obj,"ok");
            }
            else
            {
                util.ok(res,"ok");
            }

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userRemove=async (req,res)=>{
        try
        {
            await (this.admin.userRemove(req.clientParam.id));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectStatistics=async (req,res)=>{
        try
        {
            let obj=await (this.admin.projectStatistics());
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectList=async (req,res)=>{
        try
        {
            let arr=await (this.admin.projectList(req.clientParam.type,req.clientParam.key,req.clientParam.page,req.clientParam.category))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectInfo=async (req,res)=>{
        try
        {
            let obj=await (this.admin.projectInfo(req.clientParam.id,req.clientParam.category));
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectEdit=async (req,res)=>{
        try
        {
            let obj=await (this.admin.projectEdit(req.clientParam.id,req.clientParam.name,req.clientParam.dis,req.clientParam.public,req.clientParam.category));
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectRemove=async (req,res)=>{
        try
        {
            await (this.admin.projectRemove(req.clientParam.id,req.clientParam.category));
            util.ok(res,"删除成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.teamStatistics=async (req,res)=>{
        try
        {
            let obj=await (this.admin.teamStatistics());
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.teamList=async (req,res)=>{
        try
        {
            let arr=await (this.admin.teamList(req.clientParam.type,req.clientParam.key,req.clientParam.page));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.teamInfo=async (req,res)=>{
        try
        {
            let obj=await (this.admin.teamInfo(req.clientParam.id));
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.teamRemove=async (req,res)=>{
        try
        {
            await (this.admin.teamRemove(req.clientParam.id));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceStatistics=async (req,res)=>{
        try
        {
            let obj=await (this.admin.interfaceStatistics());
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.editPassword=async (req,res)=>{
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
    }
    this.userProjectList=async (req,res)=>{
        try
        {
            let ret=await (this.admin.userProjectList(req.clientParam.id));
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userTeamList=async (req,res)=>{
        try
        {
            let ret=await (this.admin.userTeamList(req.clientParam.id));
            util.ok(res,ret,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userRemoveProject=async (req,res)=>{
        try
        {
            await (this.admin.userRemoveProject(req.clientParam.id));
            util.ok(res,"删除成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userRemoveTeam=async (req,res)=>{
        try
        {
            await (this.admin.userRemoveTeam(req.clientParam.id));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userTransferProject=async (req,res)=>{
        try
        {
            let obj=await (this.admin.userTransferProject(req.clientParam.id,req.clientParam.user,req.clientParam.category));
            util.ok(res,obj,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userTransferTeam=async (req,res)=>{
        try
        {
            let u=await (this.admin.userTransferTeam(req.clientParam.id,req.clientParam.user))
            util.ok(res,u,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userQuitProject=async (req,res)=>{
        try
        {
            await (this.admin.userQuitProject(req.clientParam.id,req.clientParam.user));
            util.ok(res,"退出成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userQuitTeam=async (req,res)=>{
        try
        {
            await (this.admin.userQuitTeam(req.clientParam.id,req.clientParam.user));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.addProject=async (req,res)=>{
        try
        {
            await (this.admin.addProject(req.clientParam.name,req.clientParam.dis,req.clientParam.owner,req.clientParam.public,req.clientParam.users,req.clientParam.category))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setProjectUser=async (req,res)=>{
        try
        {
            await (this.admin.setProjectUser(req.clientParam.id,req.clientParam.users,req.clientParam.category));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.addTeam=async (req,res)=>{
        try
        {
            await (this.admin.addTeam(req.clientParam.owner,req.clientParam.name,req.clientParam.dis,req.clientParam.users))
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.addTeamGroup=async (req,res)=>{
        try
        {
            let obj=await (this.admin.addTeamGroup(req.clientParam.id,req.clientParam.group,req.clientParam.name));
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.addTeamUser=async (req,res)=>{
        try
        {
            let u=await (this.admin.addTeamUser(req.clientParam.id,req.clientParam.user,req.clientParam.group,req.clientParam.role));
            util.ok(res,{
                user:u,
                role:1
            },"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeTeamGroup=async (req,res)=>{
        try
        {
            await (this.admin.removeTeamGroup(req.clientParam.group))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeTeamUser=async (req,res)=>{
        try
        {
            await (this.admin.removeTeamUser(req.clientParam.id,req.clientParam.user));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.pullTeamProject=async (req,res)=>{
        try
        {
            let objProject=await (this.admin.pullTeamProject(req.clientParam.id,req.clientParam.project,req.clientParam.category))
            util.ok(res,objProject,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.pushTeamProject=async (req,res)=>{
        try
        {
            await (this.admin.pushTeamProject(req.clientParam.id,req.clientParam.project,req.clientParam.category))
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setTeamUserRole=async (req,res)=>{
        try
        {
            await (this.admin.setTeamUserRole(req.clientParam.id,req.clientParam.user,req.clientParam.role))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setProjectUserRole=async (req,res)=>{
        try
        {
            let ret=await (this.admin.setProjectUserRole(req.clientParam.id,req.clientParam.user,req.clientParam.role,req.clientParam.option,req.clientParam.category))
            if(ret)
            {
                util.ok(res,ret,"ok");
            }
            else
            {
                util.ok(res,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeProjectUser=async (req,res)=>{
        try
        {
            await (this.admin.removeProjectUser(req.clientParam.id,req.clientParam.user,req.clientParam.category));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.searchUser=async (req,res)=>{
        try
        {
            let arr=await (this.admin.searchUser(req.clientParam.user));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectUserList=async (req,res)=>{
        try
        {
            let objProject=await (this.admin.projectUserList(req.clientParam.id,req.clientParam.category));
            util.ok(res,objProject.users,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.editTeam=async (req,res)=>{
        try
        {
            let objTeam=await (this.admin.editTeam(req.clientParam.id,req.clientParam.name,req.clientParam.dis));
            util.ok(res,objTeam,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.moveTeamUser=async (req,res)=>{
        try
        {
            let update=await (this.admin.moveTeamUser(req.clientParam.id,req.clientParam.user,req.clientParam.group));
            util.ok(res,update,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getTeamUserList=async (req,res)=>{
        try
        {
            let arr=await (this.admin.getTeamUserList(req.clientParam.id));
            util.ok(res,arr,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.teamProjectList=async (req,res)=>{
        try
        {
            let arr=await (this.admin.teamProjectList(req.clientParam.id));
            util.ok(res,arr,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.statisticList=async (req,res)=>{
        try
        {
            let arr=await (this.admin.statisticList(req.clientParam.start,req.clientParam.end));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getSetting=async (req,res)=>{
        try
        {
            let ret=await (this.admin.getSetting());
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setBasicInfo=async (req,res)=>{
        try
        {
            await (this.admin.setBasicInfo(req.clientParam.register));
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setConnectInfo=async (req,res)=>{
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
    }
    this.backup=async (req,res)=>{
        try
        {
            await (this.admin.backup(req.clientParam.dbpath,req.clientParam.backpath,req.clientParam.hours,req.clientParam.host,req.clientParam.name,req.clientParam.user,req.clientParam.pass,req.clientParam.authdb,req.clientParam.immediate))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.restore=async (req,res)=>{
        try
        {
            await (this.admin.restore(req.clientParam.id));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.backupList=async (req,res)=>{
        try
        {
            let ret=await (this.admin.backupList(req.clientParam.page));
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeBackup=async (req,res)=>{
        try
        {
            await (this.admin.removeBackup(req.clientParam.id));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}
module.exports=Admin;










