/**
 * Created by sunxin on 2017/5/19.
 */
var schedule = require("node-schedule");
var async=require("asyncawait/async");
var await=require("asyncawait/await");
var moment=require("moment");
var fs=require("fs");
var temp=require("../model/tempModel");
var con=require("../../config.json");
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
