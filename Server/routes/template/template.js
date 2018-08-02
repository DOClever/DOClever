

var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var template=require("../../model/templateModel")
var fs=require("fs");
var uuid=require("uuid/v1");

function Template() {
    this.saveTemplate=async (req,res)=>{
        try
        {
            let query={
                name:req.clientParam.name,
                method:req.clientParam.method,
                param:JSON.parse(req.clientParam.param),
                url:req.clientParam.url?req.clientParam.url:"",
                remark:req.clientParam.remark?req.clientParam.remark:"",
                project:req.clientParam.project
            };
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let ret;
            if(req.clientParam.id)
            {
                ret=await (template.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },query,{
                    new:true
                }))
            }
            else
            {
                ret=await (template.createAsync(query))
            }
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.templateInfo=async (req,res)=>{
        try
        {
            let obj=await (template.findOneAsync({
                _id:req.clientParam.id
            }));
            if(!obj)
            {
                util.throw(e.templateNotFound,"接口模板未找到");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.templateList=async (req,res)=>{
        try
        {
            let query={
                project:req.clientParam.project
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let arr=await (template.findAsync(query,"name createdAt",{
                sort:"-createdAt"
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeTemplate=async (req,res)=>{
        try
        {
            await (template.removeAsync({
                _id:req.clientParam.id
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}


module.exports=Template;