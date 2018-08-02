

var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var group=require("../../model/groupModel")
var project=require("../../model/projectModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var article=require("../../model/articleModel")
var docGroup=require("../../model/docGroupModel")
var doc=require("../../model/docModel")
var docProject=require("../../model/docProjectModel")
var example=require("../../model/exampleModel")
var groupVersion=require("../../model/groupVersionModel")
var interface=require("../../model/interfaceModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var poll=require("../../model/pollModel")
var status=require("../../model/statusModel")
var statusVersion=require("../../model/statusVersionModel")
var template=require("../../model/templateModel")
var testCollection=require("../../model/testCollectionModel")
var testGroup=require("../../model/testGroupModel")
var test=require("../../model/testModel")
var testModule=require("../../model/testModuleModel")
var testProject=require("../../model/testProjectModel")
var version=require("../../model/versionModel")
// var globalModel={
//     group,
//     project,
//     team,
//     doc,
//     docGroup,
//     docProject,
//     interface,
//     poll,
//     testCollection,
//     test,
//     testProject,
//     testModule,
//     testGroup
// }

function Command() {
    this.validateProject=async (userId,projectId)=>{
        let obj=await (project.findOneAsync({
            _id:projectId,
            $or:[
                {
                    owner:userId
                },
                {
                    "users.user":userId
                }
            ]
        }))
        if(!obj)
        {
            obj=await (project.findOneAsync({
                _id:projectId
            }));
            if(!obj)
            {
                return false;
            }
            if(obj.team)
            {
                let arrUser=await (teamGroup.findAsync({
                    team:obj.team,
                    "users.user":userId
                }))
                if(arrUser.length==0)
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return true;
        }
    }
    this.validateTeam=async (userId,teamId)=>{
        let obj=await (team.findOneAsync({
            _id:teamId,
            owner:userId
        }))
        if(!obj)
        {
            let arr=await (teamGroup.findAsync({
                team:teamId,
                "users.user":userId
            }))
            if(arr.length==0)
            {
                return false
            }
            else
            {
                obj=await (team.findOneAsync({
                    _id:arr[0].team
                }))
            }
        }
        return true;
    }
    this.validateDoc=async (userId,projectId)=>{
        let obj=await (docProject.findOneAsync({
            _id:projectId,
            $or:[
                {
                    owner:userId
                },
                {
                    "users.user":userId
                }
            ]
        }))
        if(!obj)
        {
            obj=await (docProject.findOneAsync({
                _id:projectId
            }));
            if(!obj)
            {
                return false;
            }
            if(obj.team)
            {
                let arrUser=await (teamGroup.findAsync({
                    team:obj.team,
                    "users.user":userId
                }))
                if(arrUser.length==0)
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return true;
        }
    }
    this.validateTest=async (userId,projectId)=>{
        let obj=await (testProject.findOneAsync({
            _id:projectId,
            $or:[
                {
                    owner:userId
                },
                {
                    "users.user":userId
                }
            ]
        }))
        if(!obj)
        {
            obj=await (testProject.findOneAsync({
                _id:projectId
            }));
            if(!obj)
            {
                return false;
            }
            if(obj.team)
            {
                let arrUser=await (teamGroup.findAsync({
                    team:obj.team,
                    "users.user":userId
                }))
                if(arrUser.length==0)
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return true;
        }
    }
    this.group=async (req,res)=>{
        try
        {
            let bRet=await (this.validateProject(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (group.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.groupList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateProject(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (group.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.project=async (req,res)=>{
        try
        {

            let obj=await (project.findOneAsync(req.clientParam.query?req.clientParam.query:{},req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            let bRet=await (this.validateProject(req.userInfo._id,obj._id));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.team=async (req,res)=>{
        try
        {
            let obj=await (team.findOneAsync(req.clientParam.query?req.clientParam.query:{},req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            if(!obj)
            {
                util.throw(e.teamNotFound,"项目不存在");
            }
            let bRet=await (this.validateTeam(req.userInfo._id,obj._id));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.doc=async (req,res)=>{
        try
        {
            let bRet=await (this.validateDoc(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (doc.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateDoc(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (doc.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docProject=async (req,res)=>{
        try
        {
            let obj=await (docProject.findOneAsync(req.clientParam.query?req.clientParam.query:{},req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            if(!obj)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
            }
            let bRet=await (this.validateDoc(req.userInfo._id,obj._id));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docGroup=async (req,res)=>{
        try
        {
            let bRet=await (this.validateDoc(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (docGroup.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docGroupList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateDoc(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (docGroup.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interface=async (req,res)=>{
        try
        {
            let bRet=await (this.validateProject(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (interface.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateProject(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (interface.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.poll=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (poll.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.pollList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (poll.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.collection=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (testCollection.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.collectionList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (testCollection.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testProject=async (req,res)=>{
        try
        {
            let obj=await (testProject.findOneAsync(req.clientParam.query?req.clientParam.query:{},req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            if(!obj)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
            }
            let bRet=await (this.validateTeam(req.userInfo._id,obj._id));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testModule=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (testModule.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testModuleList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (testModule.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testGroup=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (testGroup.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testGroupList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (testGroup.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.test=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (test.findOneAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testList=async (req,res)=>{
        try
        {
            let bRet=await (this.validateTeam(req.userInfo._id,req.clientParam.project));
            if(!bRet)
            {
                util.throw(e.userForbidden,"没有权限！");
            }
            if(req.clientParam.query)
            {
                req.clientParam.query.project=req.clientParam.project
            }
            else
            {
                req.clientParam.query={
                    project:req.clientParam.project
                }
            }
            let obj=await (test.findAsync(req.clientParam.query,req.clientParam.select?req.clientParam.query:"",req.clientParam.option?req.clientParam.option:{}))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}

module.exports=Command;










