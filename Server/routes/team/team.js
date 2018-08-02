/**
 * Created by sunxin on 2017/6/7.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var status=require("../../model/statusModel")
var team=require("../../model/teamModel");
var apply=require("../../model/applyModel");
var message=require("../../model/messageModel");
var teamGroup=require("../../model/teamGroupModel");
var docProject=require("../../model/docProjectModel");
var doc=require("../../model/docModel");
var testProject=require("../../model/testProjectModel");
var test=require("../../model/testModel");
var moment=require("moment");
var fs=require("fs");
function Team() {
    this.validateTeam=async (req,res)=> {
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id,
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            req.team=obj;
            return true;
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.validate=async (req,res)=> {
        try
        {
            let obj=await (team.findOneAsync({
                _id:req.clientParam.id,
                owner:req.userInfo._id
            }))
            if(!obj)
            {
                let arr=await (teamGroup.findAsync({
                    team:req.clientParam.id,
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
            return true;
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.existUserInTeam=async (teamId,userId)=> {
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
    }

    this.teamUserList=async (teamId)=> {
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
    }
    this.save=async (req,res)=> {
        try
        {
            let obj;
            if(req.clientParam.id)
            {
                let update={};
                if(req.clientParam.name)
                {
                    update.name=req.clientParam.name;
                }
                if(req.clientParam.dis)
                {
                    update.dis=req.clientParam.dis;
                }
                obj=await (team.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },update,{
                    new:true
                }))
            }
            else
            {
                obj=await (team.createAsync({
                    name:req.clientParam.name,
                    dis:req.clientParam.dis,
                    owner:req.userInfo._id
                }));
                obj._doc.userCount=1;
                obj._doc.projectCount=0;
                obj._doc.docCount=0;
                obj._doc.testCount=0;
                obj._doc.role=2;
                obj._doc.own=1;
                let objGroup=await (teamGroup.createAsync({
                    name:"未命名",
                    team:obj._id,
                    users:[
                        {
                            user:req.userInfo._id,
                            role:2
                        }
                    ]
                }))
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.info=async (req,res)=> {
        try
        {
            let obj=await (team.populateAsync(req.team,{
                path:"owner",
                select:"name photo"
            }));
            let ret=[];
            if(req.access)
            {
                ret=await (project.findAsync({
                    team:obj._id
                },"name dis users createdAt",{
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
                },"name dis users createdAt",{
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
                },"name dis users createdAt",{
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
                },"name dis users createdAt",{
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
            let count=0;
            for(let obj of ret)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
                count+=obj._doc.interfaceCount;
            }
            obj._doc.interfaceCount=count;
            obj._doc.project=ret;
            obj._doc.projectCount=await (project.countAsync({
                team:req.team._id
            }));
            let arr;
            if(req.access)
            {
                arr=await (docProject.findAsync({
                    team:req.team._id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    obj._doc.own=1;
                    obj._doc.role=0;
                })
            }
            else
            {
                arr=await (docProject.findAsync({
                    $or:[
                        {
                            $or:[
                                {
                                    owner:req.userInfo._id
                                },
                                {
                                    users:req.userInfo._id
                                }
                            ],
                            publicTeam:0
                        },
                        {
                            publicTeam:1
                        }
                    ],
                    team:req.team._id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    if(req.userInfo._id.toString()==obj.owner.toString())
                    {
                        obj._doc.own=1;
                        obj._doc.role=0;
                    }
                    else
                    {
                        let arrUsers=obj.users.map(function (obj) {
                            return obj.toString();
                        })
                        if(arrUsers.indexOf(req.userInfo._id.toString())>-1)
                        {
                            obj._doc.role=0;
                        }
                        else
                        {
                            obj._doc.role=1;
                        }
                    }
                })
            }
            for(let o of arr)
            {
                o._doc.docCount=await (doc.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            obj._doc.doc=arr;
            obj._doc.docCount=await (docProject.countAsync({
                team:req.team._id
            }))
            if(req.access)
            {
                arr=await (testProject.findAsync({
                    team:req.team._id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    obj._doc.own=1;
                    obj._doc.role=0;
                })
            }
            else
            {
                arr=await (testProject.findAsync({
                    $or:[
                        {
                            owner:req.userInfo._id
                        },
                        {
                            users:req.userInfo._id
                        }
                    ],
                    team:req.team._id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    if(req.userInfo._id.toString()==obj.owner.toString())
                    {
                        obj._doc.own=1;
                        obj._doc.role=0;
                    }
                    else
                    {
                        obj._doc.own=0;
                        obj._doc.role=0;
                    }
                })
            }
            for(let o of arr)
            {
                o._doc.testCount=await (test.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            obj._doc.test=arr;
            obj._doc.testCount=await (testProject.countAsync({
                team:req.team._id
            }))
            ret=await (teamGroup.findAsync({
                team:req.team._id
            },null,{
                sort:"name",
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            count=0;
            ret.forEach(function (obj) {
                count+=obj.users.length;
                obj.users.sort(function (obj1,obj2) {
                    return obj1.user.name>obj2.user.name
                })
            })
            obj._doc.userCount=count;
            obj._doc.user=ret;
            obj._doc.notice=obj._doc.notice.slice(0,10);
            if(obj.owner._id.toString()==req.userInfo._id.toString())
            {
                obj._doc.role=2;
            }
            else
            {
                if(req.access)
                {
                    obj._doc.role=0;
                }
                else
                {
                    obj._doc.role=1;
                }
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.pullUser=async (req,res)=> {
        try
        {
            if(req.access==0)
            {
                util.throw(e.userForbidden,"权限不够");
            }
            let u=await (user.findOneAsync({
                name:req.clientParam.user
            }));
            if(!u)
            {
                util.throw(e.userNotFound,"用户不存在");
                return;
            }
            if((await (this.existUserInTeam(req.team._id,u._id))))
            {
                util.throw(e.userExits,"用户已经存在");
                return;
            }
            await (apply.findOneAndUpdateAsync({
                from:req.team._id,
                to:u._id,
                type:0,
                state:0
            },{
                fromType:"Team",
                from:req.team._id,
                toType:"User",
                to:u._id,
                type:0,
                state:0,
                creator:req.userInfo._id,
                relatedData:req.clientParam.group
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeUser=async (req,res)=> {
        try
        {
            if(req.access==0 && !req.clientParam.self)
            {
                util.throw(e.userForbidden,"没有权限");
                return;
            }
            let arr=await (project.findAsync({
                team:req.team._id,
                $or:[
                    {
                        owner:req.clientParam.user
                    },
                    {
                        "users.user":req.clientParam.user
                    }
                ]
            }))
            if(arr.length>0)
            {
                util.throw(e.userInProject,"用户仍然在团队的项目中");
                return;
            }
            await (teamGroup.updateAsync({
                team:req.team._id
            },{
                "$pull":{
                    "users":{
                        user:req.clientParam.user
                    }
                }
            },{
                multi:true
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeProjectUser=async (req,res)=> {
        try
        {
            await (project.updateAsync({
                team:req.team._id,
                "users.user":req.clientParam.user
            },{
                $pull:{
                    "users":{
                        user:req.clientParam.user
                    }
                }
            },{
                multi:true
            }));
            let arr=await (project.findAsync({
                team:req.team._id,
                owner:req.clientParam.user
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.projectUser=async (req,res)=> {
        try
        {
            let objPro=await (project.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objPro)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            let arr=objPro.users.map(function (obj) {
                let o={
                    user:obj.user.toString(),
                    role:obj.role
                }
                if(obj.option)
                {
                    o.option=obj.option;
                }
                return o;
            });
            let arrUser=await (teamGroup.findAsync({
                team:req.team._id
            },null,{
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            for(let obj of arrUser)
            {
                for(let obj1 of obj.users)
                {
                    if(obj1.user._id.toString()==objPro.owner.toString())
                    {
                        obj1._doc.select=1;
                        obj1.role=2;
                    }
                    else
                    {
                        let index=util.inArrKey(obj1.user._id.toString(),arr,"user");
                        if(index>-1)
                        {
                            obj1._doc.select=1;
                            obj1.role=arr[index].role;
                            if(arr[index].option)
                            {
                                obj1._doc.option=arr[index].option
                            }
                        }
                        else
                        {
                            obj1._doc.select=0;
                            obj1.role=1;
                        }
                    }
                }
            }
            util.ok(res,arrUser,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.userRole=async (req,res)=> {
        try
        {
            let arrUser=JSON.parse(req.clientParam.user);
            for(let obj of arrUser)
            {
                await (teamGroup.updateAsync({
                    team:req.team._id,
                    "users.user":obj.user
                },{
                    "users.$.role":obj.role
                }))
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.moveUser=async (req,res)=> {
        try
        {
            let obj=await (teamGroup.findOneAndUpdateAsync({
                team:req.team._id,
                "users.user":req.clientParam.user
            },{
                $pull:{
                    "users":{
                        user:req.clientParam.user
                    }
                }
            }));
            if(!obj)
            {
                util.throw(e.userNotInTeam,"用户不在团队内");
            }
            let role;
            for(let o of obj.users)
            {
                if(o.user.toString()==req.clientParam.user)
                {
                    role=o.role;
                    break;
                }
            }
            let update={
                user:req.clientParam.user,
                role:role
            };
            obj=await (teamGroup.findOneAndUpdateAsync({
                _id:req.clientParam.group
            },{
                $addToSet:{
                    users:update
                }
            }));
            if(!obj)
            {
                util.throw(e.groupNotFound,"部门不存在");
            }
            update.user=await (user.findOneAsync({
                _id:update.user
            },"name photo"))
            util.ok(res,update,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.createGroup=async (req,res)=> {
        try
        {
            let obj;
            if(req.clientParam.group)
            {
                obj=await (teamGroup.findOneAndUpdateAsync({
                    _id:req.clientParam.group
                },{
                    name:req.clientParam.name
                },{
                    new:true
                }))
            }
            else
            {
                obj=await (teamGroup.createAsync({
                    name:req.clientParam.name,
                    team:req.clientParam.id
                }))
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeGroup=async (req,res)=> {
        try
        {
            let obj=await (teamGroup.findOneAsync({
                _id:req.clientParam.group
            }));
            if(!obj)
            {
                util.throw(e.groupNotFound,"部门不存在");
            }
            else if(obj.users.length>0)
            {
                util.throw(e.teamGroupNotEmpty,"不能删除非空部门");
            }
            await (obj.removeAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.pullProject=async (req,res)=> {
        try
        {
            if(req.access==0)
            {
                util.throw(e.userForbidden,"权限不够");
            }
            let obj=await (project.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            await (apply.findOneAndUpdateAsync({
                from:req.team._id,
                to:obj._id,
                type:1,
                state:0
            },{
                fromType:"Team",
                from:req.team._id,
                toType:"Project",
                to:obj._id,
                type:1,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.userApply=async (req,res)=> {
        try
        {
            let bIn=await (this.existUserInTeam(req.team._id,req.userInfo._id));
            if(bIn)
            {
                util.throw(e.userAlreadyInTeam,"用户已经在团队中");
            }
            await (apply.findOneAndUpdateAsync({
                from:req.userInfo._id,
                to:req.team._id,
                type:2,
                state:0
            },{
                dis:req.clientParam.dis?req.clientParam.dis:"",
                fromType:"User",
                from:req.userInfo._id,
                toType:"Team",
                to:req.team._id,
                type:2,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.projectApply=async (req,res)=> {
        try
        {
            await (apply.findOneAndUpdateAsync({
                from:req.clientParam.project,
                to:req.team._id,
                type:3,
                state:0
            },{
                dis:req.clientParam.dis?req.clientParam.dis:"",
                fromType:"Project",
                from:req.clientParam.project,
                toType:"Team",
                to:req.team._id,
                type:3,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.groupList=async (req,res)=> {
        try
        {
            let arr=await (teamGroup.findAsync({
                team:req.clientParam.id
            },null,{
                sort:"name"
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.saveNotice=async (req,res)=> {
        try
        {
            let obj;
            if(req.clientParam.notice)
            {
                obj=await (team.findOneAndUpdateAsync({
                    _id:req.clientParam.id,
                    "notice._id":req.clientParam.notice
                },{
                    "notice.$.content":req.clientParam.content
                },{
                    new:true
                }))
            }
            else
            {
                obj=await (team.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },{
                    $push:{
                        notice:{
                            $each:[{
                                content:req.clientParam.content,
                                date:moment().format("YYYY-MM-DD HH:mm:ss")
                            }],
                            $position:0
                        }
                    }
                },{
                    new:true
                }))
            }
            util.ok(res,obj.notice[0],"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.getNotice=async (req,res)=> {
        try
        {
            let arr=req.team.notice.slice(req.clientParam.page*10,(req.clientParam.page+1)*10);
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeNotice=async (req,res)=> {
        try
        {
            await (team.findOneAndUpdateAsync({
                _id:req.clientParam.id
            },{
                $pull:{
                    notice:{
                        _id:req.clientParam.notice
                    }
                }
            }))
            util.ok(res,"ok");
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
                to:req.team._id,
                type:{
                    $in:[2,3]
                },
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
            arr=await (apply.populateAsync(arr,{
                path:"to",
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
                    path:"to",
                    select:"name photo"
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
            if(obj.type==2)
            {
                if(req.clientParam.state==1)
                {
                    let objGroup=await (teamGroup.findOneAsync({
                        _id:req.clientParam.group
                    }));
                    if(!objGroup)
                    {
                        util.throw(e.teamGroupNotFound,"部门不存在");
                    }
                    obj.editor=req.userInfo._id;
                    if(await (this.existUserInTeam(obj.creator,req.team._id)))
                    {
                        obj.state=3;
                        await (obj.saveAsync());
                        util.throw(e.userAlreadyInTeam,"用户已经在团队里");
                    }
                    else
                    {
                        obj.state=req.clientParam.state;
                        await (teamGroup.findOneAndUpdateAsync({
                            _id:req.clientParam.group
                        },{
                            $addToSet:{
                                users:{
                                    user:obj.creator,
                                    role:req.clientParam.role
                                }
                            }
                        }))
                        await (message.createAsync({
                            name:req.clientParam.state==1?"个人申请已通过":"个人申请被拒绝",
                            dis:`您申请加入团队${obj.to.name}的请求已经被管理员${req.userInfo.name}${req.clientParam.state==1?"通过":"拒绝"}`,
                            user:obj.creator,
                            type:0
                        }))
                        await (obj.saveAsync());
                    }
                    obj=await (apply.populateAsync(obj,{
                        path:"from",
                        select:"name photo"
                    }))
                    util.ok(res,{
                        role:req.clientParam.role,
                        user:obj.from
                    },"ok")
                }
                else
                {
                    obj.state=req.clientParam.state;
                    await (message.createAsync({
                        name:req.clientParam.state==1?"个人申请已通过":"个人申请被拒绝",
                        dis:`您申请加入团队${obj.to.name}的请求已经被管理员${req.userInfo.name}${req.clientParam.state==1?"通过":"拒绝"}`,
                        user:obj.creator,
                        type:0
                    }))
                    await (obj.saveAsync());
                    util.ok(res,"ok");
                }
            }
            else if(obj.type==3)
            {
                let userAddCount=0;
                obj.editor=req.userInfo._id;
                let objProject=await (project.findOneAsync({
                    _id:obj.from
                }));
                if(!objProject)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    util.throw(e.projectNotFound,"项目不存在");
                }
                else if(objProject.team)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    if(objProject.team.toString()==obj.to.toString())
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
                        let arrTeamUser=await (this.teamUserList(req.team._id));
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
                        userAddCount=arr.length;
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
                                team:req.team._id
                            },{
                                name:"未命名",
                                team:req.team._id,
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
                        objProject.team=req.team._id;
                        await (objProject.saveAsync());
                    }
                    await (message.createAsync({
                        name:req.clientParam.state==1?"接口项目申请已通过":"接口项目申请被拒绝",
                        dis:`您申请接口项目${objProject.name}加入团队${obj.to.name}的请求已经被管理员${req.userInfo.name}${req.clientParam.state==1?"通过":"拒绝"}`,
                        user:obj.creator,
                        type:1
                    }))
                    await (obj.saveAsync());
                }
                if(req.clientParam.state==1)
                {
                    obj=await (project.findOneAsync({
                        _id:obj.from
                    }))
                    obj._doc.userCount=obj.users.length+1;
                    obj._doc.interfaceCount=await (interface.countAsync({
                        project:obj._id
                    }))
                    obj._doc.userAddCount=userAddCount;
                    util.ok(res,obj,"ok");
                }
                else
                {
                    util.ok(res,"ok");
                }
            }
            else if(obj.type==5)
            {
                let userAddCount=0;
                obj.editor=req.userInfo._id;
                let objProject=await (docProject.findOneAsync({
                    _id:obj.from
                }));
                if(!objProject)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    util.throw(e.docProjectNotFound,"项目不存在");
                }
                else if(objProject.team)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    if(objProject.team.toString()==obj.to.toString())
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
                        let arrTeamUser=await (this.teamUserList(req.team._id));
                        let arrProjectUser=objProject.users.map(function (obj) {
                            return obj.toString();
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
                        userAddCount=arr.length;
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
                                team:req.team._id
                            },{
                                name:"未命名",
                                team:req.team._id,
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
                        objProject.team=req.team._id;
                        await (objProject.saveAsync());
                    }
                    await (message.createAsync({
                        name:req.clientParam.state==1?"文档项目申请已通过":"文档项目申请被拒绝",
                        dis:`您申请文档项目${objProject.name}加入团队${obj.to.name}的请求已经被管理员${req.userInfo.name}${req.clientParam.state==1?"通过":"拒绝"}`,
                        user:obj.creator,
                        type:1
                    }))
                    await (obj.saveAsync());
                }
                if(req.clientParam.state==1)
                {
                    obj=await (docProject.findOneAsync({
                        _id:obj.from
                    }))
                    obj._doc.userCount=obj.users.length+1;
                    obj._doc.docCount=await (doc.countAsync({
                        project:obj._id
                    }))
                    obj._doc.userAddCount=userAddCount;
                    util.ok(res,obj,"ok");
                }
                else
                {
                    util.ok(res,"ok");
                }
            }
            else if(obj.type==7)
            {
                let userAddCount=0;
                obj.editor=req.userInfo._id;
                let objProject=await (testProject.findOneAsync({
                    _id:obj.from
                }));
                if(!objProject)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    util.throw(e.testProjectNotFound,"项目不存在");
                }
                else if(objProject.team)
                {
                    obj.state=3;
                    await (obj.saveAsync());
                    if(objProject.team.toString()==obj.to.toString())
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
                        let arrTeamUser=await (this.teamUserList(req.team._id));
                        let arrProjectUser=objProject.users.map(function (obj) {
                            return obj.toString();
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
                        userAddCount=arr.length;
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
                                team:req.team._id
                            },{
                                name:"未命名",
                                team:req.team._id,
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
                        objProject.team=req.team._id;
                        await (objProject.saveAsync());
                    }
                    await (message.createAsync({
                        name:req.clientParam.state==1?"接口项目申请已通过":"接口项目申请被拒绝",
                        dis:`您申请接口项目${objProject.name}加入团队${obj.to.name}的请求已经被管理员${req.userInfo.name}${req.clientParam.state==1?"通过":"拒绝"}`,
                        user:obj.creator,
                        type:1
                    }))
                    await (obj.saveAsync());
                }
                if(req.clientParam.state==1)
                {
                    obj=await (testProject.findOneAsync({
                        _id:obj.from
                    }))
                    obj._doc.userCount=obj.users.length+1;
                    obj._doc.testCount=await (test.countAsync({
                        project:obj._id
                    }))
                    obj._doc.userAddCount=userAddCount;
                    util.ok(res,obj,"ok");
                }
                else
                {
                    util.ok(res,"ok");
                }
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeProject=async (req,res)=> {
        try
        {
            let obj=await (project.findOneAndUpdateAsync({
                _id:req.clientParam.project,
                team:req.clientParam.id
            },{
                $unset:{
                    team:null
                }
            }))
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.userPulledList=async (req,res)=> {
        try
        {
            let arrTeamUser=await (this.teamUserList(req.team._id));
            let obj=await (project.findOneAsync({
                _id:req.clientParam.project
            },null,{
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }));
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            let arrProjectUser=obj.users.map(function (obj) {
                return obj.user;
            })
            let arr=[];
            for(let o of arrProjectUser)
            {
                let bFind=false;
                for(let o1 of arrTeamUser)
                {
                    if(o1==o._id.toString())
                    {
                        bFind=true;
                        break;
                    }
                }
                if(!bFind)
                {
                    arr.push(o);
                }
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.userJoin=async (req,res)=> {
        try
        {
            if(await (this.existUserInTeam(req.team._id,req.clientParam.user)))
            {
                util.throw(e.userAlreadyInTeam,"用户已经在团队里了");
            }
            else
            {
                await (teamGroup.findOneAndUpdateAsync({
                    _id:req.clientParam.group
                },{
                    $addToSet:{
                        users:{
                            user:req.clientParam.user,
                            role:req.clientParam.role
                        }
                    }
                }))
                util.ok(res,"ok");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.removeTeam=async (req,res)=> {
        try
        {
            if(req.team.owner.toString()!=req.userInfo._id.toString())
            {
                util.throw(e.userForbidden,"你没有权限");
            }
            await (project.updateAsync({
                team:req.team._id
            },{
                $unset:{
                    team:null
                }
            },{
                multi:true
            }));
            await (teamGroup.removeAsync({
                team:req.team._id
            }))
            await (req.team.removeAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.transfer=async (req,res)=>{
        try
        {
            if(req.userInfo._id.toString()!=req.team.owner.toString())
            {
                util.throw(e.userForbidden,"你没有权限");
            }
            let u=await (user.findOneAsync({
                _id:req.clientParam.user
            }));
            if(!u)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            await (teamGroup.findOneAndUpdateAsync({
                team:req.clientParam.id,
                "users.user":req.userInfo._id
            },{
                "users.$.role":0
            }))
            await (teamGroup.findOneAndUpdateAsync({
                team:req.clientParam.id,
                "users.user":req.clientParam.user
            },{
                "users.$.role":2
            }))
            req.team.owner=req.clientParam.user;
            await (req.team.saveAsync());
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.userList=async (req,res)=>{
        try
        {
            let ret=await (teamGroup.findAsync({
                team:req.team._id
            },null,{
                sort:"name",
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.list=async function (req,res) {
        try
        {
            let obj={},ret=[];
            let arr=await (team.findAsync({
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
                obj._doc.docCount=await (docProject.countAsync({
                    team:obj._id
                }))
                obj._doc.testCount=await (testProject.countAsync({
                    team:obj._id
                }))
            }
            obj.create=arr;
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
                obj._doc.docCount=await (docProject.countAsync({
                    team:obj._id
                }))
                obj._doc.testCount=await (testProject.countAsync({
                    team:obj._id
                }))
            }
            obj.join=ret;
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    };
    this.projectList=async function (req,res) {
        try
        {
            let ret=[];
            if(req.access)
            {
                ret=await (project.findAsync({
                    team:req.team._id
                },"name dis users createdAt",{
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
                    team:req.team._id
                },"name dis users createdAt",{
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
                    team:req.team._id
                },"name dis users createdAt",{
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
                    team:req.team._id
                },"name dis users createdAt",{
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
            for(let obj of ret)
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
    this.docList=async (req,res)=>{
        try
        {
            let arr;
            if(req.access)
            {
                arr=await (docProject.findAsync({
                    team:req.clientParam.id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    obj._doc.own=1;
                    obj._doc.role=0;
                })
            }
            else
            {
                arr=await (docProject.findAsync({
                    $or:[
                        {
                            $or:[
                                {
                                    owner:req.userInfo._id
                                },
                                {
                                    users:req.userInfo._id
                                }
                            ],
                            publicTeam:0
                        },
                        {
                            publicTeam:1
                        }
                    ],
                    team:req.clientParam.id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    if(req.userInfo._id.toString()==obj.owner.toString())
                    {
                        obj._doc.own=1;
                        obj._doc.role=0;
                    }
                    else
                    {
                        let arrUsers=obj.users.map(function (obj) {
                            return obj.toString();
                        })
                        if(arrUsers.indexOf(req.userInfo._id.toString())>-1)
                        {
                            obj._doc.role=0;
                        }
                        else
                        {
                            obj._doc.role=1;
                        }
                    }
                })
            }
            for(let o of arr)
            {
                o._doc.docCount=await (doc.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testList=async (req,res)=>{
        try
        {
            let arr;
            if(req.access)
            {
                arr=await (testProject.findAsync({
                    team:req.clientParam.id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    obj._doc.own=1;
                    obj._doc.role=0;
                })
            }
            else
            {
                arr=await (testProject.findAsync({
                    $or:[
                        {
                            owner:req.userInfo._id
                        },
                        {
                            users:req.userInfo._id
                        }
                    ],
                    team:req.clientParam.id
                },null,{
                    sort:"-createdAt"
                }));
                arr.forEach(function (obj) {
                    if(req.userInfo._id.toString()==obj.owner.toString())
                    {
                        obj._doc.own=1;
                        obj._doc.role=0;
                    }
                    else
                    {
                        obj._doc.own=0;
                        obj._doc.role=0;
                    }
                })
            }
            for(let o of arr)
            {
                o._doc.testCount=await (test.countAsync({
                    project:o._id
                }))
                o._doc.userCount=o.users.length+1;
                delete o._doc.users;
            }
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeDoc=async (req,res)=> {
        try
        {
            let obj=await (docProject.findOneAndUpdateAsync({
                _id:req.clientParam.project,
                team:req.clientParam.id
            },{
                $unset:{
                    team:null
                }
            }))
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docUser=async (req,res)=>{
        try
        {
            let objPro=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objPro)
            {
                util.throw(e.projectNotFound,"项目不存在");
                return;
            }
            let arr=objPro.users.map(function (obj) {
                return obj.toString();
            });
            let arrUser=await (teamGroup.findAsync({
                team:req.team._id
            },null,{
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            for(let obj of arrUser)
            {
                for(let obj1 of obj.users)
                {
                    if(obj1.user._id.toString()==objPro.owner.toString())
                    {
                        obj1._doc.select=1;
                        obj1._doc.role=2;
                    }
                    else
                    {
                        let index=arr.indexOf(obj1.user._id.toString());
                        if(index>-1)
                        {
                            obj1._doc.select=1;
                            obj1._doc.role=0;
                        }
                        else
                        {
                            obj1._doc.select=0;
                            obj1._doc.role=0;
                        }
                    }
                }
            }
            util.ok(res,arrUser,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.pullDoc=async (req,res)=>{
        try
        {
            let obj=await (docProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.docProjectNotFound,"项目不存在");
                return;
            }
            await (apply.findOneAndUpdateAsync({
                from:req.team._id,
                to:obj._id,
                type:4,
                state:0
            },{
                fromType:"Team",
                from:req.team._id,
                toType:"DocProject",
                to:obj._id,
                type:4,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docApply=async (req,res)=>{
        try
        {
            await (apply.findOneAndUpdateAsync({
                from:req.clientParam.project,
                to:req.team._id,
                type:5,
                state:0
            },{
                dis:req.clientParam.dis?req.clientParam.dis:"",
                fromType:"DocProject",
                from:req.clientParam.project,
                toType:"Team",
                to:req.team._id,
                type:5,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.removeTest=async (req,res)=> {
        try
        {
            let obj=await (testProject.findOneAndUpdateAsync({
                _id:req.clientParam.project,
                team:req.clientParam.id
            },{
                $unset:{
                    team:null
                }
            }))
            util.ok(res,"ok")
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testUser=async (req,res)=>{
        try
        {
            let objPro=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }))
            if(!objPro)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
                return;
            }
            let arr=objPro.users.map(function (obj) {
                return obj.toString();
            });
            let arrUser=await (teamGroup.findAsync({
                team:req.team._id
            },null,{
                populate:{
                    path:"users.user",
                    select:"name photo"
                }
            }))
            for(let obj of arrUser)
            {
                for(let obj1 of obj.users)
                {
                    if(obj1.user._id.toString()==objPro.owner.toString())
                    {
                        obj1._doc.select=1;
                        obj1._doc.role=2;
                    }
                    else
                    {
                        let index=arr.indexOf(obj1.user._id.toString());
                        if(index>-1)
                        {
                            obj1._doc.select=1;
                            obj1._doc.role=0;
                        }
                        else
                        {
                            obj1._doc.select=0;
                            obj1._doc.role=0;
                        }
                    }
                }
            }
            util.ok(res,arrUser,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.pullTest=async (req,res)=>{
        try
        {
            let obj=await (testProject.findOneAsync({
                _id:req.clientParam.project
            }));
            if(!obj)
            {
                util.throw(e.testProjectNotFound,"项目不存在");
                return;
            }
            await (apply.findOneAndUpdateAsync({
                from:req.team._id,
                to:obj._id,
                type:6,
                state:0
            },{
                fromType:"Team",
                from:req.team._id,
                toType:"TestProject",
                to:obj._id,
                type:6,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.testApply=async (req,res)=>{
        try
        {
            await (apply.findOneAndUpdateAsync({
                from:req.clientParam.project,
                to:req.team._id,
                type:7,
                state:0
            },{
                dis:req.clientParam.dis?req.clientParam.dis:"",
                fromType:"TestProject",
                from:req.clientParam.project,
                toType:"Team",
                to:req.team._id,
                type:7,
                state:0,
                creator:req.userInfo._id,
            },{
                upsert:true,
                setDefaultsOnInsert:true
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}


module.exports=Team;


