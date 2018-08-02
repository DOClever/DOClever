var express=require("express");
var router = express.Router();
var admin=require("../model/adminModel");
var e=require("../util/error.json");
var fs=require("fs");


var util=require("../util/util");
var e=require("../util/error.json");
router.use(async function(req,res,next)
{
    let bUp=false;
    if(/^multipart\/form-data/i.test(req.headers["content-type"]))
    {
        bUp=true;
    }
    try
    {
        let userId;
        if(req.session.admin)
        {
            userId=req.session.admin;
        }
        else
        {
            util.throw(e.userNotLogin,"请登录");
        }
        let obj=await (admin.findOneAsync({
            _id:userId
        }));
        if(!obj)
        {
            util.throw(e.userNotFound,"用户没有找到");
        }
        req.adminInfo=obj;
        if((req.handle instanceof Array) && req.handle.length>0)
        {
            for(let func of req.handle)
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
            req.handle(req,res);
        }
    }
    catch (err)
    {
        if(bUp)
        {
            req.arrFile.forEach(function (obj) {
                util.delImg(obj.dbPath);
            })
        }
        util.catch(res,err);
    }
});


module.exports=router;