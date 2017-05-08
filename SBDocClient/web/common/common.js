/**
 * Created by sunxin on 2017/2/16.
 */
if(Vue)
{
    window.Vue=Vue;
}
Vue.use(Vuex);
document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
}
var $={};
$.ready = function (callback) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
            callback();
        }, false)
    }
    else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                callback();
            }
        })
    }
    else if (document.lastChild == document.body) {
        callback();
    }
}

$.trim=function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

$.clone=function(o){
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

$.addClass=function (ele,name) {
    if(ele.className=="")
    {
        ele.className=name;
    }
    else
    {
        ele.className+=" "+name;
    }
}

$.removeClass=function (ele,name) {
    var reg=new RegExp(name+"|\\s+"+name+"|"+name+"\\s+","gi")
    ele.className=ele.className.replace(reg,"");
}

$.addEventListener=function (ele,ev,fn) {
    var arr=ev.split(" ");
    arr.forEach(function (obj) {
        if(ele.attachEvent)
        {
            ele.attachEvent("on" + obj,fn);
        }
        else
        {
            ele.addEventListener(obj,fn,false);
        }
    })
}

$.removeEventListener=function (ele,ev,fn) {
    var arr=ev.split(" ");
    arr.forEach(function (obj) {
        if(ele.detachEvent)
        {
            ele.detachEvent("on" + obj,fn);
        }
        else
        {
            ele.removeEventListener(obj,fn);
        }
    })

}

$.once=function (ele,ev,fn) {
    $.addEventListener(ele,ev,function () {
        fn.apply(this,arguments);
        $.removeEventListener(ele,ev,arguments.callee);
    })
}

$.startLoading=function () {
    if(document.getElementById("SBDocStartLoading"))
    {
        return;
    }
    var ele=document.createElement("div");
    ele.id="SBDocStartLoading"
    document.body.appendChild(ele);
    ele.style.position="absolute";
    ele.style.zIndex=10000;
    ele.style.left=0;
    ele.style.top=0;
    ele.style.width="100%";
    ele.style.height=document.documentElement.clientHeight+"px";
    ele.style.backgroundColor="white";
    ele.innerHTML='<div style="text-align: center;margin-top: '+(document.documentElement.clientHeight/2-100)+'px"><div class="el-icon-loading" style="color: #20A0FF;font-size: 40px;"></div><div style="margin-top: 30px;color: gray;font-size: 20px">SBDoc,做最好的接口管理平台</div></div>'
}

$.stopLoading=function () {
    var ele=document.getElementById("SBDocStartLoading");
    if(ele)
    {
        $.addClass(ele,"animated fadeOut");
        $.once(ele,"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function () {
            var ele=document.getElementById("SBDocStartLoading");
            if(ele)
            {
                ele.parentNode.removeChild(ele);
            }
        })
    }
}

$.animate=function (ele,style) {
    if(ele)
    {
        style="animated "+style;
        $.addClass(ele,style);
        $.once(ele,"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function () {
            $.removeClass(ele,style);
        })
    }
}

$.query=function (str,ele) {
    if(ele)
    {
        return ele.querySelector(str);
    }
    else
    {
        return document.querySelector(str);
    }
}

$.queryAll=function (str,ele) {
    if(ele)
    {
        return ele.querySelectorAll(str);
    }
    else
    {
        return document.querySelectorAll(str);
    }
}

$.confirm=function (title,funcOk,funcCancel) {
    Vue.prototype.$confirm(title, 'SBDoc', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(function () {
        if(funcOk)
        {
            funcOk();
        }
    }).catch(function () {
        if(funcCancel)
        {
            funcCancel();
        }
    })
}

$.tip=function (content,bOk) {
    if(bOk)
    {
        Vue.prototype.$message.success(content);
    }
    else
    {
        Vue.prototype.$message.error(content);
    }
}

$.notify=function (content,bOk) {
    if(bOk)
    {
        Vue.prototype.$notify({
            title: content,
            type: 'success'
        });
    }
    else
    {
        Vue.prototype.$notify({
            title: content,
            type: 'error'
        });
    }
}

$.input=function (title,func) {
    Vue.prototype.$prompt(title, 'SBDoc', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator:function (value) {
            if(value==="")
            {
                return "请输入内容"
            }
        }
    }).then(function (value) {
        if(func)
        {
            func(value);
        }
    }).catch(function () {

    });
}

$.inputMul=function (vue,placeholder,func,hudRemove) {
    var ele=document.createElement("div");
    vue.$el.appendChild(ele);
    var self = vue;
    var Child = Vue.extend(require("../component/inputMul.vue"));
    var child = new Child({
        el: ele,
        parent: self,
        propsData:{
            placeholder:placeholder,
            hudremove:hudRemove
        }
    });
    child.$refs.box.open();
    child.$refs.box.$on("close",function () {
        child.$el.parentNode.removeChild(child.$el);
    })
    child.$on("save",function (val) {
        if(func)
        {
            var ret=func(val);
            if(ret)
            {
                child.$refs.box.close();
            }
        }
        else
        {
            child.$refs.box.close();
        }
    })
    return child;
}

var hud=null;
$.startHud=function (ele) {
    if(ele)
    {
        hud=Vue.prototype.$loading({
            target:ele
        })
    }
    else
    {
        hud=Vue.prototype.$loading({
            fullscreen: true
        })
    }
}

$.stopHud=function () {
    if(hud)
    {
        hud.close();
        hud=null;
    }
}

$.getNowFormatDate=function(fmt) {
    var date=new Date();
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

$.showBox=function (vue,type,attr) {
    var ele=document.createElement("div");
    vue.$el.appendChild(ele);
    var self = vue;
    var Child = Vue.extend(require("../component/"+type+".vue"));
    var child = new Child({
        el: ele,
        parent: self,
        propsData:attr?attr:null
    });
    child.$refs.box.open();
    child.$refs.box.$on("close",function () {
        child.$el.parentNode.removeChild(child.$el);
        child.$destroy();
    })
    return child;
}

$.param=function (obj) {
    var arr=[];
    for(var key in obj)
    {
        arr.push(key+"="+encodeURIComponent(obj[key]));
    }
    return arr.join("&");
}

$.inArr=function (str,arr) {
    for(var i=0;i<arr.length;i++)
    {
        if(str.toLowerCase()==arr[i].toLowerCase())
        {
            return true;
        }
    }
    return false;
}

$.parseURL=function(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}


module.exports=$;













