/**
 * Created by sunxin on 2017/2/5.
 */
var express=require("express");
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var con=require("../../../config.json");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var fs=require("fs");
var router=express.Router();
router.use("/:id",async (validate))

router.use(async (handle))


function validate(req,res,next) {
    try
    {
        req.arrFile.forEach(function (obj) {
            util.delImg(obj.dbPath);
        })
        if(req.params.id.length!=24)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        let obj=await (project.findOneAsync({
            _id:req.params.id
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
        let objInter=await (interface.findOneAsync({
            url:{
                $in:[mockUrl,mockUrl.substr(1)]
            },
            project:obj._id,
            method:req.method,
        }))
        if(!objInter)
        {
            let mockArr=mockUrl.split("/");
            let arr=await (interface.findAsync({
                method:req.method,
                project:obj._id
            }));
            for(let o of arr)
            {
                let arrUrl=o.url.split("/");
                if(arrUrl.length==mockArr.length)
                {
                    let bMatch=true;
                    for(let i=0;i<arrUrl.length;i++)
                    {
                        if(!(arrUrl[i].indexOf("{")>-1 && arrUrl[i].indexOf("}")>-1 && arrUrl[i].length>2))
                        {
                            if(arrUrl[i]!=mockArr[i])
                            {
                                bMatch=false;
                                break;
                            }
                        }
                    }
                    if(bMatch)
                    {
                        req.obj=o;
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
}

function handle(req,res) {
    try
    {
        let param,clientParam;
        if(req.obj.method=="GET" || req.obj.method=="DELETE")
        {
            param=req.obj.queryParam;
            clientParam=Object.keys(req.query);

        }
        else
        {
            if(!req.obj.bodyInfo || req.obj.bodyInfo.type==0)
            {
                param=req.obj.bodyParam;
                clientParam=Object.keys(req.clientParam || req.body);
            }
        }
        if(param)
        {
            for(let obj of param)
            {
                if(obj.must==1)
                {
                    if(clientParam.indexOf(obj.name)==-1)
                    {
                        util.throw(e.missParam,"缺少"+obj.name+"参数");
                    }
                }
            }
        }
        res.setHeader("__finish",req.obj.finish);
        let info=util.handleMockInfo(req.param,req.query,req.body,req.headers,req.obj,req.protocol+"://"+req.headers.host+req.originalUrl);
        if(!req.obj.outInfo || req.obj.outInfo.type==0)
        {
            let result=req.obj.outInfo.jsonType==1?[]:{};
            util.convertToJSON(req.obj.outParam,result,info);
            res.json(result);
        }
        else
        {
            res.json(util.mock(req.obj.outInfo.rawMock,info));
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
}
module.exports=router;