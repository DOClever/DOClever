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
var uuid=require("uuid/v1");
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
        },"_id name method finish url",{
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
            let result=await (group.createAsync({
                name:req.clientParam.name,
                project:req.clientParam.id,
                id:uuid()
            }));
            if(req.clientParam.import==1)
            {
                util.ok(res,result,"ok");
                return;
            }
        }
        let arr=await (refreshInterface(req.clientParam.id));
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

function exportJSON(req,res) {
    try
    {
        let obj={
            name:req.group.name,
            flag:"SBDoc",
            data:[]
        };
        let arr=await (interface.findAsync({
            group:req.group._id
        }));
        for(let item of arr)
        {
            let newInter={};
            for(let key in item._doc)
            {
                if(item._doc.hasOwnProperty(key) && key!="__v" && key!="_id" && key!="project" && key!="group" && key!="owner" && key!="editor")
                {
                    newInter[key]=item._doc[key];
                }
            }
            obj.data.push(newInter);
        }
        let content=JSON.stringify(obj);
        res.writeHead(200,{
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(req.group.name)+".json",
            "Transfer-Encoding": "chunked",
            "Expires":0,
            "Cache-Control":"must-revalidate, post-check=0, pre-check=0",
            "Content-Transfer-Encoding":"binary",
            "Pragma":"public",
        });
        res.end(content);
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function importJSON(req,res) {
    try
    {
        let obj;
        try
        {
            obj=JSON.parse(req.clientParam.json);
        }
        catch (err)
        {
            util.throw(e.systemReason,"json解析错误");
            return;
        }
        if(obj.flag!="SBDoc")
        {
            util.throw(e.systemReason,"不是SBDoc的导出格式");
            return;
        }
        let objProject=await (project.findOneAsync({
            _id:req.clientParam.id
        }))
        if(!objProject)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        let objGroup=await (group.createAsync({
            name:obj.name,
            project:objProject._id,
        }));
        for(let item of obj.data)
        {
            item.project=objProject._id;
            item.group=objGroup._id;
            item.owner=req.userInfo._id;
            item.editor=req.userInfo._id;
            await (interface.createAsync(item));
        }
        let arr=await (refreshInterface(objProject._id));
        util.ok(res,arr,"导入成功");
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
exports.exportJSON=async (exportJSON);
exports.importJSON=async (importJSON);









