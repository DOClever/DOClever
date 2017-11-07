webpackJsonp([3],{

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(198),
  /* template */
  __webpack_require__(318),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamUserOwner.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamUserOwner.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-709a08e8", Component.options)
  } else {
    hotAPI.reload("data-v-709a08e8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

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

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(193),
  /* template */
  __webpack_require__(289),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamInfo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamInfo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-367d1a9e", Component.options)
  } else {
    hotAPI.reload("data-v-367d1a9e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(346)

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(194),
  /* template */
  __webpack_require__(320),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamProjectList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamProjectList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-72d0e5d2", Component.options)
  } else {
    hotAPI.reload("data-v-72d0e5d2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(197),
  /* template */
  __webpack_require__(278),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamUser.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamUser.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1bffcb3b", Component.options)
  } else {
    hotAPI.reload("data-v-1bffcb3b", Component.options)
  }
})()}

module.exports = Component.exports


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

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vuex) {module.exports=new Vuex.Store({
    state:{
        team:{},
        notice:[],
        project:[],
        user:[],
        role:0
    },
    getters:{
        userCount:function (state,getters) {
            return state.user.length;
        },
        interfaceCount:function (state,getters) {
            var count=0;
            state.project.forEach(function (obj) {
                count+=obj.interfaceCount;
            })
            return count;
        },
        projectCount:function (state,getters) {
            return state.project.length;
        },
        ownRole:function (state) {
            if(state.role==2)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        manageRole:function (state) {
            if(state.role==2 || state.role==0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    },
    mutations:{
        setTeam:function (state,data) {
            state.team=data;
            state.notice=data.notice;
            state.project=data.project;
            state.user=data.user;
            state.role=data.role;
        },
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(34)))

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

/***/ 192:
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
module.exports = {
    props: ["arr", "id"],
    data: function data() {
        return {
            searchName: "",
            arrUser: this.arr,
            savePending: false,
            arrUserSearch: [],
            showDialog: false
        };
    },
    computed: {
        arrFilter: function arrFilter() {
            if (!this.searchName) {
                return this.arrUser;
            }
            this.arrUserSearch = [];
            var _this = this;
            this.arrUser.forEach(function (obj) {
                var objCopy = $.clone(obj);
                objCopy.users = objCopy.users.filter(function (obj) {
                    if (obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase()) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (objCopy.users.length > 0) {
                    _this.arrUserSearch.push(objCopy);
                }
            });
            return this.arrUserSearch;
        }
    },
    directives: {
        proxy: proxyImg
    },
    methods: {
        transfer: function transfer(item) {
            var _this = this;
            $.confirm("是否确认将该项目转让给用户" + item.user.name, function () {
                $.startHud();
                net.put("/project/owner", {
                    id: _this.id,
                    user: item.user._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        _this.showDialog = false;
                        $.notify("转让成功", 1);
                        if (item.select == 1) {
                            _this.$emit("userMinus");
                        }
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(net, session, $) {//
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

var sessionChange = __webpack_require__(6);
module.exports = {
    data: function data() {
        return {
            infoPending: false,
            deletePending: false,
            moreLoading: false,
            page: 0,
            more: true
        };
    },
    mixins: [sessionChange],
    computed: {
        obj: function obj() {
            return this.$store.state.team;
        },
        projectCount: function projectCount() {
            return this.$store.getters.projectCount;
        },
        interfaceCount: function interfaceCount() {
            return this.$store.getters.interfaceCount;
        },
        userCount: function userCount() {
            return this.$store.getters.userCount;
        },
        notice: function notice() {
            return this.$store.state.notice;
        },
        ownRole: function ownRole() {
            return this.$store.getters.ownRole;
        },
        manageRole: function manageRole() {
            return this.$store.getters.manageRole;
        }
    },
    methods: {
        saveInfo: function saveInfo() {
            var _this = this;
            this.infoPending = true;
            net.post("/team/save", {
                id: session.get("teamId"),
                dis: _this.$store.state.team.dis,
                name: _this.$store.state.team.name
            }).then(function (data) {
                _this.infoPending = false;
                if (data.code) {
                    session.set("teamName", data.data.name);
                    _this.$root.session.teamName = data.data.name;
                    $.notify("修改成功", 1);
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        removeTeam: function removeTeam() {
            var _this = this;
            if (this.ownRole) {
                $.confirm("确定删除该团队？", function () {
                    _this.deletePending = true;
                    net.delete("/team/item", {
                        id: session.get("teamId")
                    }).then(function (data) {
                        _this.deletePending = false;
                        if (data.code == 200) {
                            $.notify("删除成功", 1);
                            setTimeout(function () {
                                location.href = "../../project/project.html";
                            }, 1500);
                        }
                    });
                });
            } else {
                $.confirm("确定退出该团队？你同时也会退出团队中的项目", function () {
                    _this.deletePending = true;
                    net.delete("/team/projectuser", {
                        id: session.get("teamId"),
                        user: session.get("id")
                    }).then(function (data) {
                        if (data.code == 200) {
                            if (data.data.length > 0) {
                                _this.deletePending = false;
                                var child = $.showBox(_this, __webpack_require__(101), {
                                    arr: data.data,
                                    user: session.get("id"),
                                    self: 1
                                });
                                child.$on("remove", function () {
                                    setTimeout(function () {
                                        location.href = "../../project/project.html";
                                    }, 1500);
                                });
                            } else {
                                net.delete("/team/user", {
                                    id: session.get("teamId"),
                                    user: session.get("id"),
                                    self: 1
                                }).then(function (data) {
                                    _this.deletePending = false;
                                    if (data.code == 200) {
                                        $.notify("删除成功", 1);
                                        setTimeout(function () {
                                            location.href = "../../project/project.html";
                                        }, 1500);
                                    } else {
                                        $.notify(data.msg, 0);
                                    }
                                });
                            }
                        } else {
                            _this.deletePending = false;
                            $.notify(data.msg, 0);
                        }
                    });
                });
            }
        },
        removeNotice: function removeNotice(item, index) {
            var _this = this;
            $.confirm("是否删除该公告?", function () {
                net.delete("/team/notice", {
                    id: session.get("teamId"),
                    notice: item._id
                }).then(function (data) {
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                        _this.$store.state.notice.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        moreNotice: function moreNotice() {
            var _this = this;
            this.moreLoading = true;
            net.get("/team/notice", {
                id: session.get("teamId"),
                page: ++_this.page
            }).then(function (data) {
                _this.moreLoading = false;
                if (data.code == 200) {
                    if (data.data.length > 0) {
                        _this.$store.state.notice.concat(data.data);
                    } else {
                        _this.more = false;
                        $.tip("已经到最底部啦", 1);
                    }
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        addNotice: function addNotice() {
            var _this = this;
            $.inputMul(this, "请输入公告", function (val) {
                if (!val) {
                    $.tip("请输入公告", 0);
                    return false;
                }
                net.post("/team/notice", {
                    id: session.get("teamId"),
                    content: val
                }).then(function (data) {
                    if (data.code == 200) {
                        $.notify("添加成功", 1);
                        _this.$store.state.notice.unshift(data.data);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
                return true;
            });
        },
        transfer: function transfer() {
            $.startHud();
            var _this = this;
            net.get("/team/user", {
                id: session.get("teamId")
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    var child = $.showBox(_this, __webpack_require__(262), {
                        arr: data.data
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    },
    created: function created() {}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(3), __webpack_require__(0)))

/***/ }),

/***/ 194:
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

var sessionChange = __webpack_require__(6);
module.exports = {
    data: function data() {
        return {};
    },
    mixins: [sessionChange],
    computed: {
        arrLength: function arrLength() {
            return Math.floor(this.$store.state.project.length / 4) + 1;
        },
        arr: function arr() {
            return this.$store.state.project;
        },
        ownRole: function ownRole() {
            return this.$store.getters.ownRole;
        },
        manageRole: function manageRole() {
            return this.$store.getters.manageRole;
        }
    },
    methods: {
        info: function info(item) {
            session.set("projectId", item._id);
            session.set("projectName", item.name);
            location.href = "/html/web/projectinfo/projectinfo.html";
        },
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否确认删除项目，该项目下一切数据都会删除", function () {
                var loading = _this.$loading({ fullscreen: true });
                net.delete("/project/item", {
                    id: item._id
                }).then(function (data) {
                    loading.close();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                        _this.$store.state.project.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        quit: function quit(item, index) {
            var _this = this;
            $.confirm("是否踢出该项目，该项目下数据会被保留", function () {
                var loading = _this.$loading({ fullscreen: true });
                net.delete("/team/project", {
                    id: session.get("teamId"),
                    project: item._id
                }).then(function (data) {
                    loading.close();
                    if (data.code == 200) {
                        $.notify("踢出成功", 1);
                        _this.$store.state.project.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        user: function user(item) {
            $.startHud();
            var _this = this;
            net.get("/team/projectuser", {
                id: session.get("teamId"),
                project: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    var child = $.showBox(_this, __webpack_require__(261), {
                        arr: data.data,
                        id: item._id
                    });
                    child.$on("update", function (arr) {
                        item.userCount = arr.length + 1;
                        arr.forEach(function (obj) {
                            if (obj.user == session.get("id")) {
                                item.role = obj.role;
                            }
                        });
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        transfer: function transfer(item, index) {
            $.startHud();
            var _this = this;
            net.get("/team/projectuser", {
                id: session.get("teamId"),
                project: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    var child = $.showBox(_this, __webpack_require__(260), {
                        arr: data.data,
                        id: item._id
                    });
                    child.$on("userMinus", function () {
                        item.userCount--;
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    },
    events: {}
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, net, Vue) {//
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
module.exports = {
    props: ["arr", "id"],
    data: function data() {
        return {
            searchName: "",
            arrUser: this.arr,
            savePending: false,
            arrUserSearch: [],
            showDialog: false
        };
    },
    computed: {
        arrFilter: function arrFilter() {
            if (!this.searchName) {
                return this.arrUser;
            }
            this.arrUserSearch = [];
            var _this = this;
            this.arrUser.forEach(function (obj) {
                var objCopy = $.clone(obj);
                objCopy.users = objCopy.users.filter(function (obj) {
                    if (obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase()) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (objCopy.users.length > 0) {
                    _this.arrUserSearch.push(objCopy);
                }
            });
            return this.arrUserSearch;
        }
    },
    directives: {
        proxy: proxyImg
    },
    methods: {
        save: function save() {
            var arr = [];
            this.arrFilter.forEach(function (obj) {
                obj.users.forEach(function (obj) {
                    if (obj.select == 1 && obj.role != 2) {
                        var obj1 = {
                            user: obj.user._id,
                            role: obj.role
                        };
                        if (obj.role == 1) {
                            obj1.option = obj.option;
                        }
                        arr.push(obj1);
                    }
                });
            });
            this.savePending = true;
            var _this = this;
            net.put("/project/user", {
                id: this.id,
                user: JSON.stringify(arr)
            }).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("设置成功", 1);
                    _this.$emit("update", arr);
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        changeRole: function changeRole(item) {
            if (item.role == 1) {
                Vue.set(item, "option", {
                    "ie": 0,
                    "te": 0,
                    "gb": 0,
                    "gs": 0,
                    "gi": 0,
                    "gd": 0,
                    "ve": 0,
                    "vr": 0
                });
            } else {
                delete item.option;
            }
        },
        editRoleOption: function editRoleOption(item) {
            var _this = this;
            var child = $.showBox(this, __webpack_require__(22), {
                hudremove: true,
                data: item.option
            });
            child.$on("save", function (val) {
                item.option = val;
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(5)))

/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, net, session) {//
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
module.exports = {
    props: ["arr"],
    data: function data() {
        return {
            searchName: "",
            arrUser: this.arr,
            savePending: false,
            arrUserSearch: [],
            showDialog: false
        };
    },
    computed: {
        arrFilter: function arrFilter() {
            if (!this.searchName) {
                return this.arrUser;
            }
            this.arrUserSearch = [];
            var _this = this;
            this.arrUser.forEach(function (obj) {
                var objCopy = $.clone(obj);
                objCopy.users = objCopy.users.filter(function (obj) {
                    if (obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase()) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (objCopy.users.length > 0) {
                    _this.arrUserSearch.push(objCopy);
                }
            });
            return this.arrUserSearch;
        }
    },
    directives: {
        proxy: proxyImg
    },
    methods: {
        transfer: function transfer(item) {
            var _this = this;
            $.confirm("是否确认将该团队转让给用户" + item.user.name, function () {
                $.startHud();
                net.put("/team/transfer", {
                    id: session.get("teamId"),
                    user: item.user._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        _this.showDialog = false;
                        $.notify("转让成功", 1);
                        setTimeout(function () {
                            location.reload();
                        }, 1500);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(3)))

/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, net, session) {//
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
module.exports = {
    data: function data() {
        return {
            searchName: "",
            showGroup: false,
            movePending: false,
            moveUserId: "",
            selectGroup: "",
            moveUserIndex: -1,
            moveUserParent: null
        };
    },
    mixins: [sessionChange],
    directives: {
        proxy: proxyImg
    },
    computed: {
        arrFilter: function arrFilter() {
            if (!this.searchName) {
                return this.$store.state.user;
            }
            var arr = [];
            var _this = this;
            this.$store.state.user.forEach(function (obj) {
                var objCopy = $.clone(obj);
                objCopy.users = objCopy.users.filter(function (obj) {
                    if (obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase()) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (objCopy.users.length > 0) {
                    arr.push(objCopy);
                }
            });
            return arr;
        },
        arrGroup: function arrGroup() {
            return this.$store.state.user.map(function (obj) {
                return {
                    name: obj.name,
                    id: obj._id
                };
            });
        },
        ownRole: function ownRole() {
            return this.$store.getters.ownRole;
        },
        manageRole: function manageRole() {
            return this.$store.getters.manageRole;
        }
    },
    methods: {
        inviteUser: function inviteUser(item) {
            var _this = this;
            $.input("请输入邀请的用户名", function (val) {
                if (!val.value) {
                    $.tip("请输入邀请的用户名", 0);
                    return;
                }
                $.startHud();
                net.put("/team/pulluser", {
                    id: session.get("teamId"),
                    user: val.value,
                    group: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("邀请已发送，等待用户响应", 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        renameGroup: function renameGroup(item) {
            var _this = this;
            $.input("请输入部门名称", function (val) {
                if (!val.value) {
                    $.tip("请输入部门名称", 0);
                    return;
                }
                $.startHud();
                net.post("/team/group", {
                    id: session.get("teamId"),
                    name: val.value,
                    group: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("重命名成功", 1);
                        item.name = val.value;
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        removeGroup: function removeGroup(item, index) {
            var _this = this;
            if (item.users.length > 0) {
                $.tip("请在删除部门前清空部门成员!", 0);
                return;
            } else {
                $.confirm("是否删除该部门", function () {
                    $.startHud();
                    net.delete("/team/group", {
                        id: session.get("teamId"),
                        group: item._id
                    }).then(function (data) {
                        $.stopHud();
                        if (data.code == 200) {
                            $.notify("删除成功", 1);
                            _this.$store.state.user.splice(index, 1);
                        } else {
                            $.notify(data.msg, 0);
                        }
                    });
                });
            }
        },
        changeRole: function changeRole(item) {
            net.put("/team/userrole", {
                id: session.get("teamId"),
                user: JSON.stringify([{
                    user: item.user._id,
                    role: item.role
                }])
            }).then(function (data) {
                if (data.code == 200) {
                    $.notify("设置成功", 1);
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        moveUser: function moveUser(item, index, parent) {
            this.showGroup = true;
            this.moveUserId = item.user._id;
            this.moveUserIndex = index;
            this.moveUserParent = parent;
            this.selectGroup = parent._id;
        },
        removeUser: function removeUser(item, index, parent) {
            var _this = this;
            $.confirm("是否确定从团队中删除该用户，团队中的项目也会一并删除该用户", function () {
                $.startHud();
                net.delete("/team/projectuser", {
                    id: session.get("teamId"),
                    user: item.user._id
                }).then(function (data) {
                    if (data.code == 200) {
                        if (data.data.length > 0) {
                            $.stopHud();
                            var child = $.showBox(_this, __webpack_require__(101), {
                                arr: data.data,
                                user: item.user._id
                            });
                            child.$on("remove", function () {
                                parent.users.splice(index, 1);
                            });
                        } else {
                            net.delete("/team/user", {
                                id: session.get("teamId"),
                                user: item.user._id
                            }).then(function (data) {
                                $.stopHud();
                                if (data.code == 200) {
                                    $.notify("删除成功", 1);
                                    parent.users.splice(index, 1);
                                } else {
                                    $.notify(data.msg, 0);
                                }
                            });
                        }
                    } else {
                        $.stopHud();
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        handleMoveUser: function handleMoveUser() {
            if (!this.selectGroup) {
                $.tip("请选择部门", 0);
                return;
            } else if (this.selectGroup == this.moveUserParent._id) {
                $.tip("请不要移动到同一个部门", 0);
                return;
            }
            var _this = this;
            this.movePending = true;
            net.put("/team/moveuser", {
                id: session.get("teamId"),
                user: this.moveUserId,
                group: this.selectGroup
            }).then(function (data) {
                _this.movePending = false;
                if (data.code == 200) {
                    $.notify("移动成功", 1);
                    _this.showGroup = false;
                    _this.moveUserParent.users.splice(_this.moveUserIndex, 1);
                    var group;
                    _this.$store.state.user.forEach(function (obj) {
                        if (obj._id == _this.selectGroup) {
                            group = obj;
                        }
                    });
                    group.users.push(data.data);
                    group.users.sort(function (obj1, obj2) {
                        return obj1.user.name > obj2.user.name;
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(3)))

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, session, net) {//
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

module.exports = {
    props: ["arr", "user", "self"],
    data: function data() {
        return {
            savePending: false,
            arrProject: function () {
                return this.arr.map(function (obj) {
                    obj.handle = 0;
                    return obj;
                });
            }.call(this),
            showDialog: false
        };
    },
    methods: {
        save: function save() {
            var bHandle = true;
            this.arrProject.forEach(function (obj) {
                if (obj.handle == 0) {
                    bHandle = false;
                }
            });
            if (!bHandle) {
                $.tip("请将所有的项目设置新的管理员", 0);
                return;
            }
            var _this = this;
            this.savePending = true;
            var query = {
                id: session.get("teamId"),
                user: this.user
            };
            if (this.self) {
                query.self = 1;
            }
            net.delete("/team/user", query).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("删除成功", 1);
                    _this.$emit("remove");
                    _this.$refs.box.close();
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        setOwner: function setOwner(item) {
            var _this = this;
            net.get("/team/projectuser", {
                id: session.get("teamId"),
                project: item._id
            }).then(function (data) {
                var child = $.showBox(_this, __webpack_require__(263), {
                    arr: data.data,
                    id: item._id
                });
                child.$on("save", function () {
                    item.handle = 1;
                });
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3), __webpack_require__(2)))

/***/ }),

/***/ 199:
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
module.exports = {
    props: ["arr", "id"],
    data: function data() {
        return {
            savePending: false,
            selectUser: "",
            searchName: "",
            arrUser: this.arr,
            showDialog: false
        };
    },
    directives: {
        proxy: proxyImg
    },
    computed: {
        arrFilter: function arrFilter() {
            if (!this.searchName) {
                return this.arrUser;
            }
            var arr = [];
            var _this = this;
            this.arrUser.forEach(function (obj) {
                var objCopy = $.clone(obj);
                objCopy.users = objCopy.users.filter(function (obj) {
                    if (obj.user.name.toLowerCase().indexOf(_this.searchName.toLowerCase()) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (objCopy.users.length > 0) {
                    arr.push(objCopy);
                }
            });
            return arr;
        }
    },
    methods: {
        save: function save() {
            if (!this.selectUser) {
                $.tip("请选择项目所有者", 0);
                return;
            }
            var _this = this;
            this.savePending = true;
            net.put("/project/owner", {
                id: this.id,
                user: this.selectUser
            }).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("设置成功", 1);
                    _this.$emit("save");
                    _this.$refs.box.close();
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        select: function select(item) {
            if (item.role == 2) {
                $.tip("不能选择原来的项目所有者", 0);
                return;
            } else {
                this.selectUser = item.user._id;
            }
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(24)();
// imports


// module
exports.push([module.i, "\n.item{\n    text-align: center;font-size:20px;color: #50a3ff;width: 100%;height: 100%;cursor: pointer;position: relative;box-shadow: 2px 2px 2px #888888;\n}\n", "", {"version":3,"sources":["/Users/sunxin/DOClever/Client/web/team/component/teamProjectList.vue?71bbe2c9"],"names":[],"mappings":";AAqCA;IACA,mBAAA,eAAA,eAAA,YAAA,aAAA,gBAAA,mBAAA,gCAAA;CACA","file":"teamProjectList.vue","sourcesContent":["<template>\n    <div style=\"width: 100%;\">\n        <table style=\"background-color: transparent;width: 100%;height: 100%\">\n            <tbody>\n            <template v-for=\"n in arrLength\">\n                <tr>\n                    <template v-for=\"index in 4\">\n                        <td  style=\"padding: 10px;height: 150px;width: 25%\">\n                            <div v-if=\"arr[(n-1)*4+(index-1)]\" class=\"item\" :style=\"{backgroundImage: 'url(\\'../pic/back'+index+'.jpg\\')',borderRadius:'5px',color:'gray',fontSize:'25px',wordBreak: 'break-all',display:'table'}\" @click=\"info(arr[(n-1)*4+(index-1)])\">\n                                <div style=\"display: table-cell;vertical-align: middle\">\n                                    {{arr[(n-1)*4+(index-1)].name}}\n                                </div>\n                                <el-row class=\"row\" style=\"height: 30px;line-height:30px;font-size: 15px;color: gray;position: absolute;left: 0;bottom: 0;text-align: left;background-color: rgba(215,215,215,0.51)\">\n                                    &nbsp;{{\"成员:\"+arr[(n-1)*4+(index-1)].userCount}}&nbsp;\n                                    {{\"接口:\"+arr[(n-1)*4+(index-1)].interfaceCount}}\n                                    <el-dropdown style=\"float: right;height: 30px\" v-if=\"manageRole\">\n                                        <el-button type=\"text\" style=\"width:40px;height: 30px\" class=\"el-dropdown-link\" @click.stop=\"\">\n                                            管理\n                                        </el-button>\n                                        <el-dropdown-menu slot=\"dropdown\">\n                                            <el-dropdown-item @click.native=\"user(arr[(n-1)*4+(index-1)])\">成员管理</el-dropdown-item>\n                                            <el-dropdown-item @click.native=\"quit(arr[(n-1)*4+(index-1)],(n-1)*4+(index-1))\">踢出团队</el-dropdown-item>\n                                            <el-dropdown-item @click.native=\"remove(arr[(n-1)*4+(index-1)],(n-1)*4+(index-1))\">删除项目</el-dropdown-item>\n                                            <el-dropdown-item @click.native=\"transfer(arr[(n-1)*4+(index-1)],(n-1)*4+(index-1))\">指定所有者</el-dropdown-item>\n                                        </el-dropdown-menu>\n                                    </el-dropdown>\n                                </el-row>\n                            </div>\n                        </td>\n                    </template>\n                </tr>\n            </template>\n            </tbody>\n        </table>\n    </div>\n</template>\n<style>\n    .item{\n        text-align: center;font-size:20px;color: #50a3ff;width: 100%;height: 100%;cursor: pointer;position: relative;box-shadow: 2px 2px 2px #888888;\n    }\n</style>\n<script>\n    var sessionChange=require(\"../../mixins/session\");\n    module.exports={\n        data:function () {\n            return {\n            }\n        },\n        mixins:[sessionChange],\n        computed:{\n            arrLength:function () {\n                return Math.floor(this.$store.state.project.length/4)+1\n            },\n            arr:function () {\n                return this.$store.state.project\n            },\n            ownRole:function () {\n                return this.$store.getters.ownRole;\n            },\n            manageRole:function () {\n                return this.$store.getters.manageRole;\n            }\n        },\n        methods:{\n            info:function (item) {\n                session.set(\"projectId\",item._id);\n                session.set(\"projectName\",item.name);\n                location.href=\"/html/web/projectinfo/projectinfo.html\";\n            },\n            remove:function (item,index) {\n                var _this=this;\n                $.confirm(\"是否确认删除项目，该项目下一切数据都会删除\",function () {\n                    var loading=_this.$loading({fullscreen:true});\n                    net.delete(\"/project/item\",{\n                        id:item._id\n                    }).then(function (data) {\n                        loading.close();\n                        if(data.code==200)\n                        {\n                            $.notify(\"删除成功\",1);\n                            _this.$store.state.project.splice(index,1);\n                        }\n                        else\n                        {\n                            $.notify(data.msg,0);\n                        }\n                    })\n                })\n            },\n            quit:function (item,index) {\n                var _this=this;\n                $.confirm(\"是否踢出该项目，该项目下数据会被保留\",function () {\n                    var loading=_this.$loading({fullscreen:true});\n                    net.delete(\"/team/project\",{\n                        id:session.get(\"teamId\"),\n                        project:item._id\n                    }).then(function (data) {\n                        loading.close();\n                        if(data.code==200)\n                        {\n                            $.notify(\"踢出成功\",1);\n                            _this.$store.state.project.splice(index,1);\n                        }\n                        else\n                        {\n                            $.notify(data.msg,0);\n                        }\n                    })\n                })\n            },\n            user:function (item) {\n                $.startHud();\n                var _this=this;\n                net.get(\"/team/projectuser\",{\n                    id:session.get(\"teamId\"),\n                    project:item._id\n                }).then(function (data) {\n                    $.stopHud();\n                    if(data.code==200)\n                    {\n                        var child=$.showBox(_this,require(\"./teamProjectUser.vue\"),{\n                            arr:data.data,\n                            id:item._id\n                        });\n                        child.$on(\"update\",function (arr) {\n                            item.userCount=arr.length+1;\n                            arr.forEach(function (obj) {\n                                if(obj.user==session.get(\"id\"))\n                                {\n                                    item.role=obj.role;\n                                }\n                            })\n                        })\n                    }\n                    else\n                    {\n                        $.notify(data.msg,0);\n                    }\n                })\n            },\n            transfer:function (item,index) {\n                $.startHud();\n                var _this=this;\n                net.get(\"/team/projectuser\",{\n                    id:session.get(\"teamId\"),\n                    project:item._id\n                }).then(function (data) {\n                    $.stopHud();\n                    if(data.code==200)\n                    {\n                        var child=$.showBox(_this,require(\"./projectTransfer.vue\"),{\n                            arr:data.data,\n                            id:item._id\n                        });\n                        child.$on(\"userMinus\",function () {\n                            item.userCount--;\n                        })\n                    }\n                    else\n                    {\n                        $.notify(data.msg,0);\n                    }\n                })\n            }\n        },\n        events:{\n\n        }\n    }\n</script>\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(36),
  /* template */
  __webpack_require__(44),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/component/roleOption.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] roleOption.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5966a33e", Component.options)
  } else {
    hotAPI.reload("data-v-5966a33e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(45)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 260:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(192),
  /* template */
  __webpack_require__(328),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/projectTransfer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] projectTransfer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-877cdcfe", Component.options)
  } else {
    hotAPI.reload("data-v-877cdcfe", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(195),
  /* template */
  __webpack_require__(316),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamProjectUser.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamProjectUser.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-668069c4", Component.options)
  } else {
    hotAPI.reload("data-v-668069c4", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 262:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(196),
  /* template */
  __webpack_require__(269),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamTransfer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamTransfer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0c619b5b", Component.options)
  } else {
    hotAPI.reload("data-v-0c619b5b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(199),
  /* template */
  __webpack_require__(331),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/team/component/teamUserOwnerSelect.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamUserOwnerSelect.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-93ab7ff8", Component.options)
  } else {
    hotAPI.reload("data-v-93ab7ff8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 269:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "团队转让",
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
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "50px",
      "line-height": "50px"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "placeholder": "请输入你要筛选的用户名"
    },
    model: {
      value: (_vm.searchName),
      callback: function($$v) {
        _vm.searchName = $$v
      },
      expression: "searchName"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_c('el-collapse', [_vm._l((_vm.arrFilter), function(item, index) {
    return [_c('el-collapse-item', {
      staticClass: "hover",
      attrs: {
        "title": item.name
      }
    }, [_vm._l((item.users), function(item1, index1) {
      return [_c('el-row', {
        staticClass: "row",
        staticStyle: {
          "height": "40px",
          "line-height": "40px",
          "text-align": "center"
        }
      }, [_c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 3
        }
      }, [_c('img', {
        directives: [{
          name: "proxy",
          rawName: "v-proxy",
          value: (item1.user.photo),
          expression: "item1.user.photo"
        }],
        staticStyle: {
          "width": "30px",
          "height": "30px",
          "border-radius": "50%",
          "vertical-align": "middle"
        }
      })]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 9
        }
      }, [_vm._v("\n                                " + _vm._s(item1.user.name) + "\n                            ")]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 6
        }
      }, [(item1.role == 0) ? _c('span', [_vm._v("\n                                        团队管理员\n                                    ")]) : (item1.role == 1) ? _c('span', [_vm._v("\n                                        团队观察者\n                                    ")]) : _c('span', [_vm._v("\n                                        团队所有者\n                                ")])]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 3
        }
      }, [(item1.role == 0 || item1.role == 1) ? _c('el-button', {
        staticStyle: {
          "font-size": "15px"
        },
        attrs: {
          "size": "small",
          "type": "text"
        },
        on: {
          "click": function($event) {
            _vm.transfer(item1)
          }
        }
      }, [_vm._v("转让")]) : _vm._e()], 1)], 1)]
    })], 2)]
  })], 2)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0c619b5b", module.exports)
  }
}

/***/ }),

/***/ 278:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row"
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "50px",
      "line-height": "50px",
      "text-align": "center"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "90%"
    },
    attrs: {
      "placeholder": "请输入你要筛选的用户名"
    },
    model: {
      value: (_vm.searchName),
      callback: function($$v) {
        _vm.searchName = $$v
      },
      expression: "searchName"
    }
  })], 1), _vm._v(" "), _c('el-collapse', [_vm._l((_vm.arrFilter), function(item, index) {
    return [_c('el-collapse-item', {
      key: item._id,
      staticClass: "hover"
    }, [_c('template', {
      slot: "title"
    }, [_c('span', {
      staticStyle: {
        "font-size": "15px"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name + "(" + item.users.length + ")") + "\n                        ")]), _vm._v("   \n                    "), (_vm.manageRole) ? _c('el-dropdown', [_c('el-button', {
      staticClass: "el-dropdown-link",
      attrs: {
        "type": "text",
        "icon": "setting"
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
        }
      }
    }), _vm._v(" "), _c('el-dropdown-menu', {
      slot: "dropdown"
    }, [_c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.inviteUser(item)
        }
      }
    }, [_vm._v("邀请用户")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.renameGroup(item)
        }
      }
    }, [_vm._v("重命名")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.removeGroup(item, index)
        }
      }
    }, [_vm._v("删除")])], 1)], 1) : _vm._e()], 1), _vm._v(" "), _vm._l((item.users), function(item1, index1) {
      return [_c('el-row', {
        key: item1.user._id,
        staticClass: "row",
        staticStyle: {
          "height": "40px",
          "line-height": "40px",
          "text-align": "center"
        }
      }, [_c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 4
        }
      }, [_c('img', {
        directives: [{
          name: "proxy",
          rawName: "v-proxy",
          value: (item1.user.photo),
          expression: "item1.user.photo"
        }],
        staticStyle: {
          "width": "30px",
          "height": "30px",
          "border-radius": "50%",
          "vertical-align": "middle"
        }
      })]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 10
        }
      }, [_vm._v("\n                            " + _vm._s(item1.user.name) + "\n                        ")]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 6
        }
      }, [(item1.role != 2) ? [(_vm.manageRole && _vm.session.id != item1.user._id) ? _c('el-select', {
        on: {
          "input": function($event) {
            _vm.changeRole(item1)
          }
        },
        model: {
          value: (item1.role),
          callback: function($$v) {
            item1.role = $$v
          },
          expression: "item1.role"
        }
      }, [_c('el-option', {
        attrs: {
          "value": 0,
          "label": "团队管理员"
        }
      }), _vm._v(" "), _c('el-option', {
        attrs: {
          "value": 1,
          "label": "团队成员"
        }
      })], 1) : _c('span', [_vm._v("\n                                    " + _vm._s(item1.role == 0 ? '团队管理员' : '团队成员') + "\n                                ")])] : _c('span', [_vm._v("\n                                团队所有者\n                            ")])], 2), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 4
        }
      }, [((_vm.manageRole && item1.role != 2 && !_vm.ownRole) || _vm.ownRole) ? _c('el-dropdown', [_c('el-button', {
        staticClass: "el-dropdown-link",
        attrs: {
          "type": "text"
        },
        on: {
          "click": function($event) {
            $event.stopPropagation();
          }
        }
      }, [_vm._v("\n                                    操作\n                                ")]), _vm._v(" "), _c('el-dropdown-menu', {
        slot: "dropdown"
      }, [_c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.moveUser(item1, index1, item)
          }
        }
      }, [_vm._v("移动")]), _vm._v(" "), (item1.role != 2) ? _c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.removeUser(item1, index1, item)
          }
        }
      }, [_vm._v("删除")]) : _vm._e()], 1)], 1) : _vm._e()], 1)], 1)]
    })], 2)]
  })], 2), _vm._v(" "), _c('el-dialog', {
    attrs: {
      "title": "选择部门",
      "size": "small"
    },
    model: {
      value: (_vm.showGroup),
      callback: function($$v) {
        _vm.showGroup = $$v
      },
      expression: "showGroup"
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "30px",
      "line-height": "30px",
      "text-align": "center"
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "50%"
    },
    model: {
      value: (_vm.selectGroup),
      callback: function($$v) {
        _vm.selectGroup = $$v
      },
      expression: "selectGroup"
    }
  }, _vm._l((_vm.arrGroup), function(item) {
    return _c('el-option', {
      key: item.id,
      attrs: {
        "label": item.name,
        "value": item.id
      }
    })
  }))], 1), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.movePending
    },
    on: {
      "click": _vm.handleMoveUser
    }
  }, [_vm._v("确 定")])], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1bffcb3b", module.exports)
  }
}

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),

/***/ 289:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row"
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "50px",
      "line-height": "50px",
      "font-size": "20px",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "background-color": "white"
    }
  }, [_c('el-col', {
    staticClass: "col",
    staticStyle: {
      "border-right": "1px gray solid"
    },
    attrs: {
      "span": 8
    }
  }, [_vm._v("\n            项目:" + _vm._s(_vm.projectCount) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "border-right": "1px gray solid"
    },
    attrs: {
      "span": 8
    }
  }, [_vm._v("\n            接口:" + _vm._s(_vm.interfaceCount) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 8
    }
  }, [_vm._v("\n            用户:" + _vm._s(_vm.userCount) + "\n        ")])], 1), _vm._v(" "), _c('el-form', {
    ref: "form",
    staticStyle: {
      "margin-top": "20px",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "background-color": "white",
      "padding": "20px"
    },
    attrs: {
      "label-width": "100px"
    }
  }, [_c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "名称"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    model: {
      value: (_vm.obj.name),
      callback: function($$v) {
        _vm.obj.name = $$v
      },
      expression: "obj.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "简介"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%",
      "height": "80%"
    },
    attrs: {
      "type": "textarea",
      "rows": 3
    },
    model: {
      value: (_vm.obj.dis),
      callback: function($$v) {
        _vm.obj.dis = $$v
      },
      expression: "obj.dis"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "团队ID"
    }
  }, [_c('div', {
    staticStyle: {
      "width": "80%",
      "display": "inline-block",
      "text-align": "left"
    }
  }, [_vm._v("\n                " + _vm._s(_vm.obj._id) + "\n            ")])]), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "团队角色"
    }
  }, [_c('div', {
    staticStyle: {
      "width": "80%",
      "display": "inline-block",
      "text-align": "left"
    }
  }, [_vm._v("\n                " + _vm._s(_vm.ownRole ? '所有者' : (_vm.manageRole ? '管理员' : '普通成员')) + "\n            ")])]), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "创建时间"
    }
  }, [_c('div', {
    staticStyle: {
      "width": "80%",
      "display": "inline-block",
      "text-align": "left"
    }
  }, [_vm._v("\n                " + _vm._s(_vm.obj.createdAt) + "\n            ")]), _vm._v(" "), _c('el-button', {
    staticStyle: {
      "width": "90px",
      "position": "absolute",
      "right": "50px"
    },
    attrs: {
      "type": "danger",
      "loading": _vm.deletePending
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.removeTeam($event)
      }
    }
  }, [_vm._v("\n                " + _vm._s(_vm.ownRole ? '删除团队' : '退出团队') + "\n            ")]), _vm._v(" "), (_vm.manageRole) ? _c('el-button', {
    staticStyle: {
      "width": "80px",
      "position": "absolute",
      "right": "160px"
    },
    attrs: {
      "type": "primary",
      "loading": _vm.infoPending
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.saveInfo($event)
      }
    }
  }, [_vm._v("\n                保存\n            ")]) : _vm._e(), _vm._v(" "), (_vm.ownRole) ? _c('el-button', {
    staticStyle: {
      "width": "80px",
      "position": "absolute",
      "right": "270px"
    },
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.transfer($event)
      }
    }
  }, [_vm._v("\n                转让\n            ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "background-color": "white",
      "padding": "20px",
      "margin-top": "20px"
    }
  }, [_c('el-collapse', {
    directives: [{
      name: "loading",
      rawName: "v-loading",
      value: (_vm.moreLoading),
      expression: "moreLoading"
    }]
  }, [_c('el-collapse-item', [_c('template', {
    slot: "title"
  }, [_c('span', {
    staticStyle: {
      "font-size": "15px"
    }
  }, [_vm._v("\n                        团队公告\n                    ")]), _vm._v("   \n                    "), (_vm.manageRole) ? _c('el-button', {
    attrs: {
      "type": "text",
      "icon": "plus"
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.addNotice($event)
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _vm._l((_vm.notice), function(item, index) {
    return [_c('el-row', {
      staticClass: "row"
    }, [_c('el-row', {
      staticClass: "row",
      staticStyle: {
        "font-size": "17px"
      }
    }, [_vm._v("\n                            " + _vm._s(item.content) + "\n                        ")]), _vm._v(" "), _c('el-row', {
      staticClass: "row",
      staticStyle: {
        "color": "gray"
      }
    }, [_vm._v("\n                            " + _vm._s(item.date) + "   \n                            "), _c('el-button', {
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
          _vm.removeNotice(item, index)
        }
      }
    })], 1)], 1)]
  }), _vm._v(" "), (_vm.more && _vm.notice.length > 0) ? _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "30px",
      "line-height": "30px",
      "text-align": "center",
      "color": "gray",
      "border-top": "1px lightgray solid",
      "cursor": "pointer"
    },
    nativeOn: {
      "click": function($event) {
        _vm.moreNotice($event)
      }
    }
  }, [_vm._v("\n                    获取更多\n                ")]) : _vm._e()], 2)], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-367d1a9e", module.exports)
  }
}

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),

/***/ 316:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "项目用户管理",
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
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "50px",
      "line-height": "50px"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "placeholder": "请输入你要筛选的用户名"
    },
    model: {
      value: (_vm.searchName),
      callback: function($$v) {
        _vm.searchName = $$v
      },
      expression: "searchName"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_c('el-collapse', [_vm._l((_vm.arrFilter), function(item, index) {
    return [_c('el-collapse-item', {
      staticClass: "hover",
      attrs: {
        "title": item.name
      }
    }, [_vm._l((item.users), function(item1, index1) {
      return [_c('el-row', {
        staticClass: "row",
        staticStyle: {
          "height": "40px",
          "line-height": "40px",
          "text-align": "center"
        }
      }, [_c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 2
        }
      }, [(item1.role != 2) ? _c('el-checkbox', {
        attrs: {
          "true-label": 1,
          "false-label": 0
        },
        model: {
          value: (item1.select),
          callback: function($$v) {
            item1.select = $$v
          },
          expression: "item1.select"
        }
      }) : _vm._e()], 1), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 3
        }
      }, [_c('img', {
        directives: [{
          name: "proxy",
          rawName: "v-proxy",
          value: (item1.user.photo),
          expression: "item1.user.photo"
        }],
        staticStyle: {
          "width": "30px",
          "height": "30px",
          "border-radius": "50%",
          "vertical-align": "middle"
        }
      })]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 9
        }
      }, [_vm._v("\n                                " + _vm._s(item1.user.name) + "\n                            ")]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 7
        }
      }, [(item1.role != 2) ? _c('el-select', {
        on: {
          "input": function($event) {
            _vm.changeRole(item1)
          }
        },
        model: {
          value: (item1.role),
          callback: function($$v) {
            item1.role = $$v
          },
          expression: "item1.role"
        }
      }, [_c('el-option', {
        attrs: {
          "value": 0,
          "label": "项目管理员"
        }
      }), _vm._v(" "), _c('el-option', {
        attrs: {
          "value": 1,
          "label": "项目观察者"
        }
      })], 1) : _c('span', [_vm._v("\n                                项目所有者\n                            ")])], 1), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 3
        }
      }, [(item1.role == 1) ? _c('el-button', {
        staticStyle: {
          "font-size": "15px"
        },
        attrs: {
          "size": "small",
          "type": "text"
        },
        on: {
          "click": function($event) {
            _vm.editRoleOption(item1)
          }
        }
      }, [_vm._v("权限")]) : _vm._e()], 1)], 1)]
    })], 2)]
  })], 2)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savePending
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n            保存\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-668069c4", module.exports)
  }
}

/***/ }),

/***/ 318:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "设置项目所有者",
      "size": "small",
      "close-on-click-modal": false,
      "close-on-press-escape": false,
      "show-close": false
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "50px",
      "line-height": "50px"
    }
  }, [_vm._v("\n        请设置以下项目的新的所有者\n    ")]), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_vm._l((_vm.arrProject), function(item) {
    return [_c('el-row', {
      key: item._id,
      staticClass: "row",
      staticStyle: {
        "height": "40px",
        "line-height": "40px"
      }
    }, [_c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 18
      }
    }, [_vm._v("\n                    " + _vm._s(item.name) + "\n                ")]), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 6
      }
    }, [(item.handle == 0) ? _c('el-button', {
      attrs: {
        "type": "primary"
      },
      on: {
        "click": function($event) {
          _vm.setOwner(item)
        }
      }
    }, [_vm._v("\n                        设置所有者\n                    ")]) : _c('span', [_vm._v("\n                        已设置\n                    ")])], 1)], 1)]
  })], 2), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savePending
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n            确定\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-709a08e8", module.exports)
  }
}

/***/ }),

/***/ 320:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticStyle: {
      "width": "100%"
    }
  }, [_c('table', {
    staticStyle: {
      "background-color": "transparent",
      "width": "100%",
      "height": "100%"
    }
  }, [_c('tbody', [_vm._l((_vm.arrLength), function(n) {
    return [_c('tr', [_vm._l((4), function(index) {
      return [_c('td', {
        staticStyle: {
          "padding": "10px",
          "height": "150px",
          "width": "25%"
        }
      }, [(_vm.arr[(n - 1) * 4 + (index - 1)]) ? _c('div', {
        staticClass: "item",
        style: ({
          backgroundImage: 'url(\'../pic/back' + index + '.jpg\')',
          borderRadius: '5px',
          color: 'gray',
          fontSize: '25px',
          wordBreak: 'break-all',
          display: 'table'
        }),
        on: {
          "click": function($event) {
            _vm.info(_vm.arr[(n - 1) * 4 + (index - 1)])
          }
        }
      }, [_c('div', {
        staticStyle: {
          "display": "table-cell",
          "vertical-align": "middle"
        }
      }, [_vm._v("\n                                " + _vm._s(_vm.arr[(n - 1) * 4 + (index - 1)].name) + "\n                            ")]), _vm._v(" "), _c('el-row', {
        staticClass: "row",
        staticStyle: {
          "height": "30px",
          "line-height": "30px",
          "font-size": "15px",
          "color": "gray",
          "position": "absolute",
          "left": "0",
          "bottom": "0",
          "text-align": "left",
          "background-color": "rgba(215,215,215,0.51)"
        }
      }, [_vm._v("\n                                 " + _vm._s("成员:" + _vm.arr[(n - 1) * 4 + (index - 1)].userCount) + " \n                                " + _vm._s("接口:" + _vm.arr[(n - 1) * 4 + (index - 1)].interfaceCount) + "\n                                "), (_vm.manageRole) ? _c('el-dropdown', {
        staticStyle: {
          "float": "right",
          "height": "30px"
        }
      }, [_c('el-button', {
        staticClass: "el-dropdown-link",
        staticStyle: {
          "width": "40px",
          "height": "30px"
        },
        attrs: {
          "type": "text"
        },
        on: {
          "click": function($event) {
            $event.stopPropagation();
          }
        }
      }, [_vm._v("\n                                        管理\n                                    ")]), _vm._v(" "), _c('el-dropdown-menu', {
        slot: "dropdown"
      }, [_c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.user(_vm.arr[(n - 1) * 4 + (index - 1)])
          }
        }
      }, [_vm._v("成员管理")]), _vm._v(" "), _c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.quit(_vm.arr[(n - 1) * 4 + (index - 1)], (n - 1) * 4 + (index - 1))
          }
        }
      }, [_vm._v("踢出团队")]), _vm._v(" "), _c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.remove(_vm.arr[(n - 1) * 4 + (index - 1)], (n - 1) * 4 + (index - 1))
          }
        }
      }, [_vm._v("删除项目")]), _vm._v(" "), _c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.transfer(_vm.arr[(n - 1) * 4 + (index - 1)], (n - 1) * 4 + (index - 1))
          }
        }
      }, [_vm._v("指定所有者")])], 1)], 1) : _vm._e()], 1)], 1) : _vm._e()])]
    })], 2)]
  })], 2)])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-72d0e5d2", module.exports)
  }
}

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "指定项目所有者",
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
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "50px",
      "line-height": "50px"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "placeholder": "请输入你要筛选的用户名"
    },
    model: {
      value: (_vm.searchName),
      callback: function($$v) {
        _vm.searchName = $$v
      },
      expression: "searchName"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_c('el-collapse', [_vm._l((_vm.arrFilter), function(item, index) {
    return [_c('el-collapse-item', {
      staticClass: "hover",
      attrs: {
        "title": item.name
      }
    }, [_vm._l((item.users), function(item1, index1) {
      return [_c('el-row', {
        staticClass: "row",
        staticStyle: {
          "height": "40px",
          "line-height": "40px",
          "text-align": "center"
        }
      }, [_c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 3
        }
      }, [_c('img', {
        directives: [{
          name: "proxy",
          rawName: "v-proxy",
          value: (item1.user.photo),
          expression: "item1.user.photo"
        }],
        staticStyle: {
          "width": "30px",
          "height": "30px",
          "border-radius": "50%",
          "vertical-align": "middle"
        }
      })]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 9
        }
      }, [_vm._v("\n                                " + _vm._s(item1.user.name) + "\n                            ")]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 6
        }
      }, [(item1.select == 1) ? [(item1.role == 0) ? _c('span', [_vm._v("\n                                        项目管理员\n                                    ")]) : (item1.role == 1) ? _c('span', [_vm._v("\n                                        项目观察者\n                                    ")]) : _c('span', [_vm._v("\n                                        项目所有者\n                                    ")])] : _c('span', [_vm._v("\n                                    非项目成员\n                                ")])], 2), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 3
        }
      }, [(item1.role == 0 || item1.role == 1) ? _c('el-button', {
        staticStyle: {
          "font-size": "15px"
        },
        attrs: {
          "size": "small",
          "type": "text"
        },
        on: {
          "click": function($event) {
            _vm.transfer(item1)
          }
        }
      }, [_vm._v("转让")]) : _vm._e()], 1)], 1)]
    })], 2)]
  })], 2)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-877cdcfe", module.exports)
  }
}

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "项目用户管理",
      "size": "small",
      "modal": false
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "50px",
      "line-height": "50px"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "100%"
    },
    attrs: {
      "placeholder": "请输入你要筛选的用户名"
    },
    model: {
      value: (_vm.searchName),
      callback: function($$v) {
        _vm.searchName = $$v
      },
      expression: "searchName"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_c('el-collapse', [_vm._l((_vm.arrFilter), function(item, index) {
    return [_c('el-collapse-item', {
      key: item._id,
      staticClass: "hover",
      attrs: {
        "title": item.name
      }
    }, [_vm._l((item.users), function(item1, index1) {
      return [_c('el-row', {
        key: item1._id,
        staticClass: "row",
        staticStyle: {
          "height": "40px",
          "line-height": "40px",
          "text-align": "center",
          "cursor": "pointer"
        },
        style: ({
          'backgroundColor': _vm.selectUser == item1.user._id ? 'lightblue' : 'white'
        }),
        nativeOn: {
          "click": function($event) {
            _vm.select(item1)
          }
        }
      }, [_c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 4
        }
      }, [_c('img', {
        directives: [{
          name: "proxy",
          rawName: "v-proxy",
          value: (item1.user.photo),
          expression: "item1.user.photo"
        }],
        staticStyle: {
          "width": "30px",
          "height": "30px",
          "border-radius": "50%",
          "vertical-align": "middle"
        }
      })]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 13
        }
      }, [_vm._v("\n                                " + _vm._s(item1.user.name) + "\n                            ")]), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 7
        }
      }, [(item1.select == 0) ? _c('span', [_vm._v("\n                                    非项目成员\n                                ")]) : [(item1.role == 0) ? _c('span', [_vm._v("\n                                        项目管理员\n                                    ")]) : (item1.role == 1) ? _c('span', [_vm._v("\n                                        项目观察者\n                                    ")]) : (item1.role == 2) ? _c('span', [_vm._v("\n                                        项目所有者\n                                    ")]) : _vm._e()]], 2)], 1)]
    })], 2)]
  })], 2)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savePending
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n            确定\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-93ab7ff8", module.exports)
  }
}

