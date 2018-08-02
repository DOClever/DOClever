/**
 * Created by sunxin on 16/3/30.
 */
var express=require("express");
var user=require("../model/userModel");
var e=require("../util/error.json");
var util=require("../util/util");


function route(category) {
    var router = util.router(category);
    if(router instanceof Array)
    {
        return router[0];
    }
    var inter=require("./"+category+"/"+category+"Imp.js");
    router.use(async function(req,res,next)
    {
        var bFind=false;
        var index;
        for(var key in inter)
        {
            if(inter[key].method==req.method && inter[key].path==req.baseUrl+req._parsedUrl.pathname)
            {
                bFind=true;
                index=key;
                break;
            }
        }
        if(!bFind)
        {
            next();
            return;
        }
        var clientParam;
        var id;
        if(req.method=="POST" || req.method=="PUT" || req.method=="PATCH")
        {
            if(!req.clientParam)
            {
                req.clientParam=req.body;
            }
        }
        else
        {
            req.clientParam=req.query;
        }
        var param=inter[index].param;
        let temp={};
        for(var key in param) {
            if ((req.clientParam[key] == undefined || req.clientParam[key].length==0) && !param[key].optional) {
                res.json({
                    code: e.missParam,
                    msg: "缺少" + key + "参数"
                });
                return;
            }
            else if (req.clientParam[key] && (param[key].type == Number || param[key]==Number)) {
                if(isNaN(req.clientParam[key]))
                {
                    res.json({
                        code: e.paramTypeWrong,
                        msg: "参数" + key + "必须为number"
                    });
                    return;
                }
                else
                {
                    temp[key]=parseFloat(req.clientParam[key]);
                }
            }
            else if(req.clientParam[key] && param[key].type == String && (param[key].uppercase || param[key].lowercase))
            {
                if(param[key].uppercase)
                {
                    temp[key]=req.clientParam[key].toUpperCase();
                }
                else
                {
                    temp[key]=req.clientParam[key].toLowerCase();
                }
            }
            else if(req.clientParam[key]!=undefined)
            {
                temp[key]=req.clientParam[key];
            }
            if(temp[key] && param[key].validate)
            {
                let bSuccess=util.validateParam(temp[key],param[key].validate);
                if(!bSuccess)
                {
                    res.json({
                        code: e.validateParamFail,
                        msg: "参数" + key + "验证失败"
                    });
                    return;
                }
            }
            if(temp[key] && param[key].rename)
            {
                temp[param[key].rename]=temp[key];
                delete temp[key];
            }
        }
        req.clientParam=temp;
        if(inter[index].user || inter[index].admin)
        {
            req.handle=inter[index].handle
            next();
        }
        else
        {
            if((inter[index].handle instanceof Array) && inter[index].handle.length>0)
            {
                for(let func of inter[index].handle)
                {
                    let ret=await (func(req,res))
                    if(ret!==true)
                    {
                        break;
                    }
                }
            }
            else
            {
                inter[index].handle(req,res);
            }

        }
    });
    return router;
}

module.exports=route;