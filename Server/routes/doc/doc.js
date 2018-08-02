

var pdf = require('html-pdf');
var md = require('markdown-it')();
var con=require("../../../config.json")
var path=require("path");
var dom = require("jsdom").JSDOM;
var window=(new dom(`...`)).window;
var document=window.document;
var e=require("../../util/error.json");
var util=require("../../util/util");
var docProject=require("../../model/docProjectModel");
var docGroup=require("../../model/docGroupModel");
var doc=require("../../model/docModel");
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var project=require("../../model/projectModel")
var version=require("../../model/versionModel")
var group=require("../../model/groupModel")
var groupVersion=require("../../model/groupVersionModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var interface=require("../../model/interfaceModel")
var user=require("../../model/userModel")
var apply=require("../../model/applyModel")
var message=require("../../model/messageModel")
var status=require("../../model/statusModel")
var statusVersion=require("../../model/statusVersionModel")
function Doc()
{
    this.teamUserList=async (teamId)=> {
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
    }
    this.existUserInTeam=async (teamId,userId)=>{
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
    }
    this.saveProject=async (req,res)=>{
        try
        {
            let query={
                name:req.clientParam.name,
                dis:req.clientParam.dis?req.clientParam.dis:""
            }
            let obj;
            if(req.clientParam.project)
            {
                if(req.clientParam.team)
                {
                    query.team=req.clientParam.team;
                    query.publicTeam=req.clientParam.publicteam;
                }
                else
                {
                    query["$unset"]={
                        team:1
                    }
                }
                query.public=req.clientParam.public;
                obj=await (docProject.findOneAndUpdateAsync({
                    _id:req.clientParam.project
                },query,{
                    new:true
                }))
            }
            else
            {
                query.owner=req.userInfo._id;
                query.totalSize=10*1024*1024;
                if(req.clientParam.team)
                {
                    query.team=req.clientParam.team;
                }
                obj=await (docProject.createAsync(query));
                obj._doc.userCount=1;
                obj._doc.docCount=0;
                obj._doc.own=1;
                obj._doc.role=0;
            }
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
            let ret={}
            let arr=await (docProject.findAsync({
                owner:req.userInfo._id,
                team:{
                    $exists:false
                },
            },null,{
                sort:"-createdAt"
            }));
            for(let o of arr)
            {
                o._doc.own=1;
                o._doc.role=0;
                o._doc.docCount=await (doc.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            ret.create=arr;
            arr=await (docProject.findAsync({
                users:req.userInfo._id,
                team:{
                    $exists:false
                },
            },null,{
                sort:"-createdAt"
            }));
            for(let o of arr)
            {
                o._doc.role=0;
                o._doc.docCount=await (doc.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            ret.join=arr;
            arr=await (docProject.findAsync({
                public:1,
                $or:[
                    {
                        team:{
                            $exists:true
                        },
                    },
                    {
                        owner:{
                            $ne:req.userInfo._id
                        },
                        users:{
                            $ne:req.userInfo._id
                        },
                        team:{
                            $exists:false
                        },
                    }
                ]
            },null,{
                sort:"-createdAt"
            }));
            for(let o of arr)
            {
                o._doc.role=1;
                o._doc.docCount=await (doc.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            ret.public=arr;
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectInfo=async (req,res)=>{
        try
        {
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            },null,{
                populate:{
                    path:"users",
                    select:"name photo"
                }
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目没有找到");
            }
            objProject=await (docProject.populateAsync(objProject,{
                path:"owner",
                select:"name photo"
            }))
            util.ok(res,objProject,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeProject=async (req,res)=>{
        try
        {
            let arrDoc=await (doc.findAsync({
                project:req.clientParam.project
            },"-content"));
            for(let obj of arrDoc)
            {
                obj.img.forEach(function (obj) {
                    util.delImg(obj)
                })
                obj.file.forEach(function (obj) {
                    util.delImg(obj)
                })
            }
            await (doc.removeAsync({
                project:req.clientParam.project
            }))
            await (docGroup.removeAsync({
                project:req.clientParam.project
            }))
            await (docProject.removeAsync({
                _id:req.clientParam.project
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.saveGroup=async (req,res)=>{
        try
        {
            let query={
                name:req.clientParam.name,
                project:req.clientParam.project
            };
            let obj;
            if(req.clientParam.group)
            {
                if(req.clientParam.parent)
                {
                    query.parent=req.clientParam.parent
                }
                else
                {
                    query["$unset"]={
                        parent:1
                    }
                }
                obj=await (docGroup.findOneAndUpdateAsync({
                    _id:req.clientParam.group
                },query,{
                    new:true
                }))
            }
            else
            {
                if(req.clientParam.parent)
                {
                    query.parent=req.clientParam.parent
                }
                obj=await (docGroup.createAsync(query));
                if(req.clientParam.parent)
                {
                    await (docGroup.findOneAndUpdateAsync({
                        _id:req.clientParam.parent
                    },{
                        $addToSet:{
                            childGroup:obj._id
                        }
                    }))
                }
                else
                {
                    await (docProject.findOneAndUpdateAsync({
                        _id:req.clientParam.project
                    },{
                        $addToSet:{
                            childGroup:obj._id
                        }
                    }))
                }
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeGroup=async (req,res)=>{
        try
        {
            let objGroup=await (docGroup.findOneAsync({
                _id:req.clientParam.group
            }))
            if(!objGroup)
            {
                util.throw(e.docGroupNotFound,"分组没有找到");
            }
            if(objGroup.parent)
            {
                await (docGroup.findOneAndUpdateAsync({
                    _id:objGroup.parent
                },{
                    $pull:{
                        childGroup:objGroup._id
                    }
                }))
            }
            let size=0;
            let __map=async function (obj) {
                if(obj.childGroup && obj.childGroup.length>0)
                {
                    let arrGroup=await (docGroup.findAsync({
                        _id:{
                            $in:obj.childGroup
                        }
                    }))
                    for(let i=0;i<arrGroup.length;i++)
                    {
                        await (__map(arrGroup[i]));
                    }
                }
                if(obj.childDoc && obj.childDoc.length>0)
                {
                    let arrDoc=await (doc.findAsync({
                        _id:{
                            $in:obj.childDoc
                        }
                    },"-content -interface"))
                    for(let obj of arrDoc)
                    {
                        for(let o of obj.img)
                        {
                            size+=(await (util.getFileSize(o)));
                            util.delImg(o)
                        }
                        for(let o of obj.file)
                        {
                            size+=(await (util.getFileSize(o)));
                            util.delImg(o)
                        }
                        await (obj.removeAsync());
                    }
                }
                await (obj.removeAsync());
            }
            await (__map(objGroup));
            let obj=await (docProject.findOneAndUpdateAsync({
                _id:objGroup.project
            },{
                $inc:{
                    useSize:-size
                }
            },{
                new:true
            }))
            util.ok(res,obj.useSize,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.saveDoc=async (req,res)=>{
        try
        {
            let objGroup=await (docGroup.findOneAsync({
                _id:req.clientParam.group
            }))
            if(!objGroup)
            {
                util.throw(e.docGroupNotFound,"分组没有找到");
            }
            let query={
                name:req.clientParam.name,
                group:req.clientParam.group,
                project:req.clientParam.project
            }
            let obj;
            if(req.clientParam.id)
            {
                query.editor=req.userInfo._id;
                obj=await (doc.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },query,{
                    new:true
                }))
            }
            else
            {
                query.owner=req.userInfo._id;
                query.editor=req.userInfo._id;
                obj=await (doc.createAsync(query));
                objGroup.childDoc.push(obj._id);
                await (objGroup.saveAsync());
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docInfo=async (req,res)=>{
        try
        {
            let obj=await (doc.findOneAsync({
                _id:req.clientParam.id
            },null,{
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }))
            if(!obj)
            {
                util.throw(e.docNotFound,"文档不存在");
            }
            obj=await (doc.populateAsync(obj,{
                path:"editor",
                select:"name photo"
            }));
            obj=await (doc.populateAsync(obj,{
                path:"project",
                select:"name team",
                populate:{
                    path:"team",
                    select:"name"
                }
            }));
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeDoc=async (req,res)=>{
        try
        {
            let obj=await (doc.findOneAsync({
                _id:req.clientParam.id
            }))
            if(!obj)
            {
                util.throw(e.docNotFound,"文档不存在");
            }
            await (docGroup.findOneAndUpdateAsync({
                _id:obj.group
            },{
                $pull:{
                    childDoc:obj._id
                }
            }))
            let size=0;
            for(let o of obj.img)
            {
                size+=(await (util.getFileSize(o)));
                util.delImg(o)
            }
            for(let o of obj.file)
            {
                size+=(await (util.getFileSize(o)));
                util.delImg(o)
            }
            await (obj.removeAsync());
            obj=await (docProject.findOneAndUpdateAsync({
                _id:obj.project
            },{
                $inc:{
                    useSize:-size
                }
            },{
                new:true
            }))
            util.ok(res,obj.useSize,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.moveGroup=async (req,res)=>{
        try
        {
            let obj=await (docGroup.findOneAsync({
                _id:req.clientParam.group
            }));
            if(!obj)
            {
                util.throw(e.docGroupNotFound,"分组没有找到");
            }
            let objFrom,objTo;
            if(obj.parent)
            {
                objFrom=await (docGroup.findOneAsync({
                    _id:obj.parent
                }));
            }
            else
            {
                objFrom=await (docProject.findOneAsync({
                    _id:obj.project
                }));
            }
            if(req.clientParam.to)
            {
                objTo=await (docGroup.findOneAsync({
                    _id:req.clientParam.to
                }));
                if(!objTo)
                {
                    util.throw(e.docGroupNotFound,"分组没有找到");
                }
            }
            else
            {
                objTo=await (docProject.findOneAsync({
                    _id:obj.project
                }));
                if(!objTo)
                {
                    util.throw(e.docProjectNotFound,"项目没有找到");
                }
            }
            let index;
            objFrom.childGroup.forEach(function (obj,i) {
                if(obj.toString()==req.clientParam.group)
                {
                    index=i;
                }
            })
            if(objFrom._id.toString()==objTo._id.toString())
            {
                let obj1=objFrom.childGroup[req.clientParam.index];
                objFrom.childGroup.splice(req.clientParam.index,1,obj);
                objFrom.childGroup.splice(index,1,obj1);
                await (objFrom.saveAsync());
            }
            else
            {
                objFrom.childGroup.splice(index,1);
                objTo.childGroup.splice(req.clientParam.index,0,obj)
                await (objFrom.saveAsync());
                await (objTo.saveAsync());
            }
            if(req.clientParam.to)
            {
                obj=await (docGroup.findOneAndUpdateAsync({
                    _id:obj._id
                },{
                    parent:req.clientParam.to
                },{
                    new:true
                }))
            }
            else
            {
                obj=await (docGroup.findOneAndUpdateAsync({
                    _id:obj._id
                },{
                    $unset:{
                        parent:1
                    }
                },{
                    new:true
                }))
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.moveDoc=async (req,res)=>{
        try
        {
            let obj=await (doc.findOneAsync({
                _id:req.clientParam.id
            }));
            if(!obj)
            {
                util.throw(e.docNotFound,"文档没有找到");
            }
            let objFrom,objTo;
            objFrom=await (docGroup.findOneAsync({
                _id:obj.group
            }));
            if(!objFrom)
            {
                util.throw(e.docGroupNotFound,"分组没有找到");
            }
            objTo=await (docGroup.findOneAsync({
                _id:req.clientParam.to
            }));
            if(!objTo)
            {
                util.throw(e.docGroupNotFound,"分组没有找到");
            }
            let index;
            objFrom.childDoc.forEach(function (obj,i) {
                if(obj.toString()==req.clientParam.id)
                {
                    index=i;
                }
            })
            if(objFrom._id.toString()==objTo._id.toString())
            {
                let obj1=objFrom.childDoc[req.clientParam.index];
                objFrom.childDoc.splice(req.clientParam.index,1,obj);
                objFrom.childDoc.splice(index,1,obj1);
                await (objFrom.saveAsync());
            }
            else
            {
                objFrom.childDoc.splice(index,1);
                objTo.childDoc.splice(req.clientParam.index,0,obj)
                await (objFrom.saveAsync());
                await (objTo.saveAsync());
            }
            obj=await (doc.findOneAndUpdateAsync({
                _id:obj._id
            },{
                group:req.clientParam.to
            },{
                new:true
            }))
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.addUser=async (req,res)=>{
        try
        {
            let objUser=await (user.findOneAsync({
                name:req.clientParam.user
            }))
            if(!objUser)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
            }
            for(let u of objProject.users)
            {
                if(u.toString()==objUser._id.toString())
                {
                    util.throw(e.userAlreadyInDoc,"用户已经在项目里了");
                }
            }
            if(objProject.team)
            {
                let bExist=await (this.existUserInTeam(objProject.team,objUser._id))
                if(!bExist)
                {
                    util.throw(e.userNotInTeam,"用户不在团队里");
                }
            }
            await (docProject.findOneAndUpdateAsync({
                _id:req.clientParam.project
            },{
                $addToSet:{
                    users:objUser._id
                }
            }))
            util.ok(res,objUser,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeUser=async (req,res)=>{
        try
        {
            let objUser=await (user.findOneAsync({
                _id:req.clientParam.user
            }))
            if(!objUser)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
            }
            let bExist=false;
            for(let u of objProject.users)
            {
                if(u.toString()==req.clientParam.user)
                {
                    bExist=true;
                }
            }
            if(!bExist)
            {
                util.throw(e.userNotInDoc,"用户不在项目里");
            }
            await (docProject.updateAsync({
                _id:req.clientParam.project
            },{
                $pull:{
                    users:req.clientParam.user
                }
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.quit=async (req,res)=>{
        try
        {
            let obj=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(obj.owner.toString()==req.userInfo._id.toString())
            {
                util.throw(e.userForbidden,"创建的项目不能退出");
            }
            let index=-1;
            for(let i=0;i< obj.users.length;i++)
            {
                let u=obj.users[i];
                if(u.toString()==req.userInfo._id.toString())
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
    }
    this.setUser=async (req,res)=>{
        try
        {
            let obj=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
            }
            obj.users=JSON.parse(req.clientParam.user);
            await (obj.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setOwner=async (req,res)=> {
        try
        {
            let obj=await (user.findOneAsync({
                _id:req.clientParam.user
            }))
            if(!obj)
            {
                util.throw(e.userNotFound,"用户没有找到");
                return;
            }
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目没有找到");
            }
            let bInTeam=false;
            if(objProject.team)
            {
                let bIn=await (this.existUserInTeam(objProject.team,req.clientParam.user));
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
            for(let o of objProject.users)
            {
                if(o.toString()==req.clientParam.user)
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                await (docProject.updateAsync({
                    _id:req.clientParam.project
                },{
                    owner:req.clientParam.user,
                    $pull:{
                        "users":req.clientParam.user
                    }
                }))
            }
            else
            {
                if(bInTeam)
                {
                    objProject.owner=req.clientParam.user;
                    await (objProject.saveAsync());
                }
                else
                {
                    util.throw(e.userNotInProject,"用户不在项目里");
                }
            }
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.structure=async (req,res)=>{
        try
        {
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目没有找到");
            }
            let __map=async function (obj) {
                if(obj.childGroup && obj.childGroup.length>0)
                {
                    let type;
                    if(obj.users)
                    {
                        type=docProject;
                    }
                    else
                    {
                        type=docGroup;
                    }
                    obj=await (type.populateAsync(obj,{
                        path:"childGroup",
                    }));
                    for(let i=0;i<obj.childGroup.length;i++)
                    {
                        obj.childGroup[i]=await (__map(obj.childGroup[i]));
                    }
                }
                if(obj.childDoc && obj.childDoc.length>0)
                {
                    obj=await (docGroup.populateAsync(obj,{
                        path:"childDoc",
                        select:"-content -img -file -interface"
                    }))
                    for(let j=0;j<obj.childDoc.length;j++)
                    {
                        obj.childDoc[j]=await (doc.populateAsync(obj.childDoc[j],{
                            path:"owner",
                            select:"name"
                        }))
                        obj.childDoc[j]=await (doc.populateAsync(obj.childDoc[j],{
                            path:"editor",
                            select:"name"
                        }))
                    }
                }
                return obj;
            }
            objProject=await (__map(objProject));
            util.ok(res,objProject.childGroup,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.filterStructure=async (req,res)=>{
        try
        {
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目没有找到");
            }
            let __map=async function (obj) {
                if(obj.childGroup && obj.childGroup.length>0)
                {
                    let type;
                    if(obj.users)
                    {
                        type=docProject;
                    }
                    else
                    {
                        type=docGroup;
                    }
                    obj=await (type.populateAsync(obj,{
                        path:"childGroup",
                    }));
                    for(let i=0;i<obj.childGroup.length;i++)
                    {
                        obj.childGroup[i]=await (__map(obj.childGroup[i]));
                    }
                }
                obj.childGroup=obj.childGroup.filter(function (obj) {
                    if(obj.childDoc.length>0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                })
                if(obj.childDoc && obj.childDoc.length>0)
                {
                    let query={
                        path:"childDoc",
                        select:"-content -img -file -interface",
                    }
                    if(req.clientParam.key)
                    {
                        if(req.clientParam.type==0)
                        {
                            query.match={
                                name:new RegExp(req.clientParam.key,"i")
                            }
                        }
                        else if(req.clientParam.type==1)
                        {
                            query.match={
                                content:new RegExp(req.clientParam.key,"i")
                            }
                        }
                        else if(req.clientParam.type==2)
                        {
                            query.match={
                                $or:[
                                    {
                                        name:new RegExp(req.clientParam.key,"i")
                                    },
                                    {
                                        content:new RegExp(req.clientParam.key,"i")
                                    }
                                ]
                            }
                        }
                    }
                    obj=await (docGroup.populateAsync(obj,query))
                    for(let j=0;j<obj.childDoc.length;j++)
                    {
                        obj.childDoc[j]=await (doc.populateAsync(obj.childDoc[j],{
                            path:"owner",
                            select:"name"
                        }))
                        obj.childDoc[j]=await (doc.populateAsync(obj.childDoc[j],{
                            path:"editor",
                            select:"name"
                        }))
                    }
                }
                return obj;
            }
            objProject=await (__map(objProject));
            util.ok(res,objProject.childGroup,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.filterList=async (req,res)=>{
        try
        {
            let query={
                name:new RegExp(req.clientParam.name,"i")
            }
            if(req.clientParam.team)
            {
                query.team=req.clientParam.team;
                query["$or"]=[
                    {
                        publicTeam:1
                    },
                    {
                        $or:[
                            {
                                owner:req.userInfo._id
                            },
                            {
                                users:req.userInfo._id
                            }
                        ]
                    }
                ]
            }
            else
            {
                query.team={
                    $exists:false
                }
                query["$or"]=[
                    {
                        public:1
                    },
                    {
                        $or:[
                            {
                                owner:req.userInfo._id
                            },
                            {
                                users:req.userInfo._id
                            }
                        ]
                    }
                ]
            }
            let arr=await (docProject.findAsync(query,"_id name owner dis users",{
                sort:"createdAt"
            }));
            let bManager=0;
            if(req.clientParam.team)
            {
                let obj=await (team.findOneAsync({
                    _id:req.clientParam.team
                }));
                if(!obj)
                {
                    util.throw(e.teamNotFound,"团队不存在");
                }
                let arr=await (teamGroup.findAsync({
                    team:req.clientParam.team,
                }))
                req.teamGroup=arr;
                req.team=obj;
                if(req.team.owner.toString()==req.userInfo._id.toString())
                {
                    req.access=1;
                }
                else
                {
                    req.access=0;
                    for(let o of req.teamGroup) {
                        let bFind=false;
                        for(let o1 of o.users)
                        {
                            if (o1.user.toString() == req.userInfo._id.toString() && o1.role == 0) {
                                req.access = 1;
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind)
                        {
                            break;
                        }
                    }
                }
                bManager=req.access;
            }
            arr.forEach(function (obj) {
                if(obj.owner.toString()==req.userInfo._id.toString())
                {
                    obj._doc.open=0;
                }
                else
                {
                    let objFind=null;
                    for(let o1 of obj.users)
                    {
                        if (o1.user.toString() == req.userInfo._id.toString()) {
                            objFind=o1;
                            break;
                        }
                    }
                    if(req.clientParam.team)
                    {
                        if(bManager)
                        {
                            obj._doc.open=0;
                        }
                        else if(objFind && objFind.role==0)
                        {
                            obj._doc.open=0
                        }
                        else
                        {
                            obj._doc.open=1;
                        }
                    }
                    else
                    {
                        if(objFind && objFind.role==0)
                        {
                            obj._doc.open=0
                        }
                        else
                        {
                            obj._doc.open=1;
                        }
                    }
                }
                delete obj._doc.users;
                delete obj._doc.owner;
            })
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.handleApply=async (req,res)=>{
        try
        {
            let obj=await (apply.findOneAsync({
                _id:req.clientParam.apply
            },null,{
                populate:{
                    path:"from",
                    select:"name"
                }
            }));
            obj=await (apply.populateAsync(obj,{
                path:"to",
                select:"name"
            }))
            if(!obj)
            {
                util.throw(e.applyNotFound,"申请不存在");
            }
            else if(obj.state!=0)
            {
                util.throw(e.applyAlreadyHandle,"申请已经处理过了");
            }
            let objTeam=await (team.findOneAsync({
                _id:obj.from._id
            }))
            if(!objTeam)
            {
                util.throw(e.teamNotFound,"团队不存在");
            }
            obj.editor=req.userInfo._id;
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
            }
            if(objProject.team)
            {
                obj.state=3;
                await (obj.saveAsync());
                if(objProject.team.toString()==obj.to._id.toString())
                {
                    util.throw(e.projectAlreadyJoinTeam,"项目已加入其他团队")
                }
                else
                {
                    util.throw(e.projectAlreadyJoinTeam,"项目已加入团队")
                }

            }
            else
            {
                obj.state=req.clientParam.state;
                if(req.clientParam.state==1)
                {
                    let arrTeamUser=await (this.teamUserList(objTeam._id));
                    let arrProjectUser=objProject.users.map(function (obj) {
                        return obj.user.toString();
                    });
                    arrProjectUser.push(objProject.owner.toString());
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
                }
                await (message.createAsync({
                    name:req.clientParam.state==1?"您已同意文档项目加入团队":"您已拒绝文档项目加入团队",
                    dis:`您已${req.clientParam.state==1?"通过":"拒绝"}文档项目${objProject.name}加入团队${obj.from.name}`,
                    user:req.userInfo._id,
                    type:1
                }))
                await (obj.saveAsync());
                await (apply.updateAsync({
                    to:objProject._id,
                    type:4,
                    state:0
                },{
                    state:3
                },{
                    multi:true
                }))
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceProject=async (req,res)=>{
        try
        {
            let query={},arr=[];
            if(req.clientParam.team)
            {
                let access,arrGroup=[];
                let objTeam=await (team.findOneAsync({
                    _id:req.clientParam.team,
                    owner:req.userInfo._id
                }))
                if(!obj)
                {
                    let arr=await (teamGroup.findAsync({
                        team:req.clientParam.id,
                        "users.user":req.userInfo._id
                    }))
                    if(arr.length==0)
                    {
                        util.throw(e.projectNotFound,"项目不存在或者没有权限");
                        return;
                    }
                    else
                    {
                        arrGroup=arr;
                        objTeam=await (team.findOneAsync({
                            _id:arr[0].team
                        }))
                    }
                }
                if(objTeam.owner.toString()==req.userInfo._id.toString())
                {
                    access=1;
                }
                else
                {
                    access=0;
                    for(let o of arrGroup) {
                        let bFind=false;
                        for(let o1 of o.users)
                        {
                            if (o1.user.toString() == req.userInfo._id.toString() && o1.role == 0) {
                                access = 1;
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind)
                        {
                            break;
                        }
                    }
                }
                if(access)
                {
                    query={
                        team:req.clientParam.team,
                    }
                }
                else
                {
                    query={
                        team:req.clientParam.team,
                        $or:[
                            {
                                owner:req.userInfo._id
                            },
                            {
                                "users.user":req.userInfo._id
                            }
                        ]
                    }
                }
                arr=await (project.findAsync(query,"name",{
                    sort:"-createdAt"
                }))
            }
            else
            {
                query={
                    team:req.clientParam.team
                }
                arr=await (project.findAsync(query,"name",{
                    sort:"-createdAt"
                }))
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceVersion=async (req,res)=>{
        try
        {
            let arr=await (version.findAsync({
                project:req.clientParam.project
            },"name",{
                sort:"-createdAt"
            }))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceList=async (req,res)=>{
        try
        {
            req.groupModel=group;
            req.interfaceModel=interface;
            if(req.clientParam.version)
            {
                req.groupModel=groupVersion;
                req.interfaceModel=interfaceVersion;
            }
            let getChild=async function(req,id,obj,bInter) {
                let query={
                    project:id,
                    parent:obj?obj.id:{
                        $exists:false
                    }
                }
                if(req.clientParam.version)
                {
                    query.version=req.clientParam.version
                }
                let arr=await (req.groupModel.findAsync(query,null,{
                    sort:"name"
                }))
                for(let obj of arr)
                {
                    obj._doc.data=await (getChild(req,id,obj,bInter));
                }
                if(bInter && obj)
                {
                    let arrInterface=await (req.interfaceModel.findAsync({
                        group:obj._id
                    },"_id name method finish url id delete",{
                        sort:"name"
                    }));
                    arr=arr.concat(arrInterface);
                }
                return arr;
            }
            let arr=await (getChild(req,req.clientParam.project,null,1));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getInterface=async (req,res)=>{
        try
        {
            let interfaceModel = interface;
            let inter = await (interfaceModel.findOneAsync({
                _id: req.clientParam.id
            }));
            if (!inter) {
                interfaceModel = interfaceVersion;
                inter = await (interfaceModel.findOneAsync({
                    _id: req.clientParam.id
                }));
                if (!inter) {
                    util.throw(e.interfaceNotFound, "接口不存在");
                }
            }
            let obj = await (interfaceModel.populateAsync(inter, {
                path: "project",
                select: "name baseUrls"
            }))
            if (obj.group) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "group",
                    select: "name"
                }))
            }
            if (obj.owner) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "owner",
                    select: "name"
                }))
            }
            if (obj.editor) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "editor",
                    select: "name"
                }))
            }
            if (obj.version) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "version",
                    select: "name"
                }))
            }
            let objProject=await (project.findOneAsync({
                _id:obj.project._id
            },"team",{
                populate:{
                    path:"team",
                    select:"name"
                }
            }));
            if(objProject.team)
            {
                obj._doc.teamName=objProject.team.name
            }
            util.ok(res, obj, "ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getInterfaceInfo=async (req,res)=>{
        try
        {
            let ret={};
            let interfaceModel = interface;
            let statusModel=status;
            let inter = await (interfaceModel.findOneAsync({
                _id: req.clientParam.id
            }));
            if (!inter) {
                interfaceModel = interfaceVersion;
                statusModel=statusVersion;
                inter = await (interfaceModel.findOneAsync({
                    _id: req.clientParam.id
                }));
                if (!inter) {
                    util.throw(e.interfaceNotFound, "接口不存在");
                }
            }
            let objProject=await (project.findOneAsync({
                _id:inter.project
            },"baseUrls before after"));
            ret.baseUrls=objProject.baseUrls;
            ret.before=objProject.before;
            ret.after=objProject.after;
            let query={
                project:objProject._id
            }
            if(inter.version)
            {
                query.version=inter.version
            }
            let arr=await (statusModel.findAsync(query,null,{
                sort:"-createdAt"
            }))
            ret.status=arr;
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exportPdf=async (req,res)=>{
        try
        {
            let objProject=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.docProjectNotFound,"项目没有找到");
            }
            let html="";
            let __map=async function (obj) {
                if(obj.childGroup && obj.childGroup.length>0)
                {
                    let type;
                    if(obj.users)
                    {
                        type=docProject;
                    }
                    else
                    {
                        type=docGroup;
                    }
                    obj=await (type.populateAsync(obj,{
                        path:"childGroup",
                    }));
                    for(let i=0;i<obj.childGroup.length;i++)
                    {
                        obj.childGroup[i]=await (__map(obj.childGroup[i]));
                    }
                }
                if(obj.childDoc && obj.childDoc.length>0)
                {
                    obj=await (docGroup.populateAsync(obj,{
                        path:"childDoc",
                        select:"name content"
                    }))
                    for(let j=0;j<obj.childDoc.length;j++)
                    {
                        let d=obj.childDoc[j];
                        let str="<div style='text-align: center;font-size: 20px'>"+d.name+"</div>"
                        let temp=md.render(d.content);
                        let div=document.createElement("div");
                        div.innerHTML=temp;
                        var arr=div.getElementsByTagName("img");
                        for(let i=0;i<arr.length;i++)
                        {
                            let o=arr[i];
                            o.style.maxWidth="100%";
                            if(o.src.startsWith("/"))
                            {
                                o.src=path.join('file://',con.filePath, o.src)
                            }
                        }
                        html+=str+div.innerHTML+"<br><br>";
                    }
                }
                return obj;
            }
            objProject=await (__map(objProject));
            html=`
                <style>
                    * {
                        line-height: 1.5;
                    }
                    img {
                        max-width: 100%;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        text-align: center;
                    }
                    td{
                        border:1px solid #BBB;
                    }
                    th{
                        border:1px solid #BBB;
                    }
                    pre {
                        background-color: #f3f3f3;
                        padding: 10px;
                    }
                </style>
                <div style="text-align: center;font-size: 25px">${objProject.name}</div>
            `+html;
            res.writeHead(200,{
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(objProject.name)+".pdf",
                "Transfer-Encoding": "chunked",
                "Expires":0,
                "Cache-Control":"must-revalidate, post-check=0, pre-check=0",
                "Content-Transfer-Encoding":"binary",
                "Pragma":"public",
            });
            pdf.create(html,{
                border: {
                    "top": "0.3in",
                    "right": "0.2in",
                    "left": "0.2in",
                    "bottom":"0in"
                },
                footer: {
                    height:"15mm",
                    "contents": "<div style='color: gray;border-top: 1px lightgray solid;font-size: 13px;padding-top: 10px'>本pdf由<a href='http://doclever.cn'>DOClever</a>生成</div>"
                },
            }).toStream(function (err,stream) {
                stream.pipe(res);
            })
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}
module.exports=Doc;










