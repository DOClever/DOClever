/**
 * Created by sunxin on 2017/5/19.
 */
var schedule = require("node-schedule");
var async=require("asyncawait/async");
var await=require("asyncawait/await");
var moment=require("moment");
var fs=require("fs");
var temp=require("../model/tempModel");
var poll=require("../model/pollModel");
var test=require("../model/testModel");
var user=require("../model/userModel");
var con=require("../../config.json");
var util=require("../util/util");
var blue=require("bluebird");
var path = require('path');
var rule = new schedule.RecurrenceRule();
rule.minute = 30;
blue.promisifyAll(fs);
var j = schedule.scheduleJob(rule,async (function(){
    try
    {
        let arr=await (temp.findAsync());
        for(let obj of arr)
        {
            let newDate=moment(obj.createdAt).add(30,"m");
            if(moment().isAfter(newDate))
            {
                let pathName=path.join(con.tempPath,obj.name+".zip");
                if(await (fs.existsAsync(pathName)))
                {
                    await (fs.unlinkAsync(pathName));
                }
                await (obj.removeAsync());
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }


}));

var j1=schedule.scheduleJob("0 * * * *",(async (function () {
    try
    {
        let date=moment();
        let weekDay=date.weekday()-1;
        let hour=date.hour();
        let arr=await (poll.findAsync({
            date:weekDay,
            time:hour
        },null,{
            populate:{
                path:"project"
            }
        }));
        arr=await (poll.populateAsync(arr,{
            path:"version"
        }));
        arr=await (poll.populateAsync(arr,{
            path:"test",
        }));
        for(let obj of arr)
        {
            let root={
                output:"",
                count:obj.test.length,
                success:0,
                fail:0,
                unknown:0
            };
            for(let obj1 of obj.test)
            {
                obj1=await (test.populateAsync(obj1,{
                    path:"module"
                }))
                obj1=await (test.populateAsync(obj1,{
                    path:"group"
                }))
                let global={
                    baseUrl:obj.baseUrl,
                    before:obj.project.before,
                    after:obj.project.after
                }
                if(typeof (obj.version)=="object")
                {
                    global.before=obj.version.before;
                    global.after=obj.version.after;
                }
                try
                {
                    let ret=await (util.runTestCode(obj1.code,obj1,{},global,root))
                    if(ret===undefined)
                    {
                        root.unknown++;
                    }
                    else if(Boolean(ret)==true)
                    {
                        root.success++;
                    }
                    else
                    {
                        root.fail++;
                    }
                }
                catch (err)
                {
                    root.output+=err+"<br>"
                }
            }
            var arrPollUser=obj.users.map(function (obj) {
                return obj.toString();
            });
            var arrProjectUser=obj.project.users.map(function (obj) {
                return obj.user.toString();
            })
            arrProjectUser.unshift(obj.project.owner.toString());
            let arr=[];
            for(let u of arrPollUser)
            {
                if(arrProjectUser.indexOf(u)>-1)
                {
                    let obj=await (user.findOneAsync({
                        _id:u
                    }));
                    if(obj && obj.email)
                    {
                        arr.push(obj.email);
                    }
                }
            }
            if(arr.length>0)
            {
                let subject="[DOClever]"+moment().format("YYYY-MM-DD HH:mm:ss")+" 项目"+obj.project.name+"轮询结果";
                let content=`<h3>测试：${root.count}&nbsp;&nbsp;成功：${root.success}&nbsp;&nbsp;失败：${root.fail}&nbsp;&nbsp;未判定：${root.unknown}</h3>`+root.output;
                util.sendMail(obj.sendInfo.smtp,obj.sendInfo.port,obj.sendInfo.user,obj.sendInfo.password,arr,subject,content);
            }
        }
    }
    catch (err)
    {
        console.log(err);
    }
})));
















