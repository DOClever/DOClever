/**
 * Created by sunxin on 16/4/16.
 */
var request=require("../third/requestAsync");
var error=require("./error.json");
var moment=require("moment");
var event=require("events");
var express=require("express");
var fs=require("fs");
var path = require('path');


var CryptoJS=require("crypto-js")
var request=require("../third/requestAsync");
var mongoose = require('mongoose');
var mail=require("nodemailer");
var readline=require("readline");
var dom = require("jsdom").JSDOM;
var window=(new dom(`...`)).window;
var document=window.document;
var argv=require("yargs").argv;
var URL=require("url");
var mockjs=require("mockjs");
var blue=require("bluebird");
var fsAsync=blue.promisifyAll(fs);
var child_process=blue.promisifyAll(require("child_process"));
require("./Base64")
var uuid=require("uuid");
var testModel=null;
var statusModel=null;
var statusVersionModel=null;
var projectModel=null;
var versionModel=null;
var exampleModel=null;
var routerMap={};
var bProduct;
var con;
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

function  delImg(filePath) {
    if(filePath)
    {
        fs.access(con.filePath+filePath.replace(/\//g,path.sep),fs.constants.F_OK,function (err) {
            if(!err)
            {
                fs.unlink(con.filePath+filePath);
            }
        })
    }
}

let existAsync=function (filePath) {
    return new Promise(function (resolve) {
        fs.access(con.filePath+filePath.replace(/\//g,path.sep),fs.constants.F_OK,function (err) {
            if(!err)
            {
                resolve(1);
            }
            else
            {
                resolve(0);
            }
        })
    })
}

