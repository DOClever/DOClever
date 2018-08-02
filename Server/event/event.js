/**
 * Created by sunxin on 2017/5/19.
 */
var schedule = require("node-schedule");
;
;
var moment=require("moment");
var fs=require("fs");
var temp=require("../model/tempModel");
var poll=require("../model/pollModel");
var test=require("../model/testModel");
var user=require("../model/userModel");
var info=require("../model/infoModel");
var con=require("../../config.json");
var util=require("../util/util");
var blue=require("bluebird");
var path = require('path');
var rule = new schedule.RecurrenceRule();
rule.minute = 30;
blue.promisifyAll(fs);
var j = schedule.scheduleJob(rule,async function(){
    try
    {
        let arr=await (temp.findAsync());
        for(let obj of arr)
        {
            let newDate=moment(obj.createdAt).add(30,"m");
            if(moment().isAfter(newDate))
            {
                let pathName=path.join(con.filePath,"temp",obj.name+".zip");
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


});

schedule.scheduleJob("0 0 0 * * *",(async function () {
    try
    {
        await (util.createStatistic());
    }
    catch (err)
    {
        console.log(err);
    }
}));

var j1=schedule.scheduleJob("0 * * * *",(async function () {
    try
    {
        let date=moment();
        let weekDay=date.weekday()-1;
        let hour=date.hour();
        let arr=await (poll.findAsync({
            date:weekDay,
            time:hour
        },null));
        await (util.runPoll(arr));
        let objInfo=await (info.findOneAsync());
        if(objInfo.db.hours.indexOf(hour)>-1)
        {
            await (util.backup(objInfo.db,objInfo.version))
        }
    }
    catch (err)
    {
        console.log(err);
    }
}));
















