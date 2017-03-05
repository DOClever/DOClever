/**
 * Created by sunxin on 2016/11/9.
 */
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var con=require("../../../config.json");
var user=require("../../model/userModel")
var group=require("../../model/groupModel")
var fs=require("fs");

function login(req,res) {
    try
    {
        let obj= await (user.findOneAsync({
            name:req.clientParam.name,
            password:req.clientParam.password
        },"-password -question -answer"));
        if(obj)
        {
            req.session.userid=obj._id;
            obj.lastLoginDate=Date.now();
            obj.loginCount++;
            await (obj.saveAsync());
            util.ok(res,obj,"ok");
        }
        else
        {
            util.throw(e.userOrPwdWrong,"用户名或者密码错误");
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function save(req,res) {
    try
    {
        if(req.clientParam.userid)
        {
            let update={};
            for(let key in req.clientParam)
            {
                if(key!="userid")
                {
                    update[key]=req.clientParam[key];
                }
            }
            if(update.name)
            {
                let ret=await (user.findOneAsync({
                    name:update.name
                }));
                if(ret)
                {
                    util.throw(e.duplicateUser,"用户名重复");
                }
            }
            let obj=await (user.findOneAndUpdateAsync({
                _id:req.clientParam.userid
            },update,{
                new:false
            }));
            if(!obj)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            else if(obj.photo && req.clientParam.photo!=obj.photo)
            {
                util.delImg(obj.photo);
            }
            obj=await (user.findOneAsync({
                _id:req.clientParam.userid
            },"-password"))
            util.ok(res,obj,"ok");
        }
        else
        {
            let obj={};
            for(let key in req.clientParam)
            {
                obj[key]=req.clientParam[key];
            }
            if(!obj.name || !obj.password)
            {
                util.throw(e.paramWrong,"姓名密码不能为空");
            }
            let ret=await (user.findOneAsync({
                name:obj.name
            }));
            if(ret)
            {
                util.throw(e.duplicateUser,"用户名重复");
            }
            obj=await (user.createAsync(obj));
            delete obj._doc.password;
            util.ok(res,obj,"ok");
        }
    }
    catch (err)
    {
        req.arrFile.forEach(function (obj) {
            util.delImg(obj.dbPath);
        });
        util.catch(res,err);
    }
}

function logout(req,res) {
    try
    {
        req.session.destroy();
        util.ok(res,"退出成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function editPass(req,res) {
    try
    {
        if(req.userInfo.password!=req.clientParam.oldpass)
        {
            util.throw(e.userOrPwdWrong,"密码错误");
        }
        req.userInfo.password=req.clientParam.newpass;
        await (req.userInfo.saveAsync());
        util.ok(res,"修改成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function reset(req,res) {
    try
    {
        let obj=await (user.findOneAsync({
            name:req.clientParam.name
        }));
        if(!obj)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        if(obj.answer!=req.clientParam.answer)
        {
            util.throw(e.userOrPwdWrong,"答案错误");
        }
        obj.password=req.clientParam.password;
        await (obj.saveAsync());
        util.ok(res,"修改成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function question(req,res) {
    try
    {
        let obj=await (user.findOneAsync({
            name:req.clientParam.name
        }));
        if(!obj)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        if(obj.question=="")
        {
            util.throw(e.questionIsEmpty,"找回密码问题不存在");
        }
        util.ok(res,obj.question,"获取成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

exports.login=async (login);
exports.save=async (save);
exports.logout=async (logout);
exports.editPass=async (editPass);
exports.reset=async (reset);
exports.question=async (question);











