/**
 * Created by sunxin on 2017/4/13.
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
var fs=require("fs");
var uuid=require("uuid/v1");
function save(req,res) {
    try
    {
        var obj={};
        if(req.clientParam.name)
        {
            obj.name=req.clientParam.name;
        }
        if(req.clientParam.project)
        {
            obj.project=req.clientParam.project;
        }
        if(req.clientParam.data)
        {
            obj.data=JSON.parse(req.clientParam.data)
        }
        let ret;
        if(req.clientParam.id)
        {
            ret=await (status.findOneAndUpdateAsync({
                _id:req.clientParam.id
            },obj,{
                new:true
            }));
        }
        else
        {
            obj.id=uuid();
            ret=await (status.createAsync(obj));
        }
        util.ok(res,ret,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function remove(req,res) {
    try
    {
        await (status.removeAsync({
            _id:req.clientParam.id
        }))
        util.ok(res,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function list(req,res) {
    try
    {
        let arr=await (status.findAsync({
            project:req.clientParam.id
        },null,{
            sort:"-createdAt"
        }))
        util.ok(res,arr,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function exportJSON(req,res) {
    try
    {
        let ret=await (status.findOneAsync({
            _id:req.clientParam.id
        }));
        if(!ret)
        {
            util.throw(e.statusNotFound,"状态码不存在");
            return;
        }
        var obj={
            name:ret.name,
            data:ret.data,
            flag:"SBDoc",
            id:ret.id
        }
        let content=JSON.stringify(obj);
        res.writeHead(200,{
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(ret.name)+".json",
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

function importJSON(req,res) {
    try
    {
        let obj;
        try
        {
            obj=JSON.parse(req.clientParam.json);
        }
        catch (err)
        {
            util.throw(e.systemReason,"json解析错误");
            return;
        }
        if(obj.flag!="SBDoc")
        {
            util.throw(e.systemReason,"不是SBDoc的导出格式");
            return;
        }
        let objProject=await (project.findOneAsync({
            _id:req.clientParam.project
        }))
        if(!objProject)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        let newObj={
            name:obj.name,
            project:objProject._id,
            data:obj.data,
            id:obj.id
        }
        let ret=await (status.createAsync(newObj));
        util.ok(res,ret,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

exports.save=async (save);
exports.remove=async (remove);
exports.list=async (list);
exports.exportJSON=async (exportJSON);
exports.importJSON=async (importJSON);









