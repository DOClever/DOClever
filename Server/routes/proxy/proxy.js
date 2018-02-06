/**
 * Created by sunxin on 2017/1/9.
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var url=require("url");
var run=require("../../model/runModel")
var getHeader = function (req) {
    var ret = {};
    for (var i in req.headers) {
        if (!/^(host|connection|Access-|origin|referer|user-agent|user-doclever|path-doclever|url-doclever|method-doclever|headers-doclever|content-|X-Requested-With)/i.test(i)) {
                ret[i] = req.headers[i];
        }
    }
    ret["accept"]="*/*";
    var headers=req.headers["headers-doclever"];
    if(headers)
    {
        headers=JSON.parse(headers);
        for(var key in headers)
        {
            ret[key]=headers[key];
        }
    }
    return ret;
};

var filterResHeader = function (headers) {
    var ret = {};
    for (var i in headers) {
        if (!/Access-/i.test(i)) {
            if(/set-cookie/i.test(i))
            {
                for(let index=0;index<headers[i].length;index++)
                {
                    headers[i][index]=headers[i][index].split(" ")[0];
                }
                ret[i]=headers[i];
            }
            else
            {
                ret[i] = headers[i];
            }
        }
    }
    return ret;
};

var getPath = function (req) {
    var url = req.url;
    if (url.substr(0, 7).toLowerCase() === 'http://') {
        var i = url.indexOf('/', 7);
        if (i !== -1) {
            url = url.substr(i);
        }
    }
    return url;
};

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

function getHost(req) {
    var url=req.headers["url-doclever"];
    url=url.replace(/^(http:\/\/|https:\/\/)/i,"");
    var arr=url.split(":");
    var ret=arr[0];
    if(ret=="127.0.0.1" || ret.toLowerCase()=="localhost")
    {
        ret=getClientIp(req);
    }
    return ret;
}

function getPort(req) {
    var url=req.headers["url-doclever"];
    var defaultPort;
    if(req.headers["url-doclever"].toLowerCase().startsWith("https://"))
    {
        defaultPort=443;
    }
    else
    {
        defaultPort=80;
    }
    url=url.replace(/^(http:\/\/|https:\/\/)/i,"");
    var arr=url.split(":");
    return arr.length>1?arr[1]:defaultPort;
}

function redirect(res,bHttps,opt,location) {
    var urlRedirect=location;
    if(urlRedirect.startsWith("/"))
    {
        urlRedirect=(bHttps?"https://":"http://")+opt.host+":"+opt.port+urlRedirect;
    }
    var objUrl=url.parse(urlRedirect);
    var request1,opt1;
    if(objUrl.protocol=="http:")
    {
        opt1={
            host:  objUrl.hostname,
            path:     objUrl.path,
            method:   "GET",
            port:objUrl.port?objUrl.port:80,
			headers:opt.headers
        }
        request1=http.request;
        bHttps=false;
    }
    else
    {
        opt1={
            host:  objUrl.hostname,
            path:     objUrl.path,
            method:   "GET",
            port:objUrl.port?objUrl.port:443,
            rejectUnauthorized: false,
            requestCert: true,
			headers:opt.headers
        }
        request1=https.request;
        bHttps=true;
    }
    var req3=request1(opt1,function (res3) {
        if(res3.statusCode==302)
        {
            handleCookieIfNecessary(opt1,res3.headers);
            opt.headers.cookie=opt1.headers.cookie;
            redirect(res,bHttps,opt,res3.headers.location)
        }
        else
        {
            var resHeader=filterResHeader(res3.headers)
            resHeader["doclever-request"]=JSON.stringify(handleSelfCookie(req3));
            res.writeHead(res3.statusCode,resHeader);
            res3.pipe(res);
            res3.on('end', function () {

            });
        }
    })
    req3.end();
    req3.on('error', function (err) {
        res.end(err.stack);
    });
}

function handleCookieIfNecessary(opt, headers) {
    let cookies = headers["set-cookie"];
    if (cookies) {
        for (let index in cookies) {
            let cookie = cookies[index];
            let realOfCookie = cookie.split(";")[0];
            if (!opt.headers.cookie) {
                opt.headers.cookie = "";
            }
            opt.headers.cookie += realOfCookie + ";";
        }
    }
}

function handleSelfCookie(req) {
    var arr=req._headers;
    arr["url"]=req.method+" "+req.path;
    var cookie=arr["cookie"];
    if(!cookie)
    {
        return arr;
    }
    var arrCookie=cookie.split(";");
    var keys=["id","name","photo","qq","sex","company","phone","loginCount","age","email"];
    arrCookie=arrCookie.filter(function (obj) {
        obj=obj.trim();
        for(let key of keys)
        {
            if(obj.startsWith(key+"="))
            {
                return false;
            }
        }
        return true;
    })
    arr["cookie"]=arrCookie.join(";");
    return arr;
}

var counter = 0;
var onProxy = function (req, res) {
    counter++;
    var num = counter;
    var bHttps=false;
    if(req.headers["url-doclever"].toLowerCase().startsWith("https://"))
    {
        bHttps=true;
    }
    var opt,request;
    if(bHttps)
    {
        opt= {
            host:     getHost(req),
            path:     req.headers["path-doclever"],
            method:   req.headers["method-doclever"],
            headers:  getHeader(req),
            port:getPort(req),
            rejectUnauthorized: false,
            requestCert: true,
        };
        request=https.request;
    }
    else
    {
        opt= {
            host:     getHost(req),
            path:     req.headers["path-doclever"],
            method:   req.headers["method-doclever"],
            headers:  getHeader(req),
            port:getPort(req)
        };
        request=http.request;
    }
    run.create({
        user:req.headers["user-doclever"],
        host:opt.host,
        path:opt.path,
    },function (err) {

    })
    var req2 = request(opt, function (res2) {
        if(res2.statusCode==302)
        {
            handleCookieIfNecessary(opt,res2.headers);
            redirect(res,bHttps,opt,res2.headers.location)
        }
        else
        {
            var resHeader=filterResHeader(res2.headers)
            resHeader["doclever-request"]=JSON.stringify(handleSelfCookie(req2));
            res.writeHead(res2.statusCode, resHeader);
            res2.pipe(res);
            res2.on('end', function () {

            });
        }
    });
    if (/POST|PUT/i.test(req.method)) {
        req.pipe(req2);
    } else {
        req2.end();
    }
    req2.on('error', function (err) {
        res.end(err.stack);
    });
};

router.post("/",function (req,res) {
    onProxy(req,res)
})

module.exports=router;