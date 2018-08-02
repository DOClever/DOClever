/**
 * Created by sunxin on 2016/11/20.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var con=require("../../../config.json");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var group=require("../../model/groupModel")
var groupVersion=require("../../model/groupVersionModel")
var interface=require("../../model/interfaceModel")
var interfaceVersion=require("../../model/interfaceVersionModel")
var interfaceSnapshot=require("../../model/interfaceSnapshotModel")
var version=require("../../model/versionModel")
var teamGroup=require("../../model/teamGroupModel")
var example=require("../../model/exampleModel")
var doc=require("../../model/docModel")
var docProject=require("../../model/docProjectModel")
var fs=require("fs");
var uuid=require("uuid/v1");

function Interface() {
    this.sort=async function (req,objGroup,objMove,index,bGroup) {
        let arr;
        if(bGroup)
        {
            let query={
                project:req.project._id
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
                project:req.project._id,
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
    this.validateUser = async (req)=> {
        let obj, pro;
        req.interfaceModel = interface;
        req.groupModel = group;
        if (req.headers["docleverversion"]) {
            req.version = await (version.findOneAsync({
                _id: req.headers["docleverversion"]
            }))
            if (!req.version) {
                util.throw(e.versionInvalidate, "版本不可用");
            }
            req.interfaceModel = interfaceVersion;
            req.groupModel = groupVersion;
        }
        if (req.headers["docleversnapshot"]) {
            req.interfaceModel = interfaceSnapshot;
        }
        if (req.clientParam.id) {
            let obj = await (req.interfaceModel.findOneAsync(req.clientParam.id.length == 24 ? {
                _id: req.clientParam.id
            } : {
                id: req.clientParam.id,
                project: req.clientParam.project
            }));
            if (!obj) {
                util.throw(e.interfaceNotFound, "接口不存在或者该接口被锁定不可移动");
            }
            req.interface = obj;
            pro = obj.project;
        }
        else {
            pro = req.clientParam.project;
        }
        if (pro) {
            obj = await (project.findOneAsync({
                _id: pro,
                $or: [
                    {
                        owner: req.userInfo._id
                    },
                    {
                        "users.user": req.userInfo._id
                    }
                ]
            }))
            if (!obj) {
                obj = await (project.findOneAsync({
                    _id: pro
                }));
                if (!obj) {
                    util.throw(e.projectNotFound, "项目不存在");
                    return;
                }
                if (obj.team) {
                    let arrUser = await (teamGroup.findAsync({
                        team: obj.team,
                        users: {
                            $elemMatch: {
                                user: req.userInfo._id,
                                role: {
                                    $in: [0, 2]
                                }
                            }
                        }
                    }))
                    if (arrUser.length == 0 && !obj.public && !req.headers["referer"].endsWith("public/public.html")) {
                        util.throw(e.userForbidden, "你没有权限");
                        return;
                    }
                }
                else if(!obj.public && !req.headers["referer"].endsWith("public/public.html"))
                {
                    util.throw(e.userForbidden, "你没有权限");
                    return;
                }
            }
            req.project = obj;
            if (obj.owner.toString() == req.userInfo._id.toString()) {
                req.access = 1;
            }
            else {
                for (let o of obj.users) {
                    if (o.user.toString() == req.userInfo._id.toString()) {
                        if (o.role == 0) {
                            req.access = 1;
                        }
                        else {
                            req.access = 0;
                        }
                        break;
                    }
                }
            }
        }
        if (req.clientParam.group) {
            let g = await (req.groupModel.findOneAsync({
                _id: req.clientParam.group
            }));
            if (!g) {
                util.throw(e.groupNotFound, "分组不存在")
            }
            else {
                req.group = g;
                if(req.clientParam.project)
                {
                    if(req.group.project.toString()!=req.clientParam.project)
                    {
                        util.throw(e.systemReason, "分组不在当前工程内")
                    }
                }
            }
        }
    }

    this.create=async (req, res)=> {
        try {
            await (this.validateUser(req));
            let query={
                url:req.clientParam.url,
                method:req.clientParam.method,
                project:req.project._id
            }
            if(req.clientParam.id)
            {
                query._id={
                    $ne:req.clientParam.id
                }
            }
            if (req.headers["docleverversion"]) {
                query.version = req.headers["docleverversion"]
            }
            let bDuplicate=false;
            let obj=await (req.interfaceModel.findOneAsync(query));
            if(obj)
            {
                bDuplicate=true;
            }
            let update = {};
            for (let key in req.clientParam) {
                if (key != "id" && req.clientParam[key] !== undefined) {
                    if (key == "param") {
                        if (req.clientParam[key] !== "") {
                            update[key] = JSON.parse(req.clientParam[key]);
                        }
                    }
                    else {
                        update[key] = req.clientParam[key];
                    }

                }
            }
            if (req.clientParam.id) {
                update.editor = req.userInfo._id;
                if (req.headers["docleversnapshot"]) {
                    update.snapshot = decodeURIComponent(req.headers["docleversnapshotdis"]);
                }
                let obj = await (req.interfaceModel.findOneAndUpdateAsync({
                    _id: req.clientParam.id
                }, update, {
                    new: false
                }));
                let arr=update.param.map(function (obj) {
                    return obj.id;
                })
                await (example.removeAsync({
                    interface:req.clientParam.id,
                    paramId:{
                        $nin:arr
                    }
                }))
                if (req.clientParam.group && !req.clientParam.autosave) {
                    if (obj.group.toString() != req.clientParam.group) {
                        if (req.interfaceModel != interfaceSnapshot) {
                            let query = {
                                id: obj.id,
                                project: obj.project
                            };
                            if (req.headers["docleverversion"]) {
                                query.version = req.headers["docleverversion"]
                            }
                            else {
                                query.version = {
                                    $exists: false
                                }
                            }
                            await (interfaceSnapshot.updateAsync(query, {
                                group: req.clientParam.group
                            }));
                        }
                        let arr = await (this.getChild(req,obj.project, null,1))
                        util.ok(res, arr, "修改成功");
                        return;
                    }
                }
                util.ok(res, obj._id, bDuplicate?"有重复接口，请尽量避免":"修改成功");
            }
            else
            {
                update.owner = req.userInfo._id;
                update.editor = req.userInfo._id;
                update.id = uuid();
                if (req.headers["docleverversion"]) {
                    update.version = req.headers["docleverversion"]
                }
                let obj = await (req.interfaceModel.createAsync(update))
                util.ok(res, obj, bDuplicate?"有重复接口，请尽量避免":"新建成功");
            }
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.remove=async (req, res)=> {
        try {
            await (this.validateUser(req));
            let query = {
                project: req.project._id,
                type: 1
            }
            if (req.headers["docleverversion"]) {
                query.version = req.headers["docleverversion"]
            }
            let obj = await (req.groupModel.findOneAsync(query))
            req.interface.group = obj._id;
            await (req.interface.saveAsync())
            query = {
                id: req.interface.id,
                project: req.project._id
            };
            if (req.headers["docleverversion"]) {
                query.version = req.headers["docleverversion"]
            }
            else {
                query.version = {
                    $exists: false
                }
            }
            await (interfaceSnapshot.updateAsync(query, {
                group: obj._id
            }));
            let arr = await (this.getChild(req,req.project._id, null,1));
            util.ok(res, arr, "已移到回收站");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.move=async (req, res)=> {
        try {
            await (this.validateUser(req));
            if (req.headers["docleversnapshot"]) {
                util.throw(e.systemReason, "快照状态下不可移动");
            }
            let update = {};
            update.group = req.group._id;
            let obj=await (req.interfaceModel.findOneAndUpdateAsync({
                _id: req.clientParam.id
            }, update,{
                new:true
            }))
            let query = {
                id: req.interface.id,
                project: req.project._id
            };
            if (req.headers["docleverversion"]) {
                query.version = req.headers["docleverversion"]
            }
            else {
                query.version = {
                    $exists: false
                }
            }
            await (interfaceSnapshot.updateAsync(query, update));
            await (this.sort(req,req.group,obj,req.clientParam.index?req.clientParam.index:0))
            let arr = await (this.getChild(req,obj.project, null,1))
            util.ok(res,arr,"移动成功");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.info=async (req, res)=> {
        try {
            await (this.validateUser(req));
            let obj = await (req.interfaceModel.populateAsync(req.interface, {
                path: "project",
                select: "name"
            }))
            if (obj.group) {
                obj = await (req.interfaceModel.populateAsync(obj, {
                    path: "group",
                    select: "name"
                }))
            }
            if (obj.owner) {
                obj = await (req.interfaceModel.populateAsync(obj, {
                    path: "owner",
                    select: "name"
                }))
            }
            if (obj.editor) {
                obj = await (req.interfaceModel.populateAsync(obj, {
                    path: "editor",
                    select: "name"
                }))
            }
            if (req.clientParam.group && obj.group._id.toString() != req.clientParam.group && req.clientParam.group.length == 24) {
                obj._doc.change = 1;
            }
            if (req.clientParam.run) {
                obj._doc.baseUrl = req.project.baseUrls;
            }
            util.ok(res, obj, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.share=async (req, res)=>{
        try {
            let interfaceModel = interface;
            let inter = await (interfaceModel.findOneAsync({
                _id: req.clientParam.id
            }));
            if (!inter) {
                interfaceModel = interfaceVersion;
                inter = await (interfaceModel.findOneAsync({
                    _id: req.clientParam.id
                }));
                if (!inter) {
                    interfaceModel = interfaceSnapshot;
                    inter = await (interfaceModel.findOneAsync({
                        _id: req.clientParam.id
                    }));
                    if (!inter) {
                        util.throw(e.interfaceNotFound, "接口不存在");
                    }
                }
            }
            let obj = await (interfaceModel.populateAsync(inter, {
                path: "project",
                select: "name"
            }))
            if (obj.group) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "group",
                    select: "name"
                }))
            }
            if (obj.owner) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "owner",
                    select: "name"
                }))
            }
            if (obj.editor) {
                obj = await (interfaceModel.populateAsync(obj, {
                    path: "editor",
                    select: "name"
                }))
            }
            util.ok(res, obj, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.destroy=async (req, res)=>{
        try {
            await (this.validateUser(req));
            await (req.interface.removeAsync())
            let query = {
                id: req.interface.id,
                project: req.project._id
            }
            if (req.headers["docleverversion"]) {
                query.version = req.headers["docleverversion"];
            }
            else {
                query.version = {
                    $exists: false
                }
            }
            await (interfaceSnapshot.removeAsync(query))
            await (example.removeAsync({
                interface:req.interface._id
            }))
            let arr = await (this.getChild(req,req.project._id, null,1));
            util.ok(res, arr, "删除成功");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.exportJSON=async (req, res)=> {
        try {
            await (this.validateUser(req));
            let obj = {
                flag: "SBDoc",
            };
            for (let key in req.interface._doc) {
                if (req.interface._doc.hasOwnProperty(key) && key != "__v" && key != "_id" && key != "id" && key != "project" && key != "group" && key != "owner" && key != "editor") {
                    obj[key] = req.interface._doc[key];
                }
            }
            let content = JSON.stringify(obj);
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(req.interface.name) + ".json",
                "Transfer-Encoding": "chunked",
                "Expires": 0,
                "Cache-Control": "must-revalidate, post-check=0, pre-check=0",
                "Content-Transfer-Encoding": "binary",
                "Pragma": "public",
            });
            res.end(content);
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.importJSON=async (req, res)=> {
        try {
            await (this.validateUser(req));
            let obj;
            try {
                obj = JSON.parse(req.clientParam.json);
            }
            catch (err) {
                util.throw(e.systemReason, "json解析错误");
                return;
            }
            if (obj.flag != "SBDoc") {
                util.throw(e.systemReason, "不是DOClever的导出格式");
                return;
            }
            let objGroup = await (req.groupModel.findOneAsync({
                _id: req.clientParam.group
            }))
            if (!objGroup) {
                util.throw(e.groupNotFound, "分组不存在");
                return;
            }
            obj.project = objGroup.project;
            obj.group = objGroup._id;
            obj.owner = req.userInfo._id;
            obj.editor = req.userInfo._id;
            obj.id=uuid();
            if (req.headers["docleverversion"]) {
                obj.version = req.headers["docleverversion"]
            }
            if(!obj.param)
            {
                obj.param=[];
                let o={
                    name:"未命名",
                    remark:"",
                    id:uuid(),
                    header:obj.header,
                    queryParam:obj.queryParam,
                    restParam:obj.restParam,
                    outParam:obj.outParam,
                    outInfo:obj.outInfo,
                    before:obj.before,
                    after:obj.after
                }
                if(obj.bodyParam)
                {
                    o.bodyParam=obj.bodyParam;
                    o.bodyInfo=obj.bodyInfo;
                }
                delete obj.header;
                delete obj.queryParam;
                delete obj.restParam;
                delete obj.outParam;
                delete obj.outInfo;
                delete obj.before;
                delete obj.after;
                delete obj.bodyParam;
                delete obj.bodyInfo;
                obj.param.push(o);
            }
            obj = await (req.interfaceModel.createAsync(obj));
            util.ok(res, obj, "导入成功");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.createSnapshot=async (req, res)=> {
        try {
            await (this.validateUser(req));
            delete req.interface._doc._id;
            delete req.interface._doc.createdAt;
            delete req.interface._doc.updatedAt;
            req.interface._doc.snapshot = req.clientParam.dis;
            req.interface._doc.snapshotCreator = req.userInfo._id;
            if (req.headers["docleverversion"]) {
                req.interface._doc.version = req.headers["docleverversion"];
                req.interface._doc.groupType = "GroupVersion";
            }
            else {
                req.interface._doc.groupType = "Group";
            }
            await (interfaceSnapshot.createAsync(req.interface._doc));
            util.ok(res, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.snapshotList=async (req, res)=>{
        try {
            await (this.validateUser(req));
            let query = {
                project: req.interface.project,
                id: req.interface.id
            }
            if (req.headers["docleverversion"]) {
                query.version = req.headers["docleverversion"]
            }
            else {
                query.version = {
                    $exists: false
                }
            }
            let arr = await (interfaceSnapshot.findAsync(query, "", {
                sort: "-createdAt",
                populate: {
                    path: "version"
                },
                skip: req.clientParam.page * 10,
                limit: 10
            }));
            arr = await (interfaceSnapshot.populateAsync(arr, {
                path: "snapshotCreator",
                select: "name photo"
            }))
            util.ok(res, arr, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.removeSnapshot=async (req, res)=> {
        try {
            await (this.validateUser(req));
            await (req.interface.removeAsync());
            util.ok(res, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.snapshotRoll=async (req, res)=>{
        try {
            await (this.validateUser(req));
            let obj = await (interface.findOneAsync({
                id: req.interface.id,
                project: req.interface.project
            }));
            if (!obj) {
                util.throw(e.interfaceNotFound, "接口不存在");
            }
            delete req.interface._doc._id;
            delete req.interface._doc.snapshot;
            delete req.interface._doc.snapshotCreator;
            delete req.interface._doc.version;
            delete req.interface._doc.groupType;
            delete req.interface._doc.createdAt;
            delete req.interface._doc.updatedAt;
            await (interface.updateAsync({
                _id: obj._id
            }, req.interface._doc));
            util.ok(res, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }
    this.notify=async (req,res)=>{
        try
        {
            await (this.validateUser(req));
            if(!req.userInfo.sendInfo.user)
            {
                util.throw(e.systemReason,"发件账户不存在，请前去个人设置里面设置");
            }
            let arrTo=req.clientParam.users.split(",");
            let arrToMail=[];
            for(let obj of arrTo)
            {
                let u=await (user.findOneAsync({
                    _id:obj
                }))
                if(u && u.email)
                {
                    arrToMail.push(u.email);
                }
            }
            let title=`[DOClever]接口${req.interface.name}发生变更`;
            req.group=await (req.groupModel.findOneAsync({
                _id:req.interface.group
            }));
            let g=req.group.id;
            let arrGroup=[];
            while(g)
            {
                let obj=await (req.groupModel.findOneAsync({
                    id:g,
                    project:req.interface.project
                }));
                if(obj)
                {
                    arrGroup.unshift(obj.name);
                }
                g=obj.parent;
            }
            let strGroup=arrGroup.join("/");
            let content=`<div>名称：${req.interface.name}</div><div>路径：${req.interface.url}</div><div>方法：${req.interface.method}</div><div>分组：${strGroup}</div><div>通知人：${req.userInfo.name}</div><div>通知内容：${req.clientParam.content?req.clientParam.content:""}</div>`;
            if(arrToMail.length>0)
            {
                util.sendMail(req.userInfo.sendInfo.smtp,req.userInfo.sendInfo.port,req.userInfo.sendInfo.user,req.userInfo.sendInfo.password,arrToMail,title,content);
            }
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.merge=async (req,res)=>{
        try
        {
            await (this.validateUser(req));
            await (req.interfaceModel.updateAsync({
                _id:req.clientParam.id
            },{
                $unset:{
                    delete:1
                }
            }))
            let arr = await (this.getChild(req,req.project._id, null,1));
            util.ok(res, arr, "ok");

        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.docRef=async (req,res)=>{
        try
        {
            await (this.validateUser(req));
            let arr=await (doc.findAsync({
                interface:req.clientParam.id
            },"name",{
                sort:"-createdAt"
            }));
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.getParam=async (req,res)=>{
        try
        {
            await (this.validateUser(req));
            let objParam;
            for(let obj of req.interface.param)
            {
                if(obj.id==req.clientParam.param)
                {
                    objParam=obj;
                    break;
                }
            }
            if(objParam)
            {
                util.ok(res,objParam,"ok")
            }
            else
            {
                util.throw(e.systemReason,"运行实例不存在");
            }
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}


module.exports=Interface;







