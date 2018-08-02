var e=require("../../util/error.json");
var user=require("../../model/userModel")
var admin=require("../../model/adminModel")
var teamGroup=require("../../model/teamGroupModel")
var project=require("../../model/projectModel")
var team=require("../../model/teamModel")
var interface=require("../../model/interfaceModel")
var groupVersion=require("../../model/groupVersionModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var statusVersion=require("../../model/statusVersionModel")
var test=require("../../model/testModel")
var testModule=require("../../model/testModuleModel")
var testGroup=require("../../model/testGroupModel")
var testProject=require("../../model/testProjectModel")
var testCollection=require("../../model/testCollectionModel")
var poll=require("../../model/pollModel")
var group=require("../../model/groupModel")
var status=require("../../model/statusModel")
var poll=require("../../model/pollModel")
var version=require("../../model/versionModel")
var statistic=require("../../model/statisticModel")
var template=require("../../model/templateModel")
var example=require("../../model/exampleModel")
var info=require("../../model/infoModel")
var doc=require("../../model/docModel")
var docProject=require("../../model/docProjectModel")
var docGroup=require("../../model/docGroupModel")
var util=require("../../util/util");
var blue=require("bluebird");
var fs=blue.promisifyAll(require("fs"));
var config=require("../../../config.json")
var uuid=require("uuid");
var path=require("path");
var objectId = require('mongoose').Types.ObjectId;
function Common() {
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
    this.existUserInTeam=async (teamId,userId)=>{
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
    this.projectRemove=async (id,category)=>{
        if(category==0)
        {
            let obj=await (project.findOneAsync({
                _id:id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await (interface.removeAsync({
                project:id
            }));
            await (version.removeAsync({
                project:id
            }));
            await (interfaceVersion.removeAsync({
                project:id
            }));
            await (interfaceSnapshot.removeAsync({
                project:id
            }));
            await (group.removeAsync({
                project:id
            }))
            await (groupVersion.removeAsync({
                project:id
            }))
            await (status.removeAsync({
                project:id
            }))
            await (statusVersion.removeAsync({
                project:id
            }))
            await (test.removeAsync({
                project:id
            }))
            let arrTestModule=await (testModule.findAsync({
                project:id
            }))
            for(let obj of arrTestModule)
            {
                await (testGroup.removeAsync({
                    module:obj._id
                }))
            }
            await (testModule.removeAsync({
                project:id
            }))
            await (poll.removeAsync({
                project:id
            }))
            await (template.removeAsync({
                project:id
            }))
            await (example.removeAsync({
                project:id
            }))
            await (project.removeAsync({
                _id:id
            }))
        }
        else if(category==1)
        {
            let obj=await (docProject.findOneAsync({
                _id:id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await docGroup.removeAsync({
                project:id
            })
            await doc.removeAsync({
                project:id
            })
        }
        else if(category==2)
        {
            let obj=await (testProject.findOneAsync({
                _id:id
            }))
            if(!obj)
            {
                util.throw(e.projectNotFound,"项目不存在");
            }
            await testModule.removeAsync({
                project:id
            })
            await testGroup.removeAsync({
                project:id
            })
            await test.removeAsync({
                project:id
            })
            await testCollection.removeAsync({
                project:id
            })
            await poll.removeAsync({
                project:id
            })
        }
    }
    this.userRemove=async (id)=>{
        let arrProject=await (project.findAsync({
            owner:id
        }));
        let arrTeam=await (teamGroup.findAsync({
            owner:id
        }))
        let arrDoc=await (docProject.findAsync({
            owner:id
        }))
        if(arrProject.length>0 || arrTeam.length>0 || arrDoc.length>0)
        {
            util.throw(e.systemReason,"该账户下有项目或者团队，请先解除关联");
        }
        await (project.updateAsync({
            "users.user":id
        },{
            $pull:{
                users:{
                    user:id
                }
            }
        }))
        await (teamGroup.updateAsync({
            "users.user":id
        },{
            $pull:{
                users:{
                    user:id
                }
            }
        }))
        await (docProject.updateAsync({
            "users":id
        },{
            $pull:{
                users:id
            }
        }))
        await (user.removeAsync({
            _id:id
        }))
    }
    this.handleLogin=async (name,password)=>{
        let obj=await (admin.findOneAndUpdateAsync({
            name:name,
            password:password
        },{
            lastLoginDate:Date.now(),
            $inc:{
                loginCount:1
            }
        },{
            new:true
        }))
        return obj;
    }
    this.userStatistics=async ()=>{
        let obj={};
        obj.total=await (user.countAsync());
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        obj.register=await (user.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        obj.login=await (user.countAsync({
            lastLoginDate:{
                $gt:date
            }
        }))
        return obj;
    }
    this.userList=async (type,key,page)=>{
        let arr,query={},sort;
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if(type==0)
        {
            query={
                createdAt:{
                    $gt:date
                }
            }
            sort="-createdAt";
        }
        else if(type==1)
        {
            query={
                lastLoginDate:{
                    $gt:date
                }
            }
            sort="-lastLoginDate"
        }
        else if(type==2)
        {
            sort="-loginCount"
        }
        else if(type==3)
        {
            query={
                name:new RegExp(key?key:"","i")
            };
            sort="name";
        }
        else if(type==4)
        {
            let today=new Date();
            let t=today.getTime()-1000*60*60*24*10;
            var newDay=new Date(t);
            query={
                lastLoginDate:{
                    $gt:newDay
                },
                loginCount:{
                    $gte:10
                }
            };
            sort="name";
            arr=await (user.findAsync(query,"name photo createdAt lastLoginDate loginCount state",{
                sort:sort
            }));
            let ret=[];
            for(let obj of arr)
            {
                let bOK=false;
                let arrProject=await (project.findAsync({
                    $or:[
                        {
                            owner:obj._id
                        },
                        {
                            "users.user":obj._id
                        }
                    ]
                }))
                for(let obj1 of arrProject)
                {
                    let count=await (interface.countAsync({
                        project:obj1._id
                    }));
                    if(count>=5)
                    {
                        bOK=true;
                        break;
                    }
                }
                if(bOK)
                {
                    ret.push(obj);
                }
            }
            ret=ret.slice(page*10,10+page*10);
            util.ok(res,ret,"ok");
            return;
        }
        arr=await (user.findAsync(query,"name photo createdAt lastLoginDate loginCount state",{
            sort:sort,
            skip:10*page,
            limit:10
        }))
        return arr;
    }
    this.getUserInfo=async (id)=>{
        let obj=await (user.findOneAsync({
            _id:id
        }));
        return obj;
    }
    this.userCreate=async (param,id,photo)=>{
        if(id)
        {
            let update={};
            for(let key in param)
            {
                if(key!="id")
                {
                    update[key]=param[key];
                }
            }
            let ret=await (user.findOneAsync({
                name:update.name,
                _id:{
                    $ne:id
                }
            }));
            if(ret)
            {
                util.throw(e.duplicateUser,"用户名重复");
            }
            let obj=await (user.findOneAndUpdateAsync({
                _id:id
            },update,{
                new:false
            }));
            if(!obj)
            {
                util.throw(e.userNotFound,"用户不存在");
            }
            else if(photo && obj.photo && photo!=obj.photo)
            {
                util.delImg(obj.photo);
            }
            obj=await (user.findOneAsync({
                _id:id
            },"-password"));
        }
        else
        {
            let obj={};
            for(let key in param)
            {
                obj[key]=param[key];
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
            return obj;
        }
    }
    this.projectStatistics=async ()=>{
        let obj={};
        obj.interfaceTotal=await (project.countAsync());
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        obj.interfaceToday=await (project.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        obj.docTotal=await (docProject.countAsync());
        obj.docToday=await (docProject.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        obj.testTotal=await (testProject.countAsync());
        obj.testToday=await (testProject.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        return obj;
    }
    this.projectList=async (type,key,page,category)=>{
        let arr,query={},sort;
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if(type==0)
        {
            query={
                createdAt:{
                    $gt:date
                }
            }
            sort="-createdAt";
        }
        else if(type==1)
        {
            query={
                name:new RegExp(key?key:"","i")
            };
            sort="name";
        }
        if(category==0)
        {
            arr=await (project.findAsync(query,null,{
                sort:sort,
                skip:10*page,
                limit:10,
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }))
            arr=await (project.populateAsync(arr,{
                path:"team",
                select:"name"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.interfaceCount=await (interface.countAsync({
                    project:obj._id
                }))
            }
        }
        else if(category==1)
        {
            arr=await (docProject.findAsync(query,null,{
                sort:sort,
                skip:10*page,
                limit:10,
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }))
            arr=await (docProject.populateAsync(arr,{
                path:"team",
                select:"name"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.docCount=await (doc.countAsync({
                    project:obj._id
                }))
            }
        }
        else
        {
            arr=await (testProject.findAsync(query,null,{
                sort:sort,
                skip:10*page,
                limit:10,
                populate:{
                    path:"owner",
                    select:"name photo"
                }
            }))
            arr=await (testProject.populateAsync(arr,{
                path:"team",
                select:"name"
            }))
            for(let obj of arr)
            {
                obj._doc.userCount=obj.users.length+1;
                delete obj._doc.users;
                obj._doc.testCount=await (test.countAsync({
                    project:obj._id
                }))
            }
        }
        return arr;
    }
    this.projectInfo=async (id,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let obj=await (model.findOneAsync({
            _id:id
        },"",{
            populate:{
                path:"owner",
                select:"name photo"
            }
        }));
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        else
        {
            obj=await (model.populateAsync(obj,{
                path:"team",
                select:"name"
            }))
        }
        return obj;
    }
    this.projectEdit=async (id,name,dis,public,category)=>{
        let model,update={};
        if(category==0)
        {
            model=project;
            update={
                name:name,
                dis:dis,
                public:public
            }
        }
        else if(category==1)
        {
            model=docProject;
            update={
                name:name,
                dis:dis,
                public:public
            }
        }
        else if(category==2)
        {
            model=testProject;
            update={
                name:name,
                dis:dis,
            }
        }
        let obj=await (model.findOneAndUpdateAsync({
            _id:id
        },update,{
            new:true
        }))
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        return obj;
    }
    this.teamStatistics=async ()=>{
        let obj={};
        obj.total=await (team.countAsync());
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        obj.today=await (team.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        return obj;
    }
    this.teamList=async (type,key,page)=>{
        let arr,query={},sort;
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if(type==0)
        {
            query={
                createdAt:{
                    $gt:date
                }
            }
            sort="-createdAt";
        }
        else if(type==1)
        {
            query={
                name:new RegExp(key?key:"","i")
            };
            sort="name";
        }
        arr=await (team.findAsync(query,null,{
            sort:sort,
            skip:10*page,
            limit:10,
            populate:{
                path:"owner",
                select:"name photo"
            }
        }))
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
            count=await (project.countAsync({
                team:obj._id
            }))
            count+=await (docProject.countAsync({
                team:obj._id
            }))
            count+=await (testProject.countAsync({
                team:obj._id
            }))
            obj._doc.projectCount=count
        }
        return arr;
    }
    this.teamInfo=async (id)=>{
        let obj=await (team.findOneAsync({
            _id:id
        },"",{
            populate:{
                path:"owner",
                select:"name photo"
            }
        }));
        if(!obj)
        {
            util.throw(e.projectNotFound,"团队不存在");
        }
        return obj;
    }
    this.teamRemove=async (id)=>{
        let obj=await (team.findOneAsync({
            _id:id
        }));
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        await (project.updateAsync({
            team:obj._id
        },{
            $unset:{
                team:null
            }
        },{
            multi:true
        }));
        await (teamGroup.removeAsync({
            team:obj._id
        }))
        await (obj.removeAsync());
    }
    this.interfaceStatistics=async ()=>{
        let obj={
            interface:{},
            doc:{},
            test:{},
        };
        let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        obj.interface.total=await (interface.countAsync());
        obj.interface.today=await (interface.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        obj.doc.total=await (doc.countAsync());
        obj.doc.today=await (doc.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        obj.test.total=await (test.countAsync());
        obj.test.today=await (test.countAsync({
            createdAt:{
                $gt:date
            }
        }))
        return obj;
    }
    this.userProjectList=async (id)=>{
        let ret={};
        let arrOwn=await (project.findAsync({
            owner:id
        },"",{
            sort:"name",
            populate:{
                path:"team",
                select:"name"
            }
        }))
        for(let obj of arrOwn)
        {
            obj._doc.userCount=obj.users.length+1;
            delete obj._doc.users
            obj._doc.interfaceCount=await (interface.countAsync({
                project:obj._id
            }))
        }
        ret.own=arrOwn;
        let arrManage=await (project.findAsync({
            users:{
                $elemMatch:{
                    role:0,
                    user:id
                }
            }
        },"",{
            sort:"name",
            populate:{
                path:"team",
                select:"name"
            }
        }))
        arrManage=await (project.populateAsync(arrManage,{
            path:"owner",
            select:"name"
        }))
        for(let obj of arrManage)
        {
            obj._doc.role=0;
            obj._doc.userCount=obj.users.length+1;
            obj._doc.interfaceCount=await (interface.countAsync({
                project:obj._id
            }))
            for(let obj1 of obj.users)
            {
                if(obj1.user.toString()==id)
                {
                    obj._doc.option=obj1.option
                    break;
                }
            }
            delete obj._doc.users
        }
        let arrJoin=await (project.findAsync({
            users:{
                $elemMatch:{
                    role:1,
                    user:id
                }
            }
        },"",{
            sort:"name",
            populate:{
                path:"team",
                select:"name"
            }
        }))
        arrJoin=await (project.populateAsync(arrJoin,{
            path:"owner",
            select:"name"
        }))
        for(let obj of arrJoin)
        {
            obj._doc.role=1;
            obj._doc.userCount=obj.users.length+1;
            obj._doc.interfaceCount=await (interface.countAsync({
                project:obj._id
            }))
            for(let obj1 of obj.users)
            {
                if(obj1.user.toString()==id)
                {
                    obj._doc.option=obj1.option
                    break;
                }
            }
            delete obj._doc.users
        }
        arrManage=arrManage.concat(arrJoin);
        ret.join=arrManage;
        return ret;
    }
    this.userTeamList=async (id)=>{
        let ret={};
        let arr=await (team.findAsync({
            owner:id
        },"",{
            sort:"name",
            populate:{
                path:"owner",
                select:"name"
            }
        }))
        ret.own=arr;
        let arrTeam=[];
        let arrTemp=await (teamGroup.findAsync({
            users:{
                $elemMatch:{
                    user:id,
                    role:0
                }
            }
        },"",{
            sort:"-createdAt"
        }))
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
            sort:"name",
            populate:{
                path:"owner",
                select:"name"
            }
        }))
        for(let obj of arr)
        {
            obj._doc.role=0;
        }
        ret.join=arr;
        arrTemp=await (teamGroup.findAsync({
            users:{
                $elemMatch:{
                    user:id,
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
            sort:"name",
            populate:{
                path:"owner",
                select:"name"
            }
        }))
        for(let obj of arr)
        {
            obj._doc.role=1;
        }
        ret.join=ret.join.concat(arr);
        let arrRet=[ret.own,ret.join];
        for(let model of arrRet)
        {
            for(let obj of model)
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
        }
        return ret;
    }
    this.userRemoveProject=async (id)=>{
        let obj=await (project.findOneAsync({
            _id:id
        }))
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        await (interface.removeAsync({
            project:id
        }));
        await (version.removeAsync({
            project:id
        }));
        await (interfaceVersion.removeAsync({
            project:id
        }));
        await (interfaceSnapshot.removeAsync({
            project:id
        }));
        await (group.removeAsync({
            project:id
        }))
        await (groupVersion.removeAsync({
            project:id
        }))
        await (status.removeAsync({
            project:id
        }))
        await (statusVersion.removeAsync({
            project:id
        }))
        await (test.removeAsync({
            project:id
        }))
        let arrTestModule=await (testModule.findAsync({
            project:id
        }))
        for(let obj of arrTestModule)
        {
            await (testGroup.removeAsync({
                module:obj._id
            }))
        }
        await (testModule.removeAsync({
            project:id
        }))
        await (poll.removeAsync({
            project:id
        }))
        await (project.removeAsync({
            _id:id
        }))
    }
    this.userRemoveTeam=async (id)=>{
        let obj=await (team.findOneAsync({
            _id:id
        }));
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        await (project.updateAsync({
            team:obj._id
        },{
            $unset:{
                team:null
            }
        },{
            multi:true
        }));
        await (teamGroup.removeAsync({
            team:obj._id
        }))
        await (obj.removeAsync());
    }
    this.userTransferProject=async (id,username,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let obj=await (model.findOneAsync({
            _id:id
        }))
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        let objProject=obj;
        obj=await (user.findOneAsync({
            name:username
        }))
        if(!obj)
        {
            util.throw(e.userNotFound,"用户没有找到");
            return;
        }
        let bInTeam=false;
        if(objProject.team)
        {
            let bIn=await (this.existUserInTeam(objProject.team,obj._id));
            if(!bIn)
            {
                util.throw(e.userNotInTeam,"用户不在团队里");
            }
            else
            {
                bInTeam=true;
            }
        }
        if(category==0)
        {
            let bFind=false;
            for(let o of objProject.users)
            {
                if(o.user.toString()==obj._id.toString())
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                await (project.updateAsync({
                    _id:id
                },{
                    owner:obj._id,
                    $pull:{
                        "users":{
                            user:obj._id
                        }
                    }
                }))
            }
            else
            {
                if(bInTeam || !objProject.team)
                {
                    objProject.owner=obj._id;
                    await (objProject.saveAsync());
                }
                else
                {
                    util.throw(e.userNotInProject,"用户不在项目里");
                }
            }
        }
        else
        {
            let bFind=false;
            for(let o of objProject.users)
            {
                if(o.toString()==obj._id.toString())
                {
                    bFind=true;
                    break;
                }
            }
            if(bFind)
            {
                await (project.updateAsync({
                    _id:id
                },{
                    owner:obj._id,
                    $pull:{
                        "users":obj._id
                    }
                }))
            }
            else
            {
                if(bInTeam || !objProject.team)
                {
                    objProject.owner=obj._id;
                    await (objProject.saveAsync());
                }
                else
                {
                    util.throw(e.userNotInProject,"用户不在项目里");
                }
            }
        }
    }
    this.userTransferTeam=async (id,username)=>{
        let obj=await (team.findOneAsync({
            _id:id
        }))
        if(!obj)
        {
            util.throw(e.teamNotFound,"团队不存在");
            return;
        }
        let objTeam=obj;
        let u=await (user.findOneAsync({
            name:username
        }));
        if(!u)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        let bExist=await (this.existUserInTeam(obj._id,u._id));
        if(!bExist)
        {
            util.throw(e.userNotInTeam,"用户不在团队内");
        }
        await (teamGroup.findOneAndUpdateAsync({
            team:id,
            "users.user":objTeam.owner
        },{
            "users.$.role":0
        }))
        await (teamGroup.findOneAndUpdateAsync({
            team:id,
            "users.user":u._id
        },{
            "users.$.role":2
        }))
        objTeam.owner=u._id;
        await (objTeam.saveAsync());
        return u;
    }
    this.userQuitProject=async (id,userId)=>{
        let userInfo=await (user.findOneAsync({
            _id:userId
        }))
        if(!userInfo)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        let obj=await (project.findOneAsync({
            _id:id
        }));
        if(obj.owner.toString()==id)
        {
            util.throw(e.userForbidden,"创建的项目不能退出");
        }
        let index=-1;
        for(let i=0;i< obj.users.length;i++)
        {
            let u=obj.users[i];
            if(u.user.toString()==userInfo._id.toString())
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
        }
    }
    this.userQuitTeam=async (id,userId)=>{
        let obj=await (team.findOneAsync({
            _id:id
        }))
        if(!obj)
        {
            util.throw(e.teamNotFound,"团队不存在");
            return;
        }
        let objTeam=obj;
        let arr=await (project.findAsync({
            team:objTeam._id,
            owner:userId
        }))
        if(arr.length>0)
        {
            util.throw(e.userInProject,"用户仍然拥有团队的项目");
            return;
        }
        await (project.updateAsync({
            team:objTeam._id,
            "users.user":userId
        },{
            $pull:{
                users:{
                    user:userId
                }
            }
        }, {
            multi: true
        }));
        await (teamGroup.updateAsync({
            team:objTeam._id
        },{
            "$pull":{
                "users":{
                    user:userId
                }
            }
        },{
            multi:true
        }));
    }
    this.addProject=async (name,dis,owner,public,users,category)=>{
        let update={
            name:name
        };
        if(dis)
        {
            update.dis=dis;
        }
        update.owner=owner;
        if(users)
        {
            let users=JSON.parse(users);
            update.users=users;
        }
        if(category==0)
        {
            if(public)
            {
                update.public=public;
            }
            let obj=await (project.createAsync(update));
            let query={
                name:"未命名",
                project:obj._id,
                id:uuid()
            }
            await (group.createAsync(query))
            query={
                name:"#回收站",
                project:obj._id,
                type:1,
                id:uuid()
            }
            await (group.createAsync(query))
        }
        else if(category==1)
        {
            await docProject.createAsync(update);
        }
        else if(category==2)
        {
            await testProject.createAsync(update);
        }
    }
    this.setProjectUser=async (id,users,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let obj=await (model.findOneAsync({
            _id:id
        }))
        if(!obj)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        let objProject=obj;
        let objUser=JSON.parse(users);
        for(let obj of objUser)
        {
            if(obj.user==objProject.owner.toString())
            {
                util.throw(e.userForbidden,"用户列表里还有拥有者");
            }
            else if(objProject.team)
            {
                let bExist=await (this.existUserInTeam(objProject.team,obj.user));
                if(!bExist)
                {
                    util.throw(e.userNotInTeam,"用户不在团队内");
                }
            }
        }
        objProject.users=objUser;
        await (objProject.saveAsync());
    }
    this.addTeam=async (owner,name,dis,users)=>{
        let u=await (user.findOneAsync({
            _id:owner
        }))
        if(!u)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        let obj=await (team.createAsync({
            name:name,
            dis:dis,
            owner:owner
        }));
        let objGroup=await (teamGroup.createAsync({
            name:"未命名",
            team:obj._id,
            users:[
                {
                    user:owner,
                    role:2
                }
            ]
        }))
        if(users)
        {
            let users=JSON.parse(users);
            for(let obj of users)
            {
                objGroup.users.push(obj);
            }
            await (teamGroup.updateAsync({
                _id:objGroup._id
            },{
                users:objGroup.users
            }))
        }
    }
    this.addTamGroup=async (id,groupId,name)=>{
        let obj;
        if(groupId)
        {
            obj=await (teamGroup.findOneAndUpdateAsync({
                _id:groupId
            },{
                name:name
            },{
                new:true
            }))
        }
        else
        {
            obj=await (teamGroup.createAsync({
                name:name,
                team:id
            }))
        }
        return obj;
    }
    this.addTeamUser=async (id,username,groupId,role)=>{
        let u=await (user.findOneAsync({
            name:username
        }))
        if(!u)
        {
            util.throw(e.userNotFound,"用户不存在");
        }
        if(await (this.existUserInTeam(id,u._id)))
        {
            util.throw(e.userAlreadyInTeam,"用户已经在团队里了");
        }
        else
        {
            await (teamGroup.findOneAndUpdateAsync({
                _id:groupId
            },{
                $addToSet:{
                    users:{
                        user:u._id,
                        role:role
                    }
                }
            }))
        }
        return u;
    }
    this.removeTeamGroup=async (groupId)=>{
        let obj=await (teamGroup.findOneAsync({
            _id:groupId
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
    }
    this.removeTeamUser=async (id,userId)=>{
        let arr=await (project.findAsync({
            team:id,
            owner:userId
        }))
        if(arr.length>0)
        {
            util.throw(e.userInProject,"用户仍然拥有团队中的项目");
            return;
        }
        await (project.updateAsync({
            team:id,
            "users.user":userId
        },{
            $pull:{
                users:{
                    user:userId
                }
            }
        },{
            multi:true
        }))
        await (teamGroup.updateAsync({
            team:id
        },{
            "$pull":{
                "users":{
                    user:userId
                }
            }
        },{
            multi:true
        }));
    }
    this.pullTeamProject=async (id,projectId,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let objProject=await (model.findOneAsync({
            _id:projectId
        },"",{
            populate:{
                path:"owner",
                select:"name"
            }
        }))
        if(!objProject)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        let objTeam=await (team.findOneAsync({
            _id:id
        }))
        if(!objTeam)
        {
            util.throw(e.projectNotFound,"团队不存在");
            return;
        }
        let arrTeamUser=await (this.teamUserList(objTeam._id));
        let arrProjectUser=objProject.users.map(function (obj) {
            return obj.user.toString();
        });
        arrProjectUser.push(objProject.owner._id.toString());
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
        objProject._doc.userCount=objProject.users.length+1;
        delete objProject._doc.users;
        if(category==0)
        {
            objProject._doc.interfaceCount=await (interface.countAsync({
                project:objProject._id
            }))
        }
        else if(category==1)
        {
            objProject._doc.docCount=await (doc.countAsync({
                project:objProject._id
            }))
        }
        else if(category==2)
        {
            objProject._doc.testCount=await (test.countAsync({
                project:objProject._id
            }))
        }
        return objProject;
    }
    this.pushTeamProject=async (id,projectId,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let obj=await (model.findOneAndUpdateAsync({
            _id:projectId,
            team:id
        },{
            $unset:{
                team:null
            }
        }))
    }
    this.setTeamUserRole=async (id,userId,role)=>{
        let objTeam=await (team.findOneAsync({
            _id:id
        }))
        if(!objTeam)
        {
            util.throw(e.projectNotFound,"团队不存在");
            return;
        }
        await (teamGroup.updateAsync({
            team:objTeam._id,
            "users.user":userId
        },{
            "users.$.role":role
        }))
    }
    this.setProjectUserRole=async (id,userId,role,option,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let objProject=await (model.findOneAsync({
            _id:id
        }))
        if(!model)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        let u=await (user.findOneAsync({
            [objectId.isValid(userId)?"_id":"name"]:userId
        }));
        if(!u)
        {
            util.throw(e.userNotFound,"用户不存在");
            return;
        }
        if(objProject.owner.toString()==u._id.toString())
        {
            util.throw(e.systemReason,"用户已经是所有者了");
            return;
        }
        if(category==0)
        {
            let bIn=false;
            for(let obj of objProject.users)
            {
                if(obj.user.toString()==u._id.toString())
                {
                    bIn=true;
                    break;
                }
            }
            if(bIn)
            {
                let update={
                    "users.$.role":role
                }
                if(option)
                {
                    update["users.$.option"]=JSON.parse(option);
                }
                else
                {
                    update["$unset"]={
                        "users.$.option":1
                    }

                }
                await (model.findOneAndUpdateAsync({
                    _id:id,
                    "users.user":u._id
                },update))
            }
            else
            {
                let update={
                    user:u._id,
                    role:role
                }
                if(option)
                {
                    update.option=JSON.parse(option);
                }
                await (model.findOneAndUpdateAsync({
                    _id:id
                },{
                    $addToSet:{
                        users:update
                    }
                }))
                if(objProject.team)
                {
                    let bExist=await (this.existUserInTeam(objProject.team,u._id));
                    if(!bExist)
                    {
                        let objGroup=await (teamGroup.findOneAndUpdateAsync({
                            name:"未命名",
                            team:objProject.team
                        },{
                            name:"未命名",
                            team:objProject.team,
                            $addToSet:{
                                users:{
                                    user:u._id,
                                    role:0
                                }
                            }
                        },{
                            upsert:true,
                            setDefaultsOnInsert:true
                        }))
                    }
                }
                let ret={
                    user:u,
                    role:role
                };
                if(option)
                {
                    ret.option=JSON.parse(option)
                }
                return ret;
            }
        }
        else
        {
            await model.updateAsync({
                _id:id
            },{
                $addToSet:{
                    users:u._id
                }
            },{
                new:true
            })
            return {
                user:u
            };
        }
    }
    this.removeProjectUser=async (id,userId,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let objProject=await (model.findOneAsync({
            _id:id
        }))
        if(!objProject)
        {
            util.throw(e.projectNotFound,"项目不存在");
            return;
        }
        await (model.findOneAndUpdateAsync({
            _id:id
        },{
            $pull:{
                users:{
                    user:userId
                }
            }
        }))
    }
    this.searchUser=async (username)=>{
        let reg=new RegExp("^"+username,"i");
        let arr=await (user.findAsync({
            name:reg
        },"name",{
            sort:"name",
            limit:20
        }))
        return arr;
    }
    this.projectUserList=async (id,category)=>{
        let model;
        if(category==0)
        {
            model=project;
        }
        else if(category==1)
        {
            model=docProject;
        }
        else if(category==2)
        {
            model=testProject;
        }
        let objProject=await (model.findOneAsync({
            _id:id
        },null,{
            populate:{
                path:(category==0)?"users.user":"users",
                select:"name photo"
            }
        }))
        if(!objProject)
        {
            util.throw(e.projectNotFound,"项目不存在");
        }
        return objProject;
    }
    this.editTeam=async (id,name,dis)=>{
        let objTeam=await (team.findOneAsync({
            _id:id
        }))
        if(!objTeam)
        {
            util.throw(e.projectNotFound,"团队不存在");
            return;
        }
        objTeam.name=name;
        if(dis!==undefined)
        {
            objTeam.dis=dis
        }
        await (objTeam.saveAsync());
        return objTeam;
    }
    this.moveTeamUser=async (id,userId,groupId)=>{
        let obj=await (teamGroup.findOneAndUpdateAsync({
            team:id,
            "users.user":userId
        },{
            $pull:{
                "users":{
                    user:userId
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
            if(o.user.toString()==userId)
            {
                role=o.role;
                break;
            }
        }
        let update={
            user:userId,
            role:role
        };
        obj=await (teamGroup.findOneAndUpdateAsync({
            _id:groupId
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
        return update;
    }
    this.getTeamUserList=async (id)=>{
        let arrUser=await (teamGroup.findAsync({
            team:id
        },"",{
            populate:{
                path:"users.user",
                select:"name photo"
            }
        }))
        let arr=[];
        arrUser.forEach(function (obj) {
            arr.push({
                users:obj.users,
                _id:obj._id,
                name:obj.name
            })
        })
        return arr;
    }
    this.teamProjectList=async (id)=>{
        let arr=await (project.findAsync({
            team:id
        },null,{
            populate:{
                path:"owner",
                select:"name"
            },
            sort:"name"
        }))
        for(let obj of arr)
        {
            obj._doc.userCount=obj.users.length+1;
            delete obj._doc.users;
            obj._doc.interfaceCount=await (interface.countAsync({
                project:obj._id
            }))
        }
        return arr;
    }
    this.statisticList=async (start,end)=>{
        let arr=await (statistic.findAsync({
            date:{
                $gte:start,
                $lte:end
            }
        },null,{
            sort:"-date"
        }))
        return arr;
    }
    this.getSetting=async ()=>{
        let ret={};
        let objInfo=await (info.findOneAsync());
        ret.info={
            version:objInfo.version,
            register:objInfo.register
        }
        ret.connect={
            db:config.db,
            filePath:config.filePath,
            port:config.port
        };
        ret.db=objInfo.db;
        ret.files=[];
        if(objInfo.db.backPath)
        {
            ret.files=await (fs.readdirAsync(objInfo.db.backPath))
            ret.files=ret.files.filter(function (obj) {
                if(obj.indexOf("@")>-1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            })
            ret.files.sort(function (obj1,obj2) {
                if(obj1>obj2)
                {
                    return -1
                }
                else if(obj1<obj2)
                {
                    return 1
                }
                else
                {
                    return 0;
                }
            })
            ret.files=ret.files.slice(0,10);
        }
        return ret;
    }
    this.setBasicInfo=async (register)=>{
        let obj=await (info.findOneAsync());
        obj.register=register;
        await (obj.saveAsync());
    }
    this.backup=async (dbpath,backpath,hours,host,name,userId,pass,authdb,immediate)=>{
        let obj=await (info.findOneAsync());
        obj.db={
            dbPath:dbpath,
            backPath:backpath,
            hours:JSON.parse(hours),
            host:host,
            name:name
        }
        if(userId)
        {
            obj.db.user=userId;
            obj.db.pass=pass;
            obj.db.authDb=authdb;
        }
        await (obj.saveAsync());
        if(immediate)
        {
            await (util.backup(obj.db,obj.version))
        }
    }
    this.restore=async (id)=>{
        let obj=await (info.findOneAsync());
        await (util.restore(obj.db,id))
    }
    this.backupList=async (page)=>{
        let ret=[];
        let objInfo=await (info.findOneAsync());
        if(objInfo.db.backPath)
        {
            ret=await (fs.readdirAsync(objInfo.db.backPath))
            ret=ret.filter(function (obj) {
                if(obj.indexOf("@")>-1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            })
            ret.sort(function (obj1,obj2) {
                if(obj1>obj2)
                {
                    return -1
                }
                else if(obj1<obj2)
                {
                    return 1
                }
                else
                {
                    return 0;
                }
            })
            ret=ret.slice(page*10,10);
        }
        return ret;
    }
    this.removeBackup=async (id)=>{
        let objInfo=await (info.findOneAsync());
        let backPath=path.join(objInfo.db.backPath,id);
        if(fs.existsSync(backPath))
        {
            util.removeFolder(backPath);
        }
    }
}
module.exports=new Common();