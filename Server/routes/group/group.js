/**
 * Created by sunxin on 2016/11/17.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var con=require("../../../config.json");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var groupVersion=require("../../model/groupVersionModel")
var version=require("../../model/versionModel")
var teamGroup=require("../../model/teamGroupModel")
var fs=require("fs");
var uuid=require("uuid/v1");

function Group() {
    this.sort=async function (req,objGroup,objMove,index,bGroup) {
        let arr;
        if(bGroup)
        {
            let query={
                project:req.obj._id
            };
            if(objGroup)
            {
                query.parent=objGroup.id;
            }
            else
            {
                query.parent={
                    $exists:false
                }
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            arr=await (req.groupModel.findAsync(query,null,{
                sort:"sort"
            }))
        }
        else
        {
            let query={
                project:req.obj._id,
                group:objGroup._id
            };
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            arr=await (req.interfaceModel.findAsync(query,null,{
                sort:"sort"
            }))

        }
        for(let i=0;i<arr.length;i++)
        {
            let obj=arr[i];
            if(obj._id.toString()==objMove._id.toString())
            {
                arr.splice(i,1);
                break;
            }
        }
        arr.splice(index,0,objMove);
        for(let i=0;i<arr.length;i++)
        {
            let obj=arr[i];
            obj.sort=i;
            await (obj.saveAsync());
        }
    }
    this.getChild=async function(req,id,obj,bInter) {
        let query={
            project:id,
            parent:obj?obj.id:{
                $exists:false
            }
        }
        if(req.headers["docleverversion"])
        {
            query.version=req.headers["docleverversion"]
        }
        let sort="name";
        if(req.cookies.sort==1)
        {
            sort="-updatedAt";
        }
        else if(req.cookies.sort==2)
        {
            sort="sort";
        }
        let arr=await (req.groupModel.findAsync(query,null,{
            sort:sort
        }))
        for(let obj of arr)
        {
            obj._doc.data=await (this.getChild(req,id,obj,bInter));
        }
        if(bInter && obj)
        {
            let arrInterface=await (req.interfaceModel.findAsync({
                group:obj._id
            },"_id name method finish url delete",{
                sort:sort
            }));
            arr=arr.concat(arrInterface);
        }
        return arr;
    }
    this.validateUser=async (req,res)=> {
        try
        {
            req.interfaceModel=interface;
            req.groupModel=group;
            if(req.headers["docleverversion"])
            {
                req.version=await (version.findOneAsync({
                    _id:req.headers["docleverversion"]
                }))
                if(!req.version)
                {
                    util.throw(e.versionInvalidate,"版本不可用");
                }
                req.interfaceModel=interfaceVersion;
                req.groupModel=groupVersion;
            }
            let grp;
            if(req.clientParam.group)
            {
                grp=await (req.groupModel.findOneAsync({
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
                obj=await (project.findOneAsync({
                    _id:req.clientParam.id?req.clientParam.id:grp.project,
                }));
                if(!obj)
                {
                    util.throw(e.projectNotFound,"项目不存在");
                    return;
                }
                if(obj.team)
                {
                    let arrUser=await (teamGroup.findAsync({
                        team:obj.team,
                        users:{
                            $elemMatch:{
                                user:req.userInfo._id,
                                role:{
                                    $in:[0,2]
                                }
                            }
                        }
                    }))
                    if(arrUser.length==0 && !obj.public && !req.headers["referer"].endsWith("public/public.html"))
                    {
                        util.throw(e.userForbidden,"你没有权限");
                        return;
                    }
                }
                else if(!obj.public && !req.headers["referer"].endsWith("public/public.html"))
                {
                    util.throw(e.userForbidden,"你没有权限");
                    return;
                }
                req.obj=obj;
                req.group=grp;
                return true
            }
            else
            {
                req.obj=obj;
                req.group=grp;
                return true
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.create=async (req,res)=> {
        try
        {
            let query={
                name:req.clientParam.name,
                project:req.clientParam.id
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let objParent;
            if(req.clientParam.parent)
            {
                objParent=await (req.groupModel.findOneAsync({
                    _id:req.clientParam.parent
                }));
                if(!objParent)
                {
                    util.throw(e.groupNotFound,"父级分组不存在");
                }
                else
                {
                    query.parent=objParent.id;
                }
            }
            let obj=await (req.groupModel.findOneAsync(query));
            if(obj)
            {
                util.throw(e.duplicateName,"名字重复了");
            }
            if(req.clientParam.group)
            {
                if(req.clientParam.name)
                {
                    req.group.name=req.clientParam.name;
                }
                if(req.clientParam.parent)
                {
                    req.group.parent=req.clientParam.parent;
                }
                await (req.group.saveAsync());
            }
            else
            {
                let query={
                    name:req.clientParam.name,
                    project:req.clientParam.id,
                    id:uuid()
                }
                if(req.clientParam.parent)
                {
                    query.parent=objParent.id;
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"]
                }
                let result=await (req.groupModel.createAsync(query));
                if(req.clientParam.import==1)
                {
                    util.ok(res,result,"ok");
                    return;
                }
            }
            let arr=await (this.getChild(req,req.clientParam.id,null,1));
            util.ok(res,arr,"更新成功");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.remove=async (req,res)=> {
        try
        {
            if(req.group.type==0)
            {
                let query={
                    type:1,
                    project:req.group.project
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"]
                }
                let objTrash=await (req.groupModel.findOneAsync(query));
                let removeChild=async function (objGroup) {
                    let arrGroup=await (req.groupModel.findAsync({
                        project:req.group.project,
                        parent:objGroup.id
                    }));
                    for(let obj of arrGroup)
                    {
                        await (removeChild(obj));
                    }
                    await (req.interfaceModel.updateAsync({
                        group:objGroup._id
                    },{
                        group:objTrash._id
                    },{
                        multi:true
                    }))
                    await (interfaceSnapshot.updateAsync({
                        group:objGroup._id
                    },{
                        group:objTrash._id
                    },{
                        multi:true
                    }));
                    await (objGroup.removeAsync());
                }
                await (removeChild(req.group));
                let arr=await (this.getChild(req,req.group.project,null,1));
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
    this.exportJSON=async (req,res)=>{
        try
        {
            let obj={
                name:req.group.name,
                flag:"SBDoc",
                data:[]
            };
            let _map=async function(req,id,obj) {
                let query={
                    project:id,
                    parent:obj?obj.id:{
                        $exists:false
                    }
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"]
                }
                let arr=await (req.groupModel.findAsync(query,"-parent -version -project",{
                    sort:"name"
                }))
                for(let obj of arr)
                {
                    obj._doc.data=await (_map(req,id,obj));
                    delete obj._doc._id;
                }
                let arrInterface=await (req.interfaceModel.findAsync({
                    group:obj._id
                },"-_id -id -project -group -owner -editor -version",{
                    sort:"name"
                }));
                arr=arr.concat(arrInterface);
                return arr;
            }
            obj.data=await (_map(req,req.group.project,req.group));
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

    this.importJSON=async (req,res)=>{
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
                util.throw(e.systemReason,"不是DOClever的导出格式");
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
            if(req.clientParam.group)
            {
                req.group=await (req.groupModel.findOneAsync({
                    _id:req.clientParam.group
                }))
                if(!req.group)
                {
                    util.throw(e.groupNotFound,"分组不存在");
                    return;
                }
            }
            let importChild=async function (data,objParent) {
                for(let item of data)
                {
                    if(item.data)
                    {
                        let query={
                            name:item.name,
                            project:objProject._id,
                            id:uuid(),
                            type:0
                        };
                        if(objParent)
                        {
                            query.parent=objParent.id;
                        }
                        if(req.headers["docleverversion"])
                        {
                            query.version=req.headers["docleverversion"]
                        }
                        let objGroup=await (req.groupModel.createAsync(query));
                        await (importChild(item.data,objGroup));
                    }
                    else
                    {
                        item.project=objProject._id;
                        item.group=objParent._id;
                        item.owner=req.userInfo._id;
                        item.editor=req.userInfo._id;
                        item.id=uuid();
                        if(req.headers["docleverversion"])
                        {
                            item.version=req.headers["docleverversion"]
                        }
                        if(!item.param)
                        {
                            item.param=[];
                            let o={
                                name:"未命名",
                                remark:"",
                                id:uuid(),
                                header:item.header,
                                queryParam:item.queryParam,
                                restParam:item.restParam,
                                outParam:item.outParam,
                                outInfo:item.outInfo,
                                before:item.before,
                                after:item.after
                            }
                            if(item.bodyParam)
                            {
                                o.bodyParam=item.bodyParam;
                                o.bodyInfo=item.bodyInfo;
                            }
                            delete item.header;
                            delete item.queryParam;
                            delete item.restParam;
                            delete item.outParam;
                            delete item.outInfo;
                            delete item.before;
                            delete item.after;
                            delete item.bodyParam;
                            delete item.bodyInfo;
                            item.param.push(o);
                        }
                        await (req.interfaceModel.createAsync(item));
                    }
                }
            }
            await (importChild([obj],req.group?req.group:null))
            let arr=await (this.getChild(req,objProject._id,null,1));
            util.ok(res,arr,"导入成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.move=async (req,res)=>{
        try
        {
            let toGroup;
            if(req.clientParam.to)
            {
                toGroup=await (req.groupModel.findOneAsync({
                    _id:req.clientParam.to
                }));
                if(!toGroup)
                {
                    util.throw(e.groupNotFound,"分组不存在");
                }
            }
            let obj=await (req.groupModel.findOneAndUpdateAsync({
                _id:req.clientParam.group
            },req.clientParam.to?{
                parent:toGroup.id
            }:{
                $unset:{
                    parent:1
                }
            },{
                new:true
            }));
            await (this.sort(req,toGroup,obj,req.clientParam.index?req.clientParam.index:0,1))
            let arr = await (this.getChild(req,obj.project, null,1))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.merge=async (req,res)=>{
        try
        {
            await (req.groupModel.updateAsync({
                _id:req.clientParam.group
            },{
                $unset:{
                    delete:1
                }
            }))
            let mergeChild=async function(obj) {
                let query={
                    project:req.obj._id,
                    parent:obj.id
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"]
                }
                let arr=await (req.groupModel.findAsync(query))
                for(let obj of arr)
                {
                    await (req.groupModel.findOneAndUpdateAsync({
                        _id:obj._id
                    },{
                        $unset:{
                            delete:1
                        }
                    }))
                    await (mergeChild(obj));
                }
                await (req.interfaceModel.updateAsync({
                    group:obj._id
                },{
                    $unset:{
                        delete:1
                    }
                },{
                    multi:true
                }));
            }
            await (mergeChild(req.group));
            let arr = await (this.getChild(req,req.group.project,null,1));
            util.ok(res, arr, "ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}


module.exports=Group;