let getFileSize=async function (filePath) {
    let size=0;
    if(!filePath)
    {
        return size;
    }
    let bExist=await (existAsync(filePath));
    if(bExist)
    {
        let obj=await (fsAsync.statAsync(con.filePath+filePath.replace(/\//g,path.sep)));
        if(obj)
        {
            size+=obj.size;
        }
    }
    return size;
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

function convertToJSON(data,obj,info) {
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
                    return Boolean(eval(data.mock.trim()))
                }
                else
                {
                    return true
                }
            }
            else if(data.type==5)
            {
                if(data.mock)
                {
                    return data.mock.trim();
                }
                else
                {
                    return "mixed"
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
                var val=str.length==3?"":str.substring(4,str.length-1),arr;
                if(val)
                {
                    arr=val.split(",");
                }
                return "https://dummyimage.com/"+(arr?(arr[0]+"x"+arr[1]+"/"):"600x400/")+Math.round(Math.random()*999);
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
                if(data.type==0 || data.type==5)
                {
                    return String(temp);
                }
                else if(data.type==1)
                {
                    return parseFloat(temp);
                }
                else if(data.type==2)
                {
                    return Boolean(eval(temp));
                }
            }
            else if(str.startsWith("arr"))
            {
                var val=str.substring(4,str.length-1).trim();
                if(data.type==5)
                {
                    if(val.length>0)
                    {
                        var arr;
                        try
                        {
                            arr=eval(val);
                        }
                        catch (err)
                        {
                            arr=[];
                        }
                        if(!(arr instanceof  Array))
                        {
                            arr=[];
                        }
                        return arr;
                    }
                    else
                    {
                        return [];
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(str.startsWith("obj"))
            {
                var val=str.substring(4,str.length-1).trim();
                if(data.type==5)
                {
                    if(val.length>0)
                    {
                        var obj;
                        try
                        {
                            obj=eval("("+val+")");
                        }
                        catch (err)
                        {
                            obj={};
                        }
                        if(!(obj instanceof  Object))
                        {
                            obj={};
                        }
                        return obj;
                    }
                    else
                    {
                        return {};
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(str.startsWith("null"))
            {
                return null;
            }
            else if(str.startsWith("code"))
            {
                var val=str.substring(5,str.length-1).trim();
                if(info)
                {
                    try
                    {
                        var ret=(function (param,query,header,body,global) {
                            return eval("("+val+")");
                        })(info.param,info.query,info.header,info.body,info.global)
                        if(data.type==0)
                        {
                            return String(ret);
                        }
                        else if(data.type==1)
                        {
                            return parseFloat(ret);
                        }
                        else if(data.type==2)
                        {
                            return Boolean(eval(ret));
                        }
                        else if(data.type==5)
                        {
                            return ret;
                        }
                    }
                    catch (err)
                    {
                        console.log("execute err:"+err);
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            else if(str.startsWith("mj"))
            {
                var val=str.substring(3,str.length-1).trim();
                if(val[0]=="@")
                {
                    return mockjs.mock(val);
                }
                else
                {
                    var obj=eval("("+val+")");
                    if(typeof(obj)=="object")
                    {
                        var objNew={};
                        for(var key in obj)
                        {
                            objNew["mock|"+key]=obj[key];
                        }
                        var ret=mockjs.mock(objNew);
                        for(var key in ret)
                        {
                            return ret[key];
                        }

                    }
                    else
                    {
                        return val;
                    }
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
            var str=data.mock.trim().substr(1),count=1;
            if(/^count/i.test(str))
            {
                var val=str.substring(6,str.length-1);
                var arr=val.split(",");
                var gap=parseInt(arr[1])-parseInt(arr[0]);
                var temp=Math.round(Math.random()*gap+parseInt(arr[0]));
                count=temp;
            }
            for(var j=0;j<count;j++)
            {
                for(var i=0;i<data.data.length;i++)
                {
                    func(data.data[i],objTemp);
                }
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
        else if(data.type==5)
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
    }
    for(var i=0;i<data.length;i++)
    {
        func(data[i],obj);
    }
}

function mock(data,info) {
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
            var val=str.length==3?"":str.substring(4,str.length-1),arr;
            if(val)
            {
                arr=val.split(",");
            }
            return "https://dummyimage.com/"+(arr?(arr[0]+"x"+arr[1]+"/"):"600x400/")+Math.round(Math.random()*999);
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
        else if(/^arr/i.test(str))
        {
            var val=str.substring(4,str.length-1).trim();
            if(val.length>0)
            {
                return val;
            }
            else
            {
                return "[]";
            }
        }
        else if(/^obj/i.test(str))
        {
            var val=str.substring(4,str.length-1).trim();
            if(val.length>0)
            {
                return val;
            }
            else
            {
                return "{}";
            }
        }
        else if(/^null/i.test(str))
        {
            return "null";
        }
        else if(/^code/i.test(str))
        {
            var val=str.substring(5,str.length-1).trim();
            if(info)
            {
                try
                {
                    return (function (param,query,header,body,global) {
                        return eval("("+val+")");
                    })(info.param,info.query,info.header,info.body,info.global)
                }
                catch (err)
                {
                    console.log("execute err:"+err);
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        else if(/^mj/i.test(str))
        {
            var val=str.substring(3,str.length-1).trim();
            if(val[0]=="@")
            {
                return mockjs.mock(val);
            }
            else
            {
                var obj=eval("("+val+")");
                if(typeof(obj)=="object")
                {
                    var objNew={};
                    for(var key in obj)
                    {
                        objNew["mock|"+key]=obj[key];
                    }
                    var ret=mockjs.mock(objNew);
                    for(var key in ret)
                    {
                        return ret[key];
                    }

                }
                else
                {
                    return val;
                }
            }
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
        console.log("目录创建成功");
    }
    return true;
}

function handleMockInfo(param,query,body,header,objInterface,url) {
    var info={
        param:param,
        query:query,
        header:header,
        body:body,
        global:{}
    };
    info.global={
        name:objInterface.name,
        baseurl:url.substring(0,url.indexOf(objInterface.url)),
        path:objInterface.url,
        method:objInterface.method
    }
    return info;
}

function inArrKey(str,arr,key) {
    for(var i=0;i<arr.length;i++)
    {
        if(str.toLowerCase()==arr[i][key].toLowerCase())
        {
            return i;
        }
    }
    return -1;
}

var resultSave=function (data,json,globalVar) {
    var arr=[];
    for(var i=0;i<data.length;i++)
    {
        eachResult(data[i],data[i].name===null?{type:3}:null,arr,json,globalVar);
    }
    return arr;
}

var eachResult=function (item,pItem,arr,json,globalVar) {
    if(item.name || (!item.name && pItem && pItem.type==3))
    {
        var obj={
            name:item.name,
            type:item.type,
            remark:item.remark,
            must:item.must,
            mock:globalVar?exports.handleGlobalVar(item.mock,globalVar):item.mock
        }
        if(json)
        {
            if(item.value)
            {
                if(item.value.type==0)
                {
                    var v=item.mock,bFind=false;
                    item.value.data.forEach(function (o) {
                        if(o.value==v)
                        {
                            bFind=true;
                        }
                    })
                    if(!bFind)
                    {
                        item.value.data.push({
                            value:v,
                            remark:""
                        });
                    }
                }
            }
            else
            {
                obj.value={
                    type:0,
                    status:"",
                    data:[{
                        value:item.mock,
                        remark:""
                    }]
                }
            }
        }
        if(item.status)
        {
            obj.status=item.status;
        }
        arr.push(obj)
        if(item.type==3 || item.type==4)
        {
            obj.data=[];
            for(var i=0;i<item.data.length;i++)
            {
                arguments.callee(item.data[i],item,obj.data,json,globalVar)
            }
        }
    }
}

var param=function (obj,bKey) {
    var arr=[];
    for(var key in obj)
    {
        arr.push((bKey?encodeURIComponent(key):key)+"="+encodeURIComponent(obj[key]));
    }
    return arr.join("&");
}

var clone=function(o){
    var k, ret= o, b;
    if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
        ret = b ? [] : {};
        for(k in o){
            if(o.hasOwnProperty(k)){
                ret[k] = arguments.callee(o[k]);
            }
        }
    }
    return ret;
}

var inArr=function (str,arr) {
    for(var i=0;i<arr.length;i++)
    {
        if(str.toLowerCase()==arr[i].toLowerCase())
        {
            return true;
        }
    }
    return false;
}

var encrypt=function (type,val,salt) {
    if(!val)
    {
        return ""
    }
    var arr=["Base64","MD5","SHA-1","SHA-256","SHA-512","SHA-3","RIPEMD-160"];
    var arrFunc=[BASE64.encoder,CryptoJS.MD5,CryptoJS.SHA1,CryptoJS.SHA256,CryptoJS.SHA512,CryptoJS.SHA3,CryptoJS.RIPEMD160]
    var arrSalt=["AES","TripleDES","DES","Rabbit","RC4","RC4Drop"];
    var arrSaltFunc=[CryptoJS.AES.encrypt,CryptoJS.TripleDES.encrypt,CryptoJS.DES.encrypt,CryptoJS.Rabbit.encrypt,CryptoJS.RC4.encrypt,CryptoJS.RC4Drop.encrypt];
    var index=arr.indexOf(type);
    if(index>-1)
    {
        return arrFunc[index](val).toString();
    }
    index=arrSalt.indexOf(type);
    if(index>-1)
    {
        return arrSaltFunc[index](val,salt).toString();
    }
    return val;
}


var runBefore=function (code,url,path,method,query,header,body,param) {
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    try
    {
        if(code)
        {
            eval(code);
        }
    }
    catch (err)
    {
        console.log("Before Error:"+err);
    }
}

var runAfter=function (code,status,header,data) {
    try
    {
        if(code)
        {
            eval(code);
        }
    }
    catch (err)
    {
        console.log("After Error:"+err);
    }
}

var runTest=async function (obj,global,test,root,opt) {
    root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]开始运行接口："+obj.name+"<br>"
    var name=obj.name
    var method=obj.method;
    var baseUrl=obj.baseUrl=="defaultUrl"?global.baseUrl:obj.baseUrl;
    var globalVar={};
    global.baseUrls.forEach(function (obj) {
        if(obj.url==baseUrl && obj.env)
        {
            obj.env.forEach(function (obj) {
                globalVar[obj.key]=obj.value;
            })
        }
    })
    if(!baseUrl)
    {
        root.output+="baseUrl为空，请设置baseUrl<br>"
        return {};
    }
    var path=obj.url;
    var indexHttp=baseUrl.indexOf("://"),indexSlash;
    if(indexHttp==-1)
    {
        indexSlash=baseUrl.indexOf("/")
    }
    else
    {
        indexSlash=baseUrl.indexOf("/",indexHttp+3);
    }
    if(indexSlash>-1)
    {
        var baseUrlTemp=baseUrl.substring(0,indexSlash);
        var pathTemp=baseUrl.substr(indexSlash);
        if(pathTemp[pathTemp.length-1]=="/" && path[0]=="/")
        {
            pathTemp=pathTemp.substr(0,pathTemp.length-1);
        }
        else if(pathTemp[pathTemp.length-1]!="/" && path[0]!="/" && pathTemp.indexOf("?")==-1 && pathTemp.indexOf("#")==-1)
        {
            pathTemp+="/"
        }
        baseUrl=baseUrlTemp;
        path=pathTemp+path;
    }
    else
    {
        if(path[0]!="/")
        {
            path="/"+path;
        }
    }
    path=exports.handleGlobalVar(path,globalVar);
    if(path.substr(0,2)=="//")
    {
        path=path.substr(1);
    }
    var objParam=clone(obj.restParam);
    var param1={};
    objParam.forEach(function (obj) {
        param1[obj.name]=exports.handleGlobalVar(obj.selValue,globalVar);
    })
    var query={};
    obj.queryParam.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=encrypt(obj.encrypt.type,exports.handleGlobalVar(obj.selValue,globalVar),obj.encrypt.salt);
            var key=obj.name;
            if(obj.encrypt.key)
            {
                key=encrypt(obj.encrypt.type,key,obj.encrypt.salt);
            }
            query[key]=value;
        }
        else
        {
            query[obj.name]=exports.handleGlobalVar(obj.selValue,globalVar);
        }
    })
    if(obj.pullInject)
    {
        if(opt && opt.query)
        {
            Object.assign(query,opt.query);
        }
    }
    var header={};
    obj.header.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=encrypt(obj.encrypt.type,exports.handleGlobalVar(obj.value,globalVar),obj.encrypt.salt);
            var key=obj.name;
            header[key]=value;

        }
        else
        {
            header[obj.name]=exports.handleGlobalVar(obj.value,globalVar);

        }
    })
    if(obj.pullInject)
    {
        if(opt && opt.header)
        {
            for(var key in opt.header)
            {
                header[key]=opt.header[key];
            }
        }
    }
    var body={},bUpload=false;
    if(method=="POST" || method=="PUT" || method=="PATCH")
    {
        if(obj.bodyInfo.type==0)
        {
            for(var i=0;i<obj.bodyParam.length;i++)
            {
                var obj1=obj.bodyParam[i];
                if(!obj1.name || !obj1.enable)
                {
                    return;
                }
                if(obj1.type==0)
                {
                    if(obj1.encrypt && obj1.encrypt.type)
                    {
                        var value=encrypt(obj1.encrypt.type,exports.handleGlobalVar(obj1.selValue,globalVar),obj1.encrypt.salt);
                        var key=obj1.name;
                        if(obj1.encrypt.key)
                        {
                            key=encrypt(obj1.encrypt.type,key,obj1.encrypt.salt);
                        }
                        body[key]=value;
                    }
                    else
                    {
                        body[obj1.name]=exports.handleGlobalVar(obj1.selValue,globalVar);
                    }
                }
                else if(obj1.type==1)
                {
                    var startDate=new Date();
                    body[obj1.name]="";
                }
            }
        }
        else
        {
            if(obj.bodyInfo.rawType==0)
            {
                var encryptType=obj.encrypt.type;
                if(encryptType)
                {
                    body=encrypt(encryptType,exports.handleGlobalVar(obj.bodyInfo.rawText,globalVar),obj.encrypt.salt)
                }
                else
                {
                    body=exports.handleGlobalVar(obj.bodyInfo.rawText,globalVar);
                }
            }
            else if(obj.bodyInfo.rawType==2)
            {
                var obj1={};
                var result=resultSave(obj.bodyInfo.rawJSON,0,globalVar);
                convertToJSON(result,obj1,null,1);
                body=obj1;
            }
            else
            {
                var startDate=new Date();
                body="";
            }
        }
    }
    if(obj.pullInject)
    {
        if((method=="POST" || method=="PUT" || method=="PATCH") && obj.bodyInfo)
        {
            if(obj.bodyInfo.type==0)
            {
                if(opt && opt.body)
                {
                    Object.assign(body,opt.body);
                }
            }
            else
            {
                if(obj.bodyInfo.rawType==0)
                {
                    if(opt && opt.body!==undefined)
                    {
                        body=opt.body;
                    }
                }
                else if(obj.bodyInfo.rawType==2)
                {
                    if(opt && opt.body)
                    {
                        for(var key in opt.body)
                        {
                            var val=opt.body[key];
                            var arr=key.split(".");
                            if(arr.length>1)
                            {
                                var obj1=body;
                                for(var i=0;i<arr.length;i++)
                                {
                                    var key1=arr[i];
                                    if(i!=arr.length-1)
                                    {
                                        if(obj1[key1]!==undefined)
                                        {
                                            obj1=obj1[key1];
                                        }
                                        else
                                        {
                                            obj1=obj1[key1]={};
                                        }
                                    }
                                    else
                                    {
                                        obj1[key1]=val;
                                    }
                                }
                            }
                            else
                            {
                                body[key]=val;
                            }
                        }
                    }
                    body=JSON.stringify(body);
                }
            }
        }
    }
    if(obj.before.mode==0)
    {
        if(global.before)
        {
            runBefore(global.before,baseUrl,path,method,query,header,body,param1)
        }
        runBefore(obj.before.code,baseUrl,path,method,query,header,body,param1)
    }
    else
    {
        runBefore(obj.before.code,baseUrl,path,method,query,header,body,param1)
    }
    if(opt && opt.param)
    {
        for(var key in opt.param)
        {
            var val=opt.param[key];
            param1[key]=val;
        }
    }
    for(var paramKey in param1)
    {
        path=path.replace("{"+paramKey+"}",param1[paramKey])
    }
    if(!obj.pullInject)
    {
        if(opt && opt.param)
        {
            for(var key in opt.param)
            {
                var val=opt.param[key];
                param[key]=val;
            }
        }
        for(var paramKey in param)
        {
            path=path.replace("{"+paramKey+"}",param[paramKey])
        }
        if(opt && opt.query)
        {
            Object.assign(query,opt.query);
        }
        if(opt && opt.header)
        {
            for(var key in opt.header)
            {
                header[key]=opt.header[key];
            }
        }
        if((method=="POST" || method=="PUT" || method=="PATCH") && obj.bodyInfo)
        {
            if(obj.bodyInfo.type==0)
            {
                if(opt && opt.body)
                {
                    Object.assign(body,opt.body);
                }
            }
            else
            {
                if(obj.bodyInfo.rawType==0)
                {
                    if(opt && opt.body!==undefined)
                    {
                        body=opt.body;
                    }
                }
                else if(obj.bodyInfo.rawType==2)
                {
                    if(opt && opt.body)
                    {
                        for(var key in opt.body)
                        {
                            var val=opt.body[key];
                            var arr=key.split(".");
                            if(arr.length>1)
                            {
                                var obj1=body;
                                for(var i=0;i<arr.length;i++)
                                {
                                    var key1=arr[i];
                                    if(i!=arr.length-1)
                                    {
                                        if(obj1[key1]!==undefined)
                                        {
                                            obj1=obj1[key1];
                                        }
                                        else
                                        {
                                            obj1=obj1[key1]={};
                                        }
                                    }
                                    else
                                    {
                                        obj1[key1]=val;
                                    }
                                }
                            }
                            else
                            {
                                body[key]=val;
                            }
                        }
                    }
                    body=JSON.stringify(body);
                }
            }
        }
    }
    else
    {
        for(var paramKey in param)
        {
            path=path.replace("{"+paramKey+"}",param[paramKey])
        }
    }
    query=param(query);
    if(query.length>0)
    {
        path=path+"?"+query;
    }
    let cookie=header["cookie"] || header["Cookie"];
    if(cookie)
    {
        let arr=cookie.split(";");
        let objCookie={};
        arr.forEach(function (obj) {
            let arr1=obj.split("=");
            objCookie[arr1[0]]=arr1[1];
        })
        for(let key in objCookie)
        {
            root.cookie[key]=objCookie[key];
        }
    }
    let strCookie="",arrCookie=[];
    for(let key in root.cookie)
    {
        arrCookie.push(key+"="+root.cookie[key]);
    }
    strCookie=arrCookie.join(";");
    header["Cookie"]=strCookie
    var startDate=new Date();
    var func;
    var objReq={
        url:baseUrl+path,
        method:method,
        headers:header
    }
    if(method=="POST" || method=="PUT" || method=="PATCH")
    {
        if(obj.bodyInfo.type==0)
        {
            objReq.form=body;
        }
        else
        {
            if(obj.bodyInfo.rawType==0)
            {
                objReq.body=body;
            }
            else if(obj.bodyInfo.rawType==1)
            {
                objReq.body=body;
            }
            else if(obj.bodyInfo.rawType==2)
            {
                objReq.body=body;
            }
        }
    }
    func=request(objReq);
    return func.then(function (result) {
        var res={}
        res.header=result.headers;
        res.status=String(result.statusCode);
        res.second=(((new Date())-startDate)/1000).toFixed(3);
        var body=result.body;
        if(typeof (body)=="string")
        {
            try
            {
                body=JSON.parse(result.body);
            }
            catch (err)
            {
                body=result.body;
            }
        }
        res.type=typeof (body);
        res.data=body;
        if(obj.after.mode==0)
        {
            if(global.after)
            {
                runAfter(global.after,res.status,res.header,res.data)
            }
            runAfter(obj.after.code,res.status,res.header,res.data)
        }
        else
        {
            runAfter(obj.after.code,res.status,res.header,res.data)
        }
        root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]结束运行接口："+obj.name+"(耗时：<span style='color: green'>"+res.second+"秒</span>)<br>"
        let cookies = res.header["set-cookie"];
        if (cookies) {
            for (let index in cookies) {
                let cookie = cookies[index];
                let realOfCookie = cookie.split(";")[0];
                let obj=realOfCookie.split("=");
                let key=obj[0].trim();
                let val=encodeURIComponent(obj[1]);
                root.cookie[key]=val;
            }
        }
        return res;
    }).catch(function (err) {
        root.output+=err.message+"<br>";
        root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]结束运行接口："+obj.name+"(耗时：<span style='color: green'>"+(((new Date())-startDate)/1000).toFixed(3)+"秒</span>)<br>"
        return {
            status:200,
            header:{},
            data:err
        }
    })
}

var runTestCode=async function (code,test,global,opt,root,argv,mode,__id,level) {
    if(!testModel)
    {
        testModel=require("../model/testModel");
    }
    if(!projectModel)
    {
        projectModel=require("../model/projectModel");
    }
    if(!versionModel)
    {
        versionModel=require("../model/versionModel");
    }
    if(!exampleModel)
    {
        exampleModel=require("../model/exampleModel");
    }
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    if(!global)
    {
        global={};
    }
    var env={};
    if(!root.cookie)
    {
        root.cookie={};
    }
    function log(text) {
        if(typeof(text)=="object")
        {
            text=JSON.stringify(text).replace(/\s/g,"&nbsp;");
        }
        root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]"+text+"<br>";
    }
    function __assert(val,id,title) {
        if(level==0)
        {
            log("断言:"+title+"("+(val?("<span style='color: green'>通过</span>"):("<span style='color: red'>不通过</span>"))+")")
        }
    }
    var ele=document.createElement("div");
    ele.innerHTML=code;
    var arr=ele.getElementsByTagName("a");
    var arrNode=[];
    for(var i=0;i<arr.length;i++)
    {
        var obj=arr[i].getAttribute("data");
        var type=arr[i].getAttribute("type");
        var objId=arr[i].getAttribute("varid");
        var text;
        if(type=="1")
        {
            let objInfo={};
            let o=JSON.parse(obj.replace(/\r|\n/g,""));
            let query={
                project:o.project._id
            }
            if(o.version)
            {
                query.version=o.version;
            }
            let bFind=false;
            for(let j=0;j<root.projectInfo.length;j++)
            {
                let objProjectInfo=root.projectInfo[j];
                if(objProjectInfo.project==query.project && objProjectInfo.version==query.version)
                {
                    objInfo=objProjectInfo;
                    bFind=true;
                    break;
                }
            }
            if(!bFind)
            {
                objInfo=await (projectModel.findOneAsync({
                    _id:query.project
                },"baseUrls after before"));
                if(!objInfo)
                {
                    objInfo={
                        baseUrls:[],
                        before:"",
                        after:""
                    }
                }
                if(query.version)
                {
                    let objVersion=await (versionModel.findOneAsync({
                        _id:query.version
                    },"baseUrls after before"));
                    if(!objVersion)
                    {
                        continue;
                    }
                    objInfo=objVersion;
                }
                let objPush={
                    baseUrls:objInfo.baseUrls,
                    before:objInfo.before,
                    after:objInfo.after,
                    project:query.project
                }
                if(query.version)
                {
                    objPush.version=query.version;
                }
                root.projectInfo.push(objPush);
            }
            if(o.example)
            {
                try
                {
                    let objExample=await (exampleModel.findOneAsync({
                        _id:o.example
                    },"param"));
                    updateTestInterfaceWithExample(o,objExample.param);
                    obj=JSON.stringify(o);
                }
                catch (err)
                {

                }
            }
            opt.baseUrls=objInfo.baseUrls;
            opt.before=objInfo.before;
            opt.after=objInfo.after;
            text="(function (opt1) {return runTest("+obj.replace(/\r|\n/g,"")+",opt,test,root,opt1,"+(level==0?objId:undefined)+")})"
        }
        else if(type=="2")
        {
            var testObj,testMode=arr[i].hasAttribute("mode")?arr[i].getAttribute("mode"):"code";
            testObj=await (testModel.findOneAsync(obj.length==24?{
                _id:obj
            }:{
                id:obj
            },"-output",{
                populate:{
                    path:"module",
                    select:"name"
                }
            }))
            if(!testObj)
            {
                testObj={
                    code:"",
                    ui:[],
                    name:"",
                    status:0
                }
            }
            testObj=await (testModel.populateAsync(testObj,{
                path:"group",
                select:"name"
            }))
            var code;
            if(testMode=="code")
            {
                code=testObj.code.replace(/\\\&quot\;/g,"\\\\&quot;").replace(/'/g,"\\'");
            }
            else
            {
                code=convertToCode(testObj.ui).replace(/'/g,"\\'").replace(/\\\"/g,"\\\\\"");
            }
            text="(function () {var argv=Array.prototype.slice.call(arguments);return runTestCode('"+code+"',"+JSON.stringify(testObj)+",global,opt,root,argv,'"+testMode+"',"+(level==0?objId:undefined)+","+(level+1)+")})"
        }
        else
        {
            arrNode.push(undefined);
            continue;
        }
        var node=document.createTextNode(text);
        arrNode.push({
            oldNode:arr[i],
            newNode:node
        });
    }
    arrNode.forEach(function (obj) {
        obj.oldNode.parentNode.replaceChild(obj.newNode,obj.oldNode);
    })
    if(test.module)
    {
        root.output+="<br><div style='background-color: #ececec'>["+moment().format("YYYY-MM-DD HH:mm:ss")+"]开始执行用例："+test.module.name+"/"+test.group.name+"/"+test.name+"("+(mode=="code"?"代码模式":"UI模式")+")<br>";
    }
    else
    {
        root.output+="<br><div style='background-color: #ececec'>["+moment().format("YYYY-MM-DD HH:mm:ss")+"]开始执行轮询<br>";
    }
    var text=ele.textContent.replace(new RegExp(decodeURIComponent("%C2%A0"),"g")," ");
    var ret=eval("(async function () {"+text+"})()").then(function (ret) {
        var obj={
            argv:[]
        };
        var temp;
        if(typeof(ret)=="object" && (ret instanceof Array))
        {
            temp=ret[0];
            obj.argv=ret.slice(1);
        }
        else
        {
            temp=ret;
        }
        if(temp===undefined)
        {
            obj.pass=undefined;
            test.status=0;
            if(__id!=undefined)
            {
                root.unknown++;
            }
            if(test.module)
            {
                root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]用例执行结束："+test.module.name+"/"+test.group.name+"/"+test.name+"(未判定)";
            }
            else
            {
                root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]轮询执行结束";
            }
        }
        else if(Boolean(temp)==true)
        {
            obj.pass=true;
            test.status=1;
            if(__id!=undefined)
            {
                root.success++;
            }
            if(test.module)
            {
                root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]用例执行结束："+test.module.name+"/"+test.group.name+"/"+test.name+"(<span style='color:green'>已通过</span>)";
            }
            else
            {
                root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]轮询执行结束";
            }
        }
        else
        {
            obj.pass=false;
            test.status=2;
            if(__id!=undefined)
            {
                root.fail++;
            }
            if(test.module)
            {
                root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]用例执行结束："+test.module.name+"/"+test.group.name+"/"+test.name+"(<span style='color:red'>未通过</span>)";
            }
            else
            {
                root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]轮询执行结束";
            }
        }
        root.output+="</div><br>"
        return obj;
    });
    return ret;
}

function updateTestInterfaceWithExample(objInter,objExample) {
    var obj={
        queryParam:objExample.param.query.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        }),
        header:objExample.param.header.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        }),
        restParam:objExample.param.param.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        }),
        before:objExample.param.before,
        after:objExample.param.after
    }
    if(objExample.param.body)
    {
        obj.bodyParam=objExample.param.body.filter(function (obj) {
            if(obj.name)
            {
                return true;
            }
            else
            {
                return false;
            }
        });
    }
    if(objExample.param.bodyInfo)
    {
        obj.bodyInfo=objExample.param.bodyInfo;
    }
    for(var key in obj)
    {
        objInter[key]=obj[key];
    }
}

