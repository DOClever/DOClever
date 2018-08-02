/**
 * Created by sunxin on 2017/7/7.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var message=require("../../model/messageModel")
var apply=require("../../model/applyModel")
var team=require("../../model/teamModel")
var docProject=require("../../model/docProjectModel")
var testProject=require("../../model/testProjectModel")
var fs=require("fs");
var uuid=require("uuid/v1");
function  Message() {
    this.remove=async (req,res)=> {
        try
        {
            await (message.removeAsync({
                _id:req.clientParam.id
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.list=async (req,res)=> {
        try
        {
            let arr=await (message.findAsync({
                user:req.userInfo._id
            },"-content",{
                populate:{
                    path:"creator",
                    select:"name photo"
                },
                sort:"-createdAt",
                skip:10*req.clientParam.page,
                limit:10
            }));
            await (message.updateAsync({
                user:req.userInfo._id
            },{
                read:1
            },{
                multi:true
            }))
            util.ok(res,arr,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.clear=async (req,res)=>{
        try
        {
            await (message.removeAsync({
                user:req.userInfo._id
            }));
            util.ok(res,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }

    this.newMsg=async (req,res)=> {
        try
        {
            let obj=await (message.findOneAsync({
                user:req.userInfo._id,
                read:0
            }))
            util.ok(res,obj?1:0,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
    this.applyList=async (req,res)=>{
        try
        {
            let ret={
                teamPullUser:[],
                teamPullProject:[],
                userApplyTeam:[],
                projectApplyTeam:[]
            }
            let arr=await (apply.findAsync({
                to:req.userInfo._id,
                type:0,
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
            let arrDel=[];
            arr=arr.filter(function (obj) {
                if(obj.from)
                {
                    return true;
                }
                else
                {
                    arrDel.push(obj);
                    return false;
                }
            })
            for(let o of arrDel)
            {
                await (o.removeAsync());
            }
            ret.teamPullUser=arr;
            let arrProject=await (project.findAsync({
                owner:req.userInfo._id
            }))
            arrProject=arrProject.map(function (obj) {
                return obj._id.toString()
            })
            let arrTemp=await (docProject.findAsync({
                owner:req.userInfo._id
            }))
            arrTemp=arrTemp.map(function (obj) {
                return obj._id.toString()
            })
            arrProject=arrProject.concat(arrTemp);
            arrTemp=await (testProject.findAsync({
                owner:req.userInfo._id
            }))
            arrTemp=arrTemp.map(function (obj) {
                return obj._id.toString()
            })
            arrProject=arrProject.concat(arrTemp);
            arr=await (apply.findAsync({
                to:{
                    $in:arrProject
                },
                type:{
                    $in:[1,4,6]
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
            arrDel=[];
            arr=arr.filter(function (obj) {
                if(obj.from && obj.to)
                {
                    return true;
                }
                else
                {
                    arrDel.push(obj);
                    return false;
                }
            })
            for(let o of arrDel)
            {
                await (o.removeAsync());
            }
            ret.teamPullProject=arr;
            let arrTeam=await (team.findAsync({
                owner:req.userInfo._id
            }))
            arrTeam=arrTeam.map(function (obj) {
                return obj._id.toString()
            })
            arr=await (apply.findAsync({
                to:{
                    $in:arrTeam
                },
                type:{
                    $in:[2,3,5,7]
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
            arrDel=[];
            arr=arr.filter(function (obj) {
                if(obj.from && obj.to)
                {
                    return true;
                }
                else
                {
                    arrDel.push(obj);
                    return false;
                }
            })
            for(let o of arrDel)
            {
                await (o.removeAsync());
            }
            arr.forEach(function (obj) {
                if(obj.type==2)
                {
                    ret.userApplyTeam.push(obj);
                }
                else if(obj.type==3 || obj.type==5 || obj.type==7)
                {
                    ret.projectApplyTeam.push(obj);
                }
            })
            util.ok(res,ret,"ok");
        }
        catch (err)
        {
            util.catch(res,err);
        }
    }
}


module.exports=Message;







