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
var async=require("asyncawait/async")
var await=require("asyncawait/await")
var CryptoJS=require("crypto-js")
var request=require("../third/requestAsync");
var mail=require("nodemailer");
var dom = require("jsdom").JSDOM;
var document=(new dom(`...`)).window.document;
require("./Base64")
var testModel=null;
var testVersionModel=null;
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

function  delImg(filePath) {
    if(filePath)
    {
        fs.exists(con.filePath+filePath.replace(/\//g,path.sep),function (exist) {
            if(exist)
            {
                fs.unlink(con.filePath+filePath);
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

var resultSave=function (data,json) {
    var arr=[];
    for(var i=0;i<data.length;i++)
    {
        eachResult(data[i],data[i].name===null?{type:3}:null,arr,json);
    }
    return arr;
}

var eachResult=function (item,pItem,arr,json) {
    if(item.name || (!item.name && pItem && pItem.type==3))
    {
        var obj={
            name:item.name,
            type:item.type,
            remark:item.remark,
            must:item.must,
            mock:item.mock
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
                arguments.callee(item.data[i],item,obj.data,json)
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

var runTest=async (function (obj,baseUrl,global,test,root,opt) {
    root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]开始运行接口："+obj.name+"<br>"
    var name=obj.name
    var method=obj.method;
    var baseUrl=obj.baseUrl=="defaultUrl"?baseUrl:obj.baseUrl;
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
    var objParam=clone(obj.restParam);
    var param1={};
    objParam.forEach(function (obj) {
        param1[obj.name]=obj.selValue;
    })
    var query={};
    obj.queryParam.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=encrypt(obj.encrypt.type,obj.selValue,obj.encrypt.salt);
            var key=obj.name;
            if(obj.encrypt.key)
            {
                key=encrypt(obj.encrypt.type,key,obj.encrypt.salt);
            }
            query[key]=value;
        }
        else
        {
            query[obj.name]=obj.selValue;
        }
    })
    var header={};
    obj.header.forEach(function (obj) {
        if(!obj.name || !obj.enable)
        {
            return;
        }
        if(obj.encrypt && obj.encrypt.type)
        {
            var value=encrypt(obj.encrypt.type,obj.value,obj.encrypt.salt);
            var key=obj.name;
            header[key]=value;

        }
        else
        {
            header[obj.name]=obj.value;

        }
    })
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
                        var value=encrypt(obj1.encrypt.type,obj1.selValue,obj1.encrypt.salt);
                        var key=obj1.name;
                        if(obj1.encrypt.key)
                        {
                            key=encrypt(obj1.encrypt.type,key,obj1.encrypt.salt);
                        }
                        body[key]=value;
                    }
                    else
                    {
                        body[obj1.name]=obj1.selValue;
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
                    body=encrypt(encryptType,obj.bodyInfo.rawText,obj.encrypt.salt)
                }
                else
                {
                    body=obj.bodyInfo.rawText;
                }
            }
            else if(obj.bodyInfo.rawType==2)
            {
                var obj1={};
                var result=resultSave(obj.bodyInfo.rawJSON);
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
    query=param(query);
    if(query.length>0)
    {
        path=path+"?"+query;
    }
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
            objReq.body=param(body,true);
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
                objReq.json=true;
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
        return res;
    })
})

var runTestCode=async (function (code,test,global,opt,root) {
    if(!testModel)
    {
        testModel=require("../model/testModel");
    }
    if(!testVersionModel)
    {
        testVersionModel=require("../model/testVersionModel");
    }
    var Base64=BASE64.encoder,MD5=CryptoJS.MD5,SHA1=CryptoJS.SHA1,SHA256=CryptoJS.SHA256,SHA512=CryptoJS.SHA512,SHA3=CryptoJS.SHA3,RIPEMD160=CryptoJS.RIPEMD160,AES=CryptoJS.AES.encrypt,TripleDES=CryptoJS.TripleDES.encrypt,DES=CryptoJS.DES.encrypt,Rabbit=CryptoJS.Rabbit.encrypt,RC4=CryptoJS.RC4.encrypt,RC4Drop=CryptoJS.RC4Drop.encrypt;
    if(!global)
    {
        global={};
    }
    function log(text) {
        if(typeof(text)=="object")
        {
            text=JSON.stringify(text);
        }
        root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]"+text+"<br>";
    }
    var ele=document.createElement("div");
    ele.innerHTML=code;
    var arr=ele.getElementsByTagName("a");
    var arrNode=[];
    for(var i=0;i<arr.length;i++)
    {
        var obj=arr[i].getAttribute("data");
        var type=arr[i].getAttribute("type");
        var text;
        if(type=="1")
        {
            text="(function (opt) {return runTest("+obj.replace(/\r|\n/g,"")+",'"+opt.baseUrl+"',"+"{before:'"+opt.before.replace(/'/g,"\\'").replace(/\r|\n/g,";")+"',after:'"+opt.after.replace(/'/g,"\\'").replace(/\r|\n/g,";")+"'}"+",test,root,opt)})"
        }
        else if(type=="2")
        {
            var testObj;
            testObj=await (testModel.findOneAsync({
                id:obj
            },null,{
                populate:{
                    path:"module",
                    select:"name"
                }
            }))
            if(!testObj)
            {
                throw "测试用例已不存在";
            }
            testObj=await (testModel.populateAsync(testObj,{
                path:"group",
                select:"name"
            }))
            text="(function () {return runTestCode('"+testObj.code.replace(/\\\&quot\;/g,"\\\\&quot;").replace(/'/g,"\\'")+"',"+JSON.stringify(testObj)+",global,"+JSON.stringify(opt)+",root)})"
        }
        else
        {
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
    root.output+="<br><div style='background-color: #ececec'>["+moment().format("YYYY-MM-DD HH:mm:ss")+"]开始执行用例："+test.module.name+"/"+test.group.name+"/"+test.name+"<br>";
    var text=ele.textContent.replace(new RegExp(decodeURIComponent("%C2%A0"),"g")," ");
    function bOutside(str) {
        var a1=0,a2=0;
        for(var i=0;i<str.length;i++)
        {
            if(str[i]=="\"" && (i==0 || str[i-1]!="\\"))
            {
                a1++
            }
            else if(str[i]=="'" && (i==0 || str[i-1]!="\\"))
            {
                a2++
            }
        }
        if(a1%2==0 && a2%2==0)
        {
            return true;
        }
        else
        {
            return false
        }
    }
    var evalText="";
    while(true)
    {
        let index=text.indexOf("await ");
        if(index>-1)
        {
            let lText=text.substring(0,index);
            if(bOutside(evalText+lText))
            {
                evalText+=lText+"await (";
                text=text.substr(index+6);
                while(true)
                {
                    index=text.indexOf(");");
                    if(index>-1)
                    {
                        lText=text.substring(0,index);
                        if(bOutside(evalText+lText))
                        {
                            evalText+=lText+"));";
                            text=text.substr(index+2);
                            break;
                        }
                        else
                        {
                            evalText+=lText+");";
                            text=text.substr(index+2);
                        }
                    }
                    else
                    {
                        evalText+=text;
                        break;
                    }
                }
            }
            else
            {
                evalText+=lText+"await ";
                text=text.substr(index+6);
            }
        }
        else
        {
            evalText+=text;
            break;
        }
    }
    var ret=eval("(async (function () {"+evalText+"}))()").then(function (ret) {
        if(ret===undefined)
        {
            test.status=0;
            root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]用例执行结束："+test.module.name+"/"+test.group.name+"/"+test.name+"(未判定)";
        }
        else if(Boolean(ret)==true)
        {
            test.status=1;
            root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]用例执行结束："+test.module.name+"/"+test.group.name+"/"+test.name+"(<span style='color:green'>已通过</span>)";
        }
        else
        {
            test.status=2;
            root.output+="["+moment().format("YYYY-MM-DD HH:mm:ss")+"]用例执行结束："+test.module.name+"/"+test.group.name+"/"+test.name+"(<span style='color:red'>未通过</span>)";
        }
        root.output+="</div><br>"
        return ret;
    });
    return ret;
})

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
exports.handleMockInfo=handleMockInfo;
exports.inArrKey=inArrKey;
exports.runTestCode=runTestCode;
exports.sendMail=sendMail;
exports.clone=clone;