function convertToCode(data) {
    var str="";
    data.forEach(function (obj) {
        if(obj.type=="interface")
        {
            var argv="{";
            for(var key in obj.argv)
            {
                argv+=key+":{";
                for(var key1 in obj.argv[key])
                {
                    argv+=key1+":"+obj.argv[key][key1]+","
                }
                argv+="},"
            }
            argv+="}"
            str+=`<div class='testCodeLine'>var $${obj.id}=await <a href='javascript:void(0)' style='cursor: pointer; text-decoration: none;' type='1' varid='${obj.id}' data='${obj.data.replace(/\'/g,"&apos;")}'>${obj.name}</a>(${argv});</div>`
        }
        else if(obj.type=="test")
        {
            var argv="[";
            obj.argv.forEach(function (obj) {
                argv+=obj+","
            })
            argv+="]";
            str+=`<div class='testCodeLine'>var $${obj.id}=await <a type='2' href='javascript:void(0)' style='cursor: pointer; text-decoration: none;' varid='${obj.id}' data='${obj.data}' mode='${obj.mode}'>${obj.name}</a>(...${argv});</div>`
        }
        else if(obj.type=="ifbegin")
        {
            str+=`<div class='testCodeLine'>if(${obj.data}){</div>`
        }
        else if(obj.type=="elseif")
        {
            str+=`<div class='testCodeLine'>}else if(${obj.data}){</div>`
        }
        else if(obj.type=="else")
        {
            str+=`<div class='testCodeLine'>}else{</div>`
        }
        else if(obj.type=="ifend")
        {
            str+=`<div class='testCodeLine'>}</div>`
        }
        else if(obj.type=="var")
        {
            if(obj.global)
            {
                str+=`<div class='testCodeLine'>global["${obj.name}"]=${obj.data};</div>`
            }
            else
            {
                str+=`<div class='testCodeLine'>var ${obj.name}=${obj.data};</div>`
            }
        }
        else if(obj.type=="return")
        {
            if(obj.argv.length>0)
            {
                var argv=obj.argv.join(",");
                str+=`<div class='testCodeLine'>return [${obj.data},${argv}];</div>`
            }
            else
            {
                str+=`<div class='testCodeLine'>return ${obj.data};</div>`
            }
        }
        else if(obj.type=="log")
        {
            str+=`<div class='testCodeLine'>log("打印${obj.name}:");log((${obj.data}));</div>`
        }
        else if(obj.type=="input")
        {
            str+=`<div class='testCodeLine'>var $${obj.id}=await input("${obj.name}",${obj.data});</div>`
        }
        else if(obj.type=="baseurl")
        {
            str+=`<div class='testCodeLine'>opt["baseUrl"]=${obj.data};</div>`
        }
        else if(obj.type=="assert")
        {
            str+=`<div class='testCodeLine'>if(${obj.data}){</div><div class='testCodeLine'>__assert(true,${obj.id},"${obj.name}");${obj.pass?"return true;":""}</div><div class='testCodeLine'>}</div><div class='testCodeLine'>else{</div><div class='testCodeLine'>__assert(false,${obj.id},"${obj.name}");</div><div class='testCodeLine'>return false;</div><div class='testCodeLine'>}</div>`
        }
    })
    return str;
}

