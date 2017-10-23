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
var groupVersion=require("../../model/groupVersionModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var statusVersion=require("../../model/statusVersionModel")
var testVersion=require("../../model/testVersionModel")
var testModuleVersion=require("../../model/testModuleVersionModel")
var testGroupVersion=require("../../model/testGroupVersionModel")
var interface=require("../../model/interfaceModel")
var status=require("../../model/statusModel")
var test=require("../../model/testModel")
var testModule=require("../../model/testModuleModel")
var testGroup=require("../../model/testGroupModel")
var temp=require("../../model/tempModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var apply=require("../../model/applyModel")
var message=require("../../model/messageModel");
var version=require("../../model/versionModel")
var poll=require("../../model/pollModel")
var article=require("../../model/articleModel")
var blue=require("bluebird");
var fs=require("fs");
var uuid=require("uuid/v1");
var zip=require("archiver");
var path=require("path");
var copy=require("recursive-copy");
var rm=require("rimraf");
var nunjucks=require("nunjucks");
var moment=require("moment");
var request=require("../../third/requestAsync");
blue.promisifyAll(fs);

function Project() {
    this.getChild=async (function(req,id,obj,bInter) {
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
        let arr=await (req.groupModel.findAsync(query,null,{
            sort:"name"
        }))
        for(let obj of arr)
        {
            obj._doc.data=await (this.getChild(req,id,obj,bInter));
        }
        if(bInter && obj)
        {
            let arrInterface=await (req.interfaceModel.findAsync({
                group:obj._id
            },"_id name method finish url id delete",{
                sort:"name"
            }));
            arr=arr.concat(arrInterface);
        }
        return arr;
    })
    this.existUserInTeam=async ( (teamId,userId)=>{
        let arrUser=await (teamGroup.findAsync({
            team:teamId
        }))
        let bFind=false;
        for(let obj of arrUser) {
            for (let obj1 of obj.users) {
                if(obj1.user.toString()==userId.toString())
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                break;
            }
        }
        if(bFind)
        {
            return true;
        }
        else
        {
            return false;
        }
    })

    this.teamUserList=async ( (teamId)=> {
        let arrUser=await (teamGroup.findAsync({
            team:teamId
        }))
        let arr=[];
        arrUser.forEach(function (obj) {
            return obj.users.forEach(function (obj) {
                arr.push(obj.user.toString());
            })
        })
        return arr;
    })

    this.validateUser=async ((req,res)=> {
        try
        {
            req.interfaceModel=interface;
            req.groupModel=group;
            req.statusModel=status;
            req.testModuleModel=testModule;
            req.testGroupModel=testGroup;
            req.testModel=test;
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
                req.statusModel=statusVersion;
                req.testModuleModel=testModuleVersion;
                req.testGroupModel=testGroupVersion;
                req.testModel=testVersion;
            }
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
                    obj=await (project.findOneAsync({
                        _id:req.clientParam.id
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
                        if(arrUser.length==0)
                        {
                            util.throw(e.userForbidden,"你没有权限");
                            return;
                        }
                        req.obj=obj;
                        return true;
                    }
                    else
                    {
                        util.throw(e.userForbidden,"你没有权限");
                        return;
                    }
                }
                else
                {
                    req.obj=obj;
                    return true;
                }
            }
            else
            {
                return true;
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.inProject=async ((req,res)=> {
        try
        {
            req.interfaceModel=interface;
            req.groupModel=group;
            req.statusModel=status;
            req.testModuleModel=testModule;
            req.testGroupModel=testGroup;
            req.testModel=test;
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
                req.statusModel=statusVersion;
                req.testModuleModel=testModuleVersion;
                req.testGroupModel=testGroupVersion;
                req.testModel=testVersion;
            }
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
                obj=await (project.findOneAsync({
                    _id:req.clientParam.id
                }));
                if(!obj)
                {
                    util.throw(e.projectNotFound,"项目不存在");
                    return;
                }
                req.obj=obj;
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
                    if(arrUser.length==0 && !obj.public)
                    {
                        util.throw(e.userForbidden,"你没有权限");
                        return;
                    }
                }
                else if(!obj.public)
                {
                    util.throw(e.userForbidden,"你没有权限");
                    return;
                }
                return true;
            }
            else
            {
                req.obj=obj;
                return true;
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.create=async ((req,res)=> {
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
            if(req.clientParam.team)
            {
                query.team=req.clientParam.team
            }
            if(req.clientParam.public!==undefined)
            {
                query.public=req.clientParam.public
            }
            if(!req.clientParam.id)
            {
                if(req.clientParam.import==1)
                {
                    query.source={
                        type:0
                    }
                }
                let obj=await (project.createAsync(query));
                if(req.clientParam.import!=1)
                {
                    let query={
                        name:"未命名",
                        project:obj._id,
                        id:uuid()
                    }
                    if(req.headers["docleverversion"])
                    {
                        query.version=req.headers["docleverversion"]
                    }
                    await (req.groupModel.createAsync(query))
                }
                let query1={
                    name:"#回收站",
                    project:obj._id,
                    type:1,
                    id:uuid()
                }
                if(req.headers["docleverversion"])
                {
                    query1.version=req.headers["docleverversion"]
                }
                await (req.groupModel.createAsync(query1))
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
    })

    this.addMember=async ((req,res)=> {
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
            else if(obj.team)
            {
                let bExist=await (this.existUserInTeam(obj.team,u._id));
                if(!bExist)
                {
                    util.throw(e.userNotInTeam,"用户不在团队内");
                }
            }
            for(let o of obj.users)
            {
                if(o.user.toString()==u._id.toString())
                {
                    util.throw(e.userExits,"用户已经存在");
                }
            }
            let query={
                user:u._id,
                role:req.clientParam.role
            };
            if(req.clientParam.role==1 && req.clientParam.option)
            {
                query.option=JSON.parse(req.clientParam.option);
            }
            await (project.updateAsync({
                _id:obj._id
            },{
                $addToSet:{
                    users:query
                }
            }));
            let ret={
                role:req.clientParam.role,
                user:u
            }
            if(req.clientParam.option)
            {
                ret.option=query.option
            }
            util.ok(res,ret,"添加成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.role=async ((req,res) =>{
        try
        {
            let update={
                "users.$.role":req.clientParam.role
            };
            if(req.clientParam.role==0)
            {
                update["$unset"]={
                    "users.$.option":1
                }
            }
            else if(req.clientParam.role==1 && req.clientParam.option)
            {
                update["users.$.option"]=JSON.parse(req.clientParam.option);
            }
            await (project.updateAsync({
                _id:req.clientParam.id,
                "users.user":req.clientParam.user
            },update));
            util.ok(res,"修改成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.removeMember=async ((req,res)=> {
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
    })

    this.list=async ((req,res)=> {
        try
        {
            let obj={},ret=[];
            obj.project={};
            obj.team={};
            let arr=await (project.findAsync({
                owner:req.userInfo._id,
                team:{
                    $exists:false
                }
            },"name dis users createdAt",{
                sort:"-createdAt"
            }));
            arr.forEach(function (obj) {
                obj._doc.role=0;
                obj._doc.own=1;
            })
            arr.sort(function (obj1,obj2) {
                if(obj1.createdAt>obj2.createdAt)
                {
                    return -1;
                }
                else if(obj1.createdAt<obj2.createdAt)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            })
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
            obj.project.create=arr;
            arr=await (project.findAsync({
                users:{
                    $elemMatch:{
                        user:req.userInfo._id,
                        role:0
                    }
                },
                team:{
                    $exists:false
                }
            },"name dis users createdAt",{
                sort:"-createdAt"
            }))
            arr.forEach(function (obj) {
                obj._doc.own=0;
                obj._doc.role=0;
            })
            ret=arr;
            arr=await (project.findAsync({
                users:{
                    $elemMatch:{
                        user:req.userInfo._id,
                        role:1
                    }
                },
                team:{
                    $exists:false
                }
            },"name dis users createdAt",{
                sort:"-createdAt"
            }))
            arr.forEach(function (obj) {
                obj._doc.own=0;
                obj._doc.role=1;
            })
            ret=ret.concat(arr);
            ret.sort(function (obj1,obj2) {
                if(obj1.createdAt>obj2.createdAt)
                {
                    return -1;
                }
                else if(obj1.createdAt<obj2.createdAt)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            })
            for(let obj of ret)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
            obj.project.join=ret;
            arr=await (project.findAsync({
                owner:{
                    $ne:req.userInfo._id
                },
                "users.user":{
                    $ne:req.userInfo._id
                },
                public:1
            },"name dis users createdAt",{
                sort:"-createdAt"
            }));
            arr.forEach(function (obj) {
                obj._doc.role=1;
                obj._doc.own=0;
            })
            arr.sort(function (obj1,obj2) {
                if(obj1.createdAt>obj2.createdAt)
                {
                    return -1;
                }
                else if(obj1.createdAt<obj2.createdAt)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            })
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
            obj.project.public=arr;
            arr=await (team.findAsync({
                owner:req.userInfo._id
            },"",{
                sort:"-createdAt"
            }))
            arr.forEach(function (obj) {
                obj._doc.role=0;
                obj._doc.own=1;
            })
            for(let obj of arr)
            {
                let arr1=await (teamGroup.findAsync({
                    team:obj._id
                }))
                let count=0;
                for(let o of arr1)
                {
                    count+=o.users.length;
                }
                obj._doc.userCount=count;
                obj._doc.projectCount=await (project.countAsync({
                    team:obj._id
                }))
            }
            obj.team.create=arr;
            let arrTemp=await (teamGroup.findAsync({
                users:{
                    $elemMatch:{
                        user:req.userInfo._id,
                        role:0
                    }
                }
            },"",{
                sort:"-createdAt"
            }))
            let arrTeam=[];
            for(let obj of arrTemp)
            {
                if(arrTeam.indexOf(obj.team.toString())==-1)
                {
                    arrTeam.push(obj.team);
                }
            }
            arr=await (team.findAsync({
                _id:{
                    $in:arrTeam
                }
            },"",{
                sort:"-createdAt"
            }))
            arr.forEach(function (obj) {
                obj._doc.own=0;
                obj._doc.role=0;
            })
            ret=arr;
            arrTemp=await (teamGroup.findAsync({
                users:{
                    $elemMatch:{
                        user:req.userInfo._id,
                        role:1
                    }
                }
            },"",{
                sort:"-createdAt"
            }))
            arrTeam=[];
            for(let obj of arrTemp)
            {
                if(arrTeam.indexOf(obj.team.toString())==-1)
                {
                    arrTeam.push(obj.team);
                }
            }
            arr=await (team.findAsync({
                _id:{
                    $in:arrTeam
                }
            },"",{
                sort:"-createdAt"
            }))
            arr.forEach(function (obj) {
                obj._doc.own=0;
                obj._doc.role=1;
            })
            ret=ret.concat(arr);
            for(let obj of ret)
            {
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
            }
            obj.team.join=ret;
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.filterList=async ((req,res)=>{
        try
        {
            let ret=[];
            if(req.clientParam.team)
            {
                let obj=await (team.findOneAsync({
                    _id:req.clientParam.team,
                    owner:req.userInfo._id
                }))
                if(!obj)
                {
                    let arr=await (teamGroup.findAsync({
                        team:req.clientParam.team,
                        "users.user":req.userInfo._id
                    }))
                    if(arr.length==0)
                    {
                        util.throw(e.projectNotFound,"项目不存在或者没有权限");
                        return;
                    }
                    else
                    {
                        req.teamGroup=arr;
                        obj=await (team.findOneAsync({
                            _id:arr[0].team
                        }))
                    }
                }
                req.team=obj;
                if(req.team.owner.toString()==req.userInfo._id.toString())
                {
                    req.access=1;
                }
                else
                {
                    req.access=0;
                    for(let o of req.teamGroup) {
                        let bFind=false;
                        for(let o1 of o.users)
                        {
                            if (o1.user.toString() == req.userInfo._id.toString() && o1.role == 0) {
                                req.access = 1;
                                bFind=true;
                                break;
                            }
                        }
                        if(bFind)
                        {
                            break;
                        }
                    }
                }
                obj=await (team.populateAsync(req.team,{
                    path:"owner",
                    select:"name photo"
                }));
                ret=[];
                if(req.access)
                {
                    ret=await (project.findAsync({
                        team:obj._id
                    },"name dis users",{
                        sort:"-createdAt"
                    }));
                    ret.forEach(function (obj) {
                        obj._doc.role=0;
                        obj._doc.own=1;
                    })
                }
                else
                {
                    let arr=await (project.findAsync({
                        owner:req.userInfo._id,
                        team:obj._id
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
                        },
                        team:obj._id
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
                        },
                        team:obj._id
                    },"name dis users",{
                        sort:"-createdAt"
                    }))
                    arr.forEach(function (obj) {
                        obj._doc.own=0;
                        obj._doc.role=1;
                    })
                    ret=ret.concat(arr);
                }
                ret.sort(function (obj1,obj2) {
                    if(obj1.createdAt>obj2.createdAt)
                    {
                        return -1;
                    }
                    else if(obj1.createdAt<obj2.createdAt)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
            else
            {
                let reg=new RegExp(req.clientParam.name,"i");
                let arr=await (project.findAsync({
                    owner:req.userInfo._id,
                    name:reg,
                    team:{
                        $exists:false
                    }
                },"name dis createdAt",{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    obj._doc.role=0;
                    obj._doc.own=1;
                })
                ret=arr;
                arr=await (project.findAsync({
                    owner:{
                        $ne:req.userInfo._id
                    },
                    "users.user":{
                        $ne:req.userInfo._id
                    },
                    name:reg,
                    public:1
                },"name dis createdAt",{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    obj._doc.role=1;
                    obj._doc.own=0;
                })
                ret=ret.concat(arr);
                arr=await (project.findAsync({
                    users:{
                        $elemMatch:{
                            user:req.userInfo._id,
                            role:0
                        }
                    },
                    name:reg,
                    team:{
                        $exists:false
                    }
                },"name dis createdAt",{
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
                    },
                    name:reg,
                    team:{
                        $exists:false
                    }
                },"name dis createdAt",{
                    sort:"-createdAt"
                }))
                arr.forEach(function (obj) {
                    obj._doc.own=0;
                    obj._doc.role=1;
                })
                ret=ret.concat(arr);
                ret.sort(function (obj1,obj2) {
                    if(obj1.createdAt>obj2.createdAt)
                    {
                        return -1;
                    }
                    else if(obj1.createdAt<obj2.createdAt)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                })
            }
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.url=async ((req,res)=> {
        try
        {
            let arr=JSON.parse(req.clientParam.urls);
            arr=arr.map(function (obj) {
                if(!obj.url.startsWith("http://") && !obj.url.startsWith("https://"))
                {
                    obj.url="http://"+obj.url;
                }
                return obj;
            })
            if(req.version)
            {
                await (version.updateAsync({
                    _id:req.version._id
                },{
                    baseUrls:arr
                }))
            }
            else
            {
                await (project.updateAsync({
                    _id:req.clientParam.id
                },{
                    baseUrls:arr
                }))
            }
            util.ok(res,arr,"修改成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.info=async ((req,res)=> {
        try
        {
            let obj=await (project.findOneAsync({
                _id:req.clientParam.id
            },null,{
                populate:{
                    path:"users.user",
                    select:"-password"
                }
            }))
            if(req.version)
            {
                obj._doc.baseUrls=req.version.baseUrls;
                obj._doc.before=req.version.before;
                obj._doc.after=req.version.after;
                obj._doc.source=req.version.source;
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.groupList=async ((req,res)=> {
        try
        {

            let arr=await (this.getChild(req,req.clientParam.id));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.interfaceList=async ((req,res)=> {
        try
        {
            let arr=await (this.getChild(req,req.clientParam.id,null,1));
            util.ok(res,{
                data:arr,
                baseUrl:req.version?req.version.baseUrls:req.obj.baseUrls
            },"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.clear=async ((req,res)=> {
        try
        {
            let query={
                project:req.clientParam.id,
                type:1
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let obj=await (req.groupModel.findOneAsync(query));
            await (req.interfaceModel.removeAsync({
                group:obj._id
            }));
            await (interfaceSnapshot.removeAsync({
                group:obj._id
            }));
            let arr=await (this.getChild(req,req.clientParam.id,null,1));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.removeProject=async ((req,res)=> {
        try
        {
            await (interface.removeAsync({
                project:req.clientParam.id
            }));
            await (version.removeAsync({
                project:req.clientParam.id
            }));
            await (interfaceVersion.removeAsync({
                project:req.clientParam.id
            }));
            await (interfaceSnapshot.removeAsync({
                project:req.clientParam.id
            }));
            await (group.removeAsync({
                project:req.clientParam.id
            }))
            await (groupVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (status.removeAsync({
                project:req.clientParam.id
            }))
            await (statusVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (test.removeAsync({
                project:req.clientParam.id
            }))
            await (testVersion.removeAsync({
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
            arrTestModule=await (testModuleVersion.findAsync({
                project:req.clientParam.id
            }))
            for(let obj of arrTestModule)
            {
                await (testGroupVersion.removeAsync({
                    module:obj._id
                }))
            }
            await (testModule.removeAsync({
                project:req.clientParam.id
            }))
            await (testModuleVersion.removeAsync({
                project:req.clientParam.id
            }))
            await (poll.removeAsync({
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
    })

    this.quit=async ((req,res)=> {
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
    })

    this.addUrl=async ((req,res)=> {
        try
        {
            let url=req.clientParam.url;
            if(!url.startsWith("http://") && !url.startsWith("https://"))
            {
                url="http://"+url;
            }
            if(req.version)
            {
                await (version.updateAsync({
                    _id:req.version._id
                },{
                    $addToSet:
                        {
                            baseUrls:{
                                url:url,
                                remark:""
                            }
                        }
                }))
            }
            else
            {
                await (project.updateAsync({
                    _id:req.clientParam.id
                },{
                    $addToSet:
                        {
                            baseUrls:{
                                url:url,
                                remark:""
                            }
                        }
                }))
            }
            util.ok(res,"添加成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.exportJSON=async ((req,res)=> {
        try
        {
            let obj={};
            obj.flag="SBDoc"
            obj.info={
                name:req.obj.name,
                description:req.obj.dis
            }
            if(req.version)
            {
                obj.global={
                    baseurl:req.version.baseUrls,
                    before:req.version.before,
                    after:req.version.after
                }
            }
            else
            {
                obj.global={
                    baseurl:req.obj.baseUrls,
                    before:req.obj.before,
                    after:req.obj.after
                }
            }
            let arr=await (article.findAsync({
                project:req.obj._id
            },"content title",{
                sort:"-updatedAt"
            }))
            obj.global.article=arr.map(function (obj) {
                return {
                    title:obj.title,
                    content:obj.content
                }
            });
            let query={
                project:req.obj._id
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            obj.global.status=await (req.statusModel.findAsync(query,"-_id -project"));
            obj.test=[];
            query={
                project:req.obj._id
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let arrTestModule=await (req.testModuleModel.findAsync(query));
            for(let objTestModule of arrTestModule)
            {
                let o={
                    name:objTestModule.name,
                    id:objTestModule.id,
                    data:[]
                };
                let arrTestGroup=await (req.testGroupModel.findAsync({
                    module:objTestModule._id
                }));
                for(let objTestGroup of arrTestGroup)
                {
                    let o1={
                        name:objTestGroup.name,
                        id:objTestGroup.id,
                        data:(await (req.testModel.findAsync({
                            group:objTestGroup._id
                        },"-_id -project -module -group -owner -editor -createdAt -updatedAt")))
                    }
                    o.data.push(o1);
                }
                obj.test.push(o);
            }
            let getChild=async (function(req,obj) {
                let query={
                    project:req.obj._id,
                    parent:obj?obj.id:{
                        $exists:false
                    }
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"]
                }
                let arr=await (req.groupModel.findAsync(query,null,{
                    sort:"name"
                }))
                let ret=[];
                for(let obj of arr)
                {
                    let o={
                        name:obj.name,
                        type:obj.type,
                        id:obj.id,
                        data:[]
                    }
                    o.data=await (getChild(req,obj));
                    ret.push(o);
                }
                if(obj)
                {
                    let arrInter=await (req.interfaceModel.findAsync({
                        group:obj._id
                    },null,{
                        sort:"name"
                    }))
                    for(let item of arrInter)
                    {
                        let newInter={};
                        for(let key in item._doc)
                        {
                            if(item._doc.hasOwnProperty(key) && key!="__v" && key!="_id" && key!="project" && key!="group" && key!="owner" && key!="editor" && key!="createdAt" && key!="updatedAt")
                            {
                                newInter[key]=item._doc[key];
                            }
                        }
                        ret.push(newInter);
                    }
                }
                return ret;
            })
            obj.data=await (getChild(req));
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
    })

    this.importJSON=async ((req,res)=> {
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
            if(req.clientParam.team)
            {
                query.team=req.clientParam.team;
            }
            let objProject=await (project.createAsync(query));
            if(obj.global.article && obj.global.article.length>0)
            {
                await (article.insertMany(obj.global.article.map(function (obj) {
                    return {
                        title:obj.title,
                        content:obj.content,
                        project:objProject._id,
                        creator:req.userInfo._id
                    }
                })));
            }
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
            let importChild=async (function (data,objParent) {
                for(let item of data)
                {
                    if(item.type==1)
                    {
                        bTrash=true;
                    }
                    if(item.data)
                    {
                        let query={
                            name:item.name,
                            project:objProject._id,
                            type:item.type,
                            id:item.id?item.id:uuid()
                        };
                        if(objParent)
                        {
                            query.parent=objParent.id;
                        }
                        let objGroup=await (group.createAsync(query));
                        await (importChild(item.data,objGroup));
                    }
                    else
                    {
                        interfaceCount++;
                        item.project=objProject._id;
                        item.group=objParent._id;
                        item.owner=req.userInfo._id;
                        item.editor=req.userInfo._id;
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
                        await (interface.createAsync(item));
                    }
                }
            })
            await (importChild(obj.data));
            if(!bTrash)
            {
                await (group.createAsync({
                    name:"#回收站",
                    project:objProject._id,
                    type:1,
                    id:uuid()
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
    })

    this.setInject=async ((req,res)=> {
        try
        {
            if(req.version)
            {
                req.version.before=req.clientParam.before;
                req.version.after=req.clientParam.after;
                await (req.version.saveAsync());
            }
            else
            {
                req.obj.before=req.clientParam.before;
                req.obj.after=req.clientParam.after;
                await (req.obj.saveAsync());
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.urlList=async ((req,res)=> {
        try
        {
            if(req.version)
            {
                util.ok(res,req.version.baseUrls,"ok");
            }
            else
            {
                util.ok(res,req.obj.baseUrls,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.getImportMember=async ((req,res)=> {
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
            if(req.obj.team)
            {
                let arrUser=await (teamGroup.findAsync({
                    team:req.obj.team
                }))
                let arr=[];
                for(let obj of arrUser)
                {
                    for(let obj1 of obj.users)
                    {
                        let objFind=null;
                        for(let obj2 of arrRet)
                        {
                            if(obj1.user.toString()==obj2._id.toString())
                            {
                                objFind=obj2;
                                break;
                            }
                        }
                        if(objFind)
                        {
                            arr.push(objFind);
                        }
                    }
                }
                arrRet=arr;
            }
            util.ok(res,arrRet,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.importMember=async ((req,res)=> {
        try
        {
            let arr=JSON.parse(req.clientParam.data);
            let arrImport=[],arrTeamUser=null;
            if(req.obj.team)
            {
                arrTeamUser=await (this.teamUserList(req.obj.team));
            }
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
                if(arrTeamUser)
                {
                    let index=arrTeamUser.indexOf(obj.user);
                    if(index==-1)
                    {
                        bFind=true;
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
    })

    this.exportHTML=async ((req,res)=> {
        try
        {
            let arr=await (temp.findAsync({
                user:req.userInfo._id,
                project:req.obj._id
            }))
            for(let obj of arr)
            {
                let pathName=path.join(con.tempPath,obj.name+".zip");
                if(await (fs.existsAsync(pathName)))
                {
                    await (fs.unlinkAsync(pathName));
                }
                await (obj.removeAsync());
            }
            let name=req.obj.name+"-"+req.userInfo.name+"-"+Date.now();
            let obj=await (temp.createAsync({
                name:name,
                user:req.userInfo._id,
                project:req.obj._id,
            }))
            await (copy(path.resolve(__dirname,"../../html"),path.join(con.tempPath,name)));
            let query={
                project:req.obj._id
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let getChild=async (function(req,obj) {
                let query={
                    project:req.obj._id,
                    parent:obj?obj.id:{
                        $exists:false
                    }
                }
                if(req.headers["docleverversion"])
                {
                    query.version=req.headers["docleverversion"]
                }
                let arr=await (req.groupModel.findAsync(query,null,{
                    sort:"name"
                }))
                for(let obj of arr)
                {
                    obj._doc.data=await (getChild(req,obj));
                }
                if(obj)
                {
                    let arrInterface=await (req.interfaceModel.findAsync({
                        group:obj._id
                    },null,{
                        sort:"name"
                    }));
                    arrInterface=await (req.interfaceModel.populateAsync(arrInterface,{
                        path:"project",
                        select:"name"
                    }))
                    arrInterface=await (req.interfaceModel.populateAsync(arrInterface,{
                        path:"group",
                        select:"name"
                    }))
                    arrInterface=await (req.interfaceModel.populateAsync(arrInterface,{
                        path:"owner",
                        select:"name"
                    }))
                    arrInterface=await (req.interfaceModel.populateAsync(arrInterface,{
                        path:"editor",
                        select:"name"
                    }))
                    arr=arr.concat(arrInterface);
                }
                return arr;
            })
            let arrGroup=await (getChild(req));
            query={
                project:req.obj._id
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            let arrStatus=await (req.statusModel.findAsync(query,null,{
                sort:"name"
            }));
            if(req.version)
            {
                req.obj.baseUrls=req.version.baseUrls;
                req.obj.before=req.version.before;
                req.obj.after=req.version.after;
            }
            arr=await (article.findAsync({
                project:req.obj._id
            },null,{
                sort:"-updatedAt",
                populate:{
                    path:"creator",
                    select:"name"
                }
            }))
            req.obj.article=req.obj._doc.article=arr.map(function (obj) {
                return {
                    title:obj.title,
                    content:obj.content,
                    updatedAt:moment(obj.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                    creator:obj.creator
                }
            });
            nunjucks.configure(path.join(con.tempPath,name), {  });
            var str=nunjucks.render("index.html",{
                interface:JSON.stringify(arrGroup),
                project:JSON.stringify(req.obj),
                status:JSON.stringify(arrStatus),
                name:req.obj.name
            })
            await (fs.writeFileAsync(path.join(con.tempPath,name,"index.html"),str));
            var pathName=path.join(con.tempPath,name+".zip");
            var output=fs.createWriteStream(pathName);
            var archive = zip('zip', {
                zlib: { level: 9 }
            });
            output.on('close', function() {
                rm(path.join(con.tempPath,name),{},function (err) {

                });
                res.download(pathName,req.obj.name+".zip",function (err) {
                    if(!err)
                    {
                        obj.removeAsync();
                        fs.exists(pathName,function (exist) {
                            if(exist)
                            {
                                fs.unlink(pathName);
                            }
                        })
                    }
                });
            });
            archive.on('error', function(err) {
                rm(path.join(con.tempPath,name),{},function (err) {

                });
                throw err;
            });
            archive.pipe(output);
            archive.directory(path.join(con.tempPath,name),req.obj.name);
            archive.finalize();
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.setOwner=async ((req,res)=> {
        try
        {
            let obj=await (user.findOneAsync({
                _id:req.clientParam.user
            }))
            if(!obj)
            {
                util.throw(e.userNotFound,"用户没有找到");
                return;
            }
            let bInTeam=false;
            if(req.obj.team)
            {
                let bIn=await (this.existUserInTeam(req.obj.team,req.clientParam.user));
                if(!bIn)
                {
                    util.throw(e.userNotInTeam,"用户不在团队里");
                }
                else
                {
                    bInTeam=true;
                }
            }
            let bFind=false;
            for(let o of req.obj.users)
            {
                if(o.user.toString()==req.clientParam.user)
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                await (project.updateAsync({
                    _id:req.clientParam.id
                },{
                    owner:req.clientParam.user,
                    $pull:{
                        "users":{
                            user:req.clientParam.user
                        }
                    }
                }))
            }
            else
            {
                if(bInTeam)
                {
                    req.obj.owner=req.clientParam.user;
                    await (req.obj.saveAsync());
                }
                else
                {
                    util.throw(e.userNotInProject,"用户不在项目里");
                }
            }
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.applyList=async ((req,res)=> {
        try
        {
            let arr=await (apply.findAsync({
                to:req.clientParam.id,
                type:1,
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
    })

    this.handleApply=async ((req,res)=> {
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
            obj=await (apply.populateAsync(obj,{
                path:"to",
                select:"name"
            }))
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
            let objProject=req.obj;
            if(objProject.team)
            {
                obj.state=3;
                await (obj.saveAsync());
                if(objProject.team.toString()==obj.to._id.toString())
                {
                    util.throw(e.projectAlreadyJoinTeam,"项目已加入其他团队")
                }
                else
                {
                    util.throw(e.projectAlreadyJoinTeam,"项目已加入团队")
                }

            }
            else
            {
                obj.state=req.clientParam.state;
                if(req.clientParam.state==1)
                {
                    let arrTeamUser=await (this.teamUserList(objTeam._id));
                    let arrProjectUser=objProject.users.map(function (obj) {
                        return obj.user.toString();
                    });
                    arrProjectUser.push(objProject.owner.toString());
                    let arr=[];
                    for(let o of arrProjectUser)
                    {
                        if(arrTeamUser.indexOf(o)==-1)
                        {
                            arr.push(o);
                        }
                    }
                    if(arr.length>0)
                    {
                        arr=arr.map(function (obj) {
                            return {
                                user:obj,
                                role:1
                            }
                        })
                        let objGroup=await (teamGroup.findOneAndUpdateAsync({
                            name:"未命名",
                            team:objTeam._id
                        },{
                            name:"未命名",
                            team:objTeam._id,
                            $addToSet:{
                                users:{
                                    $each:arr
                                }
                            }
                        },{
                            upsert:true,
                            setDefaultsOnInsert:true
                        }))
                    }
                    objProject.team=objTeam._id;
                    await (objProject.saveAsync());
                }
                await (message.createAsync({
                    name:req.clientParam.state==1?"您已同意项目加入团队":"您已拒绝项目加入团队",
                    dis:`您已${req.clientParam.state==1?"通过":"拒绝"}项目${objProject.name}加入团队${obj.from.name}`,
                    user:req.userInfo._id,
                    type:1
                }))
                await (obj.saveAsync());
                await (apply.updateAsync({
                    to:objProject._id,
                    type:1,
                    state:0
                },{
                    state:3
                },{
                    multi:true
                }))
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.setUser=async ((req,res)=> {
        try
        {
            let objUser=JSON.parse(req.clientParam.user);
            for(let obj of objUser)
            {
                if(obj.user==req.obj.owner.toString())
                {
                    util.throw(e.userForbidden,"用户列表里还有拥有者");
                }
            }
            req.obj.users=objUser;
            await (req.obj.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.getUsers=async ((req,res)=> {
        try
        {
            req.obj=await (project.populateAsync(req.obj,{
                path:"owner",
                select:"name photo"
            }));
            req.obj=await (project.populateAsync(req.obj,{
                path:"users.user",
                select:"name photo"
            }));
            let arr=[req.obj.owner].concat(req.obj.users.map(function (obj) {
                return obj.user
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.importRap=async ((req,res)=> {
        try
        {
            let obj=JSON.parse(req.clientParam.json);
            let query={
                name:obj.name,
                owner:req.userInfo._id,
                source:{
                    type:1
                }
            }
            if(req.clientParam.team)
            {
                query.team=req.clientParam.team
            }
            let objProject=await (project.createAsync(query));
            await (group.createAsync({
                name:"#回收站",
                project:objProject._id,
                type:1,
                id:uuid()
            }));
            let interfaceCount=0;
            for(let objModule of obj.moduleList)
            {
                for(let objPage of objModule.pageList)
                {
                    let groupName;
                    if(obj.moduleList.length>1)
                    {
                        groupName=objModule.name;
                        groupName+="-"+objPage.name;
                    }
                    else
                    {
                        groupName=objPage.name;
                    }
                    let query={
                        name:groupName,
                        project:objProject._id,
                        type:0,
                        id:uuid()
                    }
                    let objGroup=await (group.createAsync(query));
                    for(let objAction of objPage.actionList)
                    {
                        interfaceCount++;
                        let arrMethod=["GET","POST","PUT","DELETE"];
                        let update={
                            name:objAction.name,
                            project:objProject._id,
                            group:objGroup._id,
                            url:objAction.requestUrl,
                            remark:objAction.description,
                            method:arrMethod[objAction.requestType-1],
                            owner:req.userInfo._id,
                            editor:req.userInfo._id,
                            param:[
                                {
                                    before:{
                                        mode:0,
                                        code:""
                                    },
                                    after:{
                                        mode:0,
                                        code:""
                                    },
                                    name:"未命名",
                                    remark:"",
                                    id:uuid()
                                }
                            ],
                            id:uuid()
                        };
                        let rest=[];
                        let arrMatch=update.url.match(/(\/):(.+?)(?=\b|\?|#|\/)/g);
                        if(arrMatch && arrMatch.length>0)
                        {
                            arrMatch.forEach(function (obj) {
                                rest.push({
                                    value:{
                                        "status" : "",
                                        "data" : [],
                                        "type" : 0
                                    },
                                    name:obj.substr(2),
                                    remark:""
                                })
                            })
                            update.url=update.url.replace(/(\/):(.+?)(?=\b|\?|#|\/)/g,"$1{$2}");
                        }
                        update.param[0].restParam=rest;
                        let query=[],body=[],header=[];
                        if(update.method=="GET" || update.method=="DELETE")
                        {
                            objAction.requestParameterList.forEach(function (obj) {
                                query.push({
                                    name:obj.identifier.split("|")[0].trim(),
                                    remark:obj.name,
                                    must:1,
                                    value:{
                                        "status" : "",
                                        "data" : [],
                                        "type" : 0
                                    }
                                })
                            })
                        }
                        else
                        {
                            let bodyInfo;
                            if(req.clientParam.bodytype==0)
                            {
                                bodyInfo={
                                    type:0,
                                    rawType:0,
                                    rawTextRemark:"",
                                    rawFileRemark:"",
                                    rawText:"",
                                    rawJSON:[],
                                    rawJSONType:0
                                };
                                objAction.requestParameterList.forEach(function (obj) {
                                    body.push({
                                        name:obj.identifier.split("|")[0].trim(),
                                        remark:obj.name,
                                        must:1,
                                        value:{
                                            "status" : "",
                                            "data" : [],
                                            "type" : 0
                                        },
                                        type:0
                                    })
                                })
                                header.push({
                                    name:"Content-Type",
                                    value:"application/x-www-form-urlencoded",
                                    remark:""
                                })
                            }
                            else
                            {
                                bodyInfo={
                                    type:1,
                                    rawType:2,
                                    rawTextRemark:"",
                                    rawFileRemark:"",
                                    rawText:"",
                                    rawJSON:[],
                                    rawJSONType:0
                                };
                                for(let o of objAction.requestParameterList)
                                {
                                    handleJSON(o,bodyInfo.rawJSON);
                                }
                                header.push({
                                    name:"Content-Type",
                                    value:"application/json",
                                    remark:""
                                })
                            }
                            update.param[0].bodyInfo=bodyInfo;
                        }
                        update.param[0].queryParam=query;
                        update.param[0].bodyParam=body;
                        update.param[0].header=header;
                        let result=[];
                        function handleJSON(obj,arrRaw,bArr) {
                            if(obj.dataType=="string")
                            {
                                let o={
                                    mock : "",
                                    remark : obj.name,
                                    type : 0,
                                    must : 1,
                                    name : bArr?null:obj.identifier.split("|")[0].trim()
                                }
                                arrRaw.push(o);
                            }
                            else if(obj.dataType=="number")
                            {
                                let o={
                                    mock : "",
                                    remark : obj.name,
                                    type : 1,
                                    must : 1,
                                    name : bArr?null:obj.identifier.split("|")[0].trim()
                                }
                                arrRaw.push(o);
                            }
                            else if(obj.dataType=="boolean")
                            {
                                let o={
                                    mock : "",
                                    remark : obj.name,
                                    type : 2,
                                    must : 1,
                                    name : bArr?null:obj.identifier.split("|")[0].trim()
                                }
                                arrRaw.push(o);
                            }
                            else if(obj.dataType=="object" || obj.dataType=="array")
                            {
                                let o={
                                    mock : "",
                                    remark : obj.name,
                                    type : obj.dataType=="array"?3:4,
                                    must : 1,
                                    name : bArr?null:obj.identifier.split("|")[0].trim(),
                                    data:[]
                                }
                                arrRaw.push(o);
                                for(let o1 of obj.parameterList)
                                {
                                    arguments.callee(o1,o.data,obj.dataType=="array"?1:null)
                                }
                            }
                            else if(obj.dataType=="array<string>" || obj.dataType=="array<number>" || obj.dataType=="array<boolean>")
                            {
                                let o={
                                    mock : "",
                                    remark : obj.name,
                                    type : 3,
                                    must : 1,
                                    name : bArr?null:obj.identifier.split("|")[0].trim(),
                                    data:[{
                                        mock : "",
                                        remark : "",
                                        type : obj.dataType=="array<string>"?0:(obj.dataType=="array<number>"?1:2),
                                        must : 1,
                                        name : null
                                    }]
                                }
                                arrRaw.push(o);
                            }
                            else if(obj.dataType=="array<object>")
                            {
                                let o={
                                    mock : "",
                                    remark : obj.name,
                                    type : 3,
                                    must : 1,
                                    name : bArr?null:obj.identifier.split("|")[0].trim(),
                                    data:[{
                                        mock : "",
                                        remark : "",
                                        type :4,
                                        must : 1,
                                        name : null,
                                        data:[]
                                    }]
                                }
                                arrRaw.push(o);
                                for(let o1 of obj.parameterList)
                                {
                                    arguments.callee(o1,o.data[0].data)
                                }
                            }
                        }
                        for(let o of objAction.responseParameterList)
                        {
                            handleJSON(o,result);
                        }
                        update.param[0].outParam=result;
                        update.param[0].outInfo={
                            "jsonType" : 0,
                            "rawMock" : "",
                            "rawRemark" : "",
                            "type" : 0
                        }
                        await (interface.createAsync(update));
                    }
                }
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
    })

    this.importSwagger=async ((req,res)=> {
        try
        {
            let data=req.clientParam.json;
            if(req.clientParam.url)
            {
                data=await (request({
                    method:"GET",
                    url:req.clientParam.url
                }).then(function (response) {
                    return response.body;
                }))
            }
            let obj=JSON.parse(data);
            let update={
                name:obj.info.title,
                owner:req.userInfo._id,
                source:req.clientParam.url?{
                    type:0,
                    url:req.clientParam.url
                }:{
                    type:0
                }
            }
            if(req.clientParam.team)
            {
                update.team=req.clientParam.team
            }
            if(obj.host)
            {
                let url=obj.host;
                if(obj.basePath && obj.basePath!="/")
                {
                    url+=obj.basePath
                }
                if(obj.schemes && obj.schemes.length>0)
                {
                    url=obj.schemes[0]+"://"+url;
                }
                else
                {
                    url="http://"+url;
                }
                update.baseUrls=[{
                    url:url,
                    remark:""
                }]
            }
            let objProject=await (project.createAsync(update));
            await (group.createAsync({
                name:"#回收站",
                project:objProject._id,
                type:1,
                id:uuid()
            }));
            let objGroup={};
            if(obj.tags)
            {
                obj.tags.forEach(function (obj) {
                    objGroup[obj.name]=await (group.createAsync({
                        name:obj.name,
                        project:objProject._id,
                        type:0,
                        id:uuid()
                    }));
                })
            }
            else
            {
                let arr=[];
                for(let key in obj.paths)
                {
                    let objInter=obj.paths[key];
                    for(let key1 in objInter)
                    {
                        let objIns=objInter[key1];
                        if(objIns.tags)
                        {
                            objIns.tags.forEach(function (obj) {
                                if(arr.indexOf(obj)==-1)
                                {
                                    arr.push(obj);
                                }
                            })
                        }
                    }
                }
                arr.forEach(function (obj) {
                    objGroup[obj]=await (group.createAsync({
                        name:obj,
                        project:objProject._id,
                        type:0,
                        id:uuid()
                    }));
                })
            }
            let objDef={};
            function handleDef(def,root,arrDef) {
                let ref=false,obj,key;
                if(def.$ref)
                {
                    ref=true;
                    key=def.$ref.substr(14);
                    if(objDef[key])
                    {
                        if(arrDef.indexOf(key)>-1)
                        {
                            return null;
                        }
                        else
                        {
                            return objDef[key];
                        }
                    }
                    else
                    {
                        if(arrDef.indexOf(key)>-1)
                        {
                            return null;
                        }
                        arrDef.push(key);
                        obj=root[key];
                    }
                }
                else
                {
                    obj=def;
                }
                if(!obj)
                {
                    return null;
                }
                let objRaw={
                    mock : "",
                    remark : "",
                    type : 0,
                    must : 1,
                    name : null
                };
                if(obj.type=="string" || obj.type=="byte" || obj.type=="binary" || obj.type=="date" || obj.type=="dateTime" || obj.type=="password")
                {
                    objRaw.type=0;
                }
                else if(obj.type=="integer" || obj.type=="long" || obj.type=="float" || obj.type=="double")
                {
                    objRaw.type=1;
                }
                else if(obj.type=="boolean")
                {
                    objRaw.type=2;
                }
                else if(obj.type=="array")
                {
                    objRaw.type=3;
                    objRaw.data=[];
                    let index=arrDef.length;
                    let obj1=arguments.callee(obj.items,root,arrDef);
                    arrDef.splice(index);
                    if(obj1!==null)
                    {
                        obj1=util.clone(obj1);
                        objRaw.data.push(obj1);
                    }
                }
                else if(obj.type=="object")
                {
                    objRaw.type=4;
                    objRaw.data=[];
                    for(let key in obj.properties)
                    {
                        let index=arrDef.length;
                        let obj1=arguments.callee(obj.properties[key],root,arrDef);
                        arrDef.splice(index);
                        if(obj1!==null)
                        {
                            obj1=util.clone(obj1);
                            obj1.name=key;
                            objRaw.data.push(obj1);
                        }
                    }
                }
                if(obj.description)
                {
                    objRaw.remark=obj.description;
                }
                if(obj.default!==undefined)
                {
                    objRaw.mock=obj.default;
                }
                if(obj.example!==undefined || obj.enum!==undefined)
                {
                    objRaw.value={
                        type:0,
                        status:"",
                        data:[]
                    };
                    if(obj.example!==undefined)
                    {
                        objRaw.value.data.push({
                            value:obj.example,
                            remark:""
                        })
                    }
                    if(obj.enum!==undefined)
                    {
                        objRaw.value.data=objRaw.value.data.concat(obj.enum.map(function (obj) {
                            return {
                                value:obj,
                                remark:""
                            }
                        }));
                    }
                }
                if(def.$ref)
                {
                    objDef[key]=objRaw;
                }
                return objRaw;
            }
            if(obj.definitions)
            {
                for(let key in obj.definitions)
                {
                    let val=obj.definitions[key];
                    let arrDef=[key];
                    let o=handleDef(val,obj.definitions,arrDef);
                    objDef[key]=o;
                }
            }
            let interfaceCount=0;
            let arrMethod=["GET","POST","PUT","DELETE","PATCH"]
            for(let path in obj.paths)
            {
                let obj1=obj.paths[path];
                for(let method in obj1)
                {
                    let interRaw=obj1[method];
                    if(arrMethod.indexOf(method.toUpperCase())==-1)
                    {
                        continue;
                    }
                    interfaceCount++;
                    let name;
                    if(interRaw.summary)
                    {
                        name=interRaw.summary
                    }
                    else
                    {
                        name=path;
                        let index=name.lastIndexOf("/");
                        if(index>-1)
                        {
                            name=name.substr(index+1);
                        }
                    }
                    let update={
                        name:name,
                        project:objProject._id,
                        group:objGroup[interRaw.tags[0]]._id,
                        url:path,
                        remark:interRaw.description,
                        method:method.toUpperCase(),
                        owner:req.userInfo._id,
                        editor:req.userInfo._id,
                        param:[
                            {
                                before:{
                                    mode:0,
                                    code:""
                                },
                                after:{
                                    mode:0,
                                    code:""
                                },
                                name:"未命名",
                                remark:"",
                                id:uuid(),
                                queryParam:[],
                                header:[],
                                restParam:[],
                                outInfo:{
                                    "rawMock" : "",
                                    "rawRemark" : "",
                                    "type" : 0
                                },
                                outParam:[],
                            }
                        ],
                        id:uuid()
                    };
                    let rest=[],query=[],header=[],body=[];
                    let bodyInfo={
                        type:0,
                        rawType:0,
                        rawTextRemark:"",
                        rawFileRemark:"",
                        rawText:"",
                        rawJSON:[],
                        rawJSONType:0
                    };
                    let outInfo={
                        type:0,
                        rawRemark:"",
                        rawMock:"",
                        jsonType:0
                    };
                    let contentType=interRaw.consumes?interRaw.consumes[0]:null;
                    if(contentType)
                    {
                        header.push({
                            name:"Content-Type",
                            value:contentType,
                            remark:""
                        });
                        if(contentType=="application/json")
                        {
                            bodyInfo={
                                type:1,
                                rawType:2,
                                rawTextRemark:"",
                                rawFileRemark:"",
                                rawText:"",
                                rawJSON:[],
                                rawJSONType:0
                            };
                        }
                    }
                    if(interRaw.parameters)
                    {
                        for(let o of interRaw.parameters)
                        {
                            if(o.in=="path")
                            {
                                rest.push({
                                    value:{
                                        "status" : "",
                                        "data" : [],
                                        "type" : 0
                                    },
                                    name:o.name,
                                    remark:o.description?o.description:""
                                })
                            }
                            else if(o.in=="query")
                            {
                                query.push({
                                    name:o.name,
                                    remark:o.description?o.description:"",
                                    must:o.required?1:0,
                                    value:{
                                        "status" : "",
                                        "data" : (o.items && o.items.enum)?o.items.enum.map(function (obj) {
                                            return {
                                                value:obj,
                                                remark:""
                                            }
                                        }):[],
                                        "type" : 0
                                    }
                                })
                            }
                            else if(o.in=="header")
                            {
                                header.push({
                                    name:o.name,
                                    remark:o.description?o.description:"",
                                    value:""
                                })
                            }
                            else if(o.in=="body")
                            {
                                if(bodyInfo.type==0)
                                {
                                    let objBody={
                                        name:o.name,
                                        type:0,
                                        must:o.required?1:0,
                                        remark:o.description?o.description:""
                                    };
                                    body.push(objBody);
                                }
                                else if(bodyInfo.type==1 && bodyInfo.rawType==2)
                                {
                                    let objBody={
                                        mock : "",
                                        remark : o.description,
                                        type : 1,
                                        must : o.required?1:0,
                                        name :o.name
                                    };
                                    if(o.schema)
                                    {
                                        if(o.schema.$ref)
                                        {
                                            let key=o.schema.$ref.substr(14);
                                            if(objDef[key])
                                            {
                                                let o1=util.clone(objDef[key]);
                                                o1.remark=objBody.remark;
                                                o1.must=objBody.must;
                                                o1.name=objBody.name;
                                                objBody=o1;
                                                bodyInfo.rawJSON.push(objBody);
                                            }
                                        }
                                        else
                                        {
                                            if(o.schema.items)
                                            {
                                                objBody.data=[];
                                                objBody.type=3;
                                                if(o.schema.items.$ref)
                                                {
                                                    let key=o.schema.items.$ref.substr(14);
                                                    if(objDef[key])
                                                    {
                                                        let o1=util.clone(objDef[key]);
                                                        objBody.data.push(o1);
                                                        bodyInfo.rawJSON.push(objBody);
                                                    }
                                                }
                                                else
                                                {
                                                    let type;
                                                    let o1=o.schema.items;
                                                    if(o1.type=="string" || o1.type=="byte" || o1.type=="binary" || o1.type=="date" || o1.type=="dateTime" || o1.type=="password")
                                                    {
                                                        type=0;
                                                    }
                                                    else if(o1.type=="integer" || o1.type=="long" || o1.type=="float" || o1.type=="double")
                                                    {
                                                        type=1;
                                                    }
                                                    else if(o1.type=="boolean")
                                                    {
                                                        type=2;
                                                    }
                                                    let o2={
                                                        mock : o1.default!==undefined?o1.default:"",
                                                        remark : o1.description?o1.description:"",
                                                        type : type,
                                                        must : 1,
                                                        name :null
                                                    }
                                                    objBody.data.push(o2);
                                                    bodyInfo.rawJSON.push(objBody);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else if(o.in=="formData")
                            {
                                let objBody={
                                    name:o.name,
                                    type:o.type!="file"?0:1,
                                    must:o.required?1:0,
                                    remark:o.description?o.description:""
                                };
                                body.push(objBody);
                                header["Content-Type"]="multipart/form-data";
                            }
                        }
                    }
                    if(interRaw.responses)
                    {
                        let count=0;
                        for(let status in interRaw.responses)
                        {
                            count++;
                            let result=[];
                            let objRes=interRaw.responses[status];
                            if(objRes.schema && objRes.schema.$ref)
                            {
                                let key=objRes.schema.$ref.substr(14);
                                if(objDef[key])
                                {
                                    let o1=util.clone(objDef[key]);
                                    if(o1.type==4)
                                    {
                                        result=o1.data;
                                    }
                                    else
                                    {
                                        outInfo.type=1;
                                        outInfo.rawMock=o1.mock?o1.mock:"";
                                        outInfo.rawRemark=objRes.description?objRes.description:"";
                                    }
                                }
                            }
                            else if(objRes.schema && objRes.schema.items)
                            {
                                outInfo.jsonType=1;
                                result=[
                                    {
                                        name:null,
                                        must:1,
                                        type:0,
                                        remark:"",
                                        mock:"",
                                    }
                                ]
                                if(objRes.schema.items.$ref)
                                {
                                    let key=objRes.schema.items.$ref.substr(14);
                                    if(objDef[key])
                                    {
                                        let o1=util.clone(objDef[key]);
                                        if(o1.type==4)
                                        {
                                            result[0].type=4;
                                            result[0].data=o1.data;
                                        }
                                        else
                                        {
                                            for(let key in o1)
                                            {
                                                result[0][key]=o1[key];
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    let type;
                                    let o1=objRes.schema.items;
                                    if(o1.type=="string" || o1.type=="byte" || o1.type=="binary" || o1.type=="date" || o1.type=="dateTime" || o1.type=="password")
                                    {
                                        type=0;
                                    }
                                    else if(o1.type=="integer" || o1.type=="long" || o1.type=="float" || o1.type=="double")
                                    {
                                        type=1;
                                    }
                                    else if(o1.type=="boolean")
                                    {
                                        type=2;
                                    }
                                    result[0].type=type;
                                }
                            }
                            else if(objRes.schema && objRes.schema.properties)
                            {
                                function __handleRes(key,value,data) {
                                    let obj={
                                        mock : value.example?value.example:"",
                                        remark : value.description?value.description:"",
                                        type : 0,
                                        must : 1,
                                        name :key?key:null
                                    }
                                    if(value.type=="string" || value.type=="byte" || value.type=="binary" || value.type=="date" || value.type=="dateTime" || value.type=="password")
                                    {
                                        obj.type=0;
                                    }
                                    else if(value.type=="integer" || value.type=="long" || value.type=="float" || value.type=="double")
                                    {
                                        obj.type=1;
                                    }
                                    else if(value.type=="boolean")
                                    {
                                        obj.type=2;
                                    }
                                    else if(value.type=="array")
                                    {
                                        obj.type=3;
                                        obj.data=[];
                                        if(value.items.$ref)
                                        {
                                            let result=[
                                                {
                                                    name:null,
                                                    must:1,
                                                    type:0,
                                                    remark:"",
                                                    mock:"",
                                                }
                                            ]
                                            let def=value.items.$ref.substr(value.items.$ref.lastIndexOf("/")+1);
                                            if(objDef[def])
                                            {
                                                let o1=util.clone(objDef[def]);
                                                if(o1.type==4)
                                                {
                                                    result[0].type=4;
                                                    result[0].data=o1.data;
                                                }
                                                else
                                                {
                                                    for(let key in o1)
                                                    {
                                                        result[0][key]=o1[key];
                                                    }
                                                }
                                                obj.data=result;
                                            }
                                        }
                                        else
                                        {
                                            let type;
                                            let o1=value.items;
                                            arguments.callee(null,o1,obj.data);
                                        }
                                    }
                                    else if(value.type=="object")
                                    {
                                        obj.type=4;
                                        obj.data=[];
                                        for(let k in value.properties)
                                        {
                                            arguments.callee(k,value.properties[k],obj.data);
                                        }
                                    }
                                    else if(value.$ref)
                                    {
                                        let ref=value.$ref.substr(value.$ref.lastIndexOf("/")+1);
                                        if(objDef[ref])
                                        {
                                            let o1=util.clone(objDef[ref]);
                                            if(o1.type==4)
                                            {
                                                obj.type=4;
                                                obj.data=o1.data;
                                            }
                                            else
                                            {
                                                for(let key in o1)
                                                {
                                                    obj[key]=o1[key];
                                                }
                                            }
                                        }
                                    }
                                    data.push(obj);
                                }
                                for(let key in objRes.schema.properties)
                                {
                                    __handleRes(key,objRes.schema.properties[key],result);
                                }
                            }
                            else
                            {
                                outInfo.type=1;
                                if(objRes.schema)
                                {
                                    outInfo.rawRemark=objRes.description+"("+(objRes.schema.type?objRes.schema.type:"")+")";
                                }
                                else
                                {
                                    outInfo.rawRemark=""
                                }
                            }
                            let objParam={
                                name:status,
                                remark:objRes.description?objRes.description:"",
                                id:uuid(),
                                before:{
                                    code:"",
                                    mode:0
                                },
                                after:{
                                    code:"",
                                    mode:0
                                }
                            };
                            objParam.restParam=rest;
                            objParam.queryParam=query;
                            objParam.header=header;
                            objParam.outParam=result;
                            objParam.outInfo=outInfo;
                            if(update.method=="POST" || update.method=="PUT" || update.method=="PATCH")
                            {
                                objParam.bodyParam=body;
                                objParam.bodyInfo=bodyInfo;
                            }
                            if(count==1)
                            {
                                update.param[0]=util.clone(objParam)
                            }
                            else
                            {
                                update.param.push(util.clone(objParam))
                            }
                        }
                    }
                    await (interface.createAsync(update));
                }
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
    })
    this.updateSwagger=async ((req,res)=>{
        try
        {
            let data=req.clientParam.json;
            if(req.clientParam.url)
            {
                data=await (request({
                    method:"GET",
                    url:req.clientParam.url
                }).then(function (response) {
                    return response.body;
                }))
            }
            let obj=JSON.parse(data);
            let update,objProject=req.obj;
            if(req.version)
            {
                if(obj.host)
                {
                    let url=obj.host;
                    if(obj.basePath && obj.basePath!="/")
                    {
                        url+=obj.basePath
                    }
                    if(obj.schemes && obj.schemes.length>0)
                    {
                        url=obj.schemes[0]+"://"+url;
                    }
                    else
                    {
                        url="http://"+url;
                    }
                    req.version.baseUrls=[{
                        url:url,
                        remark:""
                    }]
                    req.version.source=req.clientParam.url?{
                        type:0,
                        url:req.clientParam.url
                    }:{
                        type:0
                    };
                    await (req.version.saveAsync());
                }
            }
            else
            {
                if(obj.info.title)
                {
                    req.obj.name=obj.info.title;
                }
                req.obj.source=req.clientParam.url?{
                    type:0,
                    url:req.clientParam.url
                }:{
                    type:0
                }
                if(obj.host)
                {
                    let url=obj.host;
                    if(obj.basePath && obj.basePath!="/")
                    {
                        url+=obj.basePath
                    }
                    if(obj.schemes && obj.schemes.length>0)
                    {
                        url=obj.schemes[0]+"://"+url;
                    }
                    else
                    {
                        url="http://"+url;
                    }
                    req.obj.baseUrls=[{
                        url:url,
                        remark:""
                    }]
                }
                await (req.obj.saveAsync());
            }
            let query={
                project:req.obj._id
            }
            if(req.version)
            {
                query.version=req.version._id
            }
            query.type=0;
            await (req.groupModel.updateAsync(query,{
                delete:1
            },{
                multi:true
            }))
            delete query.type;
            await (req.interfaceModel.updateAsync(query,{
                delete:1
            },{
                multi:true
            }))
            let objGroup={};
            if(obj.tags)
            {
                obj.tags.forEach(function (obj) {
                    let query={
                        name:obj.name,
                        project:req.obj._id
                    }
                    if(req.version)
                    {
                        query.version=req.version._id
                    }
                    objGroup[obj.name]=await (req.groupModel.findOneAsync(query));
                    if(objGroup[obj.name])
                    {
                        objGroup[obj.name]=await (req.groupModel.findOneAndUpdateAsync({
                            _id:objGroup[obj.name]._id
                        },{
                            name:obj.name,
                            $unset:{
                                delete:1
                            }
                        },{
                            new:true
                        }))
                    }
                    else
                    {
                        objGroup[obj.name]=await (req.groupModel.createAsync({
                            name:obj.name,
                            project:objProject._id,
                            type:0,
                            id:uuid(),
                        }));
                    }
                })
            }
            else
            {
                let arr=[];
                for(let key in obj.paths)
                {
                    let objInter=obj.paths[key];
                    for(let key1 in objInter)
                    {
                        let objIns=objInter[key1];
                        if(objIns.tags)
                        {
                            objIns.tags.forEach(function (obj) {
                                if(arr.indexOf(obj)==-1)
                                {
                                    arr.push(obj);
                                }
                            })
                        }
                    }
                }
                arr.forEach(function (obj) {
                    let query={
                        name:obj.name,
                        project:req.obj._id
                    }
                    if(req.version)
                    {
                        query.version=req.version._id
                    }
                    objGroup[obj]=await (req.groupModel.findOneAsync(query));
                    if(objGroup[obj])
                    {
                        objGroup[obj]=await (req.groupModel.findOneAndUpdateAsync({
                            _id:objGroup[obj]._id
                        },{
                            name:obj,
                            $unset:{
                                delete:1
                            }
                        },{
                            new:true
                        }))
                    }
                    else
                    {
                        objGroup[obj]=await (req.groupModel.createAsync({
                            name:obj,
                            project:objProject._id,
                            type:0,
                            id:uuid(),
                        }));
                    }
                })
            }
            let objDef={};
            function handleDef(def,root,arrDef) {
                let ref=false,obj,key;
                if(def.$ref)
                {
                    ref=true;
                    key=def.$ref.substr(14);
                    if(objDef[key])
                    {
                        if(arrDef.indexOf(key)>-1)
                        {
                            return null;
                        }
                        else
                        {
                            return objDef[key];
                        }
                    }
                    else
                    {
                        if(arrDef.indexOf(key)>-1)
                        {
                            return null;
                        }
                        arrDef.push(key);
                        obj=root[key];
                    }
                }
                else
                {
                    obj=def;
                }
                if(!obj)
                {
                    return null;
                }
                let objRaw={
                    mock : "",
                    remark : "",
                    type : 0,
                    must : 1,
                    name : null
                };
                if(obj.type=="string" || obj.type=="byte" || obj.type=="binary" || obj.type=="date" || obj.type=="dateTime" || obj.type=="password")
                {
                    objRaw.type=0;
                }
                else if(obj.type=="integer" || obj.type=="long" || obj.type=="float" || obj.type=="double")
                {
                    objRaw.type=1;
                }
                else if(obj.type=="boolean")
                {
                    objRaw.type=2;
                }
                else if(obj.type=="array")
                {
                    objRaw.type=3;
                    objRaw.data=[];
                    let index=arrDef.length;
                    let obj1=arguments.callee(obj.items,root,arrDef);
                    arrDef.splice(index);
                    if(obj1!==null)
                    {
                        obj1=util.clone(obj1);
                        objRaw.data.push(obj1);
                    }
                }
                else if(obj.type=="object")
                {
                    objRaw.type=4;
                    objRaw.data=[];
                    for(let key in obj.properties)
                    {
                        let index=arrDef.length;
                        let obj1=arguments.callee(obj.properties[key],root,arrDef);
                        arrDef.splice(index);
                        if(obj1!==null)
                        {
                            obj1=util.clone(obj1);
                            obj1.name=key;
                            objRaw.data.push(obj1);
                        }
                    }
                }
                if(obj.description)
                {
                    objRaw.remark=obj.description;
                }
                if(obj.default!==undefined)
                {
                    objRaw.mock=obj.default;
                }
                if(obj.example!==undefined || obj.enum!==undefined)
                {
                    objRaw.value={
                        type:0,
                        status:"",
                        data:[]
                    };
                    if(obj.example!==undefined)
                    {
                        objRaw.value.data.push({
                            value:obj.example,
                            remark:""
                        })
                    }
                    if(obj.enum!==undefined)
                    {
                        objRaw.value.data=objRaw.value.data.concat(obj.enum.map(function (obj) {
                            return {
                                value:obj,
                                remark:""
                            }
                        }));
                    }
                }
                if(def.$ref)
                {
                    objDef[key]=objRaw;
                }
                return objRaw;
            }
            if(obj.definitions)
            {
                for(let key in obj.definitions)
                {
                    let val=obj.definitions[key];
                    let arrDef=[key];
                    let o=handleDef(val,obj.definitions,arrDef);
                    objDef[key]=o;
                }
            }
            let arrMethod=["GET","POST","PUT","DELETE","PATCH"];
            for(let path in obj.paths)
            {
                let objInter;
                let obj1=obj.paths[path];
                for(let method in obj1)
                {
                    let interRaw=obj1[method];
                    if(arrMethod.indexOf(method.toUpperCase())==-1)
                    {
                        continue;
                    }
                    let name;
                    if(interRaw.summary)
                    {
                        name=interRaw.summary
                    }
                    else
                    {
                        name=path;
                        let index=name.lastIndexOf("/");
                        if(index>-1)
                        {
                            name=name.substr(index+1);
                        }
                    }
                    let query1={
                        project:objProject._id,
                        group:objGroup[interRaw.tags[0]]._id,
                        url:path,
                        method:method.toUpperCase()
                    }
                    if(req.version)
                    {
                        query1.version=req.version._id;
                    }
                    objInter=await (req.interfaceModel.findOneAsync(query1));
                    let update;
                    if(objInter)
                    {
                        update={
                            name:name,
                            remark:interRaw.description?interRaw.description:objInter.remark,
                            param:[
                                {
                                    before:{
                                        mode:0,
                                        code:""
                                    },
                                    after:{
                                        mode:0,
                                        code:""
                                    },
                                    name:"未命名",
                                    remark:"",
                                    id:uuid()
                                }
                            ],
                            $unset:{
                                delete:1
                            }
                        };
                    }
                    else
                    {
                        update={
                            name:name,
                            project:objProject._id,
                            group:objGroup[interRaw.tags[0]]._id,
                            url:path,
                            remark:interRaw.description,
                            method:method.toUpperCase(),
                            owner:req.userInfo._id,
                            editor:req.userInfo._id,
                            param:[
                                {
                                    before:{
                                        mode:0,
                                        code:""
                                    },
                                    after:{
                                        mode:0,
                                        code:""
                                    },
                                    name:"未命名",
                                    remark:"",
                                    id:uuid(),
                                    queryParam:[],
                                    header:[],
                                    restParam:[],
                                    outInfo:{
                                        "rawMock" : "",
                                        "rawRemark" : "",
                                        "type" : 0
                                    },
                                    outParam:[],
                                }
                            ],
                            id:uuid()
                        };
                    }
                    let rest=[],query=[],header=[],body=[];
                    let bodyInfo={
                        type:0,
                        rawType:0,
                        rawTextRemark:"",
                        rawFileRemark:"",
                        rawText:"",
                        rawJSON:[],
                        rawJSONType:0
                    };
                    let outInfo={
                        type:0,
                        rawRemark:"",
                        rawMock:"",
                        jsonType:0
                    };
                    let contentType=interRaw.consumes?interRaw.consumes[0]:null;
                    if(contentType)
                    {
                        header.push({
                            name:"Content-Type",
                            value:contentType,
                            remark:""
                        });
                        if(contentType=="application/json")
                        {
                            bodyInfo={
                                type:1,
                                rawType:2,
                                rawTextRemark:"",
                                rawFileRemark:"",
                                rawText:"",
                                rawJSON:[],
                                rawJSONType:0
                            };
                        }
                    }
                    if(interRaw.parameters)
                    {
                        for(let o of interRaw.parameters)
                        {
                            if(o.in=="path")
                            {
                                rest.push({
                                    value:{
                                        "status" : "",
                                        "data" : [],
                                        "type" : 0
                                    },
                                    name:o.name,
                                    remark:o.description?o.description:""
                                })
                            }
                            else if(o.in=="query")
                            {
                                query.push({
                                    name:o.name,
                                    remark:o.description?o.description:"",
                                    must:o.required?1:0,
                                    value:{
                                        "status" : "",
                                        "data" : (o.items && o.items.enum)?o.items.enum.map(function (obj) {
                                            return {
                                                value:obj,
                                                remark:""
                                            }
                                        }):[],
                                        "type" : 0
                                    }
                                })
                            }
                            else if(o.in=="header")
                            {
                                header.push({
                                    name:o.name,
                                    remark:o.description?o.description:"",
                                    value:""
                                })
                            }
                            else if(o.in=="body")
                            {
                                if(bodyInfo.type==0)
                                {
                                    let objBody={
                                        name:o.name,
                                        type:0,
                                        must:o.required?1:0,
                                        remark:o.description?o.description:""
                                    };
                                    body.push(objBody);
                                }
                                else if(bodyInfo.type==1 && bodyInfo.rawType==2)
                                {
                                    let objBody={
                                        mock : "",
                                        remark : o.description,
                                        type : 1,
                                        must : o.required?1:0,
                                        name :o.name
                                    };
                                    if(o.schema)
                                    {
                                        if(o.schema.$ref)
                                        {
                                            let key=o.schema.$ref.substr(14);
                                            if(objDef[key])
                                            {
                                                let o1=util.clone(objDef[key]);
                                                o1.remark=objBody.remark;
                                                o1.must=objBody.must;
                                                o1.name=objBody.name;
                                                objBody=o1;
                                                bodyInfo.rawJSON.push(objBody);
                                            }
                                        }
                                        else
                                        {
                                            if(o.schema.items)
                                            {
                                                objBody.data=[];
                                                objBody.type=3;
                                                if(o.schema.items.$ref)
                                                {
                                                    let key=o.schema.items.$ref.substr(14);
                                                    if(objDef[key])
                                                    {
                                                        let o1=util.clone(objDef[key]);
                                                        objBody.data.push(o1);
                                                        bodyInfo.rawJSON.push(objBody);
                                                    }
                                                }
                                                else
                                                {
                                                    let type;
                                                    let o1=o.schema.items;
                                                    if(o1.type=="string" || o1.type=="byte" || o1.type=="binary" || o1.type=="date" || o1.type=="dateTime" || o1.type=="password")
                                                    {
                                                        type=0;
                                                    }
                                                    else if(o1.type=="integer" || o1.type=="long" || o1.type=="float" || o1.type=="double")
                                                    {
                                                        type=1;
                                                    }
                                                    else if(o1.type=="boolean")
                                                    {
                                                        type=2;
                                                    }
                                                    let o2={
                                                        mock : o1.default!==undefined?o1.default:"",
                                                        remark : o1.description?o1.description:"",
                                                        type : type,
                                                        must : 1,
                                                        name :null
                                                    }
                                                    objBody.data.push(o2);
                                                    bodyInfo.rawJSON.push(objBody);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else if(o.in=="formData")
                            {
                                let objBody={
                                    name:o.name,
                                    type:o.type!="file"?0:1,
                                    must:o.required?1:0,
                                    remark:o.description?o.description:""
                                };
                                body.push(objBody);
                                header["Content-Type"]="multipart/form-data";
                            }
                        }
                    }
                    if(interRaw.responses)
                    {
                        let count=0;
                        for(let status in interRaw.responses)
                        {
                            count++;
                            let result=[];
                            let objRes=interRaw.responses[status];
                            if(objRes.schema && objRes.schema.$ref)
                            {
                                let key=objRes.schema.$ref.substr(14);
                                if(objDef[key])
                                {
                                    let o1=util.clone(objDef[key]);
                                    if(o1.type==4)
                                    {
                                        result=o1.data;
                                    }
                                    else
                                    {
                                        outInfo.type=1;
                                        outInfo.rawMock=o1.mock?o1.mock:"";
                                        outInfo.rawRemark=objRes.description?objRes.description:"";
                                    }
                                }
                            }
                            else if(objRes.schema && objRes.schema.items)
                            {
                                outInfo.jsonType=1;
                                result=[
                                    {
                                        name:null,
                                        must:1,
                                        type:0,
                                        remark:"",
                                        mock:"",
                                    }
                                ]
                                if(objRes.schema.items.$ref)
                                {
                                    let key=objRes.schema.items.$ref.substr(14);
                                    if(objDef[key])
                                    {
                                        let o1=util.clone(objDef[key]);
                                        if(o1.type==4)
                                        {
                                            result[0].type=4;
                                            result[0].data=o1.data;
                                        }
                                        else
                                        {
                                            for(let key in o1)
                                            {
                                                result[0][key]=o1[key];
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    let type;
                                    let o1=objRes.schema.items;
                                    if(o1.type=="string" || o1.type=="byte" || o1.type=="binary" || o1.type=="date" || o1.type=="dateTime" || o1.type=="password")
                                    {
                                        type=0;
                                    }
                                    else if(o1.type=="integer" || o1.type=="long" || o1.type=="float" || o1.type=="double")
                                    {
                                        type=1;
                                    }
                                    else if(o1.type=="boolean")
                                    {
                                        type=2;
                                    }
                                    result[0].type=type;
                                }
                            }
                            else if(objRes.schema && objRes.schema.properties)
                            {
                                function __handleRes(key,value,data) {
                                    let obj={
                                        mock : value.example?value.example:"",
                                        remark : value.description?value.description:"",
                                        type : 0,
                                        must : 1,
                                        name :key?key:null
                                    }
                                    if(value.type=="string" || value.type=="byte" || value.type=="binary" || value.type=="date" || value.type=="dateTime" || value.type=="password")
                                    {
                                        obj.type=0;
                                    }
                                    else if(value.type=="integer" || value.type=="long" || value.type=="float" || value.type=="double")
                                    {
                                        obj.type=1;
                                    }
                                    else if(value.type=="boolean")
                                    {
                                        obj.type=2;
                                    }
                                    else if(value.type=="array")
                                    {
                                        obj.type=3;
                                        obj.data=[];
                                        if(value.items.$ref)
                                        {
                                            let result=[
                                                {
                                                    name:null,
                                                    must:1,
                                                    type:0,
                                                    remark:"",
                                                    mock:"",
                                                }
                                            ]
                                            let def=value.items.$ref.substr(value.items.$ref.lastIndexOf("/")+1);
                                            if(objDef[def])
                                            {
                                                let o1=util.clone(objDef[def]);
                                                if(o1.type==4)
                                                {
                                                    result[0].type=4;
                                                    result[0].data=o1.data;
                                                }
                                                else
                                                {
                                                    for(let key in o1)
                                                    {
                                                        result[0][key]=o1[key];
                                                    }
                                                }
                                                obj.data=result;
                                            }
                                        }
                                        else
                                        {
                                            let type;
                                            let o1=value.items;
                                            arguments.callee(null,o1,obj.data);
                                        }
                                    }
                                    else if(value.type=="object")
                                    {
                                        obj.type=4;
                                        obj.data=[];
                                        for(let k in value.properties)
                                        {
                                            arguments.callee(k,value.properties[k],obj.data);
                                        }
                                    }
                                    else if(value.$ref)
                                    {
                                        let ref=value.$ref.substr(value.$ref.lastIndexOf("/")+1);
                                        if(objDef[ref])
                                        {
                                            let o1=util.clone(objDef[ref]);
                                            if(o1.type==4)
                                            {
                                                obj.type=4;
                                                obj.data=o1.data;
                                            }
                                            else
                                            {
                                                for(let key in o1)
                                                {
                                                    obj[key]=o1[key];
                                                }
                                            }
                                        }
                                    }
                                    data.push(obj);
                                }
                                for(let key in objRes.schema.properties)
                                {
                                    __handleRes(key,objRes.schema.properties[key],result);
                                }
                            }
                            else
                            {
                                outInfo.type=1;
                                if(objRes.schema)
                                {
                                    outInfo.rawRemark=objRes.description+"("+(objRes.schema.type?objRes.schema.type:"")+")";
                                }
                                else
                                {
                                    outInfo.rawRemark=""
                                }
                            }
                            let objParam={
                                name:status,
                                remark:objRes.description?objRes.description:"",
                                id:uuid(),
                                before:{
                                    code:"",
                                    mode:0
                                },
                                after:{
                                    code:"",
                                    mode:0
                                }
                            };
                            objParam.restParam=rest;
                            objParam.queryParam=query;
                            objParam.header=header;
                            objParam.outParam=result;
                            objParam.outInfo=outInfo;
                            if(update.method=="POST" || update.method=="PUT" || update.method=="PATCH")
                            {
                                objParam.bodyParam=body;
                                objParam.bodyInfo=bodyInfo;
                            }
                            if(count==1)
                            {
                                update.param[0]=util.clone(objParam)
                            }
                            else
                            {
                                update.param.push(util.clone(objParam))
                            }
                        }
                    }
                    if(objInter)
                    {
                        await (req.interfaceModel.findOneAndUpdateAsync({
                            _id:objInter._id
                        },update))
                    }
                    else
                    {
                        await (req.interfaceModel.createAsync(update));
                    }
                }
            }
            util.ok(res,"更新成功");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })
    this.importPostman=async ((req,res)=>{
        try
        {
            let obj=JSON.parse(req.clientParam.json);
            var projectID,groupID;
            var arr=req.clientParam.baseurl.split(",");
            var update={
                name:obj.info.name,
                dis:obj.info.description?obj.info.description:"",
                owner:req.userInfo._id,
                source:{
                    type:2
                },
                baseUrls:arr.map(function (obj) {
                    return {
                        url:obj,
                        remark:""
                    }
                })
            };
            if(req.headers["docleverversion"])
            {
                update.version=req.headers["docleverversion"]
            }
            var insertDate,interfaceCount=0;
            let objProject=await (project.createAsync(update));
            await (group.createAsync({
                name:"#回收站",
                project:objProject._id,
                type:1,
                id:uuid()
            }))
            insertDate=objProject;
            projectID=objProject._id;
            var indexInterface=0,defaultGroupId;
            let _map=async (function (obj,groupParent) {
                for(let grp of obj.item)
                {
                    if(grp.request)
                    {
                        if(!groupParent)
                        {
                            if(defaultGroupId)
                            {
                                groupID=defaultGroupId;
                            }
                            else
                            {
                                let o=await (group.createAsync({
                                    name:"未命名",
                                    project:projectID,
                                    type:0,
                                    id:uuid()
                                }))
                                groupID=defaultGroupId=o._id;
                            }
                        }
                        else
                        {
                            groupID=groupParent._id;
                        }
                        indexInterface++;
                        interfaceCount++
                        let obj;
                        if(typeof(grp.request.url)=="object")
                        {
                            let objUrl=util.parseURL(grp.request.url.raw);
                            let url=objUrl.source;
                            let index=url.indexOf("?");
                            if(index>-1)
                            {
                                url=url.substr(0,index);
                            }
                            for(var i=0;i<arr.length;i++)
                            {
                                if(req.clientParam.ignore)
                                {
                                    index=url.toLowerCase().indexOf(arr[i].toLowerCase());
                                }
                                else
                                {
                                    index=url.indexOf(arr[i]);
                                }
                                if(index>-1)
                                {
                                    url=url.substr(index+arr[i].length);
                                    break;
                                }
                            }
                            if(grp.request.url.path)
                            {
                                grp.request.url.path.forEach(function (obj) {
                                    if(obj[0]==":")
                                    {
                                        url=url.replace(obj,"{"+obj.substr(1)+"}");
                                    }
                                })
                            }
                            obj={
                                name:grp.name,
                                url:url,
                                group:groupID,
                                remark:grp.request.description,
                                project:projectID,
                                method:grp.request.method,
                                finish:1,
                                param:[{
                                    before:{
                                        mode:0,
                                        code:""
                                    },
                                    after:{
                                        mode:0,
                                        code:""
                                    },
                                    name:"未命名",
                                    remark:"",
                                    id:uuid()
                                }],
                                id:uuid(),
                                owner:req.userInfo._id,
                                editor:req.userInfo._id,
                                before:{
                                    code:"",
                                    mode:0
                                },
                                after:{
                                    code:"",
                                    mode:0
                                }
                            };
                            let restParam=[];
                            if(grp.request.url.variable)
                            {
                                grp.request.url.variable.forEach(function (obj) {
                                    restParam.push({
                                        name:obj.key,
                                        remark:obj.description,
                                        value:{
                                            "status" : "",
                                            "data" : obj.value?[obj.value]:[],
                                            "type" : 0
                                        }
                                    })
                                })
                            }
                            obj.param[0].restParam=restParam;
                            let param=[];
                            for(let key in objUrl.params)
                            {
                                let v={
                                    name:key,
                                    must:1,
                                    remark:""
                                };
                                if(objUrl.params[key]!=="" && objUrl.params[key]!==undefined)
                                {
                                    v.value=[objUrl.params[key]];
                                }
                                param.push(v);
                            }
                            obj.param[0].queryParam=param;
                        }
                        else
                        {
                            let objUrl=util.parseURL(grp.request.url);
                            let url=objUrl.source,index=url.indexOf("?");
                            if(index>-1)
                            {
                                url=url.substr(0,index);
                            }
                            for(let i=0;i<arr.length;i++)
                            {
                                if(req.clientParam.ignore)
                                {
                                    index=url.toLowerCase().indexOf(arr[i].toLowerCase());
                                }
                                else
                                {
                                    index=url.indexOf(arr[i]);
                                }
                                if(index>-1)
                                {
                                    url=url.substr(index+arr[i].length);
                                    break;
                                }
                            }
                            obj={
                                name:grp.name,
                                url:url,
                                group:groupID,
                                remark:grp.request.description,
                                project:projectID,
                                method:grp.request.method,
                                finish:1,
                                param:[{
                                    before:{
                                        mode:0,
                                        code:""
                                    },
                                    after:{
                                        mode:0,
                                        code:""
                                    },
                                    name:"未命名",
                                    remark:"",
                                    id:uuid()
                                }],
                                id:uuid(),
                                owner:req.userInfo._id,
                                editor:req.userInfo._id,
                                before:{
                                    code:"",
                                    mode:0
                                },
                                after:{
                                    code:"",
                                    mode:0
                                }
                            };
                            let param=[];
                            for(let key in objUrl.params)
                            {
                                let v={
                                    name:key,
                                    must:1,
                                    remark:""
                                };
                                if(objUrl.params[key]!=="" && objUrl.params[key]!==undefined)
                                {
                                    v.value=[objUrl.params[key]];
                                }
                                param.push(v);
                            }
                            obj.param[0].queryParam=param;
                            obj.param[0].restParam=[];
                            let arrMatch=url.match(/(\/):(.+?)(?=\b|\?|#|\/)/g);
                            if(arrMatch && arrMatch.length>0)
                            {
                                arrMatch.forEach(function (obj1) {
                                    obj.param[0].restParam.push({
                                        value:{
                                            "status" : "",
                                            "data" : [],
                                            "type" : 0
                                        },
                                        name:obj1.substr(2),
                                        remark:""
                                    })
                                })
                                obj.url=obj.url.replace(/(\/):(.+?)(?=\b|\?|#|\/)/g,"$1{$2}");
                            }
                        }
                        let bJSON=false;
                        obj.param[0].header=grp.request.header.map(function (obj) {
                            if(obj.key.toLowerCase()=="content-type" && obj.value.toLowerCase().indexOf("application/json")>-1)
                            {
                                bJSON=true;
                            }
                            return {
                                name:obj.key,
                                value:obj.value,
                                remark:""
                            }
                        })
                        if(obj.method.toLowerCase()=="post" || obj.method.toLowerCase()=="put" || obj.method.toLowerCase()=="patch")
                        {
                            let body,bodyInfo;
                            if(grp.request.body.mode=="urlencoded" || grp.request.body.mode=="formdata")
                            {
                                bodyInfo={
                                    type:0,
                                    rawType:0,
                                    rawTextRemark:"",
                                    rawFileRemark:"",
                                    rawText:"",
                                };
                                body=grp.request.body[grp.request.body.mode].map(function (obj)
                                {
                                    let o={
                                        name:obj.key,
                                        type:obj.type=="text"?0:1,
                                        must:1,
                                        remark:"",
                                    }
                                    if(o.type==0 && obj.value!=="" && obj.value!==undefined)
                                    {
                                        o.value=[obj.value];
                                    }
                                    return o;
                                })
                            }
                            else if(grp.request.body.mode=="raw")
                            {
                                body=[];
                                if(bJSON)
                                {
                                    let objJSON,bSuccess;
                                    try
                                    {
                                        objJSON=eval("("+grp.request.body.raw+")");
                                        bSuccess=true;
                                    }
                                    catch (err)
                                    {
                                        bSuccess=false;
                                    }
                                    if(!bSuccess)
                                    {
                                        let str=grp.request.body.raw;
                                        str=str.replace(/\{\{.+?\}\}/g,"\"\"");
                                        try
                                        {
                                            objJSON=eval("("+str+")");
                                        }
                                        catch (err)
                                        {

                                        }
                                    }
                                    if(objJSON)
                                    {
                                        let result=[];
                                        for(let key in objJSON)
                                        {
                                            util.handleResultData(key,objJSON[key],result,null,1)
                                        }
                                        bodyInfo={
                                            type:1,
                                            rawType:2,
                                            rawTextRemark:"",
                                            rawFileRemark:"",
                                            rawText:"",
                                            rawJSON:result
                                        };
                                    }
                                    else
                                    {
                                        bodyInfo={
                                            type:1,
                                            rawType:0,
                                            rawTextRemark:"",
                                            rawFileRemark:"",
                                            rawText:grp.request.body.raw,
                                        };
                                    }
                                }
                                else
                                {
                                    bodyInfo={
                                        type:1,
                                        rawType:0,
                                        rawTextRemark:"",
                                        rawFileRemark:"",
                                        rawText:grp.request.body.raw,
                                    };
                                }
                            }
                            else
                            {
                                body=[];
                                bodyInfo={
                                    type:0,
                                    rawType:0,
                                    rawTextRemark:"",
                                    rawFileRemark:"",
                                    rawText:"",
                                };
                            }
                            obj.param[0].bodyParam=body;
                            obj.param[0].bodyInfo=bodyInfo
                        }
                        obj.param[0].outParam=[];
                        obj.param[0].outInfo={
                            type:0,
                            rawRemark:"",
                            rawMock:"",
                        };
                        await (interface.createAsync(obj));
                    }
                    else
                    {
                        let createGroup=async (function () {
                            var groupName;
                            groupName=grp.name;
                            let query={
                                name:groupName,
                                project:projectID,
                                type:0,
                                id:uuid()
                            };
                            if(groupParent)
                            {
                                query.parent=groupParent.id;
                            }
                            let objGroup=await (group.createAsync(query));
                            return objGroup;
                        })
                        let objGroup=await (createGroup());
                        if(grp.item && grp.item.length>0)
                        {
                            await (_map(grp,objGroup))
                        }
                    }
                }
            })
            await (_map(obj));
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
    })
}

module.exports=Project