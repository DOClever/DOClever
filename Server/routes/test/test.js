/**
 * Created by sunxin on 2017/4/25.
 */
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var status=require("../../model/statusModel")
var test=require("../../model/testModel")
var testVersion=require("../../model/testVersionModel")
var testModule=require("../../model/testModuleModel")
var testModuleVersion=require("../../model/testModuleVersionModel")
var testGroup=require("../../model/testGroupModel")
var testGroupVersion=require("../../model/testGroupVersionModel")
var version=require("../../model/versionModel")
var fs=require("fs");
var uuid=require("uuid/v1");
function validateUser(req,res) {
    try
    {
        req.testModuleModel=testModule;
        req.testGroupModel=testGroup;
        req.testModel=test;
        if(req.headers["docleverversion"])
        {
            req.version=await (version.findOneAsync({
                _id:req.headers["docleverversion"]
            }))
            if(!req.version)
            {
                util.throw(e.versionInvalidate,"版本不可用");
            }
            req.testModuleModel=testModuleVersion;
            req.testGroupModel=testGroupVersion;
            req.testModel=testVersion;
        }
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
            req.project=await (project.findOneAsync({
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
        util.next();
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function save(req,res) {
    try
    {
        let obj={},ret=null;
        for(let key in req.clientParam)
        {
            if(key!="id" && req.clientParam[key]!==undefined)
            {
                obj[key]=req.clientParam[key];
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
        let objProject=await (project.findOneAsync({
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
            obj.id=uuid();
            if(req.headers["docleverversion"])
            {
                obj.version=req.headers["docleverversion"]
            }
            ret=await (req.testModel.createAsync(obj));
        }
        util.ok(res,ret,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function list(req,res) {
    try
    {
        let query={
            project:req.clientParam.project
        }
        if(req.headers["docleverversion"])
        {
            query.version=req.headers["docleverversion"]
        }
        let arrModule=await (req.testModuleModel.findAsync(query,null,{
            sort:"name"
        }));
        for(let objModule of arrModule)
        {
            let arrGroup=await (req.testGroupModel.findAsync({
                module:objModule._id
            },null,{
                sort:"name"
            }));
            for(let objGroup of arrGroup)
            {
                let arrTest=await (req.testModel.findAsync({
                    group:objGroup._id
                },"name id status group",{
                    sort:"name"
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

function saveModule(req,res) {
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
                id:uuid()
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            obj=await (req.testModuleModel.createAsync(query))
        }
        util.ok(res,obj,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function saveGroup(req,res) {
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
                id:uuid()
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            obj=await (req.testGroupModel.createAsync(query))
        }
        util.ok(res,obj,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function removeModule(req,res) {
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

function removeGroup(req,res) {
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

function removeTest(req,res) {
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

function testInfo(req,res) {
    try
    {
        util.ok(res,req.test,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function setStatus(req,res) {
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

function setOutput(req,res) {
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

function moveTest(req,res) {
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

exports.validateUser=async (validateUser);
exports.save=async (save);
exports.list=async (list);
exports.saveModule=async (saveModule);
exports.saveGroup=async (saveGroup);
exports.removeModule=async (removeModule);
exports.removeGroup=async (removeGroup);
exports.removeTest=async (removeTest);
exports.testInfo=async (testInfo);
exports.setStatus=async (setStatus);
exports.setOutput=async (setOutput);
exports.moveTest=async (moveTest);



