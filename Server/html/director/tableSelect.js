/**
 * Created by sunxin on 16/8/29.
 */
var obj={
    bind:function () {
        var _this=this;
        this.unwatch=this.vm.$watch("data",function () {
            var trs=_this.el.querySelectorAll("tbody tr");
            for(var i=0;i<trs.length;i++)
            {
                var tr=trs[i];
                tr.onclick=function () {
                    for(var j=0;j<trs.length;j++)
                    {
                        var tr1=trs[j];
                        if(tr1==this)
                        {
                            tr1.style.backgroundColor="lightgray"
                        }
                        else
                        {
                            tr1.style.backgroundColor="white"
                        }
                    }
                }
            }
        })
    },
    unbind:function () {
        if(this.unwatch)
        {
            this.unwatch();
        }
    },
    update:function (ele) {

    },
    unwatch:null
}

module.exports=obj;