/**
 * Created by sunxin on 2017/6/26.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var con=require("../../../config.json");
var user=require("../../model/userModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var apply=require("../../model/applyModel")
var project=require("../../model/projectModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var message=require("../../model/messageModel")
var version=require("../../model/versionModel")
var groupVersion=require("../../model/groupVersionModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var status=require("../../model/statusModel")
var statusVersion=require("../../model/statusVersionModel")
var testGroup=require("../../model/testGroupModel")
var testModule=require("../../model/testModuleModel")
var test=require("../../model/testModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var poll=require("../../model/pollModel")
var fs=require("fs");
function Version() {
    this.validateVersion=async (req,res)=> {
        try
        {
            if(req.clientParam.id)
            {
                let obj=await (version.findOneAsync({
                    _id:req.clientParam.id
                }));
                if(!obj)
                {
                    util.throw(e.versionNotFound,"版本没有找到");
                }
                req.version=obj;
            }
            let pro;
            if(req.clientParam.project)
            {
                pro=req.clientParam.project;
            }
            else if(req.version)
            {
                pro=req.version.project;
            }
            if(pro)
            {
                let obj=await (project.findOneAsync({
                    _id:pro,
                    $or:[
                        {
                            owner:req.userInfo._id
                        },
                        {
                            "users.user":req.userInfo._id
                        }
                    ]
                }));
                if(!obj)
                {
                    obj=await (project.findOneAsync({
                        _id:pro
                    }));
                    if(!obj)
                    {
                        util.throw(e.projectNotFound,"项目不存在");
                        return;
                    }
                    if(obj.team)
                    {
                        let arrUser=await (teamGroup.findAsync({
                            team:obj.team,
                            users:{
                                $elemMatch:{
                                    user:req.userInfo._id,
                                    role:{
                                        $in:[0,2]
                                    }
                                }
                            }
                        }))
                        if(arrUser.length==0 && !obj.public && !req.headers["referer"].endsWith("public/public.html"))
                        {
                            util.throw(e.userForbidden,"你没有权限");
                            return;
                        }
                    }
                    else if(!obj.public && !req.headers["referer"].endsWith("public/public.html"))
                    {
                        util.throw(e.userForbidden,"你没有权限");
                        return;
                    }
                }
                req.project=obj;
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
            let obj;
            let update={
                project:req.clientParam.project,
                version:req.clientParam.version
            }
            if(req.clientParam.dis)
            {
                update.dis=req.clientParam.dis;
            }
            if(req.clientParam.id)
            {
                obj=await (version.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },update,{
                    new:true
                }))
                obj=await (version.populateAsync(obj,{
                    path:"creator",
                    select:"name photo"
                }));
            }
            else
            {
                let groupModel=group,interfaceModel=interface,statusModel=status;
                if(req.headers["docleverversion"])
                {
                    groupModel=groupVersion;
                    interfaceModel=interfaceVersion;
                    statusModel=statusVersion;
                }
                if(req.project.source)
                {
                    update.source=req.project.source
                }
                update.creator=req.userInfo._id;
                update.baseUrls=req.project.baseUrls;
                update.before=req.project.before;
                update.after=req.project.after;
                obj = await (version.createAsync(update));
                let query={
                    project: req.clientParam.project
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"];
                }
                let arr = await (groupModel.findAsync(query));
                for (let o of arr) {
                    let id = o._id;
                    delete o._doc._id;
                    o._doc.version = obj._id
                    let objGroup = await (groupVersion.createAsync(o._doc));
                    let query={
                        group: id
                    }
                    if(req.headers["docleverversion"])
                    {
                        query.version=req.headers["docleverversion"];
                    }
                    let arrInter = await (interfaceModel.findAsync(query));
                    for (let o1 of arrInter) {
                        delete o1._doc._id;
                        o1._doc.version = obj._id;
                        o1._doc.group = objGroup._id;
                        await (interfaceVersion.createAsync(o1._doc));
                    }
                }
                query={
                    project: req.clientParam.project
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"];
                }
                arr = await (status.findAsync(query));
                for (let o of arr) {
                    delete o._doc._id;
                    o._doc.version = obj._id
                }
                if(arr.length>0)
                {
                    await (statusVersion.insertMany(arr.map(function (obj) {
                        return obj._doc
                    })));
                }
                obj=await (version.populateAsync(obj,{
                    path:"creator",
                    select:"name photo"
                }));
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.list=async (req,res)=> {
        try
        {
            let arr=await (version.findAsync({
                project:req.project._id
            },null,{
                populate:{
                    path:"creator",
                    select:"name photo"
                },
                sort:"-createdAt",
                skip:req.clientParam.page*10,
                limit:10
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.remove=async (req,res)=> {
        try
        {
            await (groupVersion.removeAsync({
                version:req.version._id
            }))
            await (interfaceVersion.removeAsync({
                version:req.version._id
            }))
            await (statusVersion.removeAsync({
                version:req.version._id
            }))
            await (interfaceSnapshot.removeAsync({
                version:req.version._id
            }))
            await (poll.removeAsync({
                version:req.version._id
            }))
            await (req.version.removeAsync())
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.roll=async (req,res)=> {
        try
        {
            await (group.removeAsync({
                project:req.project._id
            }))
            await (interface.removeAsync({
                project:req.project._id
            }))
            await (status.removeAsync({
                project:req.project._id
            }))
            await (test.removeAsync({
                project:req.project._id
            }))
            let arr=await (testModule.findAsync({
                project:req.project._id
            }))
            await (testGroup.removeAsync({
                project:{
                    $in:arr.map(function (obj) {
                        return obj._id.toString()
                    })
                }
            }))
            await (testModule.removeAsync({
                project:req.project._id
            }))
            await (poll.removeAsync({
                project:req.project._id,
                version:{
                    $exists:false
                }
            }))
            arr = await (groupVersion.findAsync({
                project: req.project._id,
                version:req.version._id
            }));
            for (let o of arr) {
                let id = o._id;
                delete o._doc._id;
                delete o._doc.version;
                let objGroup = await (group.createAsync(o._doc));
                let arrInter = await (interfaceVersion.findAsync({
                    group: id
                }));
                for (let o1 of arrInter) {
                    delete o1._doc._id;
                    delete o1._doc.version;
                    o1._doc.group = objGroup._id;
                    await (interface.createAsync(o1._doc));
                }
            }
            arr = await (statusVersion.findAsync({
                project: req.project._id,
                version:req.version._id
            }));
            for (let o of arr) {
                delete o._doc._id;
                delete o._doc.version
            }
            if(arr.length>0)
            {
                await (status.insertMany(arr.map(function (obj) {
                    return obj._doc
                })));
            }
            let obj= await (poll.findOneAsync({
                project: req.project._id,
                version:req.version._id
            },null,{
                populate:{
                    path:"test"
                }
            }));
            if(obj)
            {
                delete obj._doc._id;
                delete obj._doc.version;
                obj._doc.testType="Test";
                obj._doc.test=obj._doc.test.map(function (obj) {
                    for(let o of arrMyTest)
                    {
                        if(obj.id==o.id)
                        {
                            return o._id;
                        }
                    }
                })
                await (poll.createAsync(obj._doc));
            }
            req.project.baseUrls=req.version.baseUrls;
            req.project.before=req.version.before;
            req.project.after=req.version.after;
            await (req.project.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

}

module.exports=Version;












