/**
 * Created by sunxin on 2017/7/8.
 */
var obj={
    bind:function (el,binding,vnode) {
        function finish(val) {
            el.removeAttribute("scrolling");
            if(val==1)
            {
                el.removeEventListener("scroll",scroll);
            }
        }
        function scroll(e) {
            if(el.scrollTop + el.clientHeight >= el.scrollHeight-50 && !el.hasAttribute("scrolling"))           {
                if(binding.value)
                {
                    el.setAttribute("scrolling","1");
                    binding.value(finish);
                }
            }
        }
        el.addEventListener("scroll",scroll)
    },
    unbind:function (el) {

    },
    update:function (el,binding) {

    }
}

module.exports=obj;