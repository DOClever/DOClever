module.exports={
    data:function () {
        return {
            session:$.clone(session.raw())
        }
    },
    created:function () {
        var _this=this;
        document.addEventListener("sessionChange",function (event) {
            Vue.set(_this.session,event.key,event.value);
        })
        document.addEventListener("sessionClear",function (event) {
            _this.session={};
        })
        document.addEventListener("sessionRemove",function (event) {
            if(_this.session[event.key]!==undefined)
            {
                Vue.delete(_this.session,event.key);
            }
        })
    }
}