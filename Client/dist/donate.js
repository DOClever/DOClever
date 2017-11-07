webpackJsonp([8],{

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(session, $, net) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var proxyImg = __webpack_require__(8);
var sessionChange = __webpack_require__(6);
var ver = __webpack_require__(17);
module.exports = {
    props: ["transparent"],
    mixins: [sessionChange],
    data: function data() {
        return {
            showTeam: false,
            applyPending: false,
            applyName: "",
            applyDis: "",
            newMsg: false,
            proxy: session.get("proxy") ? true : false,
            bShowApply: document.title.indexOf("DOClever") > -1 ? false : true,
            admin: sessionStorage.getItem("admin"),
            adminPhoto: "/html/web/pic/admin/admin.jpeg",
            adminPage: location.href.indexOf("admin.html") > -1 ? 1 : 0
        };
    },
    directives: {
        proxy: proxyImg
    },
    watch: {
        proxy: function proxy(val) {
            if (val) {
                session.set("proxy", 1);
                $.tip("Proxy代理已开启", 1);
            } else {
                session.remove("proxy");
                $.tip("Proxy代理已关闭", 1);
            }
        }
    },
    methods: {
        handleCommand: function handleCommand(command) {
            if (command == "team") {
                location.href = "/html/web/team/team.html";
            } else if (command == "list") {
                location.href = "/html/web/project/project.html";
            } else if (command == "apply") {
                this.showTeam = true;
                document.getElementById("navBar").style.zIndex = "";
                this.$refs.team.$on("close", function () {
                    document.getElementById("navBar").style.zIndex = 100;
                });
            } else if (command == "setting") {
                location.href = "/html/web/person/person.html";
            } else if (command == "message") {
                var _this = this;
                $.startHud();
                net.get("/message/list", {
                    page: 0
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        _this.newMsg = false;
                        document.getElementById("navBar").style.zIndex = "";
                        var child = $.showBox(_this, __webpack_require__(13), {
                            propArr: data.data
                        });
                        child.$on("close", function () {
                            document.getElementById("navBar").style.zIndex = 100;
                        });
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            } else if (command == "update") {
                var xml = new XMLHttpRequest();
                $.startHud();
                xml.onreadystatechange = function () {
                    if (xml.readyState == 4 && xml.status == 200) {
                        $.stopHud();
                        var obj = JSON.parse(xml.responseText);
                        var verArr = obj[0].name.split(".");
                        var verLocalArr = ver.version.split(".");
                        var bNew = false;
                        for (var i = 0; i < 3; i++) {
                            if (verArr[i] > verLocalArr[i]) {
                                bNew = true;
                                break;
                            } else if (verArr[i] < verLocalArr[i]) {
                                break;
                            }
                        }
                        if (bNew) {
                            $.confirm("已发现新版本" + verArr.join(".") + " 是否现在下载？", function () {
                                window.open(obj[0].zipball_url, "_blank");
                            });
                        } else {
                            $.tip("已经是最新版本了", 1);
                        }
                    }
                };
                xml.open("GET", "https://api.github.com/repos/sx1989827/DOClever/tags?timestamp=" + new Date().getTime(), true);
                xml.send();
            } else if (command == "quit") {
                var _this = this;
                if (this.adminPage) {
                    net.post("/admin/logout", {}).then(function (data) {
                        if (data.code == 200) {
                            _this.$notify({
                                title: '退出成功',
                                type: 'success'
                            });
                            sessionStorage.removeItem("admin");
                            setTimeout(function () {
                                location.href = "/";
                            }, 1000);
                        }
                    });
                } else {
                    net.post("/user/logout", {}).then(function (data) {
                        if (data.code == 200) {
                            _this.$notify({
                                title: '退出成功',
                                type: 'success'
                            });
                            session.clear();
                            setTimeout(function () {
                                location.href = "/";
                            }, 1000);
                        }
                    });
                }
            }
        },
        applyTeam: function applyTeam() {
            if (!this.applyName) {
                $.tip("请输入团队ID", 0);
                return;
            }
            this.applyPending = true;
            var _this = this;
            net.put("/team/userapply", {
                id: this.applyName,
                dis: this.applyDis
            }).then(function (data) {
                _this.applyPending = false;
                _this.applyName = "";
                _this.applyDis = "";
                if (data.code == 200) {
                    $.notify("请求已发送，等待团队管理员响应", 1);
                    _this.showTeam = false;
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    },
    created: function created() {
        var ele;
        this.$nextTick(function () {
            ele = document.getElementById("navBar");
            ele.style.zIndex = 100;
        });
        var _this = this;
        if (this.transparent) {
            $.addEventListener(window, "scroll", function () {
                if (document.body.scrollTop > 50) {
                    ele.style.position = "fixed";
                    ele.style.top = 0;
                    ele.style.backgroundColor = "rgb(39,52,68)";
                } else {
                    ele.style.top = 0;
                    ele.style.backgroundColor = "rgba(0,0,0,0.3)";
                    ele.style.position = "absolute";
                }
            });
        }
        if (session.get("id")) {
            net.get("/message/new").then(function (data) {
                if (data.code == 200) {
                    _this.newMsg = data.data;
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, net) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var scroll = __webpack_require__(16);
module.exports = {
    props: ["propArr"],
    data: function data() {
        return {
            arr: this.propArr,
            page: 0,
            clearPending: false,
            loading: false,
            finish: false,
            showDialog: false
        };
    },
    directives: {
        scroll: scroll
    },
    methods: {
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否删除该消息", function () {
                $.startHud();
                net.delete("/message/item", {
                    id: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                        _this.arr.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        clear: function clear() {
            var _this = this;
            $.confirm("是否清空所有消息", function () {
                _this.clearPending = true;
                net.delete("/message/clear").then(function (data) {
                    _this.clearPending = false;
                    if (data.code == 200) {
                        $.notify("清空成功", 1);
                        _this.$refs.box.close();
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        loadMore: function loadMore(finish) {
            var _this = this;
            this.loading = true;
            net.get("/message/list", {
                page: ++this.page
            }).then(function (data) {
                if (data.code == 200) {
                    _this.loading = false;
                    if (data.data.length > 0) {
                        _this.arr = _this.arr.concat(data.data);
                        finish();
                    } else {
                        finish(1);
                        _this.finish = true;
                    }
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(12),
  /* template */
  __webpack_require__(14),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/component/message.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] message.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-10084b64", Component.options)
  } else {
    hotAPI.reload("data-v-10084b64", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "消息中心",
      "size": "small"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-row', {
    directives: [{
      name: "scroll",
      rawName: "v-scroll",
      value: (_vm.loadMore),
      expression: "loadMore"
    }],
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_vm._l((_vm.arr), function(item) {
    return [_c('el-row', {
      staticClass: "row",
      staticStyle: {
        "font-size": "17px",
        "height": "30px",
        "line-height": "30px"
      }
    }, [_vm._v("\n                " + _vm._s(item.name) + "\n            ")]), _vm._v(" "), _c('el-row', {
      staticClass: "row",
      staticStyle: {
        "font-size": "15px"
      }
    }, [_vm._v("\n                " + _vm._s(item.dis) + "\n            ")]), _vm._v(" "), _c('el-row', {
      staticClass: "row",
      staticStyle: {
        "color": "gray",
        "height": "30px",
        "line-height": "30px"
      }
    }, [_vm._v("\n                " + _vm._s(item.createdAt) + "   \n                "), _c('el-button', {
      staticStyle: {
        "color": "#FF4949"
      },
      attrs: {
        "type": "text",
        "size": "small",
        "icon": "delete2",
        "titile": "删除"
      },
      on: {
        "click": function($event) {
          _vm.remove(item, _vm.index)
        }
      }
    })], 1)]
  }), _vm._v(" "), (!_vm.finish) ? _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "30px"
    },
    attrs: {
      "loading": _vm.loading
    }
  }) : _vm._e()], 2), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "danger",
      "loading": _vm.clearPending
    },
    on: {
      "click": _vm.clear
    }
  }, [_vm._v("\n            清空消息\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-10084b64", module.exports)
  }
}

/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "box-shadow": "0 1px 3px 0 rgba(0, 0, 0, 0.15)"
    },
    style: (_vm.transparent ? {
      height: '50px',
      'backgroundColor': 'rgba(0,0,0,0.3)',
      left: 0,
      top: 0,
      position: 'absolute'
    } : {
      height: '50px',
      'backgroundColor': 'white'
    }),
    attrs: {
      "id": "navBar"
    }
  }, [_vm._t("other"), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "left",
      "line-height": "50px",
      "color": "#50bfff",
      "font-size": "25px",
      "padding-left": "20px"
    },
    attrs: {
      "span": 3
    }
  }, [_c('a', {
    staticStyle: {
      "text-decoration": "none",
      "cursor": "pointer",
      "color": "inherit"
    },
    attrs: {
      "href": "/"
    }
  }, [_vm._v("DOClever")])]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._t("slot3")], 2), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._t("slot4")], 2), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 1
    }
  }), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px",
      "font-size": "25px",
      "color": "#50bfff",
      "white-space": "nowrap",
      "text-overflow": "ellipsis"
    },
    attrs: {
      "span": 8
    }
  }, [_vm._t("title")], 2), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._t("slot1")], 2), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 2
    }
  }, [_vm._t("slot2")], 2), _vm._v(" "), (_vm.session.id || _vm.adminPage) ? _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "white-space": "nowrap",
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 4
    }
  }, [_c('img', {
    directives: [{
      name: "proxy",
      rawName: "v-proxy",
      value: (_vm.adminPage ? _vm.adminPhoto : _vm.session.photo),
      expression: "adminPage?adminPhoto:session.photo"
    }],
    staticStyle: {
      "width": "40px",
      "height": "40px",
      "border-radius": "50%",
      "margin-top": "5px"
    }
  }), _vm._v(" \n        "), _c('el-dropdown', {
    staticStyle: {
      "top": "-15px"
    },
    on: {
      "command": _vm.handleCommand
    }
  }, [(_vm.adminPage) ? _c('span', {
    staticClass: "el-dropdown-link",
    staticStyle: {
      "color": "#50bfff",
      "cursor": "pointer"
    }
  }, [_c('span', [_vm._v("\n                    " + _vm._s(_vm.admin) + "\n                ")]), _vm._v(" "), _c('i', {
    staticClass: "el-icon-caret-bottom el-icon--right"
  })]) : _c('span', {
    staticClass: "el-dropdown-link",
    staticStyle: {
      "color": "#50bfff",
      "cursor": "pointer"
    }
  }, [(_vm.newMsg) ? _c('el-badge', {
    staticClass: "msgBadge",
    attrs: {
      "is-dot": ""
    }
  }, [_vm._v("\n                    " + _vm._s(_vm.session.name) + "\n                ")]) : _c('span', [_vm._v("\n                    " + _vm._s(_vm.session.name) + "\n                ")]), _vm._v(" "), _c('i', {
    staticClass: "el-icon-caret-bottom el-icon--right"
  })], 1), _vm._v(" "), (_vm.adminPage) ? _c('el-dropdown-menu', {
    slot: "dropdown"
  }, [_c('el-dropdown-item', {
    attrs: {
      "command": "quit"
    }
  }, [_vm._v("退出")])], 1) : _c('el-dropdown-menu', {
    slot: "dropdown"
  }, [(_vm.session.team) ? _c('el-dropdown-item', {
    attrs: {
      "command": "team"
    }
  }, [_vm._v("团队首页")]) : _vm._e(), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "list"
    }
  }, [_vm._v("返回列表")]), _vm._v(" "), (_vm.bShowApply) ? _c('el-dropdown-item', {
    attrs: {
      "command": "apply"
    }
  }, [_vm._v("团队申请")]) : _vm._e(), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "setting"
    }
  }, [_vm._v("个人设置")]), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "message"
    }
  }, [(_vm.newMsg) ? _c('el-badge', {
    staticClass: "msgBadge",
    attrs: {
      "is-dot": ""
    }
  }, [_vm._v("\n                        消息中心\n                    ")]) : _c('span', [_vm._v("\n                        消息中心\n                    ")])], 1), _vm._v(" "), _c('el-dropdown-item', [_vm._v("\n                    Proxy:"), _c('br'), _vm._v(" "), _c('el-switch', {
    attrs: {
      "on-color": "#13ce66",
      "off-color": "#ff4949"
    },
    nativeOn: {
      "click": function($event) {
        $event.stopPropagation();
      }
    },
    model: {
      value: (_vm.proxy),
      callback: function($$v) {
        _vm.proxy = $$v
      },
      expression: "proxy"
    }
  })], 1), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "update"
    }
  }, [_vm._v("检查更新")]), _vm._v(" "), _c('el-dropdown-item', {
    attrs: {
      "command": "quit"
    }
  }, [_vm._v("退出")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (!_vm.session.id && !_vm.adminPage) ? _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "info",
      "onclick": "location='/html/web/login/login.html'"
    }
  }, [_vm._v("登录")])], 1) : _vm._e(), _vm._v(" "), (!_vm.session.id && !_vm.adminPage) ? _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center",
      "line-height": "50px"
    },
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "success",
      "onclick": "location='/html/web/register/register.html'"
    }
  }, [_vm._v("注册")])], 1) : _vm._e(), _vm._v(" "), _c('el-dialog', {
    ref: "team",
    attrs: {
      "title": "团队申请",
      "size": "small"
    },
    model: {
      value: (_vm.showTeam),
      callback: function($$v) {
        _vm.showTeam = $$v
      },
      expression: "showTeam"
    }
  }, [_c('el-form', {
    ref: "form",
    attrs: {
      "label-width": "100px"
    }
  }, [_c('el-form-item', {
    attrs: {
      "label": "团队ID"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "placeholder": "请输入你要申请的团队ID"
    },
    model: {
      value: (_vm.applyName),
      callback: function($$v) {
        _vm.applyName = $$v
      },
      expression: "applyName"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    attrs: {
      "label": "备注"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "type": "textarea",
      "rows": 2,
      "placeholder": "请输入你要申请的备注"
    },
    model: {
      value: (_vm.applyDis),
      callback: function($$v) {
        _vm.applyDis = $$v
      },
      expression: "applyDis"
    }
  })], 1)], 1), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.showTeam = false
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.applyPending
    },
    on: {
      "click": _vm.applyTeam
    }
  }, [_vm._v("确 定")])], 1)], 1)], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-766c6687", module.exports)
  }
}

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

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

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = {"version":"4.2.2"}

/***/ }),

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, session) {/**
 * Created by sunxin on 2017/3/3.
 */
var mainNav=__webpack_require__(9);
var vue=new Vue({
    el: "#app",
    data: {
        isLogin:session.get('id')?true:false,
    },
    components:{
        "mainnav":mainNav
    },
    methods:{

    },
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(3)))

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, session) {module.exports={
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3)))

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by sunxin on 2017/2/21.
 */
var config=__webpack_require__(10);
var obj={
    bind:function (el,binding) {
        el.src="/html/web/pic/logo.png";
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
            el.src="/html/web/pic/logo.png";
            img.onload=function () {
                el.src=img.src
            }
        }
    }
}

module.exports=obj;

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(11),
  /* template */
  __webpack_require__(15),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/component/mainNav.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mainNav.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-766c6687", Component.options)
  } else {
    hotAPI.reload("data-v-766c6687", Component.options)
  }
})()}

module.exports = Component.exports


/***/ })

},[353]);
//# sourceMappingURL=donate.js.map