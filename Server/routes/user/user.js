/**
 * Created by sunxin on 2016/11/9.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var userCom=require("./userCommon");
var user=require("../../model/userModel")
var group=require("../../model/groupModel")
var apply=require("../../model/applyModel")
var project=require("../../model/projectModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var message=require("../../model/messageModel")
var info=require("../../model/infoModel")
var fs=require("fs");

function User() {
    this.user=new userCom();
    this.login=async (req,res) =>{
        try
        {
            let obj;
            if(req.clientParam.id)
            {
                obj= await (this.user.updateUser(null,null,req.clientParam.id));
            }
            else if(req.clientParam.qqid)
            {
                obj= await (this.user.updateUser(null,null,null,req.clientParam.qqid));
                if(obj)
                {
                    await (this.user.setQQImg(obj._id,req.clientParam.qqimg))
                }
            }
            else
            {
                obj= await (this.user.updateUser(req.clientParam.name,req.clientParam.password));
            }
            if(obj)
            {
                if(obj.state==1)
                {
                    req.session.userid=obj._id;
                    util.ok(res,obj,"ok");
                }
                else
                {
                    util.throw(e.userForbidden,"用户被禁用");
                }
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
    this.createQQ=async (req,res)=>{
        try
        {
            let obj={
                name:req.clientParam.name,
                password:req.clientParam.password,
                qqId:req.clientParam.qqid,
                question:req.clientParam.question,
                answer:req.clientParam.answer,
                email:req.clientParam.email
            };
            obj.photo=await (this.user.downloadImg(req.clientParam.qqimg));
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
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.save=async (req,res)=> {
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
                else if(req.clientParam.photo && obj.photo && req.clientParam.photo!=obj.photo)
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
                let objInfo=await (info.findOneAsync());
                if(!objInfo.register)
                {
                    util.throw(e.registerForbidden,"注册被禁用了");
                }
                let obj={};
                for(let key in req.clientParam)
                {
                    obj[key]=req.clientParam[key];
                }
                if(!obj.name || !obj.password)
                {
                    util.throw(e.paramWrong,"姓名密码不能为空");
                }
                else if(!obj.email)
                {
                    util.throw(e.paramWrong,"邮箱不能为空");
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

    this.logout=async (req,res)=> {
        try
        {
            req.session.userid=null;
            delete req.session.userid;
            util.ok(res,"退出成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.editPass=async (req,res)=> {
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

    this.reset=async (req,res)=> {
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

    this.question=async (req,res)=> {
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

    this.applyList=async (req,res)=> {
        try
        {
            let arr=await (apply.findAsync({
                to:req.userInfo._id,
                type:0,
                state:0
            },null,{
                populate:{
                    path:"creator",
                    select:"name photo"
                },
                sort:"-createdAt"
            }));
            arr=await (apply.populateAsync(arr,{
                path:"from",
                select:"name"
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.handleApply=async (req,res)=> {
        try
        {
            let obj=await (apply.findOneAsync({
                _id:req.clientParam.apply
            },null,{
                populate:{
                    path:"from",
                    select:"name"
                }
            }));
            if(!obj)
            {
                util.throw(e.applyNotFound,"申请不存在");
            }
            else if(obj.state!=0)
            {
                util.throw(e.applyAlreadyHandle,"申请已经处理过了");
            }
            let objTeam=await (team.findOneAsync({
                _id:obj.from._id
            }))
            if(!objTeam)
            {
                util.throw(e.teamNotFound,"团队不存在");
            }
            obj.editor=req.userInfo._id;
            if(await (this.user.existUserInTeam(obj.from._id,req.userInfo._id)))
            {
                obj.state=3;
                await (obj.saveAsync());
                util.throw(e.userAlreadyInTeam,"用户已经在团队中");
            }
            obj.state=req.clientParam.state;
            if(req.clientParam.state==1)
            {
                let objGroup=await (teamGroup.findOneAndUpdateAsync({
                    _id:obj.relatedData
                },{
                    $addToSet:{
                        users:{
                            user:req.userInfo._id,
                            role:1
                        }
                    }
                }))
                if(!objGroup)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    util.throw(e.teamGroupNotFound,"部门不存在");
                }
            }
            await (message.createAsync({
                name:req.clientParam.state==1?"您已同意加入团队":"您已拒绝加入团队",
                dis:`您已${req.clientParam.state==1?"同意":"拒绝"}加入团队${obj.from.name}`,
                user:req.userInfo._id,
                type:1
            }))
            await (obj.saveAsync());
            if(req.clientParam.state==1)
            {
                obj=await (team.findOneAsync({
                    _id:objTeam._id
                }))
                let arr=await (teamGroup.findAsync({
                    team:obj._id
                }))
                let count=0;
                for(let o of arr)
                {
                    count+=o.users.length;
                }
                obj._doc.userCount=count;
                obj._doc.projectCount=await (project.countAsync({
                    team:obj._id
                }))
                util.ok(res,obj,"ok");
            }
            else
            {
                util.ok(res,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.setSendInfo=async (req,res)=>{
        try
        {
            req.userInfo.sendInfo.user=req.clientParam.user;
            req.userInfo.sendInfo.password=req.clientParam.password;
            req.userInfo.sendInfo.smtp=req.clientParam.smtp;
            req.userInfo.sendInfo.user=req.clientParam.user;
            await (req.userInfo.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getSendInfo=async (req,res)=>{
        try
        {
            util.ok(res,req.userInfo.sendInfo,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.version=async (req,res)=>{
        try
        {
            let obj=await (this.user.getVersionInfo());
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}

module.exports=User;










