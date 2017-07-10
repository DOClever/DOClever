/**
 * Created by sunxin on 2017/7/7.
 */
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var e=require("../../util/error.json");
var util=require("../../util/util");
var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var article=require("../../model/articleModel")
var fs=require("fs");
var uuid=require("uuid/v1");

function save(req,res) {
    try
    {
        let query={
            title:req.clientParam.title,
            content:req.clientParam.content,
            project:req.clientParam.project,
            creator:req.userInfo._id
        }
        let obj;
        if(req.clientParam.id)
        {
            obj=await (article.findOneAndUpdateAsync({
                _id:req.clientParam.id
            },query,{
                new:true
            }))
        }
        else
        {
            obj=await (article.createAsync(query))
        }
        util.ok(res,obj,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function remove(req,res) {
    try
    {
       await (article.removeAsync({
           _id:req.clientParam.id
       }));
       util.ok(res,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function info(req,res) {
    try
    {
        let obj=await (article.findOneAsync({
            _id:req.clientParam.id
        },null,{
            populate:{
                path:"creator",
                select:"name photo"
            }
        }));
        if(!obj)
        {
            util.throw(e.articleNotFound,"文档不存在");
        }
        util.ok(res,obj,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

function list(req,res) {
    try
    {
        let arr=await (article.findAsync({
            project:req.clientParam.project
        },"-content",{
            populate:{
                path:"creator",
                select:"name photo"
            },
            sort:"-updatedAt",
            skip:10*req.clientParam.page,
            limit:10
        }));
        util.ok(res,arr,"ok");
    }
    catch (err)
    {
        util.catch(res,err);
    }
}

exports.save=async (save);
exports.remove=async (remove)
exports.info=async (info);
exports.list=async (list);









