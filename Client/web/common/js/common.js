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

$.startLoading=function (scope) {
    var arr=["不忘初心，方得始终","愿每一个程序员有情人终成眷属","嘿咻嘿咻拼命加载中！"];
    if(document.getElementById("SBDocStartLoading"))
    {
        return;
    }
    var ele=document.createElement("div");
    ele.id="SBDocStartLoading";
    ele.style.position="absolute";
    ele.style.zIndex=10000;
    ele.style.backgroundColor="white";
    var ele1;
    if(scope==1)
    {
        ele1=document.getElementById("showContent");
        ele.style.left="100px";
        ele.style.top="60px";
        ele.style.width="calc(100vw - 100px)";
        ele.style.height="calc(100vh - 60px)";
    }
    else if(scope==2)
    {
        ele1=document.getElementById("interfaceContent");
        var rect=ele1.getBoundingClientRect();
        ele.style.left=rect.left+"px";
        ele.style.top=rect.top+40+"px";
        ele.style.width=rect.width+"px";
        ele.style.height="calc(100vh - 155px)";
    }
    else if(scope==3)
    {
        ele1=document.getElementById("testInfoContent");
        var rect=ele1.getBoundingClientRect();
        ele.style.left=rect.left+"px";
        ele.style.top=rect.top+40+"px";
        ele.style.width=rect.width+"px";
        ele.style.height="calc(100vh - 155px)";
    }
    else
    {
        ele.style.left=0;
        ele.style.top=0;
        ele.style.width="100%";
        ele.style.height=document.documentElement.clientHeight+"px";
    }
    ele.innerHTML='<div style="text-align: center;margin-top: '+(document.documentElement.clientHeight/2-100)+'px"><div class="fa fa-spinner fa-spin" style="color: #50bfff;font-size: 30px;"></div><div style="margin-top: 30px;color: gray;font-size: 15px">'+(ele1?arr[parseInt(Math.random()*arr.length)]:"DOClever,做最好的接口管理平台")+'</div></div>'
    document.body.appendChild(ele);
}

$.stopLoading=function () {
    setTimeout(function () {
        var ele=document.getElementById("SBDocStartLoading");
        if(ele)
        {
            ele.style.animationDuration="0.3s";
            ele.style.animationDelay="0s";
            $.addClass(ele,"animated fadeOut");
            $.once(ele,"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function () {
                var ele=document.getElementById("SBDocStartLoading");
                if(ele)
                {
                    ele.parentNode.removeChild(ele);
                }
            })
        }
    },100);
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
    Vue.prototype.$confirm(title, 'DOClever', {
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
    if(bOk==1)
    {
        Vue.prototype.$message.success(content);
    }
    else if(bOk==0)
    {
        Vue.prototype.$message.error(content);
    }
    else if(bOk==2)
    {
        Vue.prototype.$message.warning(content);
    }
}

$.notify=function (content,bOk) {
    if(bOk)
    {
        Vue.prototype.$notify({
            title: content,
            type: 'success',
            duration:1000
        });
    }
    else
    {
        Vue.prototype.$notify({
            title: content,
            type: 'error',
            duration:1000
        });
    }
}

$.input=function (title,func,defaultValue) {
    Vue.prototype.$prompt(title, 'DOClever', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator:function (value) {
            if(value==="")
            {
                return "请输入内容"
            }
        },
        inputValue:defaultValue?defaultValue:""
    }).then(function (value) {
        if(func)
        {
            func(value);
        }
    }).catch(function () {

    });
}

$.showMenu=function (vue,eleInput,data) {
    var ele=document.createElement("div");
    vue.$el.appendChild(ele);
    var xy=$.getCaretCoordinates(eleInput,eleInput.selectionStart);
    var bound=eleInput.getBoundingClientRect();
    var self = vue;
    var Child = Vue.extend(require("component/multiMenu.vue"));
    var child = new Child({
        el: ele,
        parent: self,
        propsData:{
            source:data
        }
    });
    child.$on("level",function (level) {
        var ele=child.$el;
        var width=level*150;
        if(bound.left+width>document.documentElement.clientWidth)
        {
            ele.style.left=document.documentElement.clientWidth-width+"px";
        }
        else
        {
            ele.style.left=xy.left+bound.left+"px";
        }
    })
    child.$el.style.left=xy.left+bound.left+"px";
    if(xy.top+bound.top+xy.height+210>document.documentElement.clientHeight)
    {
        child.$el.style.top=xy.top+bound.top-210+"px";
    }
    else
    {
        child.$el.style.top=xy.top+bound.top+xy.height+10+"px";
    }
    return child;
}

$.inputMul=function (vue,placeholder,func,hudRemove,content) {
    var ele=document.createElement("div");
    vue.$el.appendChild(ele);
    var self = vue;
    var Child = Vue.extend(require("component/inputMul.vue"));
    var child = new Child({
        el: ele,
        parent: self,
        propsData:{
            placeholder:placeholder,
            hudremove:hudRemove,
            source:content
        }
    });
    child.$data.showDialog=true;
    child.$refs.box.$on("close",function () {
        child.$el.parentNode.removeChild(child.$el);
    })
    child.$on("save",function (val) {
        if(func)
        {
            var ret=func(val);
            if(ret)
            {
                child.$data.showDialog=false;
            }
        }
        else
        {
            child.$data.showDialog=false;
        }
    })
    return child;
}

