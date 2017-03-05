/**
 * Created by sunxin on 2017/2/20.
 */
try {
    sessionStorage.setItem('isPrivateMode', '1');
    sessionStorage.removeItem('isPrivateMode');
    window.isPrivateMode = false;
} catch(e) {
    window.isPrivateMode = true;
}
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        var c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            var c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return decodeURIComponent(document.cookie.substring(c_start,c_end))
        }
    }
    return undefined;
}
function setCookie(c_name,value)
{
    document.cookie=c_name+ "=" +encodeURIComponent(value)
}

function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = 0;i<keys.length;i++)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=undefined && cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
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
local.update=function (data) {
    if(data._id!==undefined && data._id!==null)
    {
        local.set("id",data._id);
    }
    else
    {
        local.remove("id");
    }
    if(data.name!==undefined && data.name!==null)
    {
        local.set("name",data.name);
    }
    else
    {
        local.remove("name");
    }
    if(data.photo!==undefined && data.photo!==null)
    {
        local.set("photo",data.photo);
    }
    else
    {
        local.remove("photo");
    }
    if(data.qq!==undefined && data.qq!==null)
    {
        local.set("qq",data.qq);
    }
    else
    {
        local.remove("qq");
    }
    if(data.email!==undefined && data.email!==null)
    {
        local.set("email",data.email);
    }
    else
    {
        local.remove("email");
    }
    if(data.sex!==undefined && data.sex!==null)
    {
        local.set("sex",data.sex);
    }
    else
    {
        local.remove("sex");
    }
    if(data.age!==undefined && data.age!==null)
    {
        local.set("age",data.age);
    }
    else
    {
        local.remove("age");
    }
    if(data.company!==undefined && data.company!==null)
    {
        local.set("company",data.company);
    }
    else
    {
        local.remove("company");
    }
    if(data.loginCount!==undefined && data.loginCount!==null)
    {
        local.set("loginCount",data.loginCount);
    }
    else
    {
        local.remove("loginCount");
    }
}

local.get=function (key) {
    if(window.isPrivateMode)
    {
        return getCookie(key)
    }
    else
    {
        return sessionStorage.getItem(key);
    }

}

local.set=function (key,value) {
    if(window.isPrivateMode)
    {
        setCookie(key,value);
    }
    else
    {
        sessionStorage.setItem(key,value);
    }

}

local.clear=function () {
    if(window.isPrivateMode)
    {
        clearAllCookie();
    }
    else
    {
        sessionStorage.clear();
    }

}

local.raw=function () {
    if(window.isPrivateMode)
    {
        return getCookieObj();
    }
    else
    {
        return sessionStorage;
    }
}

local.remove=function (item) {
    if(window.isPrivateMode)
    {
        delCookie(item)
    }
    else
    {
        sessionStorage.removeItem(item);
    }

}

module.exports=local;