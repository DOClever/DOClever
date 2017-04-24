webpackJsonp([0],{

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(session, Vue, $, net) {/**
 * Created by sunxin on 2016/12/17.
 */
var mainNav=__webpack_require__(7)
var imgFile=__webpack_require__(51)
var proxyImg=__webpack_require__(17)
var config=__webpack_require__(9);
if(!session.get("id"))
{
    location.href="../login/login.html"
}
var vue=new Vue({
    el: "#app",
    data: {
        infoShow:1,
        session:$.clone(session.raw()),
        oldPass:"",
        newPass:"",
        newPass1:"",
        savePending:false,
        passPending:false,
    },
    components:{
        "mainnav":mainNav,
    },
    methods:{
        saveInfo:function () {
            var _this=this;
            var obj={};
            if($.query("#file").value)
            {
                obj.photo=$.query("#file").files[0];
            }
            if(this.session.age)
            {
                obj.age=this.session.age
            }
            if(this.session.sex)
            {
                obj.sex=this.session.sex
            }
            if(this.session.company)
            {
                obj.company=this.session.company
            }
            if(this.session.qq)
            {
                obj.qq=this.session.qq
            }
            if(this.session.email)
            {
                obj.email=this.session.email
            }
            obj.userid=this.session.id;
            this.savePending=true;
            net.upload("post","/user/save",obj).then(function (data) {
                _this.savePending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '更新成功',
                        type: 'success'
                    });
                    session.update(data.data);
                    _this.session=$.clone(session.raw());
                    _this.$emit("updatePhoto",data.data.photo);
                }
                else
                {
                    _this.$notify({
                        title: data.msg,
                        type: 'error'
                    });
                }
            })
        },
        editPass:function () {
            if(!this.oldPass || !this.newPass || !this.newPass1)
            {
                this.$message.error("请填写完整信息");
                return;
            }
            else if(this.newPass!=this.newPass1)
            {
                this.$message.error("两次填写的密码不一致");
                return;
            }
            var _this=this;
            this.passPending=true;
            net.put("/user/editpass",{
               userid:_this.session.id,
                oldpass:_this.oldPass,
                newpass:_this.newPass
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                _this.passPending=false;
                if(data.code==200)
                {
                    _this.$notify({
                        title: '修改成功',
                        type: 'success'
                    });
                    _this.oldPass="";
                    _this.newPass="";
                    _this.newPass1="";
                }
                else
                {
                    _this.$notify({
                        title: data.msg,
                        type: 'error'
                    });
                }
            })
        }
    },
    directives:{
        "imgfile":imgFile,
        "proxy":proxyImg
    }
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1), __webpack_require__(0), __webpack_require__(5)))

/***/ }),

/***/ 51:
/***/ (function(module, exports) {

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

/***/ })

},[158]);
//# sourceMappingURL=person.js.map