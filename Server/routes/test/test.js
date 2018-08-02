/**
 * Created by sunxin on 2017/4/25.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var status=require("../../model/statusModel")
var statusVersion=require("../../model/statusVersionModel")
var test=require("../../model/testModel")
var testModule=require("../../model/testModuleModel")
var testGroup=require("../../model/testGroupModel")
var testProject=require("../../model/testProjectModel")
var testCollection=require("../../model/testCollectionModel")
var version=require("../../model/versionModel")
var apply=require("../../model/applyModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var message=require("../../model/messageModel")
var groupVersion=require("../../model/groupVersionModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var poll=require("../../model/pollModel")
var fs=require("fs");
var dom = require("jsdom").JSDOM;
var window=(new dom(`...`)).window;
var document=window.document;
var uuid=require("uuid/v1");
function Test() {
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
    this.validateUser=async (req,res)=> {
        try
        {
            req.testModuleModel=testModule;
            req.testGroupModel=testGroup;
            req.testModel=test;
            if(req.clientParam.id)
            {
                req.test=await (req.testModel.findOneAsync(req.clientParam.id.length==24?{
                    _id:req.clientParam.id
                }:{
                    id:req.clientParam.id,
                    project:req.clientParam.project
                },null,{
                    populate:{
                        path:"owner",
                        select:"name"
                    }
                }))
                if(!req.test)
                {
                    util.throw(e.testNotFound,"用例没有找到");
                }
                req.test=await (req.testModel.populateAsync(req.test,{
                    path:"editor",
                    select:"name"
                }))
            }
            if(req.clientParam.project)
            {
                req.project=await (testProject.findOneAsync({
                    _id:req.clientParam.project
                }))
                if(!req.project)
                {
                    util.throw(e.projectNotFound,"项目没有找到");
                }
            }
            if(req.clientParam.module)
            {
                req.module=await (req.testModuleModel.findOneAsync({
                    _id:req.clientParam.module
                }))
                if(!req.module)
                {
                    util.throw(e.testModuleNotFound,"模块没有找到");
                }
            }
            if(req.clientParam.group)
            {
                req.group=await (req.testGroupModel.findOneAsync({
                    _id:req.clientParam.group
                }))
                if(!req.group)
                {
                    util.throw(e.testGroupNotFound,"业务分组没有找到");
                }
            }
            return true;
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.save=async (req,res)=> {
        try
        {
            let obj={},ret=null;
            for(let key in req.clientParam)
            {
                if(key!="id" && req.clientParam[key]!==undefined)
                {
                    if(key=="ui")
                    {
                        obj[key]=JSON.parse(req.clientParam[key]);
                    }
                    else
                    {
                        obj[key]=req.clientParam[key];
                    }
                }
            }
            let objModule=await (req.testModuleModel.findOneAsync({
                _id:req.group.module
            }))
            if(!objModule)
            {
                util.throw(e.testModuleNotFound,"模块没有找到");
                return;
            }
            else
            {
                obj.module=objModule._id;
            }
            let objProject=await (testProject.findOneAsync({
                _id:objModule.project
            }))
            if(!objProject)
            {
                util.throw(e.projectNotFound,"项目没有找到");
                return;
            }
            else
            {
                obj.project=objProject._id;
            }
            if(req.clientParam.id)
            {
                obj.editor=req.userInfo._id;
                ret=await (req.testModel.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },obj,{
                    new:true
                }))
            }
            else
            {
                obj.owner=obj.editor=req.userInfo._id;
                obj.user=req.clientParam.user;
                obj.id=uuid();
                ret=await (req.testModel.createAsync(obj));
            }
            ret=await (req.testModel.populateAsync(ret,{
                path:"module",
                select:"name"
            }))
            ret=await (req.testModel.populateAsync(ret,{
                path:"group",
                select:"name"
            }))
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.list=async (req,res)=> {
        try
        {
            let obj=await (testProject.findOneAsync({
                _id:req.clientParam.project
            },null,{
                populate:{
                    path:"users",
                    select:"name photo"
                }
            }))
            if(!obj)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
            }
            let query={
                project:req.clientParam.project
            }
            let queryUser=null;
            if(req.clientParam.user)
            {
                queryUser=query.user=req.clientParam.user
            }
            else
            {
                let arr=[obj.owner.toString()].concat(obj.users.map(function (obj) {
                    return obj._id.toString();
                }));
                if(arr.indexOf(req.userInfo._id.toString())>-1)
                {
                    queryUser=query.user=req.userInfo._id;
                }
                else
                {
                    queryUser=query.user=obj.owner;
                }
            }
            let arrModule=await (req.testModuleModel.findAsync(query,null,{
                sort:"name"
            }));
            for(let objModule of arrModule)
            {
                let query={
                    module:objModule._id
                }
                query.user=queryUser;
                let arrGroup=await (req.testGroupModel.findAsync(query,null,{
                    sort:"name"
                }));
                for(let objGroup of arrGroup)
                {
                    let query={
                        group:objGroup._id
                    }
                    query.user=queryUser;
                    let arrTest=await (req.testModel.findAsync(query,"name id status group user",{
                        sort:"name",
                        populate:[
                            {
                                path:"group",
                                select:"name"
                            },
                            {
                                path:"module",
                                select:"name"
                            }
                        ]
                    }))
                    objGroup._doc.data=arrTest;
                }
                objModule._doc.data=arrGroup;
            }
            util.ok(res,arrModule,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.info=async (req,res)=> {
        try
        {
            let ret={};
            let obj=await (testProject.findOneAsync({
                _id:req.clientParam.project
            },null,{
                populate:{
                    path:"users",
                    select:"name photo"
                }
            }))
            obj=await (testProject.populateAsync(obj,{
                path:"owner",
                select:"name photo"
            }))
            if(req.clientParam.only)
            {
                util.ok(res,obj,"ok");
                return;
            }
            ret.info=obj;
            let query={
                project:req.clientParam.project
            }
            let queryUser=null;
            let arr=[obj.owner.toString()].concat(obj.users.map(function (obj) {
                return obj._id.toString();
            }));
            if(req.clientParam.user)
            {
                queryUser=query.user=req.clientParam.user
            }
            else
            {
                if(arr.indexOf(req.userInfo._id.toString())>-1)
                {
                    queryUser=query.user=req.userInfo._id;
                }
                else
                {
                    queryUser=query.user=obj.owner._id;
                }
            }
            if(arr.indexOf(req.userInfo._id.toString())>-1)
            {
                ret.user=queryUser;
            }
            else
            {
                ret.user=obj.owner._id;
            }
            let arrModule=await (req.testModuleModel.findAsync(query,null,{
                sort:"name"
            }));
            for(let objModule of arrModule)
            {
                let query={
                    module:objModule._id
                }
                query.user=queryUser;
                let arrGroup=await (req.testGroupModel.findAsync(query,null,{
                    sort:"name"
                }));
                for(let objGroup of arrGroup)
                {
                    let query={
                        group:objGroup._id
                    }
                    query.user=queryUser;
                    let arrTest=await (req.testModel.findAsync(query,"name id status group user",{
                        sort:"name",
                        populate:{
                            path:"module",
                            select:"name"
                        }
                    }))
                    arrTest=await (req.testModel.populateAsync(arrTest,{
                        path:"group",
                        select:"name"
                    }))
                    objGroup._doc.data=arrTest;
                }
                objModule._doc.data=arrGroup;
            }
            ret.testList=arrModule;
            arr=await (testCollection.findAsync({
                project:req.clientParam.project,
                user:queryUser
            },"name project user",{
                sort:"-createdAt"
            }))
            ret.collectionList=arr;
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.saveModule=async (req,res)=> {
        try
        {
            let obj;
            if(req.clientParam.module)
            {
                obj=await (req.testModuleModel.findOneAndUpdateAsync({
                    _id:req.clientParam.module
                },{
                    name:req.clientParam.name
                },{
                    new:true
                }))
            }
            else
            {
                let query={
                    name:req.clientParam.name,
                    project:req.clientParam.project,
                    id:uuid(),
                    user:req.clientParam.user
                }
                obj=await (req.testModuleModel.createAsync(query))
                obj._doc.data=[];
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.saveGroup=async (req,res)=> {
        try
        {
            let obj;
            if(req.clientParam.group)
            {
                obj=await (req.testGroupModel.findOneAndUpdateAsync({
                    _id:req.clientParam.group
                },{
                    name:req.clientParam.name
                },{
                    new:true
                }))
            }
            else
            {
                let query={
                    name:req.clientParam.name,
                    module:req.clientParam.module,
                    id:uuid(),
                    user:req.clientParam.user,
                    project:req.clientParam.project
                }
                obj=await (req.testGroupModel.createAsync(query))
                obj._doc.data=[];
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeModule=async (req,res)=> {
        try
        {
            let arrGroup=await (req.testGroupModel.findAsync({
                module:req.clientParam.module
            }));
            for(let objGroup of arrGroup)
            {
                let arrTest=await (req.testModel.findAsync({
                    group:objGroup._id
                }));
                for(let objTest of arrTest)
                {
                    await (req.testModel.removeAsync({
                        _id:objTest._id
                    }))
                }
                await (req.testGroupModel.removeAsync({
                    _id:objGroup._id
                }))
            }
            await (req.testModuleModel.removeAsync({
                _id:req.clientParam.module
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeGroup=async (req,res)=> {
        try
        {
            let arrTest=await (req.testModel.findAsync({
                group:req.clientParam.group
            }));
            for(let objTest of arrTest)
            {
                await (req.testModel.removeAsync({
                    _id:objTest._id
                }))
            }
            await (req.testGroupModel.removeAsync({
                _id:req.clientParam.group
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeTest=async (req,res)=> {
        try
        {
            await (req.testModel.removeAsync({
                _id:req.clientParam.id
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.testInfo=async (req,res)=> {
        try
        {
            if(req.clientParam.type=="code")
            {
                delete req.test._doc.ui;
                delete req.test._doc.output;
            }
            else if(req.clientParam.type=="ui")
            {
                delete req.test._doc.code;
                delete req.test._doc.output;
            }
            util.ok(res,req.test,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.setStatus=async (req,res)=> {
        try
        {
            req.test.status=req.clientParam.status;
            if(req.clientParam.output!==undefined)
            {
                req.test.output=req.clientParam.output;
            }
            await (req.test.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.setOutput=async (req,res)=> {
        try
        {
            req.test.status=req.clientParam.output;
            await (req.test.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.moveTest=async (req,res)=> {
        try
        {
            req.test.group=req.clientParam.group;
            await (req.test.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.projectList=async (req,res)=>{
        try
        {
            let ret={};
            let arr=await (testProject.findAsync({
                owner:req.userInfo._id,
                team:{
                    $exists:false
                }
            },null,{
                sort:"-createdAt"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.testCount=await (test.countAsync({
                    project:obj._id
                }))
                obj._doc.own=1;
                obj._doc.role=0;
            }
            ret.create=arr;
            arr=await (testProject.findAsync({
                users:req.userInfo._id,
                team:{
                    $exists:false
                }
            },null,{
                sort:"-createdAt"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.testCount=await (test.countAsync({
                    project:obj._id
                }))
                obj._doc.own=0;
                obj._doc.role=0;
            }
            ret.join=arr;
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.saveProject=async (req,res)=>{
        try
        {
            let query={
                name:req.clientParam.name
            }
            if(req.clientParam.dis)
            {
                query.dis=req.clientParam.dis
            }
            if(req.clientParam.team)
            {
                query.team=req.clientParam.team
            }
            else
            {
                query["$unset"]={
                    team:1
                }
            }
            let ret;
            if(req.clientParam.project)
            {
                ret=await (testProject.findOneAndUpdateAsync({
                    _id:req.clientParam.project
                },query,{
                    new:true
                }))
            }
            else
            {
                query.owner=req.userInfo._id;
                ret=await (testProject.createAsync(query))
                ret._doc.userCount=1;
                ret._doc.testCount=0;
                ret._doc.own=1;
                ret._doc.role=0;
            }
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeProject=async (req,res)=>{
        try
        {
            await (test.removeAsync({
                project:req.clientParam.project
            }))
            await (testGroup.removeAsync({
                project:req.clientParam.project
            }))
            await (testModule.removeAsync({
                project:req.clientParam.project
            }))
            await (testProject.removeAsync({
                _id:req.clientParam.project
            }))
            util.ok(res,"ok");
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
            let objProject=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!objProject)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
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
                        return obj.toString();
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
                    name:req.clientParam.state==1?"您已同意测试项目加入团队":"您已拒绝测试项目加入团队",
                    dis:`您已${req.clientParam.state==1?"通过":"拒绝"}测试项目${objProject.name}加入团队${obj.from.name}`,
                    user:req.userInfo._id,
                    type:1
                }))
                await (obj.saveAsync());
                await (apply.updateAsync({
                    to:objProject._id,
                    type:6,
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
            let objProject=await (testProject.findOneAsync({
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
                await (testProject.updateAsync({
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
                        owner:req.userInfo._id
                    },
                    {
                        users:req.userInfo._id
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
                        owner:req.userInfo._id
                    },
                    {
                        users:req.userInfo._id
                    }
                ]
            }
            let arr=await (testProject.findAsync(query,"_id name dis",{
                sort:"createdAt"
            }));
            util.ok(res,arr,"ok");
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
            let objProject=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
            }
            for(let u of objProject.users)
            {
                if(u.toString()==objUser._id.toString())
                {
                    util.throw(e.userAlreadyInTest,"用户已经在项目里了");
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
            await (testProject.findOneAndUpdateAsync({
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
            let objProject=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objProject)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
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
                util.throw(e.userNotInTest,"用户不在项目里");
            }
            await (testProject.updateAsync({
                _id:req.clientParam.project
            },{
                $pull:{
                    users:req.clientParam.user,
                    "cooperation.user":req.clientParam.user,
                    "cooperation.users.user":req.clientParam.user
                }
            }));
            await (test.removeAsync({
                project:req.clientParam.project,
                user:req.clientParam.user
            }))
            await (testGroup.removeAsync({
                project:req.clientParam.project,
                user:req.clientParam.user
            }))
            await (testModule.removeAsync({
                project:req.clientParam.project,
                user:req.clientParam.user
            }))
            await (testCollection.removeAsync({
                project:req.clientParam.project,
                user:req.clientParam.user
            }))
            await (poll.removeAsync({
                project:req.clientParam.project,
                owner:req.clientParam.user
            }))
            await (poll.updateAsync({
                project:req.clientParam.project
            },{
                $pull:{
                    users:req.clientParam.user
                }
            }))
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
            let obj=await (testProject.findOneAsync({
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
                await (testProject.updateAsync({
                    _id:req.clientParam.project
                },{
                    $pull:{
                        users:req.userInfo._id,
                        "cooperation.user":req.userInfo._id,
                        "cooperation.users.user":req.userInfo._id
                    }
                }));
                await (test.removeAsync({
                    project:req.clientParam.project,
                    user:req.userInfo._id
                }))
                await (testGroup.removeAsync({
                    project:req.clientParam.project,
                    user:req.userInfo._id
                }))
                await (testModule.removeAsync({
                    project:req.clientParam.project,
                    user:req.userInfo._id
                }))
                await (testCollection.removeAsync({
                    project:req.clientParam.project,
                    user:req.userInfo._id
                }))
                await (poll.removeAsync({
                    project:req.clientParam.project,
                    owner:req.userInfo._id
                }))
                await (poll.updateAsync({
                    project:req.clientParam.project
                },{
                    $pull:{
                        users:req.userInfo._id
                    }
                }))
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
            let obj=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
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
    this.interfaceList=async (req,res)=>{
        try
        {
            let ret=[];
            let arrTemp=await (teamGroup.findAsync({
                "users":{
                    $elemMatch:{
                        user:req.userInfo._id,
                        role:{
                            $in:[0,2]
                        }
                    }
                }
            },"team",{
                sort:"-createdAt",
                populate:{
                    path:"team",
                    select:"name"
                }
            }))
            ret=arrTemp.map(function (obj) {
                let o=obj.team;
                o.access=1;
                return o;
            });
            arrTemp=await (teamGroup.findAsync({
                "users":{
                    $elemMatch:{
                        user:req.userInfo._id,
                        role:1
                    }
                }
            },"team",{
                sort:"-createdAt",
                populate:{
                    path:"team",
                    select:"name"
                }
            }))
            ret=ret.concat(arrTemp.map(function (obj) {
                let o=obj.team;
                o.access=0;
                return o;
            }));
            ret.unshift({
                _id:"",
                name:"无团队",
                access:1
            });
            for(let objTeam of ret)
            {
                let query={},arrProject=[];
                if(objTeam._id)
                {
                    let access=objTeam.access;
                    delete objTeam.access;
                    if(access)
                    {
                        query={
                            team:objTeam._id,
                        }
                    }
                    else
                    {
                        query={
                            team:objTeam._id,
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
                    arrProject=await (project.findAsync(query,"name",{
                        sort:"-createdAt"
                    }))
                }
                else
                {
                    query={
                        team:{
                            $exists:false
                        },
                        $or:[
                            {
                                owner:req.userInfo._id
                            },
                            {
                                "users.user":req.userInfo._id
                            }
                        ]
                    }
                    arrProject=await (project.findAsync(query,"name",{
                        sort:"-createdAt"
                    }))
                }
                (objTeam._doc?objTeam._doc:objTeam).data=arrProject;
                for(let objPro of arrProject)
                {
                    let arrVersion=[];
                    arrVersion=await (version.findAsync({
                        project:objPro._id
                    },"version",{
                        sort:"-createdAt"
                    }))
                    arrVersion.forEach(function (obj) {
                        obj._doc.name=obj.version;
                        delete obj._doc.version
                    })
                    arrVersion.unshift({
                        _id:"",
                        name:"master",
                    })
                    if(objPro._doc)
                    {
                        objPro._doc.data=arrVersion;
                    }
                    else
                    {
                        objPro.data=arrVersion;
                    }
                    let curProjectID=objPro._id;
                    for(let objVersion of arrVersion)
                    {
                        let groupModel=group;
                        let interfaceModel=interface;
                        if(objVersion._id)
                        {
                            groupModel=groupVersion;
                            interfaceModel=interfaceVersion;
                        }
                        let getChild=async function(id,obj,bInter) {
                            let query={
                                project:id,
                                parent:obj?obj.id:{
                                    $exists:false
                                }
                            }
                            if(objVersion._id)
                            {
                                query.version=objVersion._id
                            }
                            let arr=await (groupModel.findAsync(query,"name id",{
                                sort:"name"
                            }))
                            for(let obj of arr)
                            {
                                obj._doc.data=await (getChild(id,obj,bInter));
                                delete obj._doc.id;
                            }
                            if(bInter && obj)
                            {
                                let arrInterface=await (interfaceModel.findAsync({
                                    group:obj._id
                                },"name",{
                                    sort:"name"
                                }));
                                arr=arr.concat(arrInterface);
                            }
                            return arr;
                        }
                        let arr=await (getChild(curProjectID,null,1));
                        (objVersion._doc?objVersion._doc:objVersion).data=arr;
                    }
                }
            }
            util.ok(res,ret,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceInfo=async (req,res)=>{
        try
        {
            let ret={};
            req.interfaceModel=interface;
            req.statusModel=status;
            let obj=await (interface.findOneAsync(req.clientParam.interface.length==24?{
                _id:req.clientParam.interface
            }:{
                id:req.clientParam.interface
            }));
            if(!obj)
            {
                req.interfaceModel=interfaceVersion;
                req.statusModel=statusVersion;
                obj=await (interfaceVersion.findOneAsync({
                    _id:req.clientParam.interface
                }));
                if(!obj)
                {
                    util.throw(e.interfaceNotFound,"接口不存在");
                }
            }
            if(req.clientParam.only)
            {
                util.ok(res,obj,"ok");
                return;
            }
            req.interface=obj;
            obj = await (req.interfaceModel.populateAsync(req.interface, {
                path: "project",
                select: "name"
            }))
            if (obj.group) {
                obj = await (req.interfaceModel.populateAsync(obj, {
                    path: "group",
                    select: "name"
                }))
            }
            if (obj.owner) {
                obj = await (req.interfaceModel.populateAsync(obj, {
                    path: "owner",
                    select: "name"
                }))
            }
            if (obj.editor) {
                obj = await (req.interfaceModel.populateAsync(obj, {
                    path: "editor",
                    select: "name"
                }))
            }
            ret.interface=req.interface;
            let arrBaseUrl=[];
            if(req.interface.version)
            {
                let obj=await (version.findOneAsync({
                    _id:req.interface.version
                }))
                if(!obj)
                {
                    util.throw(e.versionNotFound,"版本不存在");
                }
                arrBaseUrl=obj.baseUrls;
            }
            else
            {
                let obj=await (project.findOneAsync({
                    _id:req.interface.project
                }))
                if(!obj)
                {
                    util.throw(e.projectNotFound,"项目不存在");
                }
                arrBaseUrl=obj.baseUrls;
            }
            ret.baseUrls=arrBaseUrl;
            let query={
                project:req.interface.project
            }
            if(req.interface.version)
            {
                query.version=req.interface.version;
            }
            let arrStatus=await (req.statusModel.findAsync(query));
            ret.status=arrStatus;
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.urlList=async (req,res)=>{
        try
        {
            let arr=await (test.findAsync({
                project:req.clientParam.project,
                user:req.clientParam.user
            }));
            let arrProject=req.clientParam.urls?req.clientParam.urls.split(","):[];
            for(let obj of arr)
            {
                if(obj.code)
                {
                    let div=document.createElement("div");
                    div.innerHTML=obj.code;
                    let arrLink=div.querySelectorAll("a[data]");
                    arrLink.forEach(function (obj) {
                        let data=obj.getAttribute("data");
                        let type=obj.getAttribute("type");
                        if(type!=1)
                        {
                            return;
                        }
                        let o=JSON.parse(data);
                        if(o.project && o.project._id && arrProject.indexOf(o.project._id)==-1)
                        {
                            arrProject.push(o.project._id);
                        }
                    })
                    div.innerHTML="";
                }
                if(obj.ui.length>0)
                {
                    obj.ui.forEach(function (obj) {
                        if(obj.type=="interface")
                        {
                            let o=JSON.parse(obj.data);
                            if(o.project && o.project._id && arrProject.indexOf(o.project._id)==-1)
                            {
                                arrProject.push(o.project._id);
                            }
                        }
                    })
                }
            }
            arr=await (project.findAsync({
                _id:{
                    $in:arrProject
                }
            },"baseUrls name"));
            arr=arr.map(function (obj) {
                return {
                    _id:obj._id,
                    name:obj.name,
                    data:obj.baseUrls.map(function (obj) {
                        return {
                            _id:obj.url,
                            name:obj.url,
                            env:obj.env
                        }
                    })
                }
            })
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.interfaceProject=async (req,res)=>{
        try
        {
            let objProject=await (project.findOneAsync({
                _id:req.clientParam.project
            },"baseUrls after before"));
            if(!objProject)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            if(req.clientParam.version)
            {
                let objVersion=await (version.findOneAsync({
                    _id:req.clientParam.version
                },"baseUrls after before"));
                if(!objVersion)
                {
                    util.throw(e.versionNotFound,"版本不存在");
                }
                objProject=objVersion;
            }
            util.ok(res,objProject,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.saveCollection=async (req,res)=>{
        try
        {
            let obj;
            if(req.clientParam.collection)
            {
                let update={
                    name:req.clientParam.name
                };
                if(req.clientParam.test)
                {
                    update.tests=JSON.parse(req.clientParam.test);
                }
                if(req.clientParam.output)
                {
                    update.output=JSON.parse(req.clientParam.output);
                }
                obj=await (testCollection.findOneAndUpdateAsync({
                    _id:req.clientParam.collection
                },update,{
                    new:true
                }))
            }
            else
            {
                obj=await (testCollection.createAsync({
                    name:req.clientParam.name,
                    project:req.clientParam.project,
                    user:req.clientParam.user
                }))
            }
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
            let arr=await (testCollection.findAsync({
                project:req.clientParam.project,
                user:req.clientParam.user?req.clientParam.user:req.userInfo._id
            },"name project user",{
                sort:"-createdAt"
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.collectionInfo=async (req,res)=>{
        try
        {
            let obj=await (testCollection.findOneAsync({
                _id:req.clientParam.collection
            },"",{
                populate:{
                    path:"tests.test",
                    populate:[
                        {
                            path:"module",
                            select:"name"
                        },
                        {
                            path:"group",
                            select:"name"
                        }
                    ]
                }
            }));
            obj._doc.tests=obj._doc.tests.filter(function (obj) {
                if(obj.test)
                {
                    return true
                }
                else
                {
                    return false;
                }
            })
            if(!obj)
            {
                util.throw(e.testCollectionNotFound,"集合不存在！");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeCollection=async (req,res)=>{
        try
        {
            let obj=await (testCollection.findOneAsync({
                _id:req.clientParam.collection
            }));
            if(!obj)
            {
                util.throw(e.testCollectionNotFound,"集合不存在！");
            }
            if(obj.poll)
            {
                await (poll.removeAsync({
                    _id:obj.poll
                }))
            }
            await obj.removeAsync();
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getUsers=async (req,res)=>{
        try
        {
            let objProject=await (testProject.findOneAsync({
                _id:req.clientParam.project
            },null,{
                populate:[
                    {
                        path:"owner",
                        select:"name photo"
                    },
                    {
                        path:"users",
                        select:"name photo"
                    }
                ]
            }))
            if(!objProject)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
            }
            let arr=[objProject.owner].concat(objProject.users);
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.cooperationInfo=async (req,res)=>{
        try
        {
            let obj=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
            }
            let arr=[];
            obj.cooperation.forEach(function (obj) {
                if(obj.user.toString()==req.userInfo._id.toString())
                {
                    arr=obj.users;
                }
            })
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.editCooperation=async (req,res)=>{
        try
        {
            let obj=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
            }
            let objSel;
            obj.cooperation.forEach(function (obj) {
                if(obj.user.toString()==req.userInfo._id.toString())
                {
                    objSel=obj;
                }
            })
            if(objSel)
            {
                objSel.users=JSON.parse(req.clientParam.users);
            }
            else
            {
                obj.cooperation.push({
                    user:req.userInfo._id,
                    users:JSON.parse(req.clientParam.users)
                })
            }
            await (obj.saveAsync());
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getAllGroupList=async (req,res)=>{
        try
        {
            let arr=await (testProject.findAsync({
                $or:[
                    {
                        owner:req.userInfo._id
                    },
                    {
                        users:req.userInfo._id
                    }
                ]
            },"name"))
            for(let objProject of arr)
            {
                objProject._doc.children=await (testModule.findAsync({
                    user:req.userInfo._id,
                    project:objProject._id
                },"name"))
                for(let objModule of objProject._doc.children)
                {
                    objModule._doc.children=await (testGroup.findAsync({
                        module:objModule._id
                    },"name"))
                }
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getAllList=async (req,res)=>{
        try
        {
            let arr=await (testProject.findAsync({
                $or:[
                    {
                        owner:req.userInfo._id
                    },
                    {
                        users:req.userInfo._id
                    }
                ]
            },"name"))
            for(let objProject of arr)
            {
                objProject._doc.children=await (testModule.findAsync({
                    user:req.userInfo._id,
                    project:objProject._id
                },"name"))
                for(let objModule of objProject._doc.children)
                {
                    objModule._doc.children=await (testGroup.findAsync({
                        module:objModule._id
                    },"name"))
                    for(let objGroup of objModule._doc.children)
                    {
                        objGroup._doc.children=await (test.findAsync({
                            group:objGroup._id
                        },"name"))
                    }
                }
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exportProject=async (req,res)=>{
        try
        {
            let objProject=await testProject.findOneAsync({
                _id:req.clientParam.project
            },"-_id name dis")
            if(!objProject)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
            }
            objProject._doc.flag="DOClever";
            objProject._doc.type="testProject";
            objProject._doc.module=[];
            let arrModule=await testModule.findAsync({
                project:req.clientParam.project,
                user:req.userInfo._id
            },"name")
            for(let objModule of arrModule)
            {
                let id=objModule._id;
                delete objModule._doc._id;
                objModule._doc.group=[];
                let arrGroup=await testGroup.findAsync({
                    module:id,
                    user:req.userInfo._id
                },"name")
                for(let objGroup of arrGroup)
                {
                    let id=objGroup._id;
                    delete objGroup._doc._id;
                    objGroup._doc.test=[];
                    let arrTest=await test.findAsync({
                        group:id,
                        user:req.userInfo._id
                    },"-project -module -group -owner -editor -user");
                    objGroup._doc.test=arrTest;
                }
                objModule._doc.group=arrGroup;
            }
            objProject._doc.module=arrModule;
            let arrCollection=await testCollection.findAsync({
                project:req.clientParam.project,
                user:req.userInfo._id
            },"name project tests output");
            objProject._doc.collection=arrCollection;
            let content=JSON.stringify(objProject);
            res.writeHead(200,{
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(objProject.name)+".json",
                "Transfer-Encoding": "chunked",
                "Expires":0,
                "Cache-Control":"must-revalidate, post-check=0, pre-check=0",
                "Content-Transfer-Encoding":"binary",
                "Pragma":"public",
            });
            res.end(content);
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.importProject=async (req,res)=>{
        try
        {
            let obj=JSON.parse(req.clientParam.content);
            if(obj.flag!="DOClever" || obj.type!="testProject")
            {
                util.throw(e.systemReason,"数据格式不正确");
            }
            let objProject;
            if(req.clientParam.project)
            {
                objProject=await testProject.findOneAsync({
                    _id:req.clientParam.project
                });
                if(!objProject)
                {
                    util.throw(e.testProjectNotFound,"项目不存在");
                }
            }
            else
            {
                let query={
                    name:obj.name,
                    owner:req.userInfo._id
                }
                if(obj.dis)
                {
                    query.dis=obj.dis;
                }
                if(obj.team)
                {
                    query.team=obj.team;
                }
                objProject=await testProject.createAsync(query)
            }
            let objTest_Id={},objTestId={},arrTest=[],count=0;
            for(let objRawModule of obj.module)
            {
                let query={
                    name:objRawModule.name,
                    project:objProject._id,
                    user:req.userInfo._id
                }
                let objModule=await testModule.findOneAsync(query);
                if(!objModule)
                {
                    query.id=uuid();
                    objModule=await testModule.createAsync(query);
                }
                for(let objRawGroup of objRawModule.group)
                {
                    let query={
                        name:objRawGroup.name,
                        module:objModule._id,
                        project:objProject._id,
                        user:req.userInfo._id
                    }
                    let objGroup=await testGroup.findOneAsync(query);
                    if(!objGroup)
                    {
                        query.id=uuid();
                        objGroup=await testGroup.createAsync(query);
                    }
                    for(let objRawTest of objRawGroup.test)
                    {
                        let query={
                            name:objRawTest.name,
                            project:objProject._id,
                            module:objModule._id,
                            group:objGroup._id,
                            remark:objRawTest.remark?objRawTest.remark:"",
                            owner:req.userInfo._id,
                            editor:req.userInfo._id,
                            status:objRawTest.status,
                            code:objRawTest.code,
                            ui:objRawTest.ui,
                            output:objRawTest.output,
                            id:uuid(),
                            user:req.userInfo._id
                        }
                        let objTest=await test.createAsync(query);
                        arrTest.push(objTest);
                        objTest_Id[objRawTest._id.toString()]=objTest._id;
                        objTestId[objRawTest.id]=objTest._id;
                        count++;
                    }
                }
            }
            for(let o of obj.collection)
            {
                let arr=o.tests.map(function (obj) {
                    obj.test=objTest_Id[obj.test.toString()];
                    return obj;
                })
                let query={
                    name:o.name,
                    project:objProject._id,
                    user:req.userInfo._id,
                    tests:arr,
                    output:o.output
                }
                let objCollection=await testCollection.createAsync(query);
            }
            for(let o of arrTest)
            {
                let arrUI=o.ui;
                for(let i=0;i<arrUI.length;i++)
                {
                    if(arrUI[i].type=="test")
                    {
                        arrUI[i].data=objTest_Id[arrUI[i].data];
                    }
                }
                let code="";
                if(o.code)
                {
                    let ele=document.createElement("div");
                    ele.innerHTML=o.code;
                    let arrLink=ele.getElementsByTagName("a");
                    for(let i=0;i<arrLink.length;i++)
                    {
                        let objLink=arrLink[i];
                        let type=objLink.getAttribute("type")
                        if(type=="2")
                        {
                            let data=objLink.getAttribute("data");
                            if(data.length==24)
                            {
                                objLink.setAttribute("data",objTest_Id[data]);
                            }
                            else
                            {
                                objLink.setAttribute("data",objTestId[data]);
                            }
                        }
                    }
                    code=ele.innerHTML;
                }
                await test.updateAsync({
                    _id:o._id
                },{
                    ui:arrUI,
                    code:code
                })
            }
            objProject._doc.role=0;
            objProject._doc.userCount=1;
            objProject._doc.testCount=count;
            objProject._doc.own=1;
            util.ok(res,objProject,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exportModule=async (req,res)=>{
        try
        {
            let objModule=await testModule.findOneAsync({
                _id:req.clientParam.module
            },"name")
            let id=objModule._id;
            delete objModule._doc._id;
            objModule._doc.flag="DOClever";
            objModule._doc.type="testModule";
            objModule._doc.group=[];
            let arrGroup=await testGroup.findAsync({
                module:id,
                user:req.userInfo._id
            },"name")
            for(let objGroup of arrGroup)
            {
                let id=objGroup._id;
                delete objGroup._doc._id;
                objGroup._doc.test=[];
                let arrTest=await test.findAsync({
                    group:id,
                    user:req.userInfo._id
                },"-project -module -group -owner -editor -user");
                objGroup._doc.test=arrTest;
            }
            objModule._doc.group=arrGroup;
            let content=JSON.stringify(objModule);
            res.writeHead(200,{
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(objModule.name)+".json",
                "Transfer-Encoding": "chunked",
                "Expires":0,
                "Cache-Control":"must-revalidate, post-check=0, pre-check=0",
                "Content-Transfer-Encoding":"binary",
                "Pragma":"public",
            });
            res.end(content);
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.importModule=async (req,res)=>{
        try
        {
            let obj=JSON.parse(req.clientParam.content);
            if(obj.flag!="DOClever" || obj.type!="testModule")
            {
                util.throw(e.systemReason,"数据格式不正确");
            }
            let objProject=await testProject.findOneAsync({
                _id:req.clientParam.project
            })
            if(!objProject)
            {
                util.throw(e.testProjectNotFound,"项目没有找到");
            }
            let query={
                name:obj.name,
                project:objProject._id,
                user:req.userInfo._id
            }
            let objModule=await testModule.findOneAsync(query);
            if(!objModule)
            {
                query.id=uuid();
                objModule=await testModule.createAsync(query);
            }
            let objTest_Id={},objTestId={},arrTest=[];
            for(let objRawGroup of obj.group)
            {
                let query={
                    name:objRawGroup.name,
                    module:objModule._id,
                    project:objProject._id,
                    user:req.userInfo._id
                }
                let objGroup=await testGroup.findOneAsync(query);
                if(!objGroup)
                {
                    query.id=uuid();
                    objGroup=await testGroup.createAsync(query);
                }
                for(let objRawTest of objRawGroup.test)
                {
                    let query={
                        name:objRawTest.name,
                        project:objProject._id,
                        module:objModule._id,
                        group:objGroup._id,
                        remark:objRawTest.remark?objRawTest.remark:"",
                        owner:req.userInfo._id,
                        editor:req.userInfo._id,
                        status:objRawTest.status,
                        code:objRawTest.code,
                        ui:objRawTest.ui,
                        output:objRawTest.output,
                        id:uuid(),
                        user:req.userInfo._id
                    }
                    let objTest=await test.createAsync(query);
                    arrTest.push(objTest);
                    objTest_Id[objRawTest._id.toString()]=objTest._id;
                    objTestId[objRawTest.id]=objTest._id;
                }
            }
            for(let o of arrTest)
            {
                let arrUI=o.ui;
                for(let i=0;i<arrUI.length;i++)
                {
                    if(arrUI[i].type=="test")
                    {
                        arrUI[i].data=objTest_Id[arrUI[i].data];
                    }
                }
                let code="";
                if(o.code)
                {
                    let ele=document.createElement("div");
                    ele.innerHTML=o.code;
                    let arrLink=ele.getElementsByTagName("a");
                    for(let i=0;i<arrLink.length;i++)
                    {
                        let objLink=arrLink[i];
                        let type=objLink.getAttribute("type")
                        if(type=="2")
                        {
                            let data=objLink.getAttribute("data");
                            if(data.length==24)
                            {
                                objLink.setAttribute("data",objTest_Id[data]);
                            }
                            else
                            {
                                objLink.setAttribute("data",objTestId[data]);
                            }
                        }
                    }
                    code=ele.innerHTML;
                }
                await test.updateAsync({
                    _id:o._id
                },{
                    ui:arrUI,
                    code:code
                })
            }
            util.ok(res,objModule,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exportGroup=async (req,res)=>{
        try
        {
            let objGroup=await testGroup.findOneAsync({
                _id:req.clientParam.group
            },"name")
            let id=objGroup._id;
            delete objGroup._doc._id;
            objGroup._doc.flag="DOClever";
            objGroup._doc.type="testGroup";
            objGroup._doc.test=[];
            let arrTest=await test.findAsync({
                group:id,
                user:req.userInfo._id
            },"-project -module -group -owner -editor -user");
            objGroup._doc.test=arrTest;
            let content=JSON.stringify(objGroup);
            res.writeHead(200,{
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(objGroup.name)+".json",
                "Transfer-Encoding": "chunked",
                "Expires":0,
                "Cache-Control":"must-revalidate, post-check=0, pre-check=0",
                "Content-Transfer-Encoding":"binary",
                "Pragma":"public",
            });
            res.end(content);
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.importGroup=async (req,res)=>{
        try
        {
            let obj=JSON.parse(req.clientParam.content);
            if(obj.flag!="DOClever" || obj.type!="testGroup")
            {
                util.throw(e.systemReason,"数据格式不正确");
            }
            let objModule=await testModule.findOneAsync({
                _id:req.clientParam.module
            })
            if(!objModule)
            {
                util.throw(e.testModuleNotFound,"模块没有找到");
            }
            let query={
                name:obj.name,
                module:objModule._id,
                project:objModule.project,
                user:req.userInfo._id
            }
            let objGroup=await testGroup.findOneAsync(query);
            if(!objGroup)
            {
                query.id=uuid();
                objGroup=await testGroup.createAsync(query);
            }
            let objTest_Id={},objTestId={},arrTest=[];
            for(let objRawTest of obj.test)
            {
                let query={
                    name:objRawTest.name,
                    project:objModule.project,
                    module:objModule._id,
                    group:objGroup._id,
                    remark:objRawTest.remark?objRawTest.remark:"",
                    owner:req.userInfo._id,
                    editor:req.userInfo._id,
                    status:objRawTest.status,
                    code:objRawTest.code,
                    ui:objRawTest.ui,
                    output:objRawTest.output,
                    id:uuid(),
                    user:req.userInfo._id
                }
                let objTest=await test.createAsync(query);
                arrTest.push(objTest);
                objTest_Id[objRawTest._id.toString()]=objTest._id;
                objTestId[objRawTest.id]=objTest._id;
            }
            for(let o of arrTest)
            {
                let arrUI=o.ui;
                for(let i=0;i<arrUI.length;i++)
                {
                    if(arrUI[i].type=="test")
                    {
                        arrUI[i].data=objTest_Id[arrUI[i].data];
                    }
                }
                let code="";
                if(o.code)
                {
                    let ele=document.createElement("div");
                    ele.innerHTML=o.code;
                    let arrLink=ele.getElementsByTagName("a");
                    for(let i=0;i<arrLink.length;i++)
                    {
                        let objLink=arrLink[i];
                        let type=objLink.getAttribute("type")
                        if(type=="2")
                        {
                            let data=objLink.getAttribute("data");
                            if(data.length==24)
                            {
                                objLink.setAttribute("data",objTest_Id[data]);
                            }
                            else
                            {
                                objLink.setAttribute("data",objTestId[data]);
                            }
                        }
                    }
                    code=ele.innerHTML;
                }
                await test.updateAsync({
                    _id:o._id
                },{
                    ui:arrUI,
                    code:code
                })
            }
            util.ok(res,objGroup,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exportTest=async (req,res)=>{
        try
        {
            let objTest=await test.findOneAsync({
                _id:req.clientParam.test
            },"-project -module -group -owner -editor -user");
            objTest._doc.flag="DOClever";
            objTest._doc.type="testTest"
            let content=JSON.stringify(objTest);
            res.writeHead(200,{
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(objTest.name)+".json",
                "Transfer-Encoding": "chunked",
                "Expires":0,
                "Cache-Control":"must-revalidate, post-check=0, pre-check=0",
                "Content-Transfer-Encoding":"binary",
                "Pragma":"public",
            });
            res.end(content);
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.importTest=async (req,res)=>{
        try
        {
            let obj=JSON.parse(req.clientParam.content);
            if(obj.flag!="DOClever" || obj.type!="testTest")
            {
                util.throw(e.systemReason,"数据格式不正确");
            }
            let objGroup=await testGroup.findOneAsync({
                _id:req.clientParam.group
            })
            if(!objGroup)
            {
                util.throw(e.testGroupNotFound,"业务没有找到");
            }
            let query={
                name:obj.name,
                project:objGroup.project,
                module:objGroup.module,
                group:objGroup._id,
                remark:obj.remark?obj.remark:"",
                owner:req.userInfo._id,
                editor:req.userInfo._id,
                status:obj.status,
                code:obj.code,
                ui:obj.ui,
                output:obj.output,
                id:uuid(),
                user:req.userInfo._id
            }
            let objTest=await test.createAsync(query);
            util.ok(res,objTest,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.pasteTest=async (req,res)=>{
        try
        {
            let obj=await test.findOneAsync({
                _id:req.clientParam.test
            });
            if(!obj)
            {
                util.throw(e.testNotFound,"用例不存在");
            }
            let objGroup=await testGroup.findOneAsync({
                _id:req.clientParam.group
            });
            if(!objGroup)
            {
                util.throw(e.testGroupNotFound,"业务不存在");
            }
            let query={
                name:obj.name+"(副本)",
                project:objGroup.project,
                module:objGroup.module,
                group:objGroup._id,
                remark:obj.remark?obj.remark:"",
                owner:req.userInfo._id,
                editor:req.userInfo._id,
                status:obj.status,
                code:obj.code,
                ui:obj.ui,
                output:obj.output,
                id:uuid(),
                user:req.userInfo._id
            }
            let objTest=await test.createAsync(query);
            util.ok(res,objTest,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}

module.exports=Test;