/***/ }),

/***/ 346:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(206);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(26)("13361019", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-72d0e5d2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./teamProjectList.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js?sourceMap!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"id\":\"data-v-72d0e5d2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./teamProjectList.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {//
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

module.exports = {
    props: ["data", "hudremove"],
    data: function data() {
        return {
            option: this.data ? $.clone(this.data) : {
                "ie": 0,
                "te": 0,
                "gb": 0,
                "gs": 0,
                "gi": 0,
                "gd": 0,
                "ve": 0,
                "vr": 0
            },
            showDialog: false,
            hud: this.hudremove === undefined ? true : !Boolean(this.hudremove)
        };
    },
    methods: {
        save: function save() {
            this.$emit("save", this.option);
            this.showDialog = false;
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 369:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(session, Vue, net, $) {/**
 * Created by sunxin on 2016/12/19.
 */
var mainNav=__webpack_require__(9);
var teamInfo=__webpack_require__(117);
var teamProjectList=__webpack_require__(118);
var teamUser=__webpack_require__(119);
var store=__webpack_require__(122);
var sessionChange=__webpack_require__(6);
if(!session.get("teamId"))
{
    location.href="../project/project.html"
}
session.remove("projectId");
session.remove("projectName");
session.remove("versionId");
session.remove("versionName");
session.remove("versionDis");
var vue=new Vue({
    el: "#app",
    data: {
        type:1,
        showAdd:false,
        addPending:false,
        newType:0,
        name:"",
        dis:"",
        id:"",
        arrApply:[],
        showApply:false,
        applyPending:false,
        showUserApply:false,
        newUserGroup:"",
        newUserRole:1,
        selUserApplyObj:{}
    },
    mixins:[sessionChange],
    store:store,
    components:{
        "mainnav":mainNav,
        "teaminfo":teamInfo,
        "teamprojectlist":teamProjectList,
        "teamuser":teamUser
    },
    computed:{
        user:function () {
            return store.state.user;
        },
        ownRole:function () {
            return store.getters.ownRole;
        },
        manageRole:function () {
            return store.getters.manageRole;
        }
    },
    methods:{
        addProject:function () {
            var _this=this;
            if(this.newType==0)
            {
                if(!this.name)
                {
                    this.$message.error("请输入名称");
                    return;
                }
                this.addPending=true;
                net.post("/project/create",{
                    name:_this.name,
                    dis:_this.dis,
                    team:session.get("teamId")
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    if(data.code==200)
                    {
                        store.state.project.unshift(data.data);
                        $.notify("创建成功",1);
                        _this.showAdd=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
            else
            {
                if(!this.id)
                {
                    this.$message.error("请输入项目ID");
                    return;
                }
                this.addPending=true;
                net.put("/team/pullproject",{
                    id:session.get("teamId"),
                    project:this.id
                }).then(function (data) {
                    _this.addPending=false;
                    _this.name="";
                    _this.dis=""
                    _this.id=""
                    if(data.code==200)
                    {
                        $.notify("请求已发出，等待项目管理员响应",1);
                        _this.showAdd=false;
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        importProject:function () {
            $.showBox(this,__webpack_require__(46));
        },
        addGroup:function () {
            var _this=this;
            $.input("请输入部门名称",function (val) {
                if(!val.value)
                {
                    $.tip("请输入部门名称",0);
                    return;
                }
                $.startHud();
                net.post("/team/group",{
                    id:session.get("teamId"),
                    name:val.value
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        $.notify("新建成功",1);
                        store.state.user.push(data.data);
                    }
                    else
                    {
                        $.notify(data.msg,0);
                    }
                })
            })
        },
        handleApply:function (item,state) {
            var _this=this;
            if(item.type==2)
            {
                this.newUserGroup=store.state.user[0]._id;
                this.newUserRole=1;
                this.selUserApplyObj={
                    item:item,
                    state:state
                }
                if(state==1)
                {
                    this.showUserApply=true;
                }
                else
                {
                    this.handleUserApply();
                }
            }
            else if(item.type==3)
            {
                $.startHud();
                net.put("/team/apply",{
                    id:session.get("teamId"),
                    apply:item._id,
                    state:state
                }).then(function (data) {
                    $.stopHud();
                    if(data.code==200)
                    {
                        if(typeof(data.data)=="object")
                        {
                            item.handle=1;
                            store.state.project.unshift(data.data);
                        }
                        else
                        {
                            item.handle=2;
                        }
                    }
                    else
                    {
                        item.handle=3;
                        $.notify(data.msg,0);
                    }
                })
            }
        },
        handleUserApply:function () {
            var _this=this;
            this.applyPending=true;
            net.put("/team/apply",{
                id:session.get("teamId"),
                apply:this.selUserApplyObj.item._id,
                group:this.newUserGroup,
                role:this.newUserRole,
                state:this.selUserApplyObj.state
            }).then(function (data) {
                _this.applyPending=false;
                if(data.code==200)
                {
                    if(typeof(data.data)=="object")
                    {
                        _this.selUserApplyObj.item.handle=1;
                        store.state.user.forEach(function (obj) {
                            if(obj._id==_this.newUserGroup)
                            {
                                obj.users.push(data.data);
                                obj.users.sort(function (obj1,obj2) {
                                    return obj1.user.name>obj2.user.name
                                })
                            }
                        })
                    }
                    else
                    {
                        _this.selUserApplyObj.item.handle=2;
                    }
                }
                else
                {
                    _this.selUserApplyObj.item.handle=3;
                    $.notify(data.msg,0);
                }
                _this.showUserApply=false;
            })
        }
    },
    created:function () {
        var _this=this;
        Promise.all([
            net.get("/team/info",{
                id:_this.session.teamId
            }),
            net.get("/team/apply",{
                id:_this.session.teamId
            })
        ]).then(function (arr) {
            $.stopLoading();
            var data1=arr[0];
            var data2=arr[1];
            if(data1.code==200)
            {
                store.commit("setTeam",data1.data);
                _this.newUserGroup=data1.data.user[0]._id;
            }
            else
            {
                throw data1.msg;
            }
            if(data2.code==200)
            {
                data2.data.forEach(function (obj) {
                    obj.handle=0;
                })
                _this.arrApply=data2.data;
                if(_this.arrApply.length>0)
                {
                    _this.showApply=true;
                }
            }
            else
            {
                throw data2.msg;
            }
        }).catch(function (err) {
            $.notify(err,0);
        })
    },
})
$.ready(function () {
    $.startLoading();
})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(5), __webpack_require__(2), __webpack_require__(0)))

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(41);
var v4 = __webpack_require__(42);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(29);
var bytesToUuid = __webpack_require__(28);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(29);
var bytesToUuid = __webpack_require__(28);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "编辑用户的权限",
      "size": "small",
      "modal": _vm.hud
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-form', {
    attrs: {
      "label-width": "80px"
    }
  }, [_c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "接口"
    }
  }, [_c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.ie),
      callback: function($$v) {
        _vm.option.ie = $$v
      },
      expression: "option.ie"
    }
  }, [_vm._v("接口编辑")])], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "测试"
    }
  }, [_c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.te),
      callback: function($$v) {
        _vm.option.te = $$v
      },
      expression: "option.te"
    }
  }, [_vm._v("用例编辑")])], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "全局"
    }
  }, [_c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.gb),
      callback: function($$v) {
        _vm.option.gb = $$v
      },
      expression: "option.gb"
    }
  }, [_vm._v("\n                BaseUrl\n            ")]), _vm._v("  \n            "), _c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.gs),
      callback: function($$v) {
        _vm.option.gs = $$v
      },
      expression: "option.gs"
    }
  }, [_vm._v("\n                状态码\n            ")]), _vm._v("  \n            "), _c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.gi),
      callback: function($$v) {
        _vm.option.gi = $$v
      },
      expression: "option.gi"
    }
  }, [_vm._v("\n                环境注入\n            ")]), _vm._v("  \n            "), _c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.gd),
      callback: function($$v) {
        _vm.option.gd = $$v
      },
      expression: "option.gd"
    }
  }, [_vm._v("\n                文档\n            ")])], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "版本"
    }
  }, [_c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.ve),
      callback: function($$v) {
        _vm.option.ve = $$v
      },
      expression: "option.ve"
    }
  }, [_vm._v("版本编辑")]), _vm._v("  \n            "), _c('el-checkbox', {
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.option.vr),
      callback: function($$v) {
        _vm.option.vr = $$v
      },
      expression: "option.vr"
    }
  }, [_vm._v("版本回滚")])], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n            保存\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-5966a33e", module.exports)
  }
}

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(50),
  /* template */
  __webpack_require__(87),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/component/importProject.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] importProject.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4e86a0d1", Component.options)
  } else {
    hotAPI.reload("data-v-4e86a0d1", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, session, net) {//
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

var uuid = __webpack_require__(40);
var dragFile = __webpack_require__(92);
var bus = __webpack_require__(91);
module.exports = {
    data: function data() {
        return {
            type: 0,
            text: "",
            textMy: "",
            arr: [{
                title: ""
            }],
            savePending: false,
            status: "",
            ignore: 0,
            textRap: "",
            rapBodyType: 0,
            swaggerType: 0,
            textSwaggerJSON: "",
            textSwaggerURL: "",
            showDialog: false
        };
    },
    directives: {
        drag: dragFile
    },
    computed: {},
    methods: {
        remove: function remove(index) {
            if (this.arr.length > 1) {
                this.arr.splice(index, 1);
            } else {
                this.arr[0].title = "";
            }
        },
        save: function save() {
            if (this.type == 0) {
                if (!this.text) {
                    $.tip("请输入JSON", 0);
                    return;
                }
                var obj;
                try {
                    obj = JSON.parse(this.text);
                } catch (e) {
                    $.tip("JSON格式有错误", 0);
                    return;
                }
                if (!obj.info._postman_id) {
                    $.tip("不是可识别的JSON格式", 0);
                    return;
                } else if (!obj.info.name) {
                    $.tip("项目名称为空", 0);
                    return;
                }
                var arr = [];
                this.arr.forEach(function (obj) {
                    if (obj.title) {
                        arr.push(obj.title);
                    }
                });
                if (arr.length == 0) {
                    $.tip("请输入BaseUrl", 0);
                    return;
                }
                var _this = this;
                this.savePending = true;
                var update = {
                    json: this.text,
                    baseurl: arr.join(","),
                    ignore: this.ignore
                };
                if (session.get("teamId")) {
                    update.team = session.get("teamId");
                }
                net.post("/project/importpostman", update).then(function (data) {
                    _this.savePending = false;
                    if (data.code == 200) {
                        _this.savePending = false;
                        _this.$refs.box.close();
                        $.notify("导入成功", 1);
                        _this.$store.commit("addProjectCreate", data.data);
                        if (session.get("teamId")) {
                            bus.$emit("updateTeamProject", 1, data.data.interfaceCount);
                        }
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            } else if (this.type == 1) {
                if (!this.textMy) {
                    $.tip("请输入JSON", 0);
                    return;
                }
                var obj;
                try {
                    obj = JSON.parse(this.textMy);
                } catch (err) {
                    $.tip("json解析错误", 0);
                    return;
                }
                if (obj.flag != "SBDoc") {
                    $.tip("不是DOClever的导出格式", 0);
                    return;
                }
                var _this = this;
                this.savePending = true;
                var update = {
                    json: this.textMy
                };
                if (session.get("teamId")) {
                    update.team = session.get("teamId");
                }
                net.post("/project/importjson", update).then(function (data) {
                    _this.savePending = false;
                    if (data.code == 200) {
                        $.notify("导入成功", 1);
                        if (session.get("teamId")) {
                            _this.$parent.obj.project.unshift(data.data);
                            bus.$emit("updateTeamProject", 1, data.data.interfaceCount);
                        } else {
                            _this.$store.commit("addProjectCreate", data.data);
                        }
                        _this.$refs.box.close();
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            } else if (this.type == 2) {
                if (!this.textRap) {
                    $.tip("请输入JSON", 0);
                    return;
                }
                var obj;
                try {
                    obj = JSON.parse(this.textRap);
                    obj = eval("(" + obj.modelJSON + ")");
                } catch (e) {
                    $.tip("JSON格式有错误", 0);
                    return;
                }
                var _this = this;
                this.savePending = true;
                var update = {
                    json: JSON.stringify(obj),
                    bodytype: this.rapBodyType
                };
                if (session.get("teamId")) {
                    update.team = session.get("teamId");
                }
                net.post("/project/importrap", update).then(function (data) {
                    _this.savePending = false;
                    if (data.code == 200) {
                        $.notify("导入成功", 1);
                        if (session.get("teamId")) {
                            _this.$parent.obj.project.unshift(data.data);
                            bus.$emit("updateTeamProject", 1, data.data.interfaceCount);
                        } else {
                            _this.$store.commit("addProjectCreate", data.data);
                        }
                        _this.$refs.box.close();
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            } else if (this.type == 3) {
                if (this.swaggerType == 0) {
                    if (!this.textSwaggerURL) {
                        $.tip("请输入url地址", 0);
                        return;
                    }
                } else if (this.swaggerType == 1) {
                    if (!this.textSwaggerJSON) {
                        $.tip("请输入JSON", 0);
                        return;
                    }
                }
                var obj;
                if (this.swaggerType == 1) {
                    try {
                        obj = JSON.parse(this.textSwaggerJSON);
                    } catch (e) {
                        $.tip("JSON格式有错误", 0);
                        return;
                    }
                }
                var _this = this;
                this.savePending = true;
                var update = {};
                if (this.swaggerType == 0) {
                    update.url = this.textSwaggerURL;
                } else {
                    update.json = this.textSwaggerJSON;
                }
                if (session.get("teamId")) {
                    update.team = session.get("teamId");
                }
                net.post("/project/importswagger", update).then(function (data) {
                    _this.savePending = false;
                    if (data.code == 200) {
                        $.notify("导入成功", 1);
                        if (session.get("teamId")) {
                            _this.$parent.obj.project.unshift(data.data);
                            bus.$emit("updateTeamProject", 1, data.data.interfaceCount);
                        } else {
                            _this.$store.commit("addProjectCreate", data.data);
                        }
                        _this.$refs.box.close();
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            }
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3), __webpack_require__(2)))

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

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "导入",
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
    staticClass: "row",
    staticStyle: {
      "height": "50px",
      "line-height": "50px"
    }
  }, [_vm._v("\n        导入类型：   \n        "), _c('el-select', {
    model: {
      value: (_vm.type),
      callback: function($$v) {
        _vm.type = $$v
      },
      expression: "type"
    }
  }, [_c('el-option', {
    attrs: {
      "label": "PostMan V2 JSON",
      "value": 0
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "DOClever JSON",
      "value": 1
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "RAP JSON",
      "value": 2
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "Swagger",
      "value": 3
    }
  })], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "1px",
      "background-color": "rgb(247,246,242)",
      "margin-bottom": "10px"
    }
  }), _vm._v(" "), _c('el-row', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 0),
      expression: "type==0"
    }],
    staticClass: "row"
  }, [_c('el-input', {
    directives: [{
      name: "drag",
      rawName: "v-drag",
      value: ('text'),
      expression: "'text'"
    }],
    staticStyle: {
      "margin-bottom": "10px"
    },
    attrs: {
      "type": "textarea",
      "rows": 10,
      "placeholder": "请输入JSON"
    },
    model: {
      value: (_vm.text),
      callback: function($$v) {
        _vm.text = $$v
      },
      expression: "text"
    }
  }), _vm._v("\n        请编辑BaseUrl：\n        "), _c('el-checkbox', {
    staticStyle: {
      "float": "right",
      "margin-right": "20px"
    },
    attrs: {
      "true-label": 1,
      "false-label": 0
    },
    model: {
      value: (_vm.ignore),
      callback: function($$v) {
        _vm.ignore = $$v
      },
      expression: "ignore"
    }
  }, [_vm._v("\n            忽略大小写\n        ")]), _vm._v(" "), _vm._l((_vm.arr), function(item, index) {
    return [_c('el-row', {
      staticClass: "row",
      staticStyle: {
        "height": "50px",
        "line-height": "50px",
        "text-align": "center"
      }
    }, [_c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 20
      }
    }, [_c('el-input', {
      staticStyle: {
        "width": "100%"
      },
      attrs: {
        "placeholder": "请填写baseurl地址"
      },
      model: {
        value: (item.title),
        callback: function($$v) {
          item.title = $$v
        },
        expression: "item.title"
      }
    })], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 2
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red",
        "font-size": "15px"
      },
      attrs: {
        "type": "text",
        "size": "small",
        "icon": "close"
      },
      on: {
        "click": function($event) {
          _vm.remove(index)
        }
      }
    })], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 2
      }
    }, [(index == _vm.arr.length - 1) ? _c('el-button', {
      staticStyle: {
        "font-size": "15px"
      },
      attrs: {
        "size": "small",
        "type": "text",
        "icon": "plus"
      },
      on: {
        "click": function($event) {
          _vm.arr.push({
            title: ''
          })
        }
      }
    }) : _vm._e()], 1)], 1)]
  })], 2), _vm._v(" "), _c('el-row', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 1),
      expression: "type==1"
    }],
    staticClass: "row"
  }, [_c('el-input', {
    directives: [{
      name: "drag",
      rawName: "v-drag",
      value: ('textMy'),
      expression: "'textMy'"
    }],
    attrs: {
      "type": "textarea",
      "rows": 10,
      "placeholder": "请输入JSON"
    },
    model: {
      value: (_vm.textMy),
      callback: function($$v) {
        _vm.textMy = $$v
      },
      expression: "textMy"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 2),
      expression: "type==2"
    }],
    staticClass: "row"
  }, [_c('el-input', {
    directives: [{
      name: "drag",
      rawName: "v-drag",
      value: ('textRap'),
      expression: "'textRap'"
    }],
    attrs: {
      "type": "textarea",
      "rows": 10,
      "placeholder": "请输入JSON"
    },
    model: {
      value: (_vm.textRap),
      callback: function($$v) {
        _vm.textRap = $$v
      },
      expression: "textRap"
    }
  }), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "20px"
    }
  }), _vm._v(" "), _c('el-row', {
    staticClass: "row"
  }, [_vm._v("\n            Body Type:   \n            "), _c('el-select', {
    model: {
      value: (_vm.rapBodyType),
      callback: function($$v) {
        _vm.rapBodyType = $$v
      },
      expression: "rapBodyType"
    }
  }, [_c('el-option', {
    attrs: {
      "value": 0,
      "label": "x-www-form-urlencoded"
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "value": 1,
      "label": "application/json"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c('el-row', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 3),
      expression: "type==3"
    }],
    staticClass: "row"
  }, [_vm._v("\n        Swagger类型:   \n        "), _c('el-select', {
    model: {
      value: (_vm.swaggerType),
      callback: function($$v) {
        _vm.swaggerType = $$v
      },
      expression: "swaggerType"
    }
  }, [_c('el-option', {
    attrs: {
      "value": 0,
      "label": "URL"
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "value": 1,
      "label": "JSON"
    }
  })], 1), _c('br'), _c('br'), _vm._v(" "), _c('el-input', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.swaggerType == 0),
      expression: "swaggerType==0"
    }],
    attrs: {
      "placeholder": "请输入Swagger URL"
    },
    model: {
      value: (_vm.textSwaggerURL),
      callback: function($$v) {
        _vm.textSwaggerURL = $$v
      },
      expression: "textSwaggerURL"
    }
  }), _vm._v(" "), _c('el-input', {
    directives: [{
      name: "drag",
      rawName: "v-drag",
      value: ('textSwaggerJSON'),
      expression: "'textSwaggerJSON'"
    }, {
      name: "show",
      rawName: "v-show",
      value: (_vm.swaggerType == 1),
      expression: "swaggerType==1"
    }],
    attrs: {
      "type": "textarea",
      "rows": 10,
      "placeholder": "请输入Swagger Url"
    },
    model: {
      value: (_vm.textSwaggerJSON),
      callback: function($$v) {
        _vm.textSwaggerJSON = $$v
      },
      expression: "textSwaggerJSON"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row"
  }, [_vm._v(_vm._s(_vm.status))]), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.savePending
    },
    on: {
      "click": _vm.save
    }
  }, [_vm._v("\n            保存\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4e86a0d1", module.exports)
  }
}

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


/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue) {module.exports=new Vue();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ })

},[369]);
//# sourceMappingURL=team.js.map