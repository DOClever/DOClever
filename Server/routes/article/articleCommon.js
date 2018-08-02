

var user=require("../../model/userModel")
var project=require("../../model/projectModel")
var article=require("../../model/articleModel")

function ArticleCommon() {
    this.save=async function (id,query) {
        let obj;
        if (id) {
            obj = await (article.findOneAndUpdateAsync({
                _id: id
            }, query, {
                new: true
            }))
        }
        else {
            obj = await (article.createAsync(query))
        }
        return obj;
    }
    this.remove=async function (id) {
        await (article.removeAsync({
            _id: id
        }));
    }
    this.info=async function (id) {
        let obj=await (article.findOneAsync({
            _id: id
        }, null, {
            populate: {
                path: "creator",
                select: "name photo"
            }
        }));
        return obj;
    }
    this.list=async function (projectId,page) {
        let arr=await (article.findAsync({
            project: projectId
        }, "-content", {
            populate: {
                path: "creator",
                select: "name photo"
            },
            sort: "-updatedAt",
            skip: 10 * page,
            limit: 10
        }));
        return arr;
    }
}

module.exports=ArticleCommon;







