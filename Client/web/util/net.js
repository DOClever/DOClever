/**
 * Created by sunxin on 2017/2/20.
 */
var config=require("./config");
var resource=require("vue-resource")
Vue.use(resource)
var net={};
function getAllHeaders(obj) {
    var result={};
    for(var key in obj.map)
    {
        if(obj.map.hasOwnProperty(key))
        {
            result[key.toLowerCase()]=obj.map[key][0];
        }
    }
    return result;
}

function handleVersionHeaders(headers) {
    var header=headers || {};
    if(session.get("versionId"))
    {
        header["docleverversion"]=session.get("versionId");
    }
    if(session.get("snapshotId"))
    {
        header["docleversnapshot"]=session.get("snapshotId");
    }
    return header;
}

function convertHeader(data) {
    if(data.length>0)
    {
        var obj={};
        var arr=data.split("\r\n");
        for(var i=0;i<arr.length;i++)
        {
            var index=arr[i].indexOf(":")
            if(index>-1)
            {
                obj[arr[i].substr(0,index)]=arr[i].substr(index+1);
            }
        }
        return obj;
    }
    else
    {
        return {};
    }
}
net.get=function (path,params,headers,beforeFunc) {
    headers=handleVersionHeaders(headers);
    if(!params)
    {
        params={};
    }
    params.sbdoctimestamps=(new Date()).getTime()
    return Vue.http.get(config.baseUrl+path,{
        headers:headers,
        params:params,
        before:beforeFunc,
        credentials:true
    }).then(function (res) {
        var json=res.body;
        if(json.code==13)
        {
            location.href="/html/web/login/login.html"
        }
        else if(json.code==35)
        {
            session.remove("versionId");
            session.remove("versionName");
            session.remove("versionDis");
            location.reload();
        }
        else
        {
            return json;
        }
    })
}

net.post=function (path,data,headers,beforeFunc,run,bNet) {
    if(!run)
    {
        headers=handleVersionHeaders(headers);
    }
    var bEncode=false,bFind=false;
    if(headers)
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
    }
    if(data)
    {
        if(bEncode || !bFind)
        {
            data=$.param(data,1);
            if(!bFind)
            {
                if(headers)
                {
                    headers["content-type"]="application/x-www-form-urlencoded"
                }
                else
                {
                    headers={
                        "content-type":"application/x-www-form-urlencoded"
                    }
                }
            }
        }
    }
    else
    {
        data=""
    }
    return Vue.http.post(bNet?path:(config.baseUrl+path),data,{
        headers:headers,
        before:beforeFunc,
        credentials:true
    }).then(function (res) {
        if(run)
        {
            var resObj;
            if(typeof (res.body)=="string")
            {
                var strStr=res.body;
                try
                {
                    resObj=JSON.parse(strStr);
                }
                catch (err)
                {
                    resObj=strStr;
                }
            }
            else
            {
                if(typeof (res.body)=="object" && (res.body instanceof Blob) && res.body.size<=1024*5)
                {
                    return new Promise(function (resolve,reject) {
                        var reader = new FileReader();
                        reader.onload = function(){
                            var content = reader.result;
                            if(/application\/xml/i.test(res.headers.map["content-type"][0]) || /text\/xml/i.test(res.headers.map["content-type"][0]))
                            {
                                resObj=content;
                            }
                            else
                            {
                                try
                                {
                                    resObj=JSON.parse(content);
                                }
                                catch (err)
                                {
                                    resObj=res.body;
                                }
                            }
                            var obj={
                                data:resObj,
                                status:res.status,
                                header:getAllHeaders(res.headers),
                            }
                            resolve(obj);
                        };
                        reader.onerror = function(event){
                            resObj=res.body;
                            var obj={
                                data:resObj,
                                status:res.status,
                                header:getAllHeaders(res.headers),
                            }
                            resolve(obj);
                        };
                        reader.readAsText(res.body);
                    })
                }
                else
                {
                    resObj=res.body;
                }
            }
            var obj={
                data:resObj,
                status:res.status,
                header:getAllHeaders(res.headers),
            }
            return obj;
        }
        else
        {
            var json=res.body;
            if(json.code==13)
            {
                location.href="/html/web/login/login.html"
            }
            else if(json.code==35)
            {
                session.remove("versionId");
                session.remove("versionName");
                session.remove("versionDis");
                location.reload();
            }
            else
            {
                return json;
            }
        }
    },function (res) {
        if(run)
        {
            var obj={
                data:res.body,
                status:res.status,
                header:getAllHeaders(res.headers),
            }
            return obj;
        }
    })
}

net.put=function (path,data,headers,beforeFunc) {
    headers=handleVersionHeaders(headers);
    var bEncode=false,bFind=false;
    if(headers)
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
    }
    if(data)
    {
        if(bEncode || !bFind)
        {
            data=$.param(data,1);
            if(!bFind)
            {
                if(headers)
                {
                    headers["content-type"]="application/x-www-form-urlencoded"
                }
                else
                {
                    headers={
                        "content-type":"application/x-www-form-urlencoded"
                    }
                }
            }
        }
    }
    else
    {
        data=""
    }
    return Vue.http.put(config.baseUrl+path,data,{
        headers:headers,
        before:beforeFunc,
        credentials:true
    }).then(function (res) {
        var json=res.body;
        if(json.code==13)
        {
            location.href="/html/web/login/login.html"
        }
        else if(json.code==35)
        {
            session.remove("versionId");
            session.remove("versionName");
            session.remove("versionDis");
            location.reload();
        }
        else
        {
            return json;
        }
    })
}

