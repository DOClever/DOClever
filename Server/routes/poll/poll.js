/**
 * Created by sunxin on 2017/7/5.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var version=require("../../model/versionModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var poll=require("../../model/pollModel")
var testCollection=require("../../model/testCollectionModel")
var fs=require("fs");
var uuid=require("uuid/v1");
function  Poll() {
    this.save=async (req,res)=> {
        try
        {
            let objCollection=await (testCollection.findOneAsync({
                _id:req.clientParam.collection
            }));
            if(!objCollection)
            {
                util.throw(e.testCollectionNotFound,"集合不存在");
            }
            else if(objCollection.poll && req.clientParam.id  && objCollection.poll!=req.clientParam.id)
            {
                util.throw(e.systemReason,"集合已和轮询绑定");
            }
            let obj;
            let update={
                project:req.clientParam.project,
                users:JSON.parse(req.clientParam.users),
                date:JSON.parse(req.clientParam.date),
                time:JSON.parse(req.clientParam.time),
                sendInfo:{
                    user:req.clientParam.user,
                    password:req.clientParam.password,
                    smtp:req.clientParam.smtp,
                    port:req.clientParam.port
                },
                baseUrl:req.clientParam.url,
                phoneInfo:JSON.parse(req.clientParam.phoneinfo),
                failSend:req.clientParam.failsend,
                owner:req.clientParam.owner,
            }
            if(req.clientParam.interproject)
            {
                update.interProject=req.clientParam.interproject;
            }
            if(req.clientParam.id)
            {
                obj=await (poll.findOneAndUpdateAsync({
                    _id:req.clientParam.id
                },update,{
                    new:true
                }));
            }
            else
            {
                obj=await (poll.createAsync(update));
            }
            objCollection.poll=obj._id;
            await (objCollection.saveAsync());
            if(req.clientParam.immediate)
            {
                util.runPoll([obj]);
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.remove=async (req,res)=> {
        try
        {
            let query={
                _id:req.clientParam.id
            }
            await (poll.removeAsync(query))
            await (testCollection.updateAsync({
                poll:req.clientParam.id
            },{
                $unset:{
                    poll:1
                }
            }))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.info=async (req,res)=> {
        try
        {
            let query={
                _id:req.clientParam.id
            }
            let obj=await (poll.findOneAsync(query,null,{
                populate:{
                    path:"users",
                    select:"name photo"
                }
            }))
            if(!obj)
            {
                util.throw(e.pollNotFound,"轮询不存在");
            }
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}

module.exports=Poll;