function sendMail(smtp,port,user,pass,to,subject,content) {
    let transporter = mail.createTransport({
        host: smtp,
        port: port,
        secure: true,
        auth: {
            user: user,
            pass: pass
        }
    });
    let mailOptions = {
        from: user,
        to: to.join(","),
        subject:subject ,
        html: content
    };
    transporter.sendMail(mailOptions, function (err,info) {
        if(err)
        {
            console.log(err);
        }
    });
}

function sendSMS(method,baseUrl,param) {
    if(method=="GET" || method=="DELETE")
    {
        request({
            url:baseUrl,
            method:method,
            qs:param
        })
    }
    else
    {
        request({
            url:baseUrl,
            method:method,
            form:param
        })
    }
}

function versionDiff(obj1,obj2) {
    var verArr=obj1.split(".");
    var verLocalArr=obj2.split(".");
    var bNew=false;
    for(var i=0;i<3;i++)
    {
        if(parseInt(verArr[i])>parseInt(verLocalArr[i]))
        {
            bNew=true;
            break;
        }
        else if(parseInt(verArr[i])<parseInt(verLocalArr[i]))
        {
            break;
        }
    }
    if(bNew)
    {
        return true;
    }
    else
    {
        return false;
    }
}

var init=async function () {
    let setConfig=async function () {
        if((!fs.existsSync(path.join(__dirname, "../../config.json")) || !require("../../config.json").db) && process.argv.length<=2)
        {
            con={};
            let read=readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            let question=function (title) {
                return new Promise(function (resolve,reject) {
                    read.question(title,function (answer) {
                        resolve(answer);
                    })
                })
            }
            let arr=["请输入mongodb数据库地址（比如：mongodb://localhost:27017/DOClever)：","请输入DOClever上传文件路径（比如：/Users/Shared/DOClever）：","请输入端口号（比如10000）："];
            for(let i=0;i<arr.length;i++)
            {
                let val=await (question(arr[i]));
                if(!val)
                {
                    i--;
                    continue;
                }
                if(i==0)
                {
                    let connectDB=function () {
                        return new Promise(function (resolve,reject) {
                            mongoose.Promise = require('bluebird');
                            let db=mongoose.createConnection(val);
                            db.on("error",function () {
                                console.log("连接失败");
                                reject();
                            })
                            db.on("connected",function () {
                                console.log("连接成功");
                                db.close();
                                resolve();
                            })
                        })
                    }
                    try
                    {
                        await (connectDB());
                    }
                    catch (err)
                    {
                        i--;
                        continue;
                    }
                    con.db=val;
                }
                else if(i==1)
                {
                    try
                    {
                        createDir(val);
                        createDir(path.join(val,"img"));
                        createDir(path.join(val,"temp"));
                    }
                    catch (err)
                    {
                        console.log(err);
                        i--;
                        continue;
                    }
                    con.filePath=val;
                }
                else if(i==2)
                {
                    con.port=parseInt(val);
                }
            }
            fs.writeFileSync(path.join(__dirname,"../../config.json"),JSON.stringify(con));
            delete require.cache[path.join(__dirname,"../../config.json")];
            con=require("../../config.json");
        }
        else if((!fs.existsSync(path.join(__dirname, "../../config.json"))  || !require("../../config.json").db) && process.argv.length>2)
        {
            fs.writeFileSync(path.join(__dirname,"../../config.json"),JSON.stringify({}));
            con=require("../../config.json");
        }
        else
        {
            con=require("../../config.json");
            createDir(con.filePath);
            createDir(path.join(con.filePath,"img"));
            createDir(path.join(con.filePath,"temp"));
        }
        if(argv.db)
        {
            con.db=argv.db;
        }
        if(argv.file)
        {
            try
            {
                createDir(argv.file)
            }
            catch (err)
            {
                console.log(err);
                process.exit(0);
            }
            con.filePath=argv.file;
        }
        if(argv.port)
        {
            con.port=parseInt(argv.port);
        }
    }
    let patch=async function () {
        let curVersion=require("../../ver.json").version;
        var stat = fs.statSync(path.join(__dirname,"../patch"));
        if(!stat.isDirectory())
        {
            return;
        }
        let files=fs.readdirSync(path.join(__dirname,"../patch"));
        files=files.filter(function (obj) {
            if(obj!="." && obj!="..")
            {
                return true;
            }
            else
            {
                return false;
            }
        }).sort(function (obj1,obj2) {
            return versionDiff(obj1,obj2);
        })
        let info=require("../model/infoModel");
        let version="0.0.0";
        let obj=await (info.findOneAsync());
        if(obj)
        {
            version=obj.version;
        };
        let index=-1;
        for(let i=0;i<files.length;i++)
        {
            let bMax=versionDiff(files[i],version);
            if(bMax)
            {
                index=i;
                break;
            }
        }
        if(index>-1)
        {
            console.log("数据更新中,请勿操作");
            for(let i=index;i<files.length;i++)
            {
                await (require("../patch/"+files[i])());
            }
            console.log("数据更新完成");
        }
        await (info.findOneAndUpdateAsync({},{
            version:curVersion
        },{
            upsert:true,
            setDefaultsOnInsert:true
        }))
    }
    await (setConfig());
    await (patch());
    require("../event/event");
    exports.event.emit("init");
    console.log("DOClever启动成功");
}

