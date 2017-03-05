/**
 * Created by sunxin on 2016/11/17.
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
        let grp;
        if(req.clientParam.group)
        {
            grp=await (group.findOneAsync({
                _id:req.clientParam.group
            }));
            if(!grp)
            {
                util.throw(e.groupNotFound,"分组不存在");
                return;
            }
        }
        let obj=await (project.findOneAsync({
            _id:req.clientParam.id?req.clientParam.id:grp.project,
            $or:[
                {
                    owner:req.userInfo._id
                },
                {
                    users:{
                        $elemMatch:{
                            user:req.userInfo._id,
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
            req.group=grp;
            util.next();
        }
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function create(req,res) {
    try
    {
        let obj=await (group.findOneAsync({
            name:req.clientParam.name,
            project:req.clientParam.id
        }));
        if(obj)
        {
            util.throw(e.duplicateName,"名字重复了");
        }
        if(req.clientParam.group)
        {
            req.group.name=req.clientParam.name;
            await (req.group.saveAsync());

        }
        else
        {
            await (group.createAsync({
                name:req.clientParam.name,
                project:req.clientParam.id
            }));
        }
        let query={
            project:req.clientParam.id
        }
        let arr=await (group.findAsync(query,null,{
            sort:"name"
        }));
        for(let obj of arr)
        {
            let arrInterface=await (interface.findAsync({
                group:obj._id
            }));
            obj._doc.data=arrInterface;
        }
        util.ok(res,arr,"更新成功");

    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function remove(req,res) {
    try
    {
        if(req.group.type==0)
        {
            let obj=await (group.findOneAsync({
                type:1,
                project:req.group.project
            }))
            await (interface.updateAsync({
                group:req.group._id
            },{
                group:obj._id
            },{
                multi:true
            }))
            await (req.group.removeAsync());
            let arr=await (refreshInterface(req.group.project));
            util.ok(res,arr,"删除成功");
        }
        else
        {
            util.throw(e.userForbidden,"系统分组不可删除");
        }

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
            group:req.clientParam.group
        }
        let arr=await (interface.findAsync(query,"name group method",{
            populate:{
                path:"group",
                select:"name"
            },
            sort:"name"
        }))
        util.ok(res,arr,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

exports.validateUser=async (validateUser);
exports.create=async (create);
exports.remove=async (remove);
exports.interface=async (interfaceList);










