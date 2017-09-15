module.exports={
    data:function () {
        return {
            session:$.clone(session.raw())
        }
    },
    created:function () {
        var _this=this;
        document.addEventListener("cookieChange",function (event) {
            _this.session[event.key]=event.value;
        })
    }
}