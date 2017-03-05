/**
 * Created by sunxin on 2017/2/21.
 */
var config=require("../util/config");
var obj={
    bind:function (el,binding) {
        var img=new Image();
        img.src=config.host+binding.value
        el.src="/html/web/pic/logo.png";
        img.onload=function () {
            el.src=img.src
        }
    },
    unbind:function (el) {

    },
    update:function (el,binding) {
        if(binding.oldValue!=binding.value)
        {
            var img=new Image();
            img.src=config.host+binding.value
            el.src="/html/web/pic/logo.png";
            img.onload=function () {
                el.src=img.src
            }
        }
    }
}

module.exports=obj;