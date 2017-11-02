/**
 * Created by sunxin on 2017/2/20.
 */
var arrCookie=["id","name","photo","qq","email","sex","age","company","loginCount","remember","sort"]
var config=require("./config");
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        var arr,reg=new RegExp("(^| )"+c_name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return undefined;
    }
    return undefined;
}
function setCookie(c_name,value,time)
{
    if(time)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() + time);
        document.cookie=c_name+ "=" +encodeURIComponent(value)+ ";expires=" + exp.toGMTString()+";path=/;";
    }
    else
    {
        document.cookie=c_name+ "=" +encodeURIComponent(value)+";path=/;";
    }
    var event = document.createEvent('HTMLEvents');
    event.initEvent("cookieChange", false, false);
    event.key = c_name;
    event.value = value;
    document.dispatchEvent(event);
}

function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = 0;i<keys.length;i++)
        {
            delCookie(keys[i]);
        }
    }
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=undefined && cval!=null)
    {
        document.cookie= name + "="+cval+";expires="+exp.toGMTString()+";path=/;";
    }
}

function getCookieObj() {
    var obj={};
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = 0;i<keys.length;i++)
        {
            obj[keys[i]]=getCookie(keys[i]);
        }
    }
    return obj;
}

var local={};
local.update=function (data,remember) {
    sessionStorage.setItem("login","1");
    if(data._id!==undefined && data._id!==null)
    {
        local.set("id",data._id,remember);
    }
    else
    {
        local.remove("id");
    }
    if(data.name!==undefined && data.name!==null)
    {
        local.set("name",data.name,remember);
    }
    else
    {
        local.remove("name");
    }
    if(data.photo!==undefined && data.photo!==null)
    {
        local.set("photo",data.photo,remember);
    }
    else
    {
        local.remove("photo");
    }
    if(data.qq!==undefined && data.qq!==null)
    {
        local.set("qq",data.qq,remember);
    }
    else
    {
        local.remove("qq");
    }
    if(data.email!==undefined && data.email!==null)
    {
        local.set("email",data.email,remember);
    }
    else
    {
        local.remove("email");
    }
    if(data.sex!==undefined && data.sex!==null)
    {
        local.set("sex",data.sex,remember);
    }
    else
    {
        local.remove("sex");
    }
    if(data.age!==undefined && data.age!==null)
    {
        local.set("age",data.age,remember);
    }
    else
    {
        local.remove("age");
    }
    if(data.company!==undefined && data.company!==null)
    {
        local.set("company",data.company,remember);
    }
    else
    {
        local.remove("company");
    }
    if(data.loginCount!==undefined && data.loginCount!==null)
    {
        local.set("loginCount",data.loginCount,remember);
    }
    else
    {
        local.remove("loginCount");
    }
    if(remember)
    {
        local.set("remember",1,1);
    }
}

local.get=function (key) {
    if(arrCookie.indexOf(key)>-1)
    {
        return getCookie(key)
    }
    else
    {
        return sessionStorage.getItem(key);
    }
}

local.set=function (key,value,remember) {
    if(arrCookie.indexOf(key)>-1)
    {
        setCookie(key,value,remember?1000*3600*24*7:0);
    }
    else
    {
        sessionStorage.setItem(key,value);
    }
}

local.clear=function () {
    clearAllCookie();
    sessionStorage.clear();
}

local.raw=function () {
    var obj=getCookieObj();
    for(var i=0;i<sessionStorage.length;i++)
    {
        obj[sessionStorage.key(i)]=sessionStorage.getItem(sessionStorage.key(i));
    }
    return obj;
}

local.remove=function (item) {
    if(arrCookie.indexOf(item)>-1)
    {
        delCookie(item)
    }
    else
    {
        sessionStorage.removeItem(item);
    }
}

;(function () {
    var id=local.get("id");
    if(!id)
    {
        if(/project/.test(location.href) || /person/.test(location.href) || /team/.test(location.href))
        {
            location.href="../login/login.html"
        }
    }
    else
    {
        if(/\/login\.html/.test(location.href))
        {
            location.href="../project/project.html"
            return
        }
        else if(sessionStorage.getItem("login"))
        {
            return;
        }
        var xhr=new XMLHttpRequest();
        xhr.withCredentials=true;
        xhr.open("POST",config.baseUrl+"/user/login",true);
        xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
        xhr.onreadystatechange=function () {
            if(xhr.readyState == 4) {
                var data=JSON.parse(xhr.responseText);
                if(data.code==200)
                {
                    var remember=local.get("remember");
                    local.update(data.data,remember==1?1:0);
                }
            }
        }
        xhr.send($.param({
            id:id
        }));
    }
})();

module.exports=local;