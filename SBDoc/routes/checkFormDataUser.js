/**
 * Created by sunxin on 16/3/31.
 */
var express=require("express");
var multiparty=require("multiparty");
var user=require("../model/userModel");
var e=require("../util/error.json");
var con=require("../../config.json");
var util=require("../util/util");
function formData(path) {
    var router = util.router(path);
    if(router instanceof Array)
    {
        return router[0];
    }
    router.use(function(req,res,next)
    {
        req.arrFile=[];
        if(!(/^multipart\/form-data/i.test(req.headers["content-type"])))
        {

            next();
            return;
        }
        var form = new multiparty.Form({uploadDir: path});
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.json({
                    code:e.systemReason,
                    msg:err.message
                });
                return;
            } else {
                req.clientParam={};
                for(var index in fields)
                {
                    if(fields[index] instanceof Array)
                    {
                        req.clientParam[index]=fields[index][0];
                    }
                }
                for(var index in files)
                {
                    if(files[index] instanceof Array)
                    {
                        var path=files[index][0].path;
                        var i=path.lastIndexOf("/");
                        i=path.lastIndexOf("/",i-1);
                        path=path.substring(i);
                        files[index][0].dbPath=path;
                        req.clientParam[index]=path;
                        req.arrFile.push(files[index][0]);
                    }
                }

                next();
            }

        });

    });
    return router
}


module.exports=formData;