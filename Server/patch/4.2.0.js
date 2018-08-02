

var interface=require("../model/interfaceModel");
require("../model/groupModel")
require("../model/groupVersionModel")
var interfaceVersion=require("../model/interfaceVersionModel");
var interfaceSnapshot=require("../model/interfaceSnapshotModel");
module.exports=async function () {
    var arr=[interface,interfaceVersion,interfaceSnapshot];
    var i=0;
    for(let inter of arr)
    {
        let arrInter=await (inter.findAsync({},"",{
            populate:{
                path:"group",
                select:"project"
            }
        }))
        for(let obj of arrInter)
        {
            if(obj.group && obj.group.project && obj.group.project.toString()!=obj.project.toString())
            {
                i++;
                obj.project=obj.group.project;
                await (obj.saveAsync());
            }
        }
    }
    if(i>0)
    {
        console.log(`修复了${i}条数据`)
    }
}









