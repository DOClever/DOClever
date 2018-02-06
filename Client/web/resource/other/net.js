
var http = require('http');
var https = require('https');
var url=require("url");
var pass = require('stream').PassThrough;

var getHeader = function (req) {
    var ret = {};
    for (var i in req.headers) {
        if (!/^(host|connection|Access-|origin|referer|user-agent|user-doclever|path-doclever|url-doclever|method-doclever|headers-doclever|X-Requested-With)/i.test(i)) {
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
    return ret
};

var filterResHeader = function (headers,res) {
    var ret = {};
    res.setHeader("Cache-Control", "no-cache,no-store");
    res.setHeader("Pragrma", "no-cache");
    res.setHeader("Expires", 0);
    var resHeaders=res.getHeader("Access-Control-Expose-Headers")?res.getHeader("Access-Control-Expose-Headers").toLowerCase():"";
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
        if(!resHeaders)
        {
            res.setHeader("Access-Control-Expose-Headers",i);
        }
        else if(resHeaders.indexOf(i.toLowerCase()+",")==-1 && resHeaders.indexOf(","+i.toLowerCase())==-1)
        {
            res.setHeader("Access-Control-Expose-Headers",res.getHeader("Access-Control-Expose-Headers")+","+i);
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

function getHost(req) {
    var url=req.headers["url-doclever"];
    url=url.replace(/^(http:\/\/|https:\/\/)/i,"");
    var arr=url.split(":");
    return arr[0];
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

var onProxy = function (req, res) {
    handleHeader(req,res);
    if(req.method=="OPTIONS")
    {
        return;
    }
    if(!req.headers["url-doclever"])
    {
        mock(req,res);
    }
    else
    {
        proxy(req,res);
    }
};

function mock(req,res) {
    var obj=url.parse(mockUrl);
    var path=req.headers.path || url.parse(req.url).path;
    var opt={
        host:     obj.hostname,
        path:     (obj.pathname=="/"?"":obj.pathname)+path,
        method:   req.method,
        headers:  getHeader(req),
        port:obj.port?obj.port:80,
    }
    console.log("初次请求：method:"+opt.method+"host:"+opt.host+"port:"+opt.port+"path:"+opt.path)
    if(opt.headers["content-length"])
    {
        delete opt.headers["content-length"]
    }
    var req2 = http.request(opt, function (res2) {
        if(!realUrl || res2.headers["finish-doclever"]=="0")
        {
            console.log("接口开发中，返回mock数据");
            res.writeHead(res2.statusCode, filterResHeader(res2.headers,res));
            res2.pipe(res);
            res2.on('end', function () {

            });
        }
        else
        {
            if(res2.headers["finish-doclever"]=="1")
            {
                console.log("接口已完成，调用真实接口");
            }
            else
            {
                console.log("接口或者项目未找到，转调真实接口");
            }
            var headers=getHeader(req);
            var objUrl=url.parse(realUrl);
            var request1,opt1;
            if(objUrl.protocol=="http:")
            {
                opt1={
                    host:  objUrl.hostname,
                    path:     (objUrl.pathname=="/"?"":objUrl.pathname)+path,
                    method:   req.method,
                    port:objUrl.port?objUrl.port:80,
                    headers:headers
                }
                request1=http.request;
            }
            else
            {
                opt1={
                    host:  objUrl.hostname,
                    path:     (objUrl.pathname=="/"?"":objUrl.pathname)+path,
                    method:   req.method,
                    port:objUrl.port?objUrl.port:443,
                    headers:headers,
                    rejectUnauthorized: false,
                    requestCert: true,
                }
                request1=https.request;
            }
            console.log("调用真实接口：method:"+opt1.method+"host:"+opt1.host+"port:"+opt1.port+"path:"+opt1.path)
            var req3=request1(opt1,function (res3) {
                console.log("真实接口调用完成。status:"+res3.statusCode)
                res.writeHead(res3.statusCode, filterResHeader(res3.headers,res));
                res3.pipe(res);
                res3.on('end', function () {

                });
            })
            if (/POST|PUT/i.test(req.method)) {
                stream.pipe(req3);
            } else {
                req3.end();
            }
            req3.on('error', function (err) {
                res.end(err.stack);
            });
        }
    });
    var stream;
    if (/POST|PUT|PATCH/i.test(req.method))
    {
        stream=new pass();
        req.pipe(stream);
        req.pipe(req2);
    }
    else
    {
        req2.end();
    }
    req2.on('error', function (err) {
        res.end(err.stack);
    });
}

function handleHeader(req,res) {
    if(!req.headers.origin)
    {
        return;
    }
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE");
    res.setHeader("Access-Control-Allow-Credentials","true");
    if(req.headers["access-control-request-headers"])
    {
        res.setHeader("Access-Control-Allow-Headers",req.headers["access-control-request-headers"])
    }
    res.setHeader("Access-Control-Expose-Headers","connection,content-length,date,x-powered-by,content-encoding,server,etag,accept-ranges,allow,content-language,set-cookie,doclever-request");
    if(req.method=="OPTIONS")
    {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end();
        return;
    }
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
        }
        request1=https.request;
        bHttps=true;
    }
    var req3=request1(opt1,function (res3) {
        if(res3.statusCode==302)
        {
            redirect(res,bHttps,opt,res3.headers.location)
        }
        else
        {
            var resHeader=filterResHeader(res3.headers,res)
            resHeader["doclever-request"]=JSON.stringify(handleSelfCookie(req3));
            res.writeHead(res3.statusCode, resHeader);
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

function proxy(req,res) {
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
    var req2 = request(opt, function (res2) {
        if(res2.statusCode==302)
        {
            redirect(res,bHttps,opt,res2.headers.location)
        }
        else
        {
            var resHeader=filterResHeader(res2.headers,res)
            resHeader["doclever-request"]=JSON.stringify(handleSelfCookie(req2));
            res.writeHead(res2.statusCode, resHeader);
            res2.pipe(res);
            res2.on('end', function () {

            });
        }
    });
    if (/POST|PUT|PATCH/i.test(req.method)) {
        req.pipe(req2);
    } else {
        req2.end();
    }
    req2.on('error', function (err) {
        res.end(err.stack);
    });
}

var arguments = process.argv.splice(2);
var mockUrl=arguments[0];
var realUrl=arguments[1];
var port=arguments[2]?arguments[2]:36742;
var server = http.createServer(onProxy);
server.listen(port);
console.log(arguments.length>0?("内网测试，Mock数据正监听端口："+port):"正在运行中，请用DOClever的接口测试页面进行内网测试！");



