/**
 * Created by sunxin on 16/3/29.
 */
var express=require("express");
var router = express.Router();
var user=require("../model/userModel");
var e=require("../util/error.json");
var con=require("../../config.json");
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
        if(req.session.userid)
        {
            userId=req.session.userid;
        }
        else
        {
            if(req.cookies.id || req.cookies.docleveruserid)
            {
                userId=req.cookies.id?req.cookies.id:req.cookies.docleveruserid;
                req.session.userid=userId;
            }
            else
            {
                if(req.headers["referer"].endsWith("public/public.html"))
                {
                    userId=0;
                }
                else
                {
                    util.throw(e.userNotLogin,"请登录");
                }
            }
        }
        let obj;
        if(userId==0)
        {
            obj={
                _id:"000000000000000000000000",
                name:"temp"
            }
        }
        else
        {
            obj=await (user.findOneAsync({
                _id:userId
            }));
            if(!obj)
            {
                util.throw(e.userNotFound,"用户没有找到");
            }
            else if(obj.state==0)
            {
                util.throw(e.userForbidden,"用户被禁用");
            }
        }
        req.userInfo=obj;
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