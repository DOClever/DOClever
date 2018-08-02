/**
 * Created by sunxin on 2017/2/21.
 */
var config=require("common/js/config");
var obj={
    bind:function (el,binding) {
        el.src=require("resource/pic/default.png");
        if(binding.value)
        {
            var img=new Image();
            img.src=config.host+binding.value
            img.onload=function () {
                el.src=img.src
            }
        }
    },
    unbind:function (el) {

    },
    update:function (el,binding) {
        if(binding.oldValue!=binding.value && binding.value)
        {
            var img=new Image();
            img.src=config.host+binding.value
            el.src=require("resource/pic/default.png");
            img.onload=function () {
                el.src=img.src
            }
        }
    }
}

module.exports=obj;