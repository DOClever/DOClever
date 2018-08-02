

var user=require("../../model/userModel")
var group=require("../../model/groupModel")
var apply=require("../../model/applyModel")
var project=require("../../model/projectModel")
var team=require("../../model/teamModel")
var teamGroup=require("../../model/teamGroupModel")
var message=require("../../model/messageModel")
var info=require("../../model/infoModel")
var util=require("../../util/util")
var request=require("request");
var fs=require("fs")
var fse=require("fs-extra")
var path=require("path")
var con=require("../../../config.json");
var uuid=require("uuid")
function UserCommon() {
    this.downloadImg=async (url)=>{
        return new Promise(function (resolve) {
            var imgPath=path.join(con.filePath,"img",uuid()+".png");
            var pipe=request(url).pipe(fs.createWriteStream(imgPath))
            pipe.on("finish",function () {
                var filePath=imgPath;
                var i=filePath.lastIndexOf(path.sep);
                i=filePath.lastIndexOf(path.sep,i-1);
                filePath=filePath.substring(i).replace(/\\/g,"/");
                resolve(filePath);
            })
        })
    }
    this.setQQImg=async (userId,url)=>{
        let imgPath=await (this.downloadImg(url));
        let obj=await (user.findOneAndUpdateAsync({
            _id:userId
        },{
            photo:imgPath
        }));
        if(obj.photo)
        {
            util.delImg(obj.photo);
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
    this.updateUser=async (name,password,id,qqId)=>{
        let obj;
        if(id)
        {
            obj= await (user.findOneAsync({
                _id:id
            },"-password -question -answer"));
        }
        else if(qqId)
        {
            obj= await (user.findOneAsync({
                qqId:qqId
            },"-password -question -answer"));
        }
        else
        {
            obj= await (user.findOneAsync({
                name:name,
                password:password
            },"-password -question -answer"));
        }
        if(obj)
        {
            obj.lastLoginDate=Date.now();
            obj.loginCount++;
            await (obj.saveAsync());
        }
        return obj;
    }
    this.getVersionInfo=async ()=>{
        let obj=await (info.findOneAsync());
        let ret={
            version:obj.version
        }
        if(await (fse.exists(path.join(__dirname,"../../resource/client.zip"))))
        {
            ret.url="/resource/client.zip";
        }
        return ret;
    }
}

module.exports=UserCommon;