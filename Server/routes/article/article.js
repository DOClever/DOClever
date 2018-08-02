/**
 * Created by sunxin on 2017/7/7.
 */


var e=require("../../util/error.json");
var util=require("../../util/util");
var article=require("./articleCommon");
var fs=require("fs");
var uuid=require("uuid/v1");

function Article()
{
    this.article=new article;
    this.save=async (req, res)=> {
        try {
            let query = {
                title: req.clientParam.title,
                content: req.clientParam.content,
                project: req.clientParam.project,
                creator: req.userInfo._id
            }
            let obj=await (this.article.save(req.clientParam.id,query));
            util.ok(res, obj, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    };

    this.remove=async (req, res)=> {
        try {
            await (this.article.remove(req.clientParam.id));
            util.ok(res, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.info=async (req, res) =>{
        try {
            let obj =await (this.article.info(req.clientParam.id));
            if (!obj) {
                util.throw(e.articleNotFound, "文档不存在");
            }
            util.ok(res, obj, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }

    this.list=async (req, res)=> {
        try {
            let arr = await (this.article.list(req.clientParam.project,req.clientParam.page));
            util.ok(res, arr, "ok");
        }
        catch (err) {
            util.catch(res, err);
        }
    }
}
module.exports=Article;









