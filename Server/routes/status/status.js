/**
 * Created by sunxin on 2017/4/13.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var status=require("../../model/statusModel")
var statusVersion=require("../../model/statusVersionModel")
var version=require("../../model/versionModel")
var fs=require("fs");
var uuid=require("uuid/v1");
function Status() {
    this.validate=async (req,res)=> {
        try
        {
            req.statusModel=status;
            if(req.headers["docleverversion"])
            {
                req.version=await (version.findOneAsync({
                    _id:req.headers["docleverversion"]
                }))
                if(!req.version)
                {
                    util.throw(e.versionInvalidate,"版本不可用");
                }
                req.statusModel=statusVersion;
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
                ret=await (req.statusModel.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },obj,{
                    new:true
                }));
            }
            else
            {
                obj.id=uuid();
                if(req.headers["docleverversion"])
                {
                    obj.version=req.headers["docleverversion"]
                }
                ret=await (req.statusModel.createAsync(obj));
            }
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.remove=async (req,res)=> {
        try
        {
            await (req.statusModel.removeAsync({
                _id:req.clientParam.id
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.list=async (req,res)=> {
        try
        {
            let query={
                project:req.clientParam.id
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let arr=await (req.statusModel.findAsync(query,null,{
                sort:"-createdAt"
            }))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.exportJSON=async (req,res)=> {
        try
        {
            let ret=await (req.statusModel.findOneAsync({
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

    this.importJSON=async (req,res)=> {
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
                util.throw(e.systemReason,"不是DOClever的导出格式");
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
            if(req.headers["docleverversion"])
            {
                newObj.version=req.headers["docleverversion"]
            }
            let ret=await (req.statusModel.createAsync(newObj));
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}

module.exports=Status;