net.delete=function (path,params,headers,beforeFunc) {
    headers=handleVersionHeaders(headers);
    return Vue.http.delete(config.baseUrl+path,{
        headers:headers,
        params:params,
        before:beforeFunc,
        credentials:true
    }).then(function (res) {
        var json=res.body;
        if(json.code==13)
        {
            location.href="/html/web/login/login.html"
        }
        else if(json.code==35)
        {
            session.remove("versionId");
            session.remove("versionName");
            session.remove("versionDis");
            location.reload();
        }
        else
        {
            return json;
        }
    })
}

net.upload=function (method,path,data,headers,beforeFunc,run,bNet) {
    if(!run)
    {
        headers=handleVersionHeaders(headers);
    }
    var form;
    if(typeof(data)=="string" || (data instanceof ArrayBuffer))
    {
        form=data;
        if(headers)
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
                if(typeof(data)=="string")
                {
                    var bJson=true;
                    try {
                        JSON.parse(data);
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
                else
                {
                    headers["content-type"]="application/x-www-form-urlencoded"
                }
            }
        }
        else
        {
            if(typeof(data)=="string")
            {
                var bJson=true;
                try {
                    JSON.parse(data);
                }
                catch(e) {
                    bJson=false;
                }
                if(bJson)
                {
                    headers={
                        "content-type":"application/json"
                    }
                }
                else
                {
                    headers={
                        "content-type":"text/plain"
                    }
                }
            }
            else
            {
                headers={
                    "content-type":"application/x-www-form-urlencoded"
                }
            }
        }
    }
    else
    {
        form=new FormData();
        for(var key in data)
        {
            form.append(key,data[key]);
        }
    }
    if(!run)
    {
        var request;
        if(method.toLowerCase()=="post")
        {
            request=Vue.http.post;
        }
        else if(method.toLowerCase()=="put")
        {
            request=Vue.http.put;
        }
        else if(method.toLowerCase()=="patch")
        {
            request=Vue.http.patch;
        }
        return request.call(Vue.http,config.baseUrl+path,form,{
            headers:headers,
            before:beforeFunc,
            credentials:true
        }).then(function (res) {
            var json=res.body;
            if(json.code==13)
            {
                location.href="/html/web/login/login.html"
            }
            else if(json.code==35)
            {
                session.remove("versionId");
                session.remove("versionName");
                session.remove("versionDis");
                location.reload();
            }
            else
            {
                return json;
            }
        })
    }
    else
    {
        return new Promise(function (resolve,reject) {
            var xhr=new XMLHttpRequest();
            xhr.withCredentials=true;
            xhr.open(method,bNet?path:(config.baseUrl+path),true);
            if(headers)
            {
                for(var key in headers)
                {
                    xhr.setRequestHeader(key,headers[key]);
                }
            }
            xhr.onreadystatechange=function () {
                if(xhr.readyState == 4) {
                    var resObj;
                    if(xhr.responseType=="string" || xhr.responseType=="" || xhr.responseType=="json")
                    {
                        var strStr=xhr.responseText;
                        try
                        {
                            resObj=JSON.parse(strStr);
                        }
                        catch (err)
                        {
                            resObj=strStr;
                        }
                    }
                    else
                    {
                        if((xhr.responseType=="blob" || xhr.responseType=="arraybuffer" || xhr.responseType=="document") &&  xhr.response.size<=1024*5)
                        {
                            var reader = new FileReader();
                            reader.onload = function(){
                                var content = reader.result;
                                if(/application\/xml/i.test(xhr.getResponseHeader("content-type")) || /text\/xml/i.test(xhr.getResponseHeader("content-type")))
                                {
                                    resObj=content;
                                }
                                else
                                {
                                    try
                                    {
                                        resObj=JSON.parse(content);
                                    }
                                    catch (err)
                                    {
                                        resObj=xhr.response;
                                    }
                                }
                                var obj={
                                    data:resObj,
                                    status:xhr.status,
                                    header:convertHeader(xhr.getAllResponseHeaders()),
                                }
                                resolve(obj);
                            };
                            reader.onerror = function(event){
                                resObj=xhr.response;
                                var obj={
                                    data:resObj,
                                    status:xhr.status,
                                    header:convertHeader(xhr.getAllResponseHeaders()),
                                }
                                resolve(obj);
                            };
                            reader.readAsText(xhr.response);
                            return;
                        }
                        else
                        {
                            resObj=xhr.response;
                        }
                    }
                    var obj={
                        data:resObj,
                        status:xhr.status,
                        header:convertHeader(xhr.getAllResponseHeaders()),
                    }
                    resolve(obj)
                    return;
                }
            }
            xhr.send(form);
        })
    }

}

module.exports=net;







