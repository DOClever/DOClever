/**
 * Created by sunxin on 16/4/16.
 */
var request=require("../third/requestAsync");
var error=require("./error.json");
var con=require("./../../config.json")
var moment=require("moment");
var event=require("events");
var express=require("express");
var fs=require("fs");
var path = require('path');
var routerMap={};
var bProduct;
function err(res,code,msg) {
    res.json({
        code:code,
        msg:msg
    })
}

function ok(res,data,msg) {
    if(!msg)
    {
        msg=data;
    }
    res.json({
        code:200,
        msg:msg,
        data:data
    })
}

function tr(type,msg) {
    var err={};
    err.type=type;
    err.msg=msg;
    throw err;
}

function stopThen() {
    var err={};
    err.stop=true;
    throw err;
}

function ch(res,e) {
    if(e.stop)
    {
        return;
    }
    else if(e.type)
    {
        err(res,e.type,e.msg);
    }
    else
    {
        console.log(e);
        err(res,error.systemReason,"服务器错误");
    }
}

function dateTrans(date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

function getImToken() {
    return request({
        method:"POST",
        url:con.imUrl+ "token",
        "body":JSON.stringify({
            "grant_type":"client_credentials",
            "client_id":con.imId,
            "client_secret":con.imSecret
        }),
        "headers":{
            "Content-Type":"application/json"
        }
    });
}

function dateDiff(startTime, endTime, diffType) {
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime);
    var eTime = new Date(endTime);
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return Math.abs(parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)));
}

function distance(lat1,lng1,lat2,lng2){
    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;

    function getRad(d){
        return d*PI/180.0;
    }
    if(Math.abs(lat1-lat2)<0.0000001 && Math.abs(lng1-lng2)<0.0000001)
    {
        return 0;
    }
    var f = getRad((lat1 + lat2)/2);
    var g = getRad((lat1 - lat2)/2);
    var l = getRad((lng1 - lng2)/2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s,c,w,r,d,h1,h2;
    var a = EARTH_RADIUS;
    var fl = 1/298.257;

    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;

    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;

    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;

    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
}

function validateArgv(count) {
    var argv=validateArgv.caller.arguments;
    if(argv.length<count)
    {
        return false;
    }
    for(var i=0;i<argv.length;i++)
    {
        if(argv[i]==null || argv[i]==undefined)
        {
            return false;
        }
    }
    return true;
}

function router(key) {
    if(routerMap[key])
    {
        return [routerMap[key]];
    }
    else
    {
        var r=express.Router();
        routerMap[key]=r;
        return r;
    }
}

function date(time) {
    let date1=moment(time).toDate();
    let date2=moment().toDate();
    let date3=date2.getTime()-date1.getTime()
    let day=Math.floor(date3/(24*3600*1000));
    let str,date;
    if(day==0)
    {
        str=""
        let sec=Math.floor(date3/(1000));
        if(sec/3600>=1)
        {
            date=Math.floor(sec/3600)+"小时前";
        }
        else if(sec/60>=1)
        {
            date=Math.floor(sec/60)+"分钟前";
        }
        else
        {
            date="刚刚";
        }
    }
    else if(day==1)
    {
        str="昨天 "
        date=moment(time).format("HH:mm");
    }
    else if(day==2)
    {
        str="前天 "
        date=moment(time).format("HH:mm");
    }
    else
    {
        str=""
        date=moment(time).format("MM-DD");
    }
    return str+date;
}

function validateParam(val,validate) {
    if(Number.isInteger(val))
    {
        if(validate["value"])
        {
            let value=validate["value"];
            let max=validate["value"]["lt"];
            let min=validate["value"]["gt"];
            let maxe=validate["value"]["lte"];
            let mine=validate["value"]["gte"];
            if(max && val>=max)
            {
                return false;
            }
            if(min && val<=min)
            {
                return false;
            }
            if(maxe && val>maxe)
            {
                return false;
            }
            if(mine && val<mine)
            {
                return false;
            }
        }
    }
    else
    {
        if(validate["length"])
        {
            let len=val.toString().length;
            let value=validate["length"];
            if(typeof(value)=="number")
            {
                if(len!=value)
                {
                    return false;
                }
            }
            else
            {
                let max=validate["length"]["lt"];
                let min=validate["length"]["gt"];
                let maxe=validate["length"]["lte"];
                let mine=validate["length"]["gte"];
                if(max && len>=max)
                {
                    return false;
                }
                if(min && len<=min)
                {
                    return false;
                }
                if(maxe && len>maxe)
                {
                    return false;
                }
                if(mine && len<mine)
                {
                    return false;
                }
            }
        }
    }
    if(validate["in"] && validate["in"].indexOf(val)==-1)
    {
        return false;
    }
    return true;
}

function  delImg(path) {
    if(path)
    {
        fs.exists(con.filePath+path,function (exist) {
            if(exist)
            {
                fs.unlink(con.filePath+path);
            }
        })
    }
}

function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

function next() {
    let n=next.caller.arguments[2];
    if(n)
    {
        n.go=1;
    }
}



(function () {
    var ip=getIPAdress();
    if(ip.startsWith("123.") || ip.startsWith("120.") || ip.startsWith("10."))
    {
         bProduct=true;
    }
    else
    {
        bProduct=false;
    }
})();

function convertToJSON(data,obj) {
    var mock=function (data) {
        if(!data.mock || data.mock.trim()[0]!="@")
        {
            if(data.type==0)
            {
                if(data.mock)
                {
                    return data.mock.trim()
                }
                else
                {
                    return "mock"
                }
            }
            else if(data.type==1)
            {
                if(data.mock)
                {
                    return parseFloat(data.mock.trim())
                }
                else
                {
                    return 1
                }
            }
            else if(data.type==2)
            {
                if(data.mock)
                {
                    return Boolean(data.mock.trim())
                }
                else
                {
                    return true
                }
            }
        }
        else
        {
            let str=data.mock.trim().substr(1);
            if(str.startsWith("date"))
            {
                return moment().format("YYYY-MM-DD HH:mm:ss");
            }
            else if(str.startsWith("img"))
            {
                return "https://dummyimage.com/600x400/"+Math.round(Math.random()*999);
            }
            else if(str.startsWith("num"))
            {
                let val=str.substring(4,str.length-1);
                let arr=val.split(",");
                let gap=parseInt(arr[1])-parseInt(arr[0]);
                let temp=Math.round(Math.random()*gap+parseInt(arr[0]));
                if(data.type==1)
                {
                    return temp;
                }
                else
                {
                    return String(temp);
                }
            }
            else if(str.startsWith("in"))
            {
                let val=str.substring(3,str.length-1);
                let arr=val.split(",");
                let temp=Math.round(Math.random()*(arr.length-1));
                temp=arr[temp];
                if(data.type==0)
                {
                    return String(temp);
                }
                else if(data.type==1)
                {
                    return parseFloat(temp);
                }
                else (data.type==2)
                {
                    return Boolean(temp);
                }
            }
        }
        return data.mock?data.mock.trim():null;
    }
    var func=function (data,obj) {
        if(data.type==0)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==1)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==2)
        {
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(mock(data));
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=mock(data);
            }
        }
        else if(data.type==3)
        {
            var objTemp=[];
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(objTemp);
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=objTemp;
            }
            for(var i=0;i<data.data.length;i++)
            {
                func(data.data[i],objTemp);
            }
        }
        else if(data.type==4)
        {
            var objTemp={};
            if(typeof(obj)=="object" && (obj instanceof  Array))
            {
                obj.push(objTemp);
            }
            else if(typeof(obj)=="object" && !(obj instanceof  Array))
            {
                obj[data.name]=objTemp;
            }
            for(var i=0;i<data.data.length;i++)
            {
                func(data.data[i],objTemp);
            }
        }
    }
    for(var i=0;i<data.length;i++)
    {
        func(data[i],obj);
    }
}

