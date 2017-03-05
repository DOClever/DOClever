/**
 * Created by sunxin on 2016/11/16.
 */
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
let refreshInterface=async (function (id) {
    let query={
        project:id
    }
    let arr=await (group.findAsync(query,"_id name type",{
        sort:"name"
    }));
    for(let obj of arr)
    {
        let arrInterface=await (interface.findAsync({
            group:obj._id
        },"_id name method",{
            sort:"name"
        }));
        obj._doc.data=arrInterface;
    }
    return arr;
})

function validateUser(req,res) {
    try
    {
        if(req.clientParam.id)
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id,
                $or:[
                    {
                        owner:req.userInfo._id
                    },
                    {
                        users:{
                            $elemMatch:{
                                user:req.userInfo._id,
                                role:0
                            }
                        }
                    }
                ]
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在或者没有权限");
            }
            else
            {
                req.obj=obj;
                util.next();
            }
        }
        else
        {
            util.next();
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function inProject(req,res) {
    try
    {
        let obj=await (project.findOneAsync({
            _id:req.clientParam.id,
            $or:[
                {
                    owner:req.userInfo._id
                },
                {
                    "users.user":req.userInfo._id
                }
            ]
        }))
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在或者没有权限");
        }
        else
        {
            req.obj=obj;
            util.next();
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
};

function create(req,res) {
    try
    {
        let query={
            name:req.clientParam.name,
            owner:req.userInfo._id
        }
        if(req.clientParam.dis)
        {
            query.dis=req.clientParam.dis
        }
        if(!req.clientParam.id)
        {
            let obj=await (project.createAsync(query));
            await (group.createAsync({
                name:"未命名",
                project:obj._id
            }))
            await (group.createAsync({
                name:"#回收站",
                project:obj._id,
                type:1
            }))
            obj._doc.role=0;
            obj._doc.userCount=1;
            obj._doc.interfaceCount=0;
            obj._doc.own=1;
            util.ok(res,obj,"创建成功");
        }
        else
        {
            delete query.owner;
            await (project.updateAsync({
                _id:req.clientParam.id
            },query));
            util.ok(res,"修改成功");
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function addMember(req,res) {
    try
    {
        let obj=req.obj;
        let u=await (user.findOneAsync({
            name:req.clientParam.user
        }))
        if(!u)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        else if(u._id.toString()==req.userInfo._id.toString())
        {
            util.throw(e.userForbidden,"自己不能邀请自己");
        }
        else if(u._id.toString()==obj.owner.toString())
        {
            util.throw(e.userExits,"用户已经存在");
        }
        for(let o of obj.users)
        {
            if(o.user.toString()==u._id.toString())
            {
                util.throw(e.userExits,"用户已经存在");
            }
        }
        await (project.updateAsync({
            _id:obj._id
        },{
            $addToSet:{
                users:{
                    user:u._id,
                    role:req.clientParam.role
                }
            }
        }));
        util.ok(res,{
            role:req.clientParam.role,
            user:u
        },"添加成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function role(req,res) {
    try
    {
        await (project.updateAsync({
            _id:req.clientParam.id,
            "users.user":req.clientParam.user
        },{
            "users.$.role":req.clientParam.role
        }));
        util.ok(res,"修改成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function removeMember(req,res) {
    try
    {
        await (project.updateAsync({
            _id:req.clientParam.id,
            "users.user":req.clientParam.user
        },{
            $pull:{
                users:{
                    user:req.clientParam.user
                }
            }
        }));
        util.ok(res,"踢人成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function list(req,res) {
    try
    {
        let ret=[];
        let arr=await (project.findAsync({
            owner:req.userInfo._id
        },"name dis users",{
            sort:"-createdAt"
        }));
        arr.forEach(function (obj) {
            obj._doc.role=0;
            obj._doc.own=1;
        })
        ret=ret.concat(arr);
        arr=await (project.findAsync({
            users:{
                $elemMatch:{
                    user:req.userInfo._id,
                    role:0
                }
            }
        },"name dis users",{
            sort:"-createdAt"
        }))
        arr.forEach(function (obj) {
            obj._doc.own=0;
            obj._doc.role=0;
        })
        ret=ret.concat(arr);
        arr=await (project.findAsync({
            users:{
                $elemMatch:{
                    user:req.userInfo._id,
                    role:1
                }
            }
        },"name dis",{
            sort:"-createdAt"
        }))
        arr.forEach(function (obj) {
            obj._doc.own=0;
            obj._doc.role=1;
        })
        ret=ret.concat(arr);
        ret.sort(function (obj1,obj2) {
            return obj1.createdAt<obj2.createdAt
        })
        for(var obj of ret)
        {
            obj._doc.userCount=obj.users.length+1;
            delete obj._doc.users;
            obj._doc.interfaceCount=await (interface.countAsync({
                project:obj._id
            }))
        }
        util.ok(res,ret,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function url(req,res) {
    try
    {
        let arr=req.clientParam.urls?req.clientParam.urls.split(","):[];
        arr=arr.map(function (obj) {
            if(!obj.startsWith("http://") && !obj.startsWith("https://"))
            {
                obj="http://"+obj;
            }
            return obj;
        })
        await (project.updateAsync({
            _id:req.clientParam.id
        },{
            baseUrls:arr
        }))
        util.ok(res,arr,"修改成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function info(req,res) {
    try
    {
        let obj=await (project.findOneAsync({
            _id:req.clientParam.id
        },null,{
            populate:{
                path:"users.user"
            }
        }))
        util.ok(res,obj,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function groupList(req,res) {
    try
    {
        let arr=await (group.findAsync({
            project:req.clientParam.id
        },null,{
            sort:"name"
        }))
        util.ok(res,arr,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function interfaceList(req,res) {
    try
    {
        let query={
            project:req.clientParam.id
        }
        let arr=await (group.findAsync(query,"_id name type",{
            sort:"name"
        }));
        for(let obj of arr)
        {
            let arrInterface=await (interface.findAsync({
                group:obj._id
            },"_id name method",{
                sort:"name"
            }));
            obj._doc.data=arrInterface;
        }
        util.ok(res,arr,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function clear(req,res) {
    try
    {
        let query={
            project:req.clientParam.id,
            type:1
        }
        let obj=await (group.findOneAsync(query));
        await (interface.removeAsync({
            group:obj._id
        }));
        let arr=await (refreshInterface(req.clientParam.id));
        util.ok(res,arr,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function removeProject(req,res) {
    try
    {
        await (interface.removeAsync({
            project:req.clientParam.id
        }));
        await (group.removeAsync({
            project:req.clientParam.id
        }))
        await (project.removeAsync({
            _id:req.clientParam.id
        }))
        util.ok(res,"删除成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function quit(req,res) {
    try
    {
        let obj=await (project.findOneAsync({
            _id:req.clientParam.id
        }));
        if(obj.owner.toString()==req.clientParam.id)
        {
            util.throw(e.userForbidden,"创建的项目不能退出");
        }
        let index=-1;
        for(let i=0;i< obj.users.length;i++)
        {
            let u=obj.users[i];
            if(u.user.toString()==req.userInfo._id.toString())
            {
                index=i;
                break;
            }
        }
        if(index==-1)
        {
            util.throw(e.projectNotFound,"你已经不在该项目里了");
        }
        else
        {
            obj.users.splice(index,1);
            await (obj.saveAsync());
            util.ok(res,"退出成功");
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function addUrl(req,res) {
    try
    {
        let url=req.clientParam.url;
        if(!url.startsWith("http://") && !url.startsWith("https://"))
        {
            url="http://"+url;
        }
        await (project.updateAsync({
            _id:req.clientParam.id
        },{
            $addToSet:
                {
                    baseUrls:url
                }
        }))
        util.ok(res,"添加成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

exports.validateUser=async (validateUser);
exports.inProject=async (inProject);
exports.create=async (create);
exports.addMember=async (addMember);
exports.role=async (role);
exports.removeMember=async (removeMember);
exports.list=async (list)
exports.url=async (url)
exports.info=async (info)
exports.group=async (groupList);
exports.interface=async (interfaceList);
exports.clear=async (clear);
exports.removeProject=async (removeProject);
exports.addUrl=async (addUrl);
exports.quit=async (quit);







