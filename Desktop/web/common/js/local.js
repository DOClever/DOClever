/**
 * Created by sunxin on 2017/2/20.
 */
var config=require("./config");
var local={};
local.update=function (data,remember,pass) {
    sessionStorage.setItem("login","1");
    if(data._id!==undefined && data._id!==null)
    {
        local.set("id",data._id);
        global.api.cookie.set("docleveruserid",data._id,1);
    }
    else
    {
        local.remove("id");
        global.api.cookie.remove("docleveruserid");
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
    if(data.phone!==undefined && data.phone!==null)
    {
        local.set("phone",data.phone);
    }
    else
    {
        local.remove("phone");
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
    if(remember)
    {
        local.set("remember",1);
    }
    else
    {
        local.remove("remember");
    }
    if(pass)
    {
        local.set("password",pass);
    }
    else
    {
        local.remove("password");
    }
}

local.get=function (key) {
    return localStorage.getItem(key);
}

local.set=function (key,value) {
    localStorage.setItem(key,value);
    var event = document.createEvent('HTMLEvents');
    event.initEvent("sessionChange", false, false);
    event.key = key;
    event.value = value;
    document.dispatchEvent(event);
}

local.clear=function () {
    localStorage.clear();
    var event = document.createEvent('HTMLEvents');
    event.initEvent("sessionClear", false, false);
    document.dispatchEvent(event);
}

local.raw=function () {
    let obj={};
    for(var i=0;i<localStorage.length;i++)
    {
        obj[localStorage.key(i)]=localStorage.getItem(localStorage.key(i));
    }
    return obj;
}

local.remove=function (item) {
    localStorage.removeItem(item);
    var event = document.createEvent('HTMLEvents');
    event.initEvent("sessionRemove", false, false);
    event.key = item;
    document.dispatchEvent(event);
}

module.exports=local;