function mock(data) {
    if(!data || data.trim()[0]!="@")
    {
        if(data)
        {
            return data.trim();
        }
        else
        {
            return "mock"
        }
    }
    else
    {
        var str=data.trim().substr(1);
        if(/^date/i.test(str))
        {
            return moment().format("YYYY-MM-DD HH:mm:ss");
        }
        else if(/^img/i.test(str))
        {
            return "https://dummyimage.com/600x400/"+Math.round(Math.random()*999);
        }
        else if(/^num/i.test(str))
        {
            var val=str.substring(4,str.length-1);
            var arr=val.split(",");
            var gap=parseInt(arr[1])-parseInt(arr[0]);
            var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
            return String(temp);
        }
        else if(/^in/i.test(str))
        {
            var val=str.substring(3,str.length-1);
            var arr=val.split(",");
            var temp=Math.round(Math.random()*(arr.length-1));
            temp=arr[temp];
            return String(temp);
        }
    }
    return data?data.trim():null;
}

function createDir(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if(!dirname)
            {
                pathtmp=path.sep;
                return;
            }
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}

exports.err=err;
exports.ok=ok;
exports.dateDiff=dateDiff;
exports.throw=tr;
exports.stopThen=stopThen;
exports.catch=ch;
exports.token=getImToken;
exports.distance=distance;
exports.dateTrans=dateTrans;
exports.event=new event.EventEmitter();
exports.validateArgv=validateArgv;
exports.router=router;
exports.date=date;
exports.bProduct=bProduct;
exports.validateParam=validateParam;
exports.delImg=delImg;
exports.next=next;
exports.convertToJSON=convertToJSON;
exports.mock=mock;
exports.createDir=createDir;