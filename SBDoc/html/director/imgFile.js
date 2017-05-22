/**
 * Created by sunxin on 16/8/29.
 */
function getUrl(el,file) {
    if(!file)
    {
        return null;
    }
    if(el.img && document.getElementById(el.img).src.match(/^blob\:/i))
    {
        el.destoryFunc(document.getElementById(el.img).src);
    }
    var url = el.createFunc(file);
    return url;
}
var obj={
    bind:function (el,binding) {
        if (window.createObjectURL != undefined) { // basic
            el.createFunc = window.createObjectURL;
            el.destoryFunc=window.revokeObjectURL;
        }  else if (window.URL != undefined) { // mozilla(firefox)
            el.createFunc = window.URL.createObjectURL;
            el.destoryFunc=window.URL.revokeObjectURL;
        } else if (window.webkitURL != undefined) { // webkit or chrome
            el.createFunc = window.webkitURL.createObjectURL;
            el.destoryFunc=window.webkitURL.revokeObjectURL;
        }
        el.img=binding.value;
        el.onchange=function () {
            var url=getUrl(el,el.files[0]);
            if(el.img && url)
            {
                document.getElementById(el.img).src=url;
            }
        }
    },
    unbind:function (el) {
        el.onchange=null;
        if(el.img && document.getElementById(el.img) && document.getElementById(el.img).src.test(/^blob\:/i))
        {
            el.destoryFunc(document.getElementById(el.img).src);
        }
    },
    update:function (el) {
        if(el.img)
        {
            return;
        }
        setTimeout(function () {
            el.img=el;
        },100);
    }
}

module.exports=obj;