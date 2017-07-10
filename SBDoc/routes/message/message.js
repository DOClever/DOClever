/**
 * Created by sunxin on 2017/7/7.
 */
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var message=require("../../model/messageModel")
var fs=require("fs");
var uuid=require("uuid/v1");

function remove(req,res) {
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

function list(req,res) {
    try
    {
        let arr=await (message.findAsync({
            user:req.userInfo._id
        },"-content",{
            populate:{
                path:"creator",
                select:"name photo"
            },
            sort:"-updatedAt",
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

function clear(req,res) {
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

function newMsg(req,res) {
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

exports.remove=async (remove)
exports.list=async (list);
exports.clear=async (clear);
exports.newMsg=async (newMsg);







