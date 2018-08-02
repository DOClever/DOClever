var io=require("socket.io");
var ss=require("socket.io-stream");


var docProject=require("../model/docProjectModel");
var docGroup=require("../model/docGroupModel");
var doc=require("../model/docModel");
var user=require("../model/userModel");
var project=require("../model/projectModel")
var version=require("../model/versionModel")
var group=require("../model/groupModel")
var groupVersion=require("../model/groupVersionModel")
var interfaceVersion=require("../model/interfaceVersionModel")
var interface=require("../model/interfaceModel")
var team=require("../model/teamModel")
var teamGroup=require("../model/teamGroupModel")
var e=require("../util/error.json");
var util=require("../util/util");
var blue=require("bluebird");
var con=require("../../config")
var pathLib=require("path");
var fs=blue.promisifyAll(require("fs"));
var arrClient=[];
function Doc(client) {
    this.socket=client;
    this.socketStream=ss(this.socket);
    var _this=this;
    this.ok=function (obj,type="data") {
        this.socket.emit(type,JSON.stringify({
            code:200,
            data:obj
        }));
    }
    this.throw=function (code,msg) {
        this.socket.emit("data",JSON.stringify({
            code:code,
            msg:msg
        }))
    }
    this.socket.on("disconnect",function () {
        let index=arrClient.indexOf(_this);
        if(index>-1)
        {
            arrClient.splice(index,1);
        }
    })
    this.socket.on("data",async function (data) {
        let obj=JSON.parse(data);
        let objUser=await (user.findOneAsync({
            _id:obj.user
        }));
        if(!objUser)
        {
            _this.throw(e.userNotFound,"用户不存在");
            return;
        }
        let objDoc;
        if(obj.doc)
        {
            objDoc=await (doc.findOneAsync({
                _id:obj.doc
            }));
            if(!objDoc)
            {
                _this.throw(e.docNotFound,"文档不存在");
                return;
            }
        }
        let objProject;
        if(obj.project)
        {
            objProject=await (docProject.findOneAsync({
                _id:obj.project
            }));
            if(!objProject)
            {
                _this.throw(e.docProjectNotFound,"项目不存在");
                return;
            }
        }
        if(obj.type=="putDoc")
        {
            objDoc.content=obj.content;
            objDoc.editor=objUser._id;
            if(obj.flag=="end")
            {
                let existImg=[],delImg=[];
                for(let img of objDoc.img)
                {
                    if(objDoc.content.indexOf(`](${img}`)>-1)
                    {
                        existImg.push(img);
                    }
                    else
                    {
                        delImg.push(img);
                    }
                }
                objDoc.img=existImg;
                let existFile=[],delFile=[];
                for(let file of objDoc.file)
                {
                    if(objDoc.content.indexOf(`](${file}`)>-1)
                    {
                        existFile.push(file);
                    }
                    else
                    {
                        delFile.push(file);
                    }
                }
                objDoc.file=existFile;
                let existInter=[],arrRet,reg=/\]\(interface\:\/\/([\w\d]{24})\?/ig;
                while((arrRet=reg.exec(objDoc.content))!==null)
                {
                    if(existInter.indexOf(arrRet[1])==-1)
                    {
                        existInter.push(arrRet[1]);
                    }
                }
                objDoc.interface=existInter;
                await (objDoc.saveAsync());
                await ((async function (arrImg,arrFile) {
                    let fileSize=0;
                    for(let o of arrImg)
                    {
                        let size=await (util.getFileSize(o));
                        fileSize+=size;
                        util.delImg(o);
                    }
                    for(let o of arrFile)
                    {
                        let size=await (util.getFileSize(o));
                        fileSize+=size;
                        util.delImg(o);
                    }
                    let obj=await (docProject.findOneAndUpdateAsync({
                        _id:objDoc.project
                    },{
                        $inc:{
                            useSize:-fileSize
                        }
                    },{
                        new:true
                    }))
                    _this.ok(obj.useSize,"useSize");
                })(delImg,delFile));
            }
            else
            {
                await (objDoc.saveAsync());
            }

        }
        else if(obj.type=="size")
        {
            _this.ok({
                total:objProject.totalSize,
                use:objProject.useSize,
                type:obj.flag
            },"size");
        }
        else if(obj.type=="close")
        {
            _this.ok(objProject.useSize,"useSize");
        }
        else if(obj.type=="open")
        {
            let ret=[];
            let arrTemp=await (teamGroup.findAsync({
                "users":{
                    $elemMatch:{
                        user:objUser._id,
                        role:{
                            $in:[0,2]
                        }
                    }
                }
            },"team",{
                sort:"-createdAt",
                populate:{
                    path:"team",
                    select:"name"
                }
            }))
            ret=arrTemp.map(function (obj) {
                let o=obj.team;
                o.access=1;
                return o;
            });
            arrTemp=await (teamGroup.findAsync({
                "users":{
                    $elemMatch:{
                        user:objUser._id,
                        role:1
                    }
                }
            },"team",{
                sort:"-createdAt",
                populate:{
                    path:"team",
                    select:"name"
                }
            }))
            ret=ret.concat(arrTemp.map(function (obj) {
                let o=obj.team;
                o.access=0;
                return o;
            }));
            ret.unshift({
                _id:"",
                name:"无团队",
                access:1
            });
            for(let objTeam of ret)
            {
                let query={},arrProject=[];
                if(objTeam._id)
                {
                    let access=objTeam.access;
                    delete objTeam.access;
                    if(access)
                    {
                        query={
                            team:objTeam._id,
                        }
                    }
                    else
                    {
                        query={
                            team:objTeam._id,
                            $or:[
                                {
                                    owner:objUser._id
                                },
                                {
                                    "users.user":objUser._id
                                }
                            ]
                        }
                    }
                    arrProject=await (project.findAsync(query,"name",{
                        sort:"-createdAt"
                    }))
                }
                else
                {
                    query={
                        team:{
                            $exists:false
                        },
                        $or:[
                            {
                                owner:objUser._id
                            },
                            {
                                "users.user":objUser._id
                            }
                        ]
                    }
                    arrProject=await (project.findAsync(query,"name",{
                        sort:"-createdAt"
                    }))
                }
                (objTeam._doc?objTeam._doc:objTeam).data=arrProject;
                for(let objPro of arrProject)
                {
                    let arrVersion=[];
                    arrVersion=await (version.findAsync({
                        project:objPro._id
                    },"version",{
                        sort:"-createdAt"
                    }))
                    arrVersion.forEach(function (obj) {
                        obj._doc.name=obj.version;
                        delete obj._doc.version
                    })
                    arrVersion.unshift({
                        _id:"",
                        name:"master",
                    })
                    if(objPro._doc)
                    {
                        objPro._doc.data=arrVersion;
                    }
                    else
                    {
                        objPro.data=arrVersion;
                    }
                    let curProjectID=objPro._id;
                    for(let objVersion of arrVersion)
                    {
                        let groupModel=group;
                        let interfaceModel=interface;
                        if(objVersion._id)
                        {
                            groupModel=groupVersion;
                            interfaceModel=interfaceVersion;
                        }
                        let getChild=async function(id,obj,bInter) {
                            let query={
                                project:id,
                                parent:obj?obj.id:{
                                    $exists:false
                                }
                            }
                            if(objVersion._id)
                            {
                                query.version=objVersion._id
                            }
                            let arr=await (groupModel.findAsync(query,"name id",{
                                sort:"name"
                            }))
                            for(let obj of arr)
                            {
                                obj._doc.data=await (getChild(id,obj,bInter));
                                delete obj._doc.id;
                            }
                            if(bInter && obj)
                            {
                                let arrInterface=await (interfaceModel.findAsync({
                                    group:obj._id
                                },"name",{
                                    sort:"name"
                                }));
                                arr=arr.concat(arrInterface);
                            }
                            return arr;
                        }
                        let arr=await (getChild(curProjectID,null,1));
                        (objVersion._doc?objVersion._doc:objVersion).data=arr;
                    }
                }
            }
            _this.ok(ret,"interfaceList");
        }
    });
    this.socketStream.on("upload",async function (stream,data) {
        let objDoc=await (doc.findOneAsync({
            _id:data.doc
        }))
        if(!objDoc)
        {
            this.throw(e.docNotFound,"文档不存在");
            return;
        }
        let objUser=await (user.findOneAsync({
            _id:data.user
        }))
        if(!objUser)
        {
            this.throw(e.userNotFound,"文档不存在");
            return;
        }
        var path=pathLib.join(con.filePath,"img",Date.now()+data.name);
        var index=path.lastIndexOf(pathLib.sep);
        index=path.lastIndexOf(pathLib.sep,index-1);
        var dbPath=path.substring(index).replace(/\\/g,"/");
        var pipe=stream.pipe(fs.createWriteStream(path));
        pipe.on("finish",async function () {
            let update={
                editor:objUser._id,
            };
            if(data.type=="img")
            {
                update["$addToSet"]={
                    img:dbPath
                }
            }
            else if(data.type=="file")
            {
                update["$addToSet"]={
                    file:dbPath
                }
            }
            await (doc.updateAsync({
                _id:objDoc._id
            },update))
            await (docProject.updateAsync({
                _id:objDoc.project
            },{
                $inc:{
                    useSize:data.size
                }
            }))
            _this.ok({
                url:dbPath,
                type:data.type,
                name:data.name
            },"upload");
        })
    })

}

function addClient(client) {
    arrClient.push(new Doc(client))
}

module.exports=addClient;