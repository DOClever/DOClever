/**
 * Created by sunxin on 2017/7/5.
 */
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var version=require("../../model/versionModel")
var group=require("../../model/groupModel")
var interface=require("../../model/interfaceModel")
var poll=require("../../model/pollModel")
var fs=require("fs");
var uuid=require("uuid/v1");
function  Poll() {
    this.save=async ((req,res)=> {
        try
        {
            let query={
                project:req.clientParam.project
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            else
            {
                query.version={
                    $exists:false
                };
            }
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
                test:JSON.parse(req.clientParam.test),
                baseUrl:req.clientParam.url
            }
            if(req.headers["docleverversion"])
            {
                update.version=req.headers["docleverversion"]
                update.testType="TestVersion"
            }
            else
            {
                update.testType="Test"
            }
            let obj=await (poll.findOneAndUpdateAsync(query,update,{
                upsert:true,
                setDefaultsOnInsert:true,
                new:true
            }));
            util.ok(res,obj,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.remove=async ((req,res)=> {
        try
        {
            let query={
                project:req.clientParam.project
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            else
            {
                query.version={
                    $exists:false
                }
            }
            await (poll.removeAsync(query))
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    })

    this.info=async ((req,res)=> {
        try
        {
            let query={
                project:req.clientParam.project
            }
            if(req.headers["docleverversion"])
            {
                query.version=req.headers["docleverversion"]
            }
            else
            {
                query.version={
                    $exists:false
                }
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
    })
}

module.exports=Poll;
