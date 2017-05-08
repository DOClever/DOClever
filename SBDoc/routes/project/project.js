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
var status=require("../../model/statusModel")
var test=require("../../model/testModel")
var testModule=require("../../model/testModuleModel")
var testGroup=require("../../model/testGroupModel")
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
            if(req.clientParam.import!=1)
            {
                await (group.createAsync({
                    name:"未命名",
                    project:obj._id
                }))
            }
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
        },"name dis users",{
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
        let arr=await (group.findAsync(query,"_id name type id",{
            sort:"name"
        }));
        for(let obj of arr)
        {
            let arrInterface=await (interface.findAsync({
                group:obj._id
            },"_id name method finish url id",{
                sort:"name"
            }));
            for(let inter of arrInterface)
            {
                if(!inter.id)
                {
                    inter.id=uuid();
                    inter._doc.id=inter.id;
                    await (inter.saveAsync())
                }
            }
            if(!obj.id)
            {
                obj.id=uuid();
                obj._doc.id=obj.id;
                await (obj.saveAsync())
            }
            obj._doc.data=arrInterface;
        }
        util.ok(res,{
            data:arr,
            baseUrl:req.obj.baseUrls
        },"ok");
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
        await (status.removeAsync({
            project:req.clientParam.id
        }))
        await (test.removeAsync({
            project:req.clientParam.id
        }))
        let arrTestModule=await (testModule.findAsync({
            project:req.clientParam.id
        }))
        for(let obj of arrTestModule)
        {
            await (testGroup.removeAsync({
                module:obj._id
            }))
        }
        await (testModule.removeAsync({
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

function exportJSON(req,res) {
    try
    {
        let obj={};
        obj.flag="SBDoc"
        obj.info={
            name:req.obj.name,
            description:req.obj.dis
        }
        obj.global={
            baseurl:req.obj.baseUrls,
            before:req.obj.before,
            after:req.obj.after
        }
        obj.global.status=await (status.findAsync({
            project:req.obj._id
        },"-_id -project"));
        obj.test=[];
        let arrTestModule=await (testModule.findAsync({
            project:req.obj._id
        }));
        for(let objTestModule of arrTestModule)
        {
            let o={
                name:objTestModule.name,
                id:objTestModule.id,
                data:[]
            };
            let arrTestGroup=await (testGroup.findAsync({
                module:objTestModule._id
            }));
            for(let objTestGroup of arrTestGroup)
            {
                let o1={
                    name:objTestGroup.name,
                    id:objTestGroup.id,
                    data:(await (test.findAsync({
                        group:objTestGroup._id
                    },"-_id -project -module -group -owner -editor -createdAt -updatedAt")))
                }
                o.data.push(o1);
            }
            obj.test.push(o);
        }
        obj.data=[];
        let arrGroup=await (group.findAsync({
            project:req.obj._id
        }))
        for(let item of arrGroup)
        {
            let o={
                name:item.name,
                type:item.type,
                data:[]
            }
            let arrInter=await (interface.findAsync({
                group:item._id
            }))
            for(let item of arrInter)
            {
                let newInter={};
                for(let key in item._doc)
                {
                    if(item._doc.hasOwnProperty(key) && key!="__v" && key!="_id" && key!="_id" && key!="project" && key!="group" && key!="owner" && key!="editor" && key!="createdAt" && key!="updatedAt")
                    {
                        newInter[key]=item._doc[key];
                    }
                }
                o.data.push(newInter);
            }
            obj.data.push(o);
        }
        let content=JSON.stringify(obj);
        res.writeHead(200,{
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(req.obj.name)+".json",
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
        let query={
            name:obj.info.name,
            owner:req.userInfo._id
        }
        if(obj.info.dis)
        {
            query.dis=obj.info.dis
        }
        if(obj.global.baseurl)
        {
            query.baseUrls=obj.global.baseurl
        }
        if(obj.global.before)
        {
            query.before=obj.global.before;
        }
        if(obj.global.after)
        {
            query.after=obj.global.after;
        }
        let objProject=await (project.createAsync(query));
        if(obj.global.status.length>0)
        {
            for(let item of obj.global.status)
            {
                item.project=objProject._id;
                await (status.createAsync(item));
            }
        }
        if(obj.test.length>0)
        {
            for(let obj1 of obj.test)
            {
                let objTestModule=await (testModule.createAsync({
                    name:obj1.name,
                    id:obj1.id,
                    project:objProject._id
                }))
                for(let obj2 of obj1.data)
                {
                    let objTestGroup=await (testGroup.createAsync({
                        name:obj2.name,
                        id:obj2.id,
                        module:objTestModule._id
                    }))
                    for(let obj3 of obj2.data)
                    {
                        obj3.project=objProject._id;
                        obj3.module=objTestModule._id;
                        obj3.group=objTestGroup._id;
                        obj3.editor=obj3.owner=req.userInfo._id;
                        await (test.createAsync(obj3));
                    }
                }
            }
        }
        let bTrash=false,interfaceCount=0;
        for(let item of obj.data)
        {
            if(item.type==1)
            {
                bTrash=true;
            }
            let objGroup=await (group.createAsync({
                name:item.name,
                project:objProject._id,
                type:item.type
            }));
            for(let itemInter of item.data)
            {
                interfaceCount++;
                itemInter.project=objProject._id;
                itemInter.group=objGroup._id;
                itemInter.owner=req.userInfo._id;
                itemInter.editor=req.userInfo._id;
                await (interface.createAsync(itemInter));
            }
        }
        if(!bTrash)
        {
            await (group.createAsync({
                name:"#回收站",
                project:objProject._id,
                type:1
            }))
        }
        objProject._doc.role=0;
        objProject._doc.userCount=1;
        objProject._doc.interfaceCount=interfaceCount;
        objProject._doc.own=1;
        util.ok(res,objProject,"导入成功");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function setInject(req,res) {
    try
    {
        req.obj.before=req.clientParam.before;
        req.obj.after=req.clientParam.after;
        await (req.obj.saveAsync());
        util.ok(res,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function urlList(req,res) {
    try
    {
        util.ok(res,req.obj.baseUrls,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function getImportMember(req,res) {
    try
    {
        let arrProject=await (project.findAsync({
            $or:[
                {
                    "users.user":req.userInfo._id
                },
                {
                    owner:req.userInfo._id
                }
                ]
        },null,{
            populate:{
                path:"users.user",
                select:"name photo"
            }
        }));
        arrProject=await (project.populateAsync(arrProject,{
            path:"owner",
            select:"name photo"
        }))
        var arrExcept=[req.obj.owner];
        arrExcept=arrExcept.concat(req.obj.users.map(function (obj) {
            return obj.user;
        }));
        var arrRet=[];
        for(let objProject of arrProject)
        {
            let arr=[objProject.owner].concat(objProject.users.map(function (obj) {
                return obj.user
            }));
            for(let obj of arr)
            {
                let bFind=false;
                for(let obj1 of arrExcept)
                {
                    if(obj1.toString()==obj._id.toString())
                    {
                        bFind=true;
                        break;
                    }
                }
                if(bFind)
                {
                    continue;
                }
                for(let obj1 of arrRet)
                {
                    if(obj1._id.toString()==obj._id.toString())
                    {
                        bFind=true;
                        break;
                    }
                }
                if(bFind)
                {
                    continue;
                }
                let objUser=await (user.findOneAsync({
                    _id:obj._id
                },"_id"))
                if(!objUser)
                {
                    continue;
                }
                arrRet.push(obj);
            }
        }
        util.ok(res,arrRet,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function importMember(req,res) {
    try
    {
        let arr=JSON.parse(req.clientParam.data);
        let arrImport=[];
        for(let obj of arr)
        {
            let bFind=false;
            for(let obj1 of req.obj.users)
            {
                if(obj.user==obj1.user.toString())
                {
                    bFind=true;
                    break;
                }
            }
            if(!bFind)
            {
                arrImport.push(obj);
            }
        }
        await (project.updateAsync({
            _id:req.obj._id
        },{
            $addToSet:{
                users:{
                    $each:arrImport
                }
            }
        }));
        util.ok(res,"ok");
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
exports.exportJSON=async (exportJSON);
exports.importJSON=async (importJSON);
exports.setInject=async (setInject);
exports.urlList=async (urlList);
exports.getImportMember=async (getImportMember);
exports.importMember=async (importMember);






