const path=require("path");
const remote=require('electron').remote;
const app=remote.app;
var mock,fs,decompress,getmac;
if(location.href.startsWith("http"))
{
    window.debug=true;
    let curPath="/Users/sunxin/DOCleverClient";
    fs=require(path.join(curPath,"./node_modules/fs-extra"));
    mock=require(path.join(curPath,"web/console/node/mock"));
    decompress =require(path.join(curPath,"./node_modules/decompress"));
    getmac =require(path.join(curPath,"./node_modules/getmac"));
}
else
{
    mock=require("./node/mock");
    let appPath = remote.getGlobal("appPath")
    fs = require(path.join(appPath, "./node_modules/fs-extra"));
    decompress = require(path.join(appPath, "./node_modules/decompress"))
    getmac = require(path.join(appPath, "./node_modules/getmac"))
}
global.remote=remote;
global.desktopVersion=remote.getGlobal("version");
const remoteApi=remote.getGlobal("api");
const ipc=require('electron').ipcRenderer;
const shell=require('electron').shell;
const clipboard = require('electron').clipboard;
const pathEnv=path.join(app.getPath("home"),"DOClever-Desktop");
global.apiNode={
    path:{
        getEnvPath:function (id) {
            return path.join(pathEnv,id);
        },
        getLoginPath:function () {
            return path.join(pathEnv,"web/basic/login/login.html")
        }
    },
    util:{
        goUrl:function (url) {
            shell.openExternal(url);
        }
    },
    clipboard:{
        copyText:function (content) {
            clipboard.writeText(content);
        }
    },
    encode:{
        param:function (obj,bKey) {
            var arr=[];
            for(var key in obj)
            {
                arr.push((bKey?encodeURIComponent(key):key)+"="+encodeURIComponent(obj[key]));
            }
            return arr.join("&");
        },
        token:function (token) {
            return remoteApi.member.encodeToken(token);
        }
    },
    net:async function (method,url,headers,body) {
        function getHost(url) {
            var a = window.document.createElement('a');
            a.href = url;
            let obj={
                protocol: a.protocol,
                host: a.hostname,
                port: a.port,
            };
            return obj.protocol+"//"+obj.host+((obj.port && obj.port!=80)?(":"+obj.port):"");
        }
        let host=getHost(url);
        let request=remote.getGlobal("api").request;
        let fs=remote.getGlobal("api").fs;
        if(!headers)
        {
            headers={};
        }
        var objReq={
            url:url,
            method:method,
            encoding: null
        }
        if((method=="POST" || method=="PUT" || method=="PATCH") && body)
        {
            if(typeof(body)=="string" || (body instanceof ArrayBuffer))
            {
                var bFind=false;
                for(var key in headers)
                {
                    if(key.toLowerCase()=="content-type")
                    {
                        bFind=true;
                        break;
                    }
                }
                if(!bFind)
                {
                    if(typeof(body)=="string")
                    {
                        var bJson=true;
                        try {
                            JSON.parse(body);
                        }
                        catch(e) {
                            bJson=false;
                        }
                        if(bJson)
                        {
                            headers["content-type"]="application/json"
                        }
                        else
                        {
                            headers["content-type"]="text/plain";
                        }
                    }
                }
                objReq.body=body;
            }
            else
            {
                var bEncode=false,bFind=false,bFile=false;
                for(let key in body)
                {
                    let val=body[key];
                    if(typeof(val)=="object" && (val instanceof File))
                    {
                        bFile=true;
                        body[key]={
                            value:await fs.readFile(val.path),
                            options:{
                                filename:val.name,
                                contentType:val.type
                            }
                        };
                    }
                }
                if(bFile)
                {
                    for(var key in headers)
                    {
                        if(key.toLowerCase()=="content-type")
                        {
                            headers[key]="multipart/form-data";
                        }
                    }
                    objReq.formData=body;
                }
                else
                {
                    for(var key in headers)
                    {
                        if(key.toLowerCase()=="content-type")
                        {
                            bFind=true;
                            if(headers[key].toLowerCase()=="application/x-www-form-urlencoded")
                            {
                                bEncode=true;
                                break;
                            }
                        }
                    }
                    if(bEncode || !bFind)
                    {
                        body=this.encode.param(body,1);
                        if(!bFind)
                        {
                            headers["content-type"]="application/x-www-form-urlencoded"
                        }
                    }
                    objReq.form=body;
                }
            }
        }
        objReq.headers=headers;
        let strCookie="";
        for(let key in headers)
        {
            if(key.toLowerCase()=="cookie")
            {
                strCookie=headers[key];
                break;
            }
        }
        let cookie=await remoteApi.cookie.all(host);
        if(strCookie)
        {
            cookie+=";"+strCookie;
        }
        headers["cookie"]=cookie;
        let userAgent="",userAgentKey="";
        for(let key in headers)
        {
            if(key.toLowerCase()=="user-agent")
            {
                userAgent=headers[key];
                userAgentKey=key;
                break;
            }
        }
        if(userAgent)
        {
            userAgent+=" DOClever";
            headers[userAgentKey]=userAgent;
        }
        else
        {
            headers["user-agent"]="DOClever"
        }
        return new Promise(function (resolve,reject) {
            request(objReq,function (err,res,resBody) {
                if(err)
                {
                    var obj={
                        data:err.message,
                        status:0,
                        header:{},
                    }
                    resolve(obj);
                }
                else
                {
                    var reader = new FileReader();
                    let resObj;
                    let content=resBody;
                    if(/image\//i.test(res.headers["content-type"]))
                    {
                        resObj=new Blob([content],{
                            type:res.headers["content-type"]
                        });
                    }
                    else
                    {
                        content=content.toString("utf8");
                        try
                        {
                            resObj=JSON.parse(content);
                        }
                        catch (err)
                        {
                            resObj=content;
                        }
                    }
                    let cookies = res.headers["set-cookie"];
                    if(cookies)
                    {
                        for (let index in cookies) {
                            let cookie = cookies[index];
                            let realOfCookie = cookie.split(";")[0];
                            let i=realOfCookie.indexOf("=");
                            if(i>-1)
                            {
                                let key=realOfCookie.substring(0,i);
                                let val=realOfCookie.substr(i+1);
                                remoteApi.cookie.set(key,val,0,host)
                            }
                        }
                    }
                    var obj={
                        data:resObj,
                        status:res.statusCode,
                        header:res.headers,
                    }
                    resolve(obj);
                }
            })
        })
    },
    mock:{
        list:[],
        start:function (id,name,mockUrl,realUrl,port) {
            let objMock=null;
            for(let o of this.list)
            {
                if(o.id==id)
                {
                    objMock=o;
                    objMock.realUrl=realUrl;
                    objMock.port=port;
                    break;
                }
            }
            if(objMock)
            {
                try
                {
                    objMock.server.listen(objMock.port);
                    objMock.state=1;
                    return true;
                }
                catch (err)
                {
                    return false;
                }
            }
            else
            {
                let server=mock(mockUrl,realUrl,Number(port))
                if(server)
                {
                    let obj={
                        name:name,
                        state:1,
                        id:id,
                        server:server,
                        port:Number(port),
                        realUrl:realUrl
                    }
                    this.list.push(obj);
                    return true;
                }
                else
                {
                    return false;
                }
            }
        },
        stop:function (id) {
            for(let o of this.list)
            {
                if(o.id==id && o.state==1)
                {
                    o.server.close();
                    o.state=0;
                }
            }
        },
        clear:function () {
            for(let o of this.list)
            {
                o.server.close();
            }
            this.list=[];
        },
        remove:function (id) {
            for(let index=0;index<this.list.length;index++)
            {
                let o=this.list[index];
                if(o.id==id)
                {
                    o.server.close();
                    this.list.splice(index,1);
                    break;
                }
            }
        }
    },
    plugin:{
        list:{
            interfaceProjectExport:[]
        },
        downloadPlugin:async function (id,pluginId,url) {
            let zip=await remoteApi.plugin.download(id,sessionStorage.getItem("member"),pluginId,url);
            await fs.remove(path.join(zip,"..","content"));
            await fs.remove(path.join(zip,"..","ver"));
            await decompress(zip,path.join(zip,".."));
            await fs.unlink(zip);
            return path.join(zip,"..");
        },
        removePlugin:async function(id,pluginId)
        {
            let p=path.join(pathEnv,id,"plugin",sessionStorage.getItem("member"),pluginId);
            await fs.remove(p);
        },
        load:async function(id)
        {
            let str=sessionStorage.getItem("plugin")
            if(str)
            {
                let arr=JSON.parse(str);
                let p=path.join(pathEnv,id,"plugin",sessionStorage.getItem("member"));
                let dirs=await fs.readdir(p);
                for(let o of dirs)
                {
                    let p1=path.join(p,o,"content/install.js");
                    if(await fs.exists(p1))
                    {
                        let o=window.installPlugin;
                        require(p1);
                        window.installPlugin(this.register);
                        window.installPlugin=o;
                    }
                }
            }
        },
        handlePluginInfo:async function(envId,userId)
        {
            let p=path.join(pathEnv,envId,"plugin");
            if(!(await fs.exists(p)))
            {
                await fs.mkdir(p);
            }
            p=path.join(p,userId);
            let objPlugin={};
            if(!(await fs.exists(p)))
            {
                await fs.mkdir(p);
            }
            else
            {
                let dirs=await fs.readdir(p);
                for(let o of dirs)
                {
                    let p1=path.join(p,o);
                    let stat=await fs.stat(p1);
                    if(stat.isDirectory())
                    {
                        let p2=path.join(p1,"ver");
                        if(await fs.exists(p2))
                        {
                            let verContent=(await fs.readFile(p2)).toString();
                            objPlugin[o]=verContent;
                        }
                    }
                }
            }
            return objPlugin;
        },
        register:{
            interfaceProjectExport:(function (name,handler) {
                global.apiNode.plugin.list.interfaceProjectExport.push({
                    name:name,
                    handler:handler
                })
            })
        }
    },
    macAddress:function () {
        return new Promise(function (resolve,reject) {
            getmac.getMac(function (err,mac) {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(mac);
                }
            })
        })
    }
};