$.inputTwo=function (vue,labelTitle,labelContent,placeholderTitle,placeholderContent,textTitle,textContent,func,hudRemove) {
    var ele=document.createElement("div");
    vue.$el.appendChild(ele);
    var self = vue;
    var Child = Vue.extend(require("component/inputTwo.vue"));
    var child = new Child({
        el: ele,
        parent: self,
        propsData:{
            name1:labelTitle,
            name2:labelContent,
            placeholder1:placeholderTitle,
            placeholder2:placeholderContent,
            text1:textTitle,
            text2:textContent,
            hudremove:hudRemove
        }
    });
    child.$data.showDialog=true;
    child.$refs.box.$on("close",function () {
        child.$el.parentNode.removeChild(child.$el);
    })
    child.$on("save",function (val1,val2) {
        if(func)
        {
            var ret=func(val1,val2);
            if(ret)
            {
                child.$data.showDialog=false;
            }
        }
        else
        {
            child.$data.showDialog=false;
        }
    })
    return child;
}

var hud=null;
$.startHud=function (ele) {
    if(ele)
    {
        hud=Vue.prototype.$loading({
            target:ele,
            background:"white"
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

$.getNowFormatDate=function(fmt,date) {
    var date=date || new Date();
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

$.showBox=function (vue,obj,attr) {
    var ele=document.createElement("div");
    vue.$el.appendChild(ele);
    var self = vue;
    var module;
    var Child = Vue.extend(obj);
    var child = new Child({
        el: ele,
        parent: self,
        propsData:attr?attr:null
    });
    child.$data.showDialog=true;
    child.$refs.box.$on("close",function () {
        child.$el.parentNode.removeChild(child.$el);
        child.$destroy();
    })
    return child;
}

$.param=function (obj,bKey) {
    var arr=[];
    for(var key in obj)
    {
        arr.push((bKey?encodeURIComponent(key):key)+"="+encodeURIComponent(obj[key]));
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

$.createUrlObject=function(obj) {
    if (window.createObjectURL != undefined) { // basic
        return window.createObjectURL(obj);
    }  else if (window.URL != undefined) { // mozilla(firefox)
        return window.URL.createObjectURL(obj);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        return window.webkitURL.createObjectURL(obj);
    }
}

$.revokeUrlObject=function(obj) {
    if (window.createObjectURL != undefined) { // basic
        return window.revokeObjectURL(obj);
    }  else if (window.URL != undefined) { // mozilla(firefox)
        return window.URL.revokeObjectURL(obj);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        return window.webkitURL.revokeObjectURL(obj);
    }
}

$.basePath=function () {
    var path=location.href;
    var index=path.indexOf("/controller/");
    return path.substring(0,index+"/controller/".length)
}

$.rand=function (Min,Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

$.getCaretCoordinates=function (element, position, options) {
    var properties = [
        'direction',
        'boxSizing',
        'width',
        'height',
        'overflowX',
        'overflowY',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',
        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',
        'letterSpacing',
        'wordSpacing',
        'tabSize',
        'MozTabSize'
    ];
    var isBrowser = (typeof window !== 'undefined');
    var isFirefox = (isBrowser && window.mozInnerScreenX != null);
    if (!isBrowser) {
        throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
    }
    var debug = options && options.debug || false;
    if (debug) {
        var el = document.querySelector('#input-textarea-caret-position-mirror-div');
        if (el) el.parentNode.removeChild(el);
    }
    var div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);
    var style = div.style;
    var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
    var isInput = element.nodeName === 'INPUT';
    style.whiteSpace = 'pre-wrap';
    if (!isInput)
        style.wordWrap = 'break-word';
    style.position = 'absolute';
    if (!debug)
        style.visibility = 'hidden';
    properties.forEach(function (prop) {
        if (isInput && prop === 'lineHeight') {
            style.lineHeight = computed.height;
        } else {
            style[prop] = computed[prop];
        }
    });
    if (isFirefox) {
        if (element.scrollHeight > parseInt(computed.height))
            style.overflowY = 'scroll';
    } else {
        style.overflow = 'hidden';
    }
    div.textContent = element.value.substring(0, position);
    if (isInput)
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    var span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
    div.appendChild(span);
    var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
        height: parseInt(computed['lineHeight'])
    };
    if (debug) {
        span.style.backgroundColor = '#aaa';
    } else {
        document.body.removeChild(div);
    }
    return coordinates;
}

$.tagReplace=function (str) {
    var tagsToReplace = {
        '&': '&amp',
        '<': '&lt',
        '>': '&gt'
    };
    return str.replace(/[&<>]/g, function (tag) {
        return tagsToReplace[tag] || tag;
    });
}

$.insertTextAtCursor=function (el, text) {
    var val = el.value, endIndex, range;
    if (typeof el.selectionStart != "undefined" && typeof el.selectionEnd != "undefined") {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, el.selectionStart) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (typeof document.selection != "undefined" && typeof document.selection.createRange != "undefined") {
        el.focus();
        range = document.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}

;(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();

module.exports=$;













