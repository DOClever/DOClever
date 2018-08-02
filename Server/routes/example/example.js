

var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var example=require("../../model/exampleModel")
var fs=require("fs");
var uuid=require("uuid/v1");

function Example() {
    this.saveExample=async (req,res)=>{
        try
        {
            let query={
                name:req.clientParam.name,
                project:req.clientParam.project,
                interface:req.clientParam.interface,
                paramId:req.clientParam.paramid,
                param:JSON.parse(req.clientParam.param)
            }
            let obj;
            if(req.clientParam.id)
            {
                obj=await (example.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },query,{
                    new:true
                }))
            }
            else
            {
                if(req.headers["docleverversion"])
                {
                    query.interfaceType="InterfaceVersion";
                }
                query.owner=req.userInfo._id;
                obj=await (example.createAsync(query));
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exampleInfo=async (req,res)=>{
        try
        {
            let obj=await (example.findOneAsync({
                _id:req.clientParam.id
            }));
            if(!obj)
            {
                util.throw(e.exampleNotFound,"运行实例未找到");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exampleList=async (req,res)=>{
        try
        {
            let query={
                interface:req.clientParam.interface,
                paramId:req.clientParam.paramid
            }
            let arr=await (example.findAsync(query,"name createdAt",{
                sort:"-createdAt"
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeExample=async (req,res)=>{
        try
        {
            await (example.removeAsync({
                _id:req.clientParam.id
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.exampleAllList=async (req,res)=>{
        try
        {
            let arr=await (example.findAsync({
                interface:req.clientParam.interface
            },"name paramId"));
            let obj={};
            arr.forEach(function (o) {
                let id=o.paramId;
                if(obj[id])
                {
                    obj[id].push(o);
                }
                else
                {
                    obj[id]=[o];
                }
            })
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}


module.exports=Example;