var getMockParam=async function(clientParam,obj,type,version) {
    var arr=[];
    if(!statusModel)
    {
        statusModel=require("../model/statusModel");
        statusVersionModel=require("../model/statusVersionModel");
    }
    var status;
    if(version)
    {
        status=statusVersionModel;
    }
    else
    {
        status=statusModel;
    }
    obj.param.forEach(function (item) {
        var score=0;
        for(let key in  clientParam)
        {
            let val=clientParam[key];
            let objParam;
            if(type=="query")
            {
                item.queryParam.forEach(function (obj) {
                    if(obj.name.toLowerCase()==key.toLowerCase())
                    {
                        objParam=obj;
                    }
                })
            }
            else if(type=="body")
            {
                (item.bodyParam?item.bodyParam:[]).forEach(function (obj) {
                    if(obj.name.toLowerCase()==key.toLowerCase())
                    {
                        objParam=obj;
                    }
                })
            }
            else
            {
                ((item.bodyInfo && item.bodyInfo.rawJSON)?item.bodyInfo.rawJSON:[]).forEach(function (obj) {
                    if(obj.name.toLowerCase()==key.toLowerCase())
                    {
                        objParam=obj;
                    }
                })
            }
            if(objParam)
            {
                score+=2;
                if(!objParam.value)
                {
                    continue;
                }
                if(objParam.value.type==0)
                {
                    let bFind=false;
                    objParam.value.data.forEach(function (obj) {
                        if(obj.value==val)
                        {
                            bFind=true;
                        }
                    })
                    if(bFind)
                    {
                        score++;
                    }
                }
                else
                {
                    let query={
                        project:obj.project,
                        id:objParam.status
                    }
                    if(version)
                    {
                        query.version=version;
                    }
                    let objStatus=await (status.findOneAsync(query))
                    if(objStatus)
                    {
                        let bFind=false;
                        for(let obj of objStatus.data)
                        {
                            if(obj.key==val)
                            {
                                score++;
                                break;
                            }
                        }
                    }
                }
            }
        }
        arr.push(score);
    })
    let index=0;
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i]>arr[index])
        {
            index=i;
        }
    }
    return obj.param[index];
}

function handleResultData(name,data,result,originObj,show,input,bArr) {
    name=typeof(name)=="string"?name:null;
    if(typeof(data)=="string")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:0,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:data):data,
            drag:1
        }
        if(show)
        {
            obj.show=0
        }
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[
                    {
                        value:obj.mock,
                        remark:""
                    }
                ]
            }
        }
        result.push(obj)
    }
    else if(typeof(data)=="number")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:1,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data),
            drag:1
        }
        if(show)
        {
            obj.show=0
        }
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[
                    {
                        value:obj.mock,
                        remark:""
                    }
                ]
            }
        }
        result.push(obj)
    }
    else if(typeof(data)=="boolean")
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:2,
            remark:originObj?originObj.remark:"",
            mock:originObj?(originObj.mock?originObj.mock:String(data)):String(data),
            drag:1
        }
        if(show)
        {
            obj.show=0
        }
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[
                    {
                        value:obj.mock,
                        remark:""
                    }
                ]
            }
        }
        result.push(obj)
    }
    else  if(typeof(data)=="object" && (data instanceof Array))
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:3,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:"",
            drag:1
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        if(data.length>0)
        {
            if(bArr)
            {
                for(var i=0;i<data.length;i++)
                {
                    var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[i]:null):null;
                    arguments.callee(null,data[i],obj.data,resultObj,show,input,bArr)
                }
            }
            else
            {
                var resultObj=originObj?((originObj.data && originObj.data.length>0)?originObj.data[0]:null):null;
                arguments.callee(null,data[0],obj.data,resultObj,show,input,bArr)
            }
        }
    }
    else  if(typeof(data)=="object" && data===null)
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:5,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:"",
            drag:1
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        if(input)
        {
            obj.value={
                type:0,
                status:"",
                data:[

                ]
            }
        }
    }
    else if(typeof(data)=="object" && !(data instanceof Array))
    {
        var obj={
            name:name,
            must:originObj?originObj.must:1,
            type:4,
            remark:originObj?originObj.remark:"",
            data:[],
            mock:"",
            drag:1
        };
        if(show)
        {
            obj.show=0
        }
        result.push(obj);
        for(var key in data)
        {
            var resultObj=findObj(originObj?originObj.data:null,key);
            arguments.callee(key,data[key],obj.data,resultObj,show,input,bArr)
        }
    }
    else
    {
        return;
    }
}
function findObj(data,key) {
    if(!data || !key)
    {
        return null;
    }
    for(var i=0;i<data.length;i++)
    {
        if(data[i].name==key)
        {
            return data[i];
        }
    }
    return null;
}

