/**
 * Created by sunxin on 2017/2/5.
 */
var express=require("express");


var e=require("../../util/error.json");
var util=require("../../util/util");
var con=require("../../../config.json");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var fs=require("fs");
var router=express.Router();
router.use("/:id",async function(req,res,next) {
    try
    {
        req.arrFile.forEach(function (obj) {
            util.delImg(obj.dbPath);
        })
        if(req.params.id.length!=24 && req.params.id.length!=48)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        let projectId=req.params.id.substr(0,24);
        let versionId=req.params.id.substr(24,24);
        req.interfaceModel=interface;
        if(versionId)
        {
            req.interfaceModel=interfaceVersion;
            req.version=versionId;
        }
        let obj=await (project.findOneAsync({
            _id:projectId
        }))
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        let mockUrl=req.originalUrl.substr(req.params.id.length+6);
        let index=mockUrl.indexOf("?");
        if(index>-1)
        {
            mockUrl=mockUrl.substring(0,index);
        }
        if(mockUrl.length==0)
        {
            util.throw(e.systemReason,"接口path不存在");
        }
        let query={
            url:{
                $in:[mockUrl,mockUrl.substr(1)]
            },
            project:obj._id,
            method:req.method,
        };
        if(versionId)
        {
            query.version=versionId;
        }
        let objInter=await (req.interfaceModel.findOneAsync(query))
        if(!objInter)
        {
            let mockArr=mockUrl.split("/");
            let query={
                method:req.method,
                project:obj._id
            }
            if(versionId)
            {
                query.version=versionId;
            }
            let arr=await (req.interfaceModel.findAsync(query));
            for(let o of arr)
            {
                let arrUrl=o.url.split("/");
                if(arrUrl.length==mockArr.length)
                {
                    let bMatch=true,param={};
                    for(let i=0;i<arrUrl.length;i++)
                    {
                        let start=arrUrl[i].indexOf("{");
                        let end=arrUrl[i].indexOf("}");
                        if(!(start>-1 && end>-1 && arrUrl[i].length>2))
                        {
                            if(arrUrl[i]!=mockArr[i])
                            {
                                bMatch=false;
                                break;
                            }
                        }
                        else if(start>-1 && end>-1 && arrUrl[i].length>2)
                        {
                            let str=arrUrl[i].substring(start+1,end);
                            let len=arrUrl[i].substr(end+1).length;
                            param[str]=mockArr[i].substr(start,mockArr[i].length-(start+len));
                        }
                    }
                    if(bMatch)
                    {
                        req.obj=o;
                        req.param=param;
                        next();
                        return;
                    }
                }
            }
            util.throw(e.interfaceNotFound,"接口不存在");
        }
        else
        {
            req.obj=objInter;
            next();
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
})

router.use(async function(req,res) {
    try
    {
        let param,clientParam,type;
        if(req.obj.method=="GET" || req.obj.method=="DELETE")
        {
            type="query";
            clientParam=req.query;
        }
        else
        {
            if(req.headers["content-type"]=="application/json")
            {
                type="json";
            }
            else
            {
                type="body";
            }
            clientParam=req.clientParam || req.body;
        }
        param=await (util.getMockParam(clientParam,req.obj,type,req.version));
        res.setHeader("finish-doclever",req.obj.finish);
        let info=util.handleMockInfo(req.param,req.query,req.body,req.headers,req.obj,req.protocol+"://"+req.headers.host+req.originalUrl);
        if(!param.outInfo || param.outInfo.type==0)
        {
            let result=param.outInfo.jsonType==1?[]:{};
            util.convertToJSON(param.outParam,result,info);
            res.json(result);
        }
        else
        {
            res.json(util.mock(param.outInfo.rawMock,info));
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
})



module.exports=router;