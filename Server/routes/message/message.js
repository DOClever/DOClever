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
function  Message() {
    this.remove=async ((req,res)=> {
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
    })

    this.list=async ((req,res)=> {
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
    })

    this.clear=async ((req,res)=>{
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
    })

    this.newMsg=async ((req,res)=> {
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
    })
}


module.exports=Message;