function parseURL(url) {
    var a = URL.parse(url);
    return {
        source: url,
        protocol: a.protocol?a.protocol.replace(':',''):"http",
        host: a.hostname,
        port: a.port,
        query: a.search?a.search:"",
        params: (function(){
            var ret = {},
                seg = (a.search?a.search:"").replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file:((a.pathname?a.pathname.match(/\/([^\/?#]+)$/i):"") || [,''])[1],
        hash: a.hash?a.hash.replace('#',''):"",
        path: a.pathname?a.pathname.replace(/^([^\/])/,'/$1'):"",
        relative: ((a.href.match(/tps?:\/\/[^\/]+(.+)/)) || [,''])[1],
        segments: a.pathname?a.pathname.replace(/^\//,'').split('/'):""
    };
}

let runPoll=async function (arr) {
    let poll=require("../model/pollModel");
    let test=require("../model/testModel");
    let user=require("../model/userModel");
    let testCollection=require("../model/testCollectionModel");
    let project=require("../model/projectModel");
    arr=await (poll.populateAsync(arr,{
        path:"project"
    }));
    arr=await (poll.populateAsync(arr,{
        path:"version"
    }));
    arr=await (poll.populateAsync(arr,{
        path:"test",
    }));
    for(let obj of arr)
    {
        let objCollection=await (testCollection.findOneAsync({
            poll:obj._id
        }))
        if(!objCollection)
        {
            continue;
        }
        let root={
            output:"",
            count:objCollection.tests.length,
            success:0,
            fail:0,
            unknown:0,
            projectInfo:[]
        };
        let env={};
        if(obj.interProject)
        {
            let objProject=await (project.findOneAsync({
                _id:obj.interProject
            },"baseUrls"))
            if(objProject)
            {
                objProject.baseUrls.forEach(function (obj) {
                    if(obj.url==objCollection.baseUrl && obj.env)
                    {
                        obj.env.forEach(function (obj) {
                            env[obj.key]=obj.value;
                        })
                    }
                })
            }
        }
        let arrTest=objCollection.tests.map(function (obj) {
            return {
                type:"test",
                data:obj.test,
                mode:obj.mode,
                id:obj.id,
                name:"aa",
                argv:obj.argv,
            }
        })
        let  str=convertToCode(arrTest);
        try
        {
            await (exports.runTestCode(str,{
                name:"",
                status:0
            },{},{
                baseUrl:obj.baseUrl,
                env:env,
            },root,[],"ui",undefined,0));
        }
        catch(e)
        {
            root.fail++;
            root.output+=e+"<br>"
        }
        if(obj.failSend && root.fail==0 && root.unknown==0)
        {
            return;
        }
        let arrPollUser=obj.users.map(function (obj) {
            return obj.toString();
        });
        let arrProjectUser=obj.project.users.map(function (obj) {
            return obj.toString();
        })
        arrProjectUser.unshift(obj.project.owner.toString());
        let arr=[],arrUser=[];
        for(let u of arrPollUser)
        {
            if(arrProjectUser.indexOf(u)>-1)
            {
                let obj=await (user.findOneAsync({
                    _id:u
                }));
                arrUser.push(obj);
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
            exports.sendMail(obj.sendInfo.smtp,obj.sendInfo.port,obj.sendInfo.user,obj.sendInfo.password,arr,subject,content);
        }
        if(obj.phoneInfo && obj.phoneInfo.baseUrl && obj.phoneInfo.contentParam && obj.phoneInfo.sign)
        {
            let method,baseUrl,param={};
            method=obj.phoneInfo.method;
            baseUrl=obj.phoneInfo.baseUrl;
            obj.phoneInfo.param.forEach(function (obj) {
                if(obj.key)
                {
                    param[obj.key]=obj.value;
                }
            })
            if(obj.phoneInfo.bindParam)
            {
                let arr=[];
                arrUser.forEach(function (obj) {
                    if(obj.phone)
                    {
                        arr.push(obj.phone);
                    }
                })
                if(arr.length>0)
                {
                    let str=arr.join(obj.phoneInfo.split);
                    param[obj.phoneInfo.bindParam]=str;
                }
            }
            param[obj.phoneInfo.contentParam]=encodeURI(`测试：${root.count} 成功：${root.success} 失败：${root.fail} 未判定：${root.unknown} ${obj.phoneInfo.sign}`)
            sendSMS(method,baseUrl,param);
        }
    }
}

function handleGlobalVar(str,global) {
    var type;
    if(typeof (str)=="string")
    {
        type==1;
    }
    else if(typeof(str)=="number")
    {
        type=2;
    }
    else if(typeof(str)=="boolean")
    {
        type=3;
    }
    str=str.toString().replace(/\{\{.+?\}\}/g,function (str) {
        var val=str.substr(2,str.length-4);
        if(global[val]!==undefined)
        {
            return global[val]
        }
        else
        {
            return str;
        }
    })
    if(type==2)
    {
        str=Number(str);
    }
    else if(type==3)
    {
        str=Boolean(str);
    }
    return str;
}

function getPostmanGlobalVar(str,baseUrls) {
    let arr=str.match(/\{\{(.+?)\}\}/g);
    if(!arr)
    {
        return;
    }
    arr.forEach(function (obj) {
        let bExist=false;
        let val=obj.substr(2,obj.length-4);
        baseUrls[0].env.forEach(function (obj) {
            if(obj.key==val)
            {
                bExist=true;
            }
        })
        if(!bExist)
        {
            baseUrls.forEach(function (obj) {
                obj.env.push({
                    key:val,
                    value:"",
                    remark:""
                })
            })
        }
    })
}

function getNowFormatDate(fmt,date) {
    date=date || new Date();
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var createStatistic=async function() {
    let inter=require("../model/interfaceModel");
    let project=require("../model/projectModel");
    let team=require("../model/teamModel");
    let user=require("../model/userModel");
    let statistic=require("../model/statisticModel");
    let date=new Date();
    date.setDate(date.getDate()-1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    let obj={
        date:getNowFormatDate("yyyy-MM-dd",date)
    }
    obj.interface=await (inter.countAsync({
        createdAt:{
            $gte:date
        }
    }))
    obj.project=await (project.countAsync({
        createdAt:{
            $gte:date
        }
    }))
    obj.team=await (team.countAsync({
        createdAt:{
            $gte:date
        }
    }))
    obj.user=await (user.countAsync())
    obj.userRegister=await (user.countAsync({
        createdAt:{
            $gte:date
        }
    }))
    obj.userLogin=await (user.countAsync({
        lastLoginDate:{
            $gte:date
        }
    }))
    await (statistic.createAsync(obj));
}

var formatJson = function (json, options) {
    var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
            var i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        }
    );
    return formatted;
};

var backup=async function (db,version) {
    if(!db.dbPath || !db.host || !db.name || !db.backPath)
    {
        return
    }
    let fileName="mongodump";
    if(path.sep=="\\")
    {
        fileName+=".exe";
    }
    let date=moment().format("YYYYMMDDHHmmss");
    db.dbPath=path.join(db.dbPath,fileName);
    db.backPath=path.join(db.backPath,`${version}@${date}`)
    let str=`${db.dbPath} -h ${db.host} -d ${db.name} -o ${db.backPath}`;
    if(db.user && db.pass && db.authDb)
    {
        str+=` -u ${db.user} -p ${db.pass} --authenticationDatabase ${db.authDb}`
    }
    await (child_process.execAsync(str));
}

var restore=async function (db,dir) {
    if(!db.dbPath || !db.host || !db.name || !db.backPath)
    {
        return
    }
    let fileName="mongorestore";
    if(path.sep=="\\")
    {
        fileName+=".exe";
    }
    db.dbPath=path.join(db.dbPath,fileName);
    db.backPath=path.join(db.backPath,dir,db.name)
    let str=`${db.dbPath} -h ${db.host} -d ${db.name} ${db.backPath} --drop`;
    if(db.user && db.pass && db.authDb)
    {
        str+=` -u ${db.user} -p ${db.pass} --authenticationDatabase ${db.authDb}`
    }
    await (child_process.execAsync(str));
}

var removeFolder=function (path) {
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                removeFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.err=err;
exports.ok=ok;
exports.dateDiff=dateDiff;
exports.throw=tr;
exports.stopThen=stopThen;
exports.catch=ch;
exports.distance=distance;
exports.dateTrans=dateTrans;
exports.event=new event.EventEmitter();
exports.validateArgv=validateArgv;
exports.router=router;
exports.date=date;
exports.bProduct=bProduct;
exports.validateParam=validateParam;
exports.delImg=delImg;
exports.convertToJSON=convertToJSON;
exports.mock=mock;
exports.createDir=createDir;
exports.handleMockInfo=handleMockInfo;
exports.inArrKey=inArrKey;
exports.runTestCode=runTestCode;
exports.sendMail=sendMail;
exports.sendSMS=sendSMS;
exports.clone=clone;
exports.init=init;
exports.getMockParam=getMockParam;
exports.handleResultData=handleResultData;
exports.parseURL=parseURL
exports.runPoll=runPoll;
exports.handleGlobalVar=handleGlobalVar;
exports.getPostmanGlobalVar=getPostmanGlobalVar
exports.getNowFormatDate=getNowFormatDate
exports.createStatistic=createStatistic
exports.formatJson=formatJson
exports.backup=backup;
exports.restore=restore;
exports.removeFolder=removeFolder;
exports.getFileSize=getFileSize;