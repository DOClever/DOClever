webpackJsonp([1],{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(12),
  /* template */
  __webpack_require__(16),
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

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "height": "30px",
      "line-height": "30px"
    }
  }, [_c('el-button', {
    attrs: {
      "type": "text",
      "size": "small",
      "icon": "arrow-left"
    },
    on: {
      "click": _vm.pre
    }
  }), _vm._v("   " + _vm._s(_vm.page + 1) + "   "), _c('el-button', {
    staticStyle: {
      "margin-left": "0"
    },
    attrs: {
      "type": "text",
      "size": "small",
      "icon": "arrow-right"
    },
    on: {
      "click": _vm.next
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2acba0fc", module.exports)
  }
}

/***/ }),

/***/ 12:
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
var ver = __webpack_require__(18);
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
                        var child = $.showBox(_this, __webpack_require__(14), {
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

/***/ 13:
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

var scroll = __webpack_require__(17);
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

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(13),
  /* template */
  __webpack_require__(15),
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

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(185),
  /* template */
  __webpack_require__(496),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/userEdit.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] userEdit.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ef680e8", Component.options)
  } else {
    hotAPI.reload("data-v-7ef680e8", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 15:
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

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(173),
  /* template */
  __webpack_require__(494),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/interface.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] interface.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b64c656", Component.options)
  } else {
    hotAPI.reload("data-v-7b64c656", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(174),
  /* template */
  __webpack_require__(434),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/project.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0436b176", Component.options)
  } else {
    hotAPI.reload("data-v-0436b176", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(178),
  /* template */
  __webpack_require__(458),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/setting.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] setting.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-34f3012d", Component.options)
  } else {
    hotAPI.reload("data-v-34f3012d", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(179),
  /* template */
  __webpack_require__(473),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/statistic.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] statistic.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-453feeed", Component.options)
  } else {
    hotAPI.reload("data-v-453feeed", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 157:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(180),
  /* template */
  __webpack_require__(449),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/team.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] team.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1cf1f760", Component.options)
  } else {
    hotAPI.reload("data-v-1cf1f760", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(184),
  /* template */
  __webpack_require__(472),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/user.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] user.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-451946be", Component.options)
  } else {
    hotAPI.reload("data-v-451946be", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 16:
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

/***/ 17:
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

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vuex, net) {module.exports=new Vuex.Store({
    state:{
        user:{
            total:0,
            todayLogin:0,
            todayRegister:0,
            list:[]
        },
        project:{
            total:0,
            todayCreate:0,
            list:[]
        },
        team:{
            total:0,
            todayCreate:0,
            list:[]
        },
        interface:{
            total:0,
            todayCreate:0,
        },
    },
    mutations:{
        setUserInfo:function (state,data) {
            state.user.total=data.total;
            state.user.todayLogin=data.login;
            state.user.todayRegister=data.register;
        },
        setProjectInfo:function (state,data) {
            state.project.total=data.total;
            state.project.todayCreate=data.today;
        },
        setTeamInfo:function (state,data) {
            state.team.total=data.total;
            state.team.todayCreate=data.today;
        },
        setInterfaceInfo:function (state,data) {
            state.interface.total=data.total;
            state.interface.todayCreate=data.today;
        }
    },
    actions:{
        userList:function (context,query) {
            return net.get("/admin/userlist",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.user.list=data.data;
                }
                return data;
            })
        },
        saveUser:function (context,query) {
            return net.upload("post","/admin/user",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.user.list.forEach(function (obj) {
                        if(obj._id==data.data._id)
                        {
                            obj.name=data.data.name;
                            obj.photo=data.data.photo;
                            obj.state=data.data.state;
                        }
                    })
                }
                return data
            })
        },
        removeUser:function (context,query) {
            return net.delete("/admin/user",{
                id:query.id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.user.list.splice(query.index,1);
                }
                return data;
            })
        },
        saveProject:function (context,query) {
            return net.put("/admin/project",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.project.list.forEach(function (obj) {
                        if(obj._id==data.data._id)
                        {
                            obj.name=data.data.name;
                            obj.public=data.data.public;
                        }
                    })
                }
                return data
            })
        },
        removeProject:function (context,query) {
            return net.delete("/admin/project",{
                id:query.id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.project.list.splice(query.index,1);
                }
                return data;
            })
        },
        projectList:function (context,query) {
            return net.get("/admin/projectlist",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.project.list=data.data;
                }
                return data;
            })
        },
        teamList:function (context,query) {
            return net.get("/admin/teamlist",query).then(function (data) {
                if(data.code==200)
                {
                    context.state.team.list=data.data;
                }
                return data;
            })
        },
        removeTeam:function (context,query) {
            return net.delete("/admin/team",{
                id:query.id
            }).then(function (data) {
                if(data.code==200)
                {
                    context.state.team.list.splice(query.index,1);
                }
                return data;
            })
        },
        editPassword:function (context,query) {
            return net.put("/admin/password",query).then(function (data) {
                return data;
            })
        },
        teamRemoveProject:function (context,query) {
            return net.put("/admin/teampushproject",{
                id:query.team,
                project:query.project
            }).then(function (data) {
                return data;
            })
        },
        setProjectOwner:function (context,query) {
            return net.put("/admin/userprojectown",{
                id:query.project,
                user:query.user
            }).then(function (data) {
                return data;
            })
        },
        searchUser:function (context,name) {
            return net.get("/admin/searchuser",{
                user:name
            }).then(function (data) {
                return data
            })
        },
        addProject:function (context,obj) {
            return net.post("/admin/project",obj).then(function (data) {
                return data;
            })
        },
        removeProjectUser:function (context,obj) {
            return net.delete("/admin/projectuser",{
                id:obj.id,
                user:obj.user
            }).then(function (data) {
                return data;
            })
        },
        editProjectUser:function (context,obj) {
            return net.post("/admin/projectuserrole",obj).then(function (data) {
                return data;
            })
        },
        projectUserList:function (context,id) {
            return net.get("/admin/projectuserlist",{
                id:id
            }).then(function (data) {
                return data;
            })
        },
        setTeamOwner:function (context,obj) {
            return net.put("/admin/userteamown",obj).then(function (data) {
                return data
            })

        },
        addTeam:function (context,obj) {
            return net.post("/admin/team",obj).then(function (data) {
                return data;
            })
        },
        pullTeamUser:function (context,obj) {
            return net.post("/admin/addteamuser",obj).then(function (data) {
                return data;
            })
        },
        addTeamGroup:function (context,obj) {
            return net.post("/admin/teamgroup",obj).then(function (data) {
                return data;
            })
        },
        removeTeamGroup:function (context,obj) {
            return net.delete("/admin/teamgroup",obj).then(function (data) {
                return data;
            })
        },
        editTeamUserRole:function (context,obj) {
            return net.put("/admin/teamuser",obj).then(function (data) {
                return data;
            })
        },
        removeTeamUser:function (context,obj) {
            return net.delete("/admin/teamuser",obj).then(function (data) {
                return data;
            })
        },
        moveTeamUser:function (context,obj) {
            return net.put("/admin/moveteamuser",obj).then(function (data) {
                return data;
            })
        },
        getTeamUserList:function (context,obj) {
            return net.get("/admin/teamuserlist",obj).then(function (data) {
                return data;
            })
        },
        editTeamInfo:function(context,obj){
            return net.put("/admin/team",obj).then(function (data) {
                return data;
            })
        },
        getTeamProjectList:function (context,obj) {
            return net.get("/admin/teamprojectlist",obj).then(function (data) {
                return data;
            })
        },
        pullTeamProject:function (context,obj) {
            return net.put("/admin/teampullproject",obj).then(function (data) {
                return data;
            })
        },
        pushTeamProject:function (context,obj) {
            return net.put("/admin/teampushproject",obj).then(function (data) {
                return data;
            })
        }
    }

})
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37), __webpack_require__(2)))

/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

//
//
//
//
//
//
//
//
//
//
//
//
//
//

var page = __webpack_require__(33);
module.exports = {
    data: function data() {
        return {};
    },
    computed: {
        total: function total() {
            return this.$store.state.interface.total;
        },
        create: function create() {
            return this.$store.state.interface.todayCreate;
        }
    },
    components: {
        "page": page
    },
    methods: {}
};

/***/ }),

/***/ 174:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var page = __webpack_require__(33);
var projectAdd = __webpack_require__(384);
var editProjectUser = __webpack_require__(386);
module.exports = {
    data: function data() {
        return {
            type: 0,
            project: ""
        };
    },
    computed: {
        total: function total() {
            return this.$store.state.project.total;
        },
        create: function create() {
            return this.$store.state.project.todayCreate;
        },
        list: function list() {
            return this.$store.state.project.list;
        }
    },
    components: {
        "page": page
    },
    methods: {
        edit: function edit(item, index) {
            var _this = this;
            $.startHud();
            net.get("/admin/project", {
                id: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.showBox(_this.$root, __webpack_require__(385), {
                        propObj: data.data
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否删除改项目？", function () {
                $.startHud();
                _this.$store.dispatch("removeProject", {
                    id: item._id,
                    index: index
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        changePage: function changePage(page) {
            var query = {
                page: page,
                type: this.type
            };
            if (this.project) {
                query.key = this.project;
            }
            $.startHud();
            this.$store.dispatch("projectList", query).then(function (data) {
                $.stopHud();
                if (data.code != 200) {
                    $.notify(data.msg, 0);
                }
            });
        },
        add: function add() {
            $.showBox(this.$root, projectAdd);
        },
        own: function own(item, index) {
            var _this = this;
            $.input("请输入指定的所有者", function (val) {
                if (!val.value) {
                    $.tip("请输入指定的所有者", 0);
                    return false;
                }
                $.startHud();
                _this.$store.dispatch("setProjectOwner", {
                    project: item._id,
                    user: val.value
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("指定成功", 1);
                        item.owner = data.data;
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
                return true;
            });
        },
        user: function user(item, index) {
            var _this = this;
            this.$store.dispatch("projectUserList", item._id).then(function (data) {
                if (data.code == 200) {
                    $.showBox(_this.$root, editProjectUser, {
                        propObj: data.data,
                        projectId: item._id
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        quit: function quit(item, index) {
            var _this = this;
            $.confirm("是否确定退出团队", function () {
                $.startHud();
                _this.$store.dispatch("teamRemoveProject", {
                    team: item.team._id,
                    project: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("退出成功", 1);
                        item.team = null;
                        delete item.team;
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

/***/ 175:
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
//
//
//
//
//
//
//
//
//
//
//
//

var _roleOption = __webpack_require__(24);
module.exports = {
    data: function data() {
        return {
            savePending: false,
            obj: {
                name: "",
                dis: "",
                public: 0,
                owner: {
                    name: "",
                    id: ""
                },
                users: [{
                    name: "",
                    id: "",
                    role: 0,
                    option: {
                        "ie": 0,
                        "te": 0,
                        "gb": 0,
                        "gs": 0,
                        "gi": 0,
                        "gd": 0,
                        "ve": 0,
                        "vr": 0
                    }
                }]
            },
            showDialog: false
        };
    },
    computed: {},
    methods: {
        add: function add() {
            this.obj.users.push({
                name: "",
                id: "",
                role: 0,
                option: {}
            });
        },
        querySearchAsync: function querySearchAsync(index, str, cb) {
            if (!str) {
                cb([]);
                return;
            }
            this.$store.dispatch("searchUser", str).then(function (data) {
                if (data.code == 200) {
                    cb(data.data.map(function (obj) {
                        return {
                            value: obj.name,
                            id: obj._id,
                            index: index
                        };
                    }));
                }
            });
        },
        sel: function sel(data) {
            this.obj.owner.name = data.value;
            this.obj.owner.id = data.id;
        },
        selUser: function selUser(data) {
            this.obj.users[data.index].name = data.value;
            this.obj.users[data.index].id = data.id;
        },
        save: function save() {
            var obj = {};
            if (!this.obj.name) {
                $.tip("名称不能为空", 0);
                return;
            } else {
                obj.name = this.obj.name;
            }
            if (this.obj.dis) {
                obj.dis = this.obj.dis;
            }
            obj.public = this.obj.public;
            if (!this.obj.owner.id) {
                $.tip("请选择所有者", 0);
                return;
            } else {
                obj.owner = this.obj.owner.id;
            }
            var arr = [];
            this.obj.users.forEach(function (obj) {
                if (obj.id) {
                    var o = {
                        user: obj.id,
                        role: obj.role
                    };
                    if (obj.role == 1) {
                        o.option = obj.option;
                    }
                    arr.push(o);
                }
            });
            if (arr.length > 0) {
                obj.users = JSON.stringify(arr);
            }
            var _this = this;
            this.savePending = true;
            this.$store.dispatch("addProject", obj).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("新建成功", 1);
                    _this.$refs.box.close();
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        remove: function remove(item, index) {
            if (index == 0) {
                this.obj.users[0] = {
                    name: "",
                    id: "",
                    role: 0,
                    option: {
                        "ie": 0,
                        "te": 0,
                        "gb": 0,
                        "gs": 0,
                        "gi": 0,
                        "gd": 0,
                        "ve": 0,
                        "vr": 0
                    }
                };
            } else {
                this.obj.users.splice(index, 1);
            }
        },
        roleOption: function roleOption(item, index) {
            var _this = this;
            var child = $.showBox(this.$root, _roleOption, {
                hudremove: 1
            });
            child.$on("save", function (data) {
                item.option = data;
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 176:
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

module.exports = {
    props: ["propObj"],
    data: function data() {
        return {
            obj: this.propObj,
            savePending: false,
            showDialog: false
        };
    },
    computed: {},
    methods: {
        save: function save() {
            var _this = this;
            var obj = {
                id: this.obj._id,
                name: this.obj.name,
                dis: this.obj.dis,
                public: this.obj.public
            };
            this.savePending = true;
            this.$store.dispatch("saveProject", obj).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("保存成功", 1);
                    _this.$refs.box.close();
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, Vue) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var roleOption = __webpack_require__(24);
var proxyImg = __webpack_require__(8);
module.exports = {
    props: ["propObj", "projectId"],
    data: function data() {
        return {
            arr: this.propObj,
            invitePending: false,
            showDialog: false,
            name: "",
            role: 0,
            roleOption: {
                "ie": 0,
                "te": 0,
                "gb": 0,
                "gs": 0,
                "gi": 0,
                "gd": 0,
                "ve": 0,
                "vr": 0
            }
        };
    },
    computed: {},
    directives: {
        proxy: proxyImg
    },
    watch: {
        role: function role(val) {
            if (val == 1) {
                this.roleOption = {
                    "ie": 0,
                    "te": 0,
                    "gb": 0,
                    "gs": 0,
                    "gi": 0,
                    "gd": 0,
                    "ve": 0,
                    "vr": 0
                };
            }
        }
    },
    methods: {
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否踢出该成员！", function () {
                $.startHud();
                _this.$store.dispatch("removeProjectUser", {
                    id: _this.projectId,
                    user: item.user._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("踢出成功", 1);
                        _this.arr.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        editRole: function editRole(item) {
            var _this = this;
            $.startHud();
            var obj = {
                id: this.projectId,
                user: item.user._id,
                role: item.role
            };
            this.$store.dispatch("editProjectUser", obj).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.notify("修改成功", 1);
                    if (item.role == 0) {
                        delete item.option;
                    } else {
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
                    }
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        editRoleOption: function editRoleOption(item) {
            var _this = this;
            var child = $.showBox(this.$root, roleOption, {
                data: item.option
            });
            child.$on("save", function (val) {
                $.startHud();
                var obj = {
                    id: _this.projectId,
                    user: item.user._id,
                    role: item.role,
                    option: JSON.stringify(val)
                };
                _this.$store.dispatch("editProjectUser", obj).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        item.option = val;
                        $.notify("修改成功", 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        invite: function invite() {
            var _this = this;
            this.invitePending = true;
            this.$store.dispatch("editProjectUser", {
                id: this.projectId,
                user: this.name,
                role: this.role,
                option: JSON.stringify(this.roleOption)
            }).then(function (data) {
                _this.invitePending = false;
                if (data.code == 200) {
                    $.notify("修改成功", 1);
                    _this.arr.push(data.data);
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        editOption: function editOption() {
            var _this = this;
            var child = $.showBox(this.$root, roleOption, {
                data: this.roleOption
            });
            child.$on("save", function (val) {
                _this.roleOption = val;
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(5)))

/***/ }),

/***/ 178:
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
//
//
//

module.exports = {
    data: function data() {
        return {
            type: 0,
            passwordPending: false,
            oldPassword: "",
            newPassword: "",
            newPassword1: ""
        };
    },
    computed: {},
    components: {},
    methods: {
        editPassword: function editPassword() {
            if (!this.oldPassword) {
                $.tip("原密码不能为空", 0);
                return;
            } else if (!this.newPassword) {
                $.tip("新密码不能为空", 0);
                return;
            } else if (!this.newPassword1) {
                $.tip("重复新密码不能为空", 0);
                return;
            } else if (this.newPassword != this.newPassword1) {
                $.tip("两次输入新密码不一致", 0);
                return;
            }
            this.editPending = true;
            var _this = this;
            this.$store.dispatch("editPassword", {
                old: this.oldPassword,
                password: this.newPassword
            }).then(function (data) {
                _this.editPending = false;
                if (data.code == 200) {
                    $.notify("修改成功", 1);
                    _this.oldPassword = "";
                    _this.newPassword = "";
                    _this.newPassword1 = "";
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(net, $) {//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function data() {
        return {
            type: 0,
            start: function () {
                var date = new Date();
                date.setDate(date.getDate() - 1);
                return date;
            }.call(this),
            end: function () {
                var date = new Date();
                date.setDate(date.getDate() - 1);
                return date;
            }.call(this),
            arr: [],
            scanPending: false
        };
    },
    computed: {},
    components: {},
    methods: {
        scan: function scan() {
            var _this = this;
            this.scanPending = true;
            net.get("/admin/statisticlist", {
                start: $.getNowFormatDate("yyyy-MM-dd", this.start),
                end: $.getNowFormatDate("yyyy-MM-dd", this.end)
            }).then(function (data) {
                _this.scanPending = false;
                if (data.code == 200) {
                    _this.arr = data.data;
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0)))

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

module.exports = {"version":"4.2.5"}

/***/ }),

/***/ 180:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var page = __webpack_require__(33);
var teamAdd = __webpack_require__(387);
var teamUserEdit = __webpack_require__(389);
var teamProjectEdit = __webpack_require__(388);
module.exports = {
    data: function data() {
        return {
            type: 0,
            team: ""
        };
    },
    computed: {
        total: function total() {
            return this.$store.state.team.total;
        },
        create: function create() {
            return this.$store.state.team.todayCreate;
        },
        list: function list() {
            return this.$store.state.team.list;
        }
    },
    components: {
        "page": page
    },
    methods: {
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否删除改团队？", function () {
                $.startHud();
                _this.$store.dispatch("removeTeam", {
                    id: item._id,
                    index: index
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        changePage: function changePage(page) {
            var query = {
                page: page,
                type: this.type
            };
            if (this.team) {
                query.key = this.team;
            }
            $.startHud();
            this.$store.dispatch("teamList", query).then(function (data) {
                $.stopHud();
                if (data.code != 200) {
                    $.notify(data.msg, 0);
                }
            });
        },
        edit: function edit(item, index) {
            var _this = this;
            $.inputTwo(this.$root, "名称", "描述", "请输入名称", "请输入描述", item.name, item.dis, function (title, content) {
                if (!title) {
                    $.notify("请输入名称", 0);
                    return;
                }
                _this.$store.dispatch("editTeamInfo", {
                    id: item._id,
                    name: title,
                    dis: content
                }).then(function (data) {
                    if (data.code == 200) {
                        $.notify("修改成功", 1);
                        item.name = data.data.name;
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
                return true;
            });
        },
        own: function own(item, index) {
            var _this = this;
            $.input("请输入指定的所有者", function (val) {
                if (!val.value) {
                    $.tip("请输入指定的所有者", 0);
                    return false;
                }
                $.startHud();
                _this.$store.dispatch("setTeamOwner", {
                    id: item._id,
                    user: val.value
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("指定成功", 1);
                        item.owner = data.data;
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
                return true;
            });
        },
        user: function user(item, index) {
            var _this = this;
            $.startHud();
            this.$store.dispatch("getTeamUserList", {
                id: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.showBox(_this.$root, teamUserEdit, {
                        propObj: data.data,
                        teamId: item._id
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        project: function project(item, index) {
            var _this = this;
            $.startHud();
            this.$store.dispatch("getTeamProjectList", {
                id: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.showBox(_this.$root, teamProjectEdit, {
                        propObj: data.data,
                        teamId: item._id
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        add: function add() {
            $.showBox(this.$root, teamAdd);
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 181:
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
//
//
//
//

module.exports = {
    data: function data() {
        return {
            savePending: false,
            obj: {
                name: "",
                dis: "",
                owner: {
                    name: "",
                    id: ""
                },
                users: [{
                    name: "",
                    id: "",
                    role: 0
                }]
            },
            showDialog: false
        };
    },
    computed: {},
    methods: {
        add: function add() {
            this.obj.users.push({
                name: "",
                id: "",
                role: 0
            });
        },
        querySearchAsync: function querySearchAsync(index, str, cb) {
            if (!str) {
                cb([]);
                return;
            }
            this.$store.dispatch("searchUser", str).then(function (data) {
                if (data.code == 200) {
                    cb(data.data.map(function (obj) {
                        return {
                            value: obj.name,
                            id: obj._id,
                            index: index
                        };
                    }));
                }
            });
        },
        sel: function sel(data) {
            this.obj.owner.name = data.value;
            this.obj.owner.id = data.id;
        },
        selUser: function selUser(data) {
            this.obj.users[data.index].name = data.value;
            this.obj.users[data.index].id = data.id;
        },
        save: function save() {
            var obj = {};
            if (!this.obj.name) {
                $.tip("名称不能为空", 0);
                return;
            } else {
                obj.name = this.obj.name;
            }
            if (this.obj.dis) {
                obj.dis = this.obj.dis;
            }
            if (!this.obj.owner.id) {
                $.tip("请选择所有者", 0);
                return;
            } else {
                obj.owner = this.obj.owner.id;
            }
            var arr = [];
            this.obj.users.forEach(function (obj) {
                if (obj.id) {
                    var o = {
                        user: obj.id,
                        role: obj.role
                    };
                    arr.push(o);
                }
            });
            if (arr.length > 0) {
                obj.users = JSON.stringify(arr);
            }
            var _this = this;
            this.savePending = true;
            this.$store.dispatch("addTeam", obj).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("新建成功", 1);
                    _this.$refs.box.close();
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        remove: function remove(item, index) {
            if (index == 0) {
                this.obj.users[0] = {
                    name: "",
                    id: "",
                    role: 0
                };
            } else {
                this.obj.users.splice(index, 1);
            }
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 182:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ["propObj", "teamId"],
    data: function data() {
        return {
            showDialog: false,
            newId: "",
            arr: this.propObj,
            pullPending: false
        };
    },
    computed: {},
    methods: {
        add: function add() {
            if (!this.newId) {
                $.tip("请输入项目的ID", 0);
                return;
            }
            var _this = this;
            this.pullPending = true;
            this.$store.dispatch("pullTeamProject", {
                id: this.teamId,
                project: this.newId
            }).then(function (data) {
                _this.pullPending = false;
                if (data.code == 200) {
                    $.notify("拉入成功", 1);
                    _this.arr.push(data.data);
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        quit: function quit(item, index) {
            var _this = this;
            $.confirm("是否确认移除该项目", function () {
                $.startHud();
                _this.$store.dispatch("pushTeamProject", {
                    id: _this.teamId,
                    project: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("移除成功", 1);
                        _this.arr.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 183:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ["propObj", "teamId"],
    data: function data() {
        return {
            arr: this.propObj,
            invitePending: false,
            showDialog: false,
            name: "",
            role: 0,
            searchName: "",
            showGroup: false,
            movePending: false,
            moveUserId: "",
            selectGroup: "",
            moveUserIndex: -1,
            moveUserParent: null
        };
    },
    computed: {
        arrFilter: function arrFilter() {
            if (!this.searchName) {
                return this.arr;
            }
            var arr = [];
            var _this = this;
            this.arr.forEach(function (obj) {
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
            return this.arr.map(function (obj) {
                return {
                    name: obj.name,
                    id: obj._id
                };
            });
        }
    },
    directives: {
        proxy: proxyImg
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
                _this.$store.dispatch("pullTeamUser", {
                    id: _this.teamId,
                    user: val.value,
                    group: item._id,
                    role: 1
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("邀请成功", 1);
                        item.users.push(data.data);
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
                _this.$store.dispatch("addTeamGroup", {
                    id: _this.teamId,
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
                    _this.$store.dispatch("removeTeamGroup", {
                        group: item._id
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
            }
        },
        changeRole: function changeRole(item) {
            this.$store.dispatch("editTeamUserRole", {
                id: this.teamId,
                user: item.user._id,
                role: item.role
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
                _this.$store.dispatch("removeTeamUser", {
                    id: _this.teamId,
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
            this.$store.dispatch("moveTeamUser", {
                id: this.teamId,
                user: this.moveUserId,
                group: this.selectGroup
            }).then(function (data) {
                _this.movePending = false;
                if (data.code == 200) {
                    $.notify("移动成功", 1);
                    _this.showGroup = false;
                    _this.moveUserParent.users.splice(_this.moveUserIndex, 1);
                    var group;
                    _this.arr.forEach(function (obj) {
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
        },
        addGroup: function addGroup() {
            var _this = this;
            $.input("请输入部门名称", function (val) {
                if (!val.value) {
                    $.tip("请输入部门名称", 0);
                    return;
                }
                $.startHud();
                _this.$store.dispatch("addTeamGroup", {
                    id: _this.teamId,
                    name: val.value
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("新建成功", 1);
                        _this.arr.push(data.data);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 184:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var page = __webpack_require__(33);
var proxyImg = __webpack_require__(8);
var _userProject = __webpack_require__(390);
var _userTeam = __webpack_require__(391);
module.exports = {
    data: function data() {
        return {
            type: 0,
            user: ""
        };
    },
    computed: {
        total: function total() {
            return this.$store.state.user.total;
        },
        register: function register() {
            return this.$store.state.user.todayRegister;
        },
        login: function login() {
            return this.$store.state.user.todayLogin;
        },
        list: function list() {
            return this.$store.state.user.list;
        }
    },
    directives: {
        proxy: proxyImg
    },
    components: {
        "page": page
    },
    methods: {
        create: function create() {
            $.showBox(this.$root, __webpack_require__(145));
        },
        edit: function edit(item, index) {
            var _this = this;
            $.startHud();
            net.get("/admin/userinfo", {
                id: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.showBox(_this.$root, __webpack_require__(145), {
                        propObj: data.data
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否删除改用户？", function () {
                $.startHud();
                _this.$store.dispatch("removeUser", {
                    id: item._id,
                    index: index
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        changePage: function changePage(page) {
            var query = {
                page: page,
                type: this.type
            };
            if (this.user) {
                query.key = this.user;
            }
            $.startHud();
            this.$store.dispatch("userList", query).then(function (data) {
                $.stopHud();
                if (data.code != 200) {
                    $.notify(data.msg, 0);
                }
            });
        },
        userProject: function userProject(item) {
            var _this = this;
            $.startHud();
            net.get("/admin/userprojectlist", {
                id: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.showBox(_this.$root, _userProject, {
                        propObj: data.data,
                        user: item
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        userTeam: function userTeam(item) {
            var _this = this;
            $.startHud();
            net.get("/admin/userteamlist", {
                id: item._id
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.showBox(_this.$root, _userTeam, {
                        propObj: data.data,
                        user: item
                    });
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 185:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var imgFile = __webpack_require__(66);
module.exports = {
    props: ["propObj"],
    data: function data() {
        return {
            obj: this.propObj ? function () {
                if (this.propObj.sex != "男" && this.propObj.sex != "女") {
                    this.propObj.sex = "男";
                }
                return this.propObj;
            }.call(this) : {
                name: "",
                password: "",
                photo: "",
                age: "",
                sex: "男",
                qq: "",
                email: "",
                phone: "",
                company: "",
                state: 1,
                question: "",
                answer: ""
            },
            savePending: false,
            showDialog: false
        };
    },
    directives: {
        "imgfile": imgFile
    },
    computed: {},
    methods: {
        save: function save() {
            var _this = this;
            var obj = {};
            if (this.propObj) {
                obj.id = this.propObj._id;
            }
            if ($.query("#file").value) {
                obj.photo = $.query("#file").files[0];
            }
            obj.age = this.obj.age !== undefined && this.obj.age !== null ? this.obj.age : "";
            obj.sex = this.obj.sex !== undefined && this.obj.sex !== null ? this.obj.sex : "";
            obj.company = this.obj.company !== undefined && this.obj.company !== null ? this.obj.company : "";
            obj.qq = this.obj.qq != undefined && this.obj.qq !== null ? this.obj.qq : "";
            obj.email = this.obj.email !== undefined && this.obj.email !== null ? this.obj.email : "";
            obj.phone = this.obj.phone !== undefined && this.obj.phone !== null ? this.obj.phone : "";
            if (this.obj.question) {
                obj.question = this.obj.question;
            } else {
                $.tip("请输入答案", 0);
                return;
            }
            if (this.obj.answer) {
                obj.answer = this.obj.answer;
            } else {
                $.tip("请输入提示问题", 0);
                return;
            }
            if (this.obj.name) {
                obj.name = this.obj.name;
            } else {
                $.tip("请输入用户名", 0);
                return;
            }
            if (this.obj.password) {
                obj.password = this.obj.password;
            } else {
                $.tip("请输入密码", 0);
                return;
            }
            obj.state = this.obj.state;
            this.savePending = true;
            this.$store.dispatch("saveUser", obj).then(function (data) {
                _this.savePending = false;
                if (data.code == 200) {
                    $.notify("保存成功", 1);
                    _this.$refs.box.close();
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 186:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _roleOption = __webpack_require__(24);
module.exports = {
    props: ["propObj", "user"],
    data: function data() {
        return {
            showDialog: false,
            obj: this.propObj
        };
    },
    computed: {
        ownTabLabel: function ownTabLabel() {
            return "创建(" + this.obj.own.length + ")";
        },
        joinTabLabel: function joinTabLabel() {
            return "创建(" + this.obj.join.length + ")";
        }
    },
    methods: {
        transfer: function transfer(item, index) {
            var _this = this;
            $.input("请输入转让的用户名", function (val) {
                if (!val.value) {
                    $.tip("请输入用户名", 0);
                    return false;
                }
                $.startHud();
                net.put("/admin/userprojectown", {
                    id: item._id,
                    user: val.value
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("转让成功", 1);
                        _this.obj.own.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否删除该项目", function () {
                $.startHud();
                net.delete("/admin/project", {
                    id: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                        _this.obj.own.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        quit: function quit(item, index) {
            var _this = this;
            $.confirm("是否退出该项目", function () {
                $.startHud();
                net.put("/admin/userquitproject", {
                    id: item._id,
                    user: _this.user._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("退出成功", 1);
                        _this.obj.join.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        role: function role(item, index) {
            var _this = this;
            $.startHud();
            net.post("/admin/projectuserrole", {
                id: item._id,
                user: this.user._id,
                role: item.role
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.notify("修改成功", 1);
                    if (item.role == 0) {
                        delete item.option;
                    }
                } else {
                    $.notify(data.msg, 0);
                }
            });
        },
        roleOption: function roleOption(item, index) {
            var _this = this;
            var child = $.showBox(this.$root, _roleOption, {
                data: item.option,
                hudremove: 1
            });
            child.$on("save", function (data) {
                Vue.set(item, "option", data);
                net.post("/admin/projectuserrole", {
                    id: item._id,
                    user: _this.user._id,
                    role: item.role,
                    option: JSON.stringify(data)
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("修改成功", 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(5)))

/***/ }),

/***/ 187:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var roleOption = __webpack_require__(24);
module.exports = {
    props: ["propObj", "user"],
    data: function data() {
        return {
            showDialog: false,
            obj: this.propObj
        };
    },
    computed: {
        ownTabLabel: function ownTabLabel() {
            return "创建(" + this.obj.own.length + ")";
        },
        joinTabLabel: function joinTabLabel() {
            return "创建(" + this.obj.join.length + ")";
        }
    },
    methods: {
        transfer: function transfer(item, index) {
            var _this = this;
            $.input("请输入转让的用户名", function (val) {
                if (!val.value) {
                    $.tip("请输入用户名", 0);
                    return false;
                }
                $.startHud();
                net.put("/admin/userteamown", {
                    id: item._id,
                    user: val.value
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("转让成功", 1);
                        _this.obj.own.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        remove: function remove(item, index) {
            var _this = this;
            $.confirm("是否删除该团队", function () {
                $.startHud();
                net.delete("/admin/team", {
                    id: item._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("删除成功", 1);
                        _this.obj.own.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        quit: function quit(item, index) {
            var _this = this;
            $.confirm("是否退出该团队", function () {
                $.startHud();
                net.put("/admin/userquitteam", {
                    id: item._id,
                    user: _this.user._id
                }).then(function (data) {
                    $.stopHud();
                    if (data.code == 200) {
                        $.notify("退出成功", 1);
                        _this.obj.join.splice(index, 1);
                    } else {
                        $.notify(data.msg, 0);
                    }
                });
            });
        },
        role: function role(item, index) {
            var _this = this;
            $.startHud();
            net.put("/admin/teamuser", {
                id: item._id,
                user: this.user._id,
                role: item.role
            }).then(function (data) {
                $.stopHud();
                if (data.code == 200) {
                    $.notify("修改成功", 1);
                } else {
                    $.notify(data.msg, 0);
                }
            });
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(41),
  /* template */
  __webpack_require__(52),
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

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(68),
  /* template */
  __webpack_require__(113),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/component/page.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] page.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2acba0fc", Component.options)
  } else {
    hotAPI.reload("data-v-2acba0fc", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(175),
  /* template */
  __webpack_require__(452),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/projectAdd.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] projectAdd.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-260db6fb", Component.options)
  } else {
    hotAPI.reload("data-v-260db6fb", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(176),
  /* template */
  __webpack_require__(475),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/projectEdit.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] projectEdit.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-476fcfa0", Component.options)
  } else {
    hotAPI.reload("data-v-476fcfa0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(177),
  /* template */
  __webpack_require__(454),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/projectUserEdit.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] projectUserEdit.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a0bf58b", Component.options)
  } else {
    hotAPI.reload("data-v-2a0bf58b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 387:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(181),
  /* template */
  __webpack_require__(505),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/teamAdd.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamAdd.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c731843e", Component.options)
  } else {
    hotAPI.reload("data-v-c731843e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(182),
  /* template */
  __webpack_require__(506),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/teamProjectEdit.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamProjectEdit.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dba195fa", Component.options)
  } else {
    hotAPI.reload("data-v-dba195fa", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 389:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(183),
  /* template */
  __webpack_require__(446),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/teamUserEdit.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] teamUserEdit.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-159e6336", Component.options)
  } else {
    hotAPI.reload("data-v-159e6336", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(186),
  /* template */
  __webpack_require__(463),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/userProject.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] userProject.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-396f062b", Component.options)
  } else {
    hotAPI.reload("data-v-396f062b", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(1)(
  /* script */
  __webpack_require__(187),
  /* template */
  __webpack_require__(499),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/Users/sunxin/DOClever/Client/web/admin/component/userTeam.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] userTeam.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-87f6188a", Component.options)
  } else {
    hotAPI.reload("data-v-87f6188a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),

/***/ 41:
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

/***/ 434:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "padding-bottom": "10px"
    }
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
      "span": 12
    }
  }, [_vm._v("\n            总共:" + _vm._s(_vm.total) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "border-right": "1px gray solid"
    },
    attrs: {
      "span": 12
    }
  }, [_vm._v("\n            今日新建:" + _vm._s(_vm.create) + "\n        ")])], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "background-color": "white",
      "margin-top": "20px"
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "50px",
      "line-height": "50px",
      "border-bottom": "1px lightgray solid"
    }
  }, [_c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "90%"
    },
    model: {
      value: (_vm.type),
      callback: function($$v) {
        _vm.type = $$v
      },
      expression: "type"
    }
  }, [_c('el-option', {
    attrs: {
      "label": "今日创建",
      "value": 0
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "所有项目",
      "value": 1
    }
  })], 1)], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 16
    }
  }, [(_vm.type == 1) ? _c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "placeholder": "请输入你要查找的项目"
    },
    model: {
      value: (_vm.project),
      callback: function($$v) {
        _vm.project = $$v
      },
      expression: "project"
    }
  }) : _c('span', [_vm._v("\n                     \n                ")])], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.$refs.page.init()
      }
    }
  }, [_vm._v("查询")])], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.add
    }
  }, [_vm._v("新建")])], 1)], 1), _vm._v(" "), _c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                ID\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                项目名\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                创建时间\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                创建者\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                接口数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                用户数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                团队\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                公开\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                操作\n            ")])]), _vm._v(" "), _c('tbody', [_vm._l((_vm.list), function(item, index) {
    return [_c('tr', {
      key: item._id,
      staticStyle: {
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item._id) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.createdAt) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.owner.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.interfaceCount) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.userCount) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.team ? item.team.name : "无") + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.public ? "公开" : "不公开") + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-dropdown', [_c('el-button', {
      staticClass: "el-dropdown-link",
      attrs: {
        "type": "text"
      }
    }, [_vm._v("\n                                操作"), _c('i', {
      staticClass: "el-icon-caret-bottom el-icon--right"
    })]), _vm._v(" "), _c('el-dropdown-menu', {
      slot: "dropdown"
    }, [_c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.edit(item, index)
        }
      }
    }, [_vm._v("编辑")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.own(item, index)
        }
      }
    }, [_vm._v("指定所有者")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.user(item, index)
        }
      }
    }, [_vm._v("管理成员")]), _vm._v(" "), (item.team) ? _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.quit(item, index)
        }
      }
    }, [_vm._v("退出团队")]) : _vm._e(), _vm._v(" "), _c('el-dropdown-item', {
      staticStyle: {
        "color": "red"
      },
      nativeOn: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    }, [_vm._v("删除")])], 1)], 1)], 1)])]
  })], 2), _vm._v(" "), _c('tfoot', [_c('tr', {
    staticStyle: {
      "text-align": "center",
      "vertical-align": "middle"
    }
  }, [_c('td', {
    attrs: {
      "colspan": "7"
    }
  }, [_c('page', {
    ref: "page",
    on: {
      "change": _vm.changePage
    }
  })], 1)])])])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0436b176", module.exports)
  }
}

/***/ }),

/***/ 446:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "管理用户",
      "size": "large"
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
  })], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_c('el-button', {
    staticStyle: {
      "font-size": "15px",
      "width": "40px",
      "height": "50px"
    },
    attrs: {
      "type": "text",
      "title": "添加部门"
    },
    on: {
      "click": _vm.addGroup
    }
  }, [_vm._v("\n                添加部门\n            ")])], 1)], 1), _vm._v(" "), _c('el-collapse', [_vm._l((_vm.arrFilter), function(item, index) {
    return [_c('el-collapse-item', {
      key: item._id,
      staticClass: "hover"
    }, [_c('template', {
      slot: "title"
    }, [_c('span', {
      staticStyle: {
        "font-size": "15px"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name + "(" + item.users.length + ")") + "\n                        ")]), _vm._v("   \n                    "), _c('el-dropdown', [_c('el-button', {
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
    }, [_vm._v("删除")])], 1)], 1)], 1), _vm._v(" "), _vm._l((item.users), function(item1, index1) {
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
      }, [(item1.role != 2) ? [_c('el-select', {
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
      })], 1)] : _c('span', [_vm._v("\n                                团队所有者\n                            ")])], 2), _vm._v(" "), _c('el-col', {
        staticClass: "col",
        attrs: {
          "span": 4
        }
      }, [(item1.role != 2) ? _c('el-dropdown', [_c('el-button', {
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
      }, [_vm._v("移动")]), _vm._v(" "), _c('el-dropdown-item', {
        nativeOn: {
          "click": function($event) {
            _vm.removeUser(item1, index1, item)
          }
        }
      }, [_vm._v("删除")])], 1)], 1) : _vm._e()], 1)], 1)]
    })], 2)]
  })], 2), _vm._v(" "), _c('el-dialog', {
    attrs: {
      "title": "选择部门",
      "size": "small",
      "modal": 0
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
     require("vue-hot-reload-api").rerender("data-v-159e6336", module.exports)
  }
}

/***/ }),

/***/ 449:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "padding-bottom": "10px"
    }
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
      "span": 12
    }
  }, [_vm._v("\n            总共:" + _vm._s(_vm.total) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "border-right": "1px gray solid"
    },
    attrs: {
      "span": 12
    }
  }, [_vm._v("\n            今日新建:" + _vm._s(_vm.create) + "\n        ")])], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "background-color": "white",
      "margin-top": "20px"
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "50px",
      "line-height": "50px",
      "border-bottom": "1px lightgray solid"
    }
  }, [_c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "90%"
    },
    model: {
      value: (_vm.type),
      callback: function($$v) {
        _vm.type = $$v
      },
      expression: "type"
    }
  }, [_c('el-option', {
    attrs: {
      "label": "今日创建",
      "value": 0
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "所有团队",
      "value": 1
    }
  })], 1)], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 16
    }
  }, [(_vm.type == 1) ? _c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "placeholder": "请输入你要查找的项目"
    },
    model: {
      value: (_vm.team),
      callback: function($$v) {
        _vm.team = $$v
      },
      expression: "team"
    }
  }) : _c('span', [_vm._v("\n                     \n                ")])], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.$refs.page.init()
      }
    }
  }, [_vm._v("查询")])], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.add
    }
  }, [_vm._v("新建")])], 1)], 1), _vm._v(" "), _c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                团队名\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                创建时间\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                创建者\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                项目数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                用户数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                操作\n            ")])]), _vm._v(" "), _c('tbody', [_vm._l((_vm.list), function(item, index) {
    return [_c('tr', {
      key: item._id,
      staticStyle: {
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.createdAt) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.owner.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.projectCount) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.userCount) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-dropdown', [_c('el-button', {
      staticClass: "el-dropdown-link",
      attrs: {
        "type": "text"
      }
    }, [_vm._v("\n                                操作"), _c('i', {
      staticClass: "el-icon-caret-bottom el-icon--right"
    })]), _vm._v(" "), _c('el-dropdown-menu', {
      slot: "dropdown"
    }, [_c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.edit(item, index)
        }
      }
    }, [_vm._v("编辑")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.own(item, index)
        }
      }
    }, [_vm._v("指定所有者")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.user(item, index)
        }
      }
    }, [_vm._v("管理成员")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.project(item, index)
        }
      }
    }, [_vm._v("管理项目")]), _vm._v(" "), _c('el-dropdown-item', {
      staticStyle: {
        "color": "red"
      },
      nativeOn: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    }, [_vm._v("删除")])], 1)], 1)], 1)])]
  })], 2), _vm._v(" "), _c('tfoot', [_c('tr', {
    staticStyle: {
      "text-align": "center",
      "vertical-align": "middle"
    }
  }, [_c('td', {
    attrs: {
      "colspan": "7"
    }
  }, [_c('page', {
    ref: "page",
    on: {
      "change": _vm.changePage
    }
  })], 1)])])])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1cf1f760", module.exports)
  }
}

/***/ }),

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "新建项目",
      "size": "large"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-form', {
    ref: "form",
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
    attrs: {
      "name": "name",
      "placeholder": "请输入项目名称"
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
      "label": "描述"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "type": "textarea",
      "rows": 3,
      "name": "dis",
      "placeholder": "请输入项目描述"
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
      "label": "公开"
    }
  }, [_c('el-switch', {
    attrs: {
      "on-color": "#13ce66",
      "off-color": "#ff4949",
      "on-value": 1,
      "off-value": 0
    },
    model: {
      value: (_vm.obj.public),
      callback: function($$v) {
        _vm.obj.public = $$v
      },
      expression: "obj.public"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "所有者"
    }
  }, [_c('el-autocomplete', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "fetch-suggestions": _vm.querySearchAsync.bind(this, 0),
      "name": "owner",
      "placeholder": "请输入所有者名称"
    },
    on: {
      "select": _vm.sel
    },
    model: {
      value: (_vm.obj.owner.name),
      callback: function($$v) {
        _vm.obj.owner.name = $$v
      },
      expression: "obj.owner.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "用户"
    }
  }, [_vm._l((_vm.obj.users), function(item, index) {
    return [_c('el-row', {
      staticClass: "row",
      staticStyle: {
        "height": "50px",
        "line-height": "50px",
        "width": "90%",
        "display": "inline-block"
      }
    }, [_c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 12
      }
    }, [_c('el-autocomplete', {
      staticStyle: {
        "width": "80%"
      },
      attrs: {
        "fetch-suggestions": _vm.querySearchAsync.bind(this, index),
        "placeholder": "请输入用户名称"
      },
      on: {
        "input": function($event) {
          index == _vm.obj.users.length - 1 ? _vm.add() : ''
        },
        "select": _vm.selUser
      },
      model: {
        value: (item.name),
        callback: function($$v) {
          item.name = $$v
        },
        expression: "item.name"
      }
    })], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 6
      }
    }, [_c('el-select', {
      staticStyle: {
        "width": "80%"
      },
      model: {
        value: (item.role),
        callback: function($$v) {
          item.role = $$v
        },
        expression: "item.role"
      }
    }, [_c('el-option', {
      attrs: {
        "label": "管理员",
        "value": 0
      }
    }), _vm._v(" "), _c('el-option', {
      attrs: {
        "label": "观察者",
        "value": 1
      }
    })], 1)], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 4
      }
    }, [(item.role == 1) ? _c('el-button', {
      attrs: {
        "type": "text"
      },
      on: {
        "click": function($event) {
          _vm.roleOption(item, index)
        }
      }
    }, [_vm._v("\n                            权限\n                        ")]) : _vm._e()], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 2
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "icon": "close"
      },
      on: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    })], 1)], 1)]
  })], 2)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "laoding": _vm.savePending
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
     require("vue-hot-reload-api").rerender("data-v-260db6fb", module.exports)
  }
}

/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "管理用户",
      "size": "large"
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
  }, [_c('el-col', {
    staticClass: "col",
    staticStyle: {
      "line-height": "50px",
      "font-size": "15px",
      "text-align": "center",
      "white-space": "nowrap"
    },
    attrs: {
      "span": 3
    }
  }, [_vm._v("\n            邀请用户\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 11
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "placeholder": "输入新增的用户名"
    },
    model: {
      value: (_vm.name),
      callback: function($$v) {
        _vm.name = $$v
      },
      expression: "name"
    }
  })], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "span": 4
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "80%"
    },
    model: {
      value: (_vm.role),
      callback: function($$v) {
        _vm.role = $$v
      },
      expression: "role"
    }
  }, [_c('el-option', {
    attrs: {
      "value": 1,
      "label": "观察者"
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "value": 0,
      "label": "管理员"
    }
  })], 1)], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "line-height": "50px",
      "text-align": "center"
    },
    attrs: {
      "span": 3
    }
  }, [(_vm.role == 1) ? _c('el-button', {
    staticStyle: {
      "font-size": "15px"
    },
    attrs: {
      "size": "small",
      "type": "text"
    },
    on: {
      "click": _vm.editOption
    }
  }, [_vm._v("权限")]) : _vm._e()], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "line-height": "50px",
      "text-align": "center"
    },
    attrs: {
      "span": 3
    }
  }, [_c('el-button', {
    staticStyle: {
      "font-size": "15px"
    },
    attrs: {
      "type": "primary",
      "loading": _vm.invitePending
    },
    on: {
      "click": _vm.invite
    }
  }, [_vm._v("\n                新增\n            ")])], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    attrs: {
      "width": "100%"
    }
  }, [_vm._l((_vm.arr), function(item, index) {
    return [_c('tr', {
      staticStyle: {
        "text-align": "center",
        "vertical-align": "middle",
        "height": "80px"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_c('img', {
      directives: [{
        name: "proxy",
        rawName: "v-proxy",
        value: (item.user.photo),
        expression: "item.user.photo"
      }],
      staticStyle: {
        "border-radius": "30px"
      },
      attrs: {
        "width": "60",
        "height": "60"
      }
    })]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "50%",
        "text-align": "center"
      }
    }, [_vm._v("\n                        " + _vm._s(item.user.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%",
        "text-align": "center"
      }
    }, [_c('el-select', {
      staticStyle: {
        "width": "90%"
      },
      on: {
        "input": function($event) {
          _vm.editRole(item)
        }
      },
      model: {
        value: (item.role),
        callback: function($$v) {
          item.role = $$v
        },
        expression: "item.role"
      }
    }, [_c('el-option', {
      attrs: {
        "value": 1,
        "label": "观察者"
      }
    }), _vm._v(" "), _c('el-option', {
      attrs: {
        "value": 0,
        "label": "管理员"
      }
    })], 1)], 1), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%",
        "text-align": "center"
      }
    }, [(item.role == 1) ? _c('el-button', {
      staticStyle: {
        "font-size": "15px"
      },
      attrs: {
        "size": "small",
        "type": "text"
      },
      on: {
        "click": function($event) {
          _vm.editRoleOption(item, index)
        }
      }
    }, [_vm._v("权限")]) : _vm._e()], 1), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%",
        "text-align": "center"
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red",
        "font-size": "15px"
      },
      attrs: {
        "size": "small",
        "icon": "close",
        "type": "text"
      },
      on: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    })], 1)])]
  })], 2)])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2a0bf58b", module.exports)
  }
}

/***/ }),

/***/ 458:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row"
  }, [_c('el-col', {
    staticClass: "col",
    staticStyle: {
      "padding": "0 10px 0 10px"
    },
    attrs: {
      "span": 6
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "background-color": "white",
      "text-align": "center",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "padding-bottom": "20px"
    }
  }, [_c('el-button', {
    staticStyle: {
      "margin": "20px 0 0 0",
      "width": "80%"
    },
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.type = 0
      }
    }
  }, [_vm._v("\n                修改管理密码\n            ")])], 1)], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "padding": "0 10px 0 10px"
    },
    attrs: {
      "span": 18
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "background-color": "white",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888"
    }
  }, [_c('el-row', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 0),
      expression: "type==0"
    }],
    staticClass: "row"
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "60px"
    }
  }, [_c('h4', {
    staticStyle: {
      "margin-left": "10px",
      "color": "gray"
    }
  }, [_vm._v("\n                        修改管理密码\n                    ")])]), _vm._v(" "), _c('el-form', {
    ref: "form",
    attrs: {
      "label-width": "100px"
    }
  }, [_c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "原密码"
    }
  }, [_c('el-input', {
    staticStyle: {
      "margin-top": "8px",
      "width": "80%"
    },
    model: {
      value: (_vm.oldPassword),
      callback: function($$v) {
        _vm.oldPassword = $$v
      },
      expression: "oldPassword"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "新密码"
    }
  }, [_c('el-input', {
    staticStyle: {
      "margin-top": "8px",
      "width": "80%"
    },
    model: {
      value: (_vm.newPassword),
      callback: function($$v) {
        _vm.newPassword = $$v
      },
      expression: "newPassword"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "重复新密码"
    }
  }, [_c('el-input', {
    staticStyle: {
      "margin-top": "8px",
      "width": "80%"
    },
    model: {
      value: (_vm.newPassword1),
      callback: function($$v) {
        _vm.newPassword1 = $$v
      },
      expression: "newPassword1"
    }
  })], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center"
    }
  }, [_c('el-button', {
    staticStyle: {
      "width": "60%",
      "margin-top": "20px",
      "margin-bottom": "20px"
    },
    attrs: {
      "type": "primary",
      "loading": _vm.passwordPending
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.editPassword($event)
      }
    }
  }, [_vm._v("\n                            保存\n                        ")])], 1)], 1)], 1)], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-34f3012d", module.exports)
  }
}

/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "用户项目",
      "size": "large"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-tabs', {
    attrs: {
      "type": "card"
    }
  }, [_c('el-tab-pane', {
    staticStyle: {
      "height": "500px",
      "overflow-y": "auto"
    },
    attrs: {
      "label": "创建"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                        名称\n                    ")]), _vm._v(" "), _c('th', [_vm._v("\n                        描述\n                    ")]), _vm._v(" "), _c('th', [_vm._v("\n                        创建时间\n                    ")]), _vm._v(" "), _c('th', [_vm._v("\n                        用户数\n                    ")]), _vm._v(" "), _c('th', [_vm._v("\n                        接口数\n                    ")]), _vm._v(" "), _c('th', [_vm._v("\n                        团队\n                    ")]), _vm._v(" "), _c('th', [_vm._v("\n                        操作\n                    ")])]), _vm._v(" "), _vm._l((_vm.obj.own), function(item, index) {
    return [_c('tr', {
      staticStyle: {
        "height": "50px",
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.dis ? item.dis : "无") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.createdAt) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.userCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.interfaceCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.team ? item.team.name : "无") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-button', {
      attrs: {
        "type": "text",
        "title": "转让"
      },
      on: {
        "click": function($event) {
          _vm.transfer(item, index)
        }
      }
    }, [_c('i', {
      staticClass: "fa fa-sign-in"
    })]), _vm._v("  \n                            "), _c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "icon": "close",
        "title": "删除"
      },
      on: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    })], 1)])]
  })], 2)]), _vm._v(" "), _c('el-tab-pane', {
    staticStyle: {
      "height": "500px",
      "overflow-y": "auto"
    },
    attrs: {
      "label": "加入"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                    名称\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    描述\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    创建人\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    创建时间\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    用户数\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    接口数\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    团队\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    角色\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    操作\n                ")])]), _vm._v(" "), _vm._l((_vm.obj.join), function(item, index) {
    return [_c('tr', {
      staticStyle: {
        "height": "50px",
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.dis ? item.dis : "无") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "5%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.owner.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.createdAt) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.userCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.interfaceCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.team ? item.team.name : "无") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "25%"
      }
    }, [_c('el-select', {
      staticStyle: {
        "width": "60%"
      },
      on: {
        "input": function($event) {
          _vm.role(item, index)
        }
      },
      model: {
        value: (item.role),
        callback: function($$v) {
          item.role = $$v
        },
        expression: "item.role"
      }
    }, [_c('el-option', {
      attrs: {
        "label": "管理员",
        "value": 0
      }
    }), _vm._v(" "), _c('el-option', {
      attrs: {
        "label": "观察者",
        "value": 1
      }
    })], 1), _vm._v("\n                             \n                            "), (item.role == 1) ? _c('el-button', {
      attrs: {
        "type": "text",
        "size": "small"
      },
      on: {
        "click": function($event) {
          _vm.roleOption(item, index)
        }
      }
    }, [_vm._v("权限")]) : _vm._e()], 1), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "icon": "close",
        "title": "退出"
      },
      on: {
        "click": function($event) {
          _vm.quit(item, index)
        }
      }
    })], 1)])]
  })], 2)])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-396f062b", module.exports)
  }
}

/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "padding-bottom": "10px"
    }
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
  }, [_vm._v("\n            总共:" + _vm._s(_vm.total) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "border-right": "1px gray solid"
    },
    attrs: {
      "span": 8
    }
  }, [_vm._v("\n            今日注册:" + _vm._s(_vm.register) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 8
    }
  }, [_vm._v("\n            今日登陆:" + _vm._s(_vm.login) + "\n        ")])], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "background-color": "white",
      "margin-top": "20px"
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "50px",
      "line-height": "50px",
      "border-bottom": "1px lightgray solid"
    }
  }, [_c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "90%"
    },
    model: {
      value: (_vm.type),
      callback: function($$v) {
        _vm.type = $$v
      },
      expression: "type"
    }
  }, [_c('el-option', {
    attrs: {
      "label": "今日注册",
      "value": 0
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "今日登陆",
      "value": 1
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "登陆最多",
      "value": 2
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "活跃用户",
      "value": 4
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "所有用户",
      "value": 3
    }
  })], 1)], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 16
    }
  }, [(_vm.type == 3) ? _c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "placeholder": "请输入你要查找的用户"
    },
    model: {
      value: (_vm.user),
      callback: function($$v) {
        _vm.user = $$v
      },
      expression: "user"
    }
  }) : _c('span', [_vm._v("\n                     \n                ")])], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.$refs.page.init()
      }
    }
  }, [_vm._v("查询")])], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 2
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.create
    }
  }, [_vm._v("新建")])], 1)], 1), _vm._v(" "), _c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                用户名\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                头像\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                注册时间\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                最后登陆\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                登陆次数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                状态\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                操作\n            ")])]), _vm._v(" "), _c('tbody', [_vm._l((_vm.list), function(item, index) {
    return [_c('tr', {
      key: item._id,
      staticStyle: {
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_c('img', {
      directives: [{
        name: "proxy",
        rawName: "v-proxy",
        value: (item.photo),
        expression: "item.photo"
      }],
      staticStyle: {
        "border-radius": "18px"
      },
      attrs: {
        "width": "36",
        "height": "36"
      }
    })]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.createdAt) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.lastLoginDate) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.loginCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.state ? "启用" : "禁用") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-dropdown', [_c('el-button', {
      staticClass: "el-dropdown-link",
      attrs: {
        "type": "text"
      }
    }, [_vm._v("\n                                    操作"), _c('i', {
      staticClass: "el-icon-caret-bottom el-icon--right"
    })]), _vm._v(" "), _c('el-dropdown-menu', {
      slot: "dropdown"
    }, [_c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.edit(item, index)
        }
      }
    }, [_vm._v("编辑")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.userProject(item, index)
        }
      }
    }, [_vm._v("项目")]), _vm._v(" "), _c('el-dropdown-item', {
      nativeOn: {
        "click": function($event) {
          _vm.userTeam(item, index)
        }
      }
    }, [_vm._v("团队")]), _vm._v(" "), _c('el-dropdown-item', {
      staticStyle: {
        "color": "red"
      },
      nativeOn: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    }, [_vm._v("删除")])], 1)], 1)], 1)])]
  })], 2), _vm._v(" "), _c('tfoot', [_c('tr', {
    staticStyle: {
      "text-align": "center",
      "vertical-align": "middle"
    }
  }, [_c('td', {
    attrs: {
      "colspan": "7"
    }
  }, [_c('page', {
    ref: "page",
    on: {
      "change": _vm.changePage
    }
  })], 1)])])])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-451946be", module.exports)
  }
}

/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row"
  }, [_c('el-col', {
    staticClass: "col",
    staticStyle: {
      "padding": "0 10px 0 10px"
    },
    attrs: {
      "span": 6
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "background-color": "white",
      "text-align": "center",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888",
      "padding-bottom": "20px"
    }
  }, [_c('el-button', {
    staticStyle: {
      "margin": "20px 0 0 0",
      "width": "80%"
    },
    attrs: {
      "type": "primary"
    },
    on: {
      "click": function($event) {
        _vm.type = 0
      }
    }
  }, [_vm._v("\n                每日数据列表\n            ")])], 1)], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "padding": "0 10px 0 10px"
    },
    attrs: {
      "span": 18
    }
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "background-color": "white",
      "border-radius": "5px",
      "box-shadow": "0px 2px 2px #888888"
    }
  }, [_c('el-row', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 0),
      expression: "type==0"
    }],
    staticClass: "row"
  }, [_c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "60px"
    }
  }, [_c('h4', {
    staticStyle: {
      "margin-left": "10px",
      "color": "gray"
    }
  }, [_vm._v("\n                        每日数据列表\n                    ")])]), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "text-align": "center"
    }
  }, [_c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 10
    }
  }, [_c('el-date-picker', {
    attrs: {
      "placeholder": "起始日期"
    },
    model: {
      value: (_vm.start),
      callback: function($$v) {
        _vm.start = $$v
      },
      expression: "start"
    }
  })], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 10
    }
  }, [_c('el-date-picker', {
    attrs: {
      "placeholder": "结束日期"
    },
    model: {
      value: (_vm.end),
      callback: function($$v) {
        _vm.end = $$v
      },
      expression: "end"
    }
  })], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.scanPending
    },
    on: {
      "click": _vm.scan
    }
  }, [_vm._v("查询")])], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "padding-bottom": "20px",
      "margin-top": "20px"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                            日期\n                        ")]), _vm._v(" "), _c('th', [_vm._v("\n                            用户数\n                        ")]), _vm._v(" "), _c('th', [_vm._v("\n                            注册用户\n                        ")]), _vm._v(" "), _c('th', [_vm._v("\n                            登录用户\n                        ")]), _vm._v(" "), _c('th', [_vm._v("\n                            新增项目\n                        ")]), _vm._v(" "), _c('th', [_vm._v("\n                            新增团队\n                        ")]), _vm._v(" "), _c('th', [_vm._v("\n                            新增接口\n                        ")])]), _vm._v(" "), _vm._l((_vm.arr), function(item) {
    return [_c('tr', {
      staticStyle: {
        "height": "50px",
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "30%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.date) + "\n                                ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.user) + "\n                                ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.userRegister) + "\n                                ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.userLogin) + "\n                                ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.project) + "\n                                ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.team) + "\n                                ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                                    " + _vm._s(item.interface) + "\n                                ")])])]
  })], 2)])], 1)], 1)], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-453feeed", module.exports)
  }
}

/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "编辑项目",
      "size": "small"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-form', {
    ref: "form",
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
    attrs: {
      "name": "name"
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
      "label": "描述"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "rows": 3,
      "name": "dis"
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
      "label": "公开"
    }
  }, [_c('el-switch', {
    attrs: {
      "on-color": "#13ce66",
      "off-color": "#ff4949",
      "on-value": 1,
      "off-value": 0
    },
    model: {
      value: (_vm.obj.public),
      callback: function($$v) {
        _vm.obj.public = $$v
      },
      expression: "obj.public"
    }
  })], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "laoding": _vm.savePending
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
     require("vue-hot-reload-api").rerender("data-v-476fcfa0", module.exports)
  }
}

/***/ }),

/***/ 494:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "padding-bottom": "10px"
    }
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
      "span": 12
    }
  }, [_vm._v("\n            总共:" + _vm._s(_vm.total) + "\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    staticStyle: {
      "border-right": "1px gray solid"
    },
    attrs: {
      "span": 12
    }
  }, [_vm._v("\n            今日新建:" + _vm._s(_vm.create) + "\n        ")])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7b64c656", module.exports)
  }
}

/***/ }),

/***/ 496:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": _vm.propObj ? '编辑用户' : '新建用户',
      "size": "small"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-form', {
    ref: "form",
    attrs: {
      "label-width": "100px"
    }
  }, [_c('el-form-item', {
    staticStyle: {
      "text-align": "center",
      "vertical-align": "middle"
    },
    attrs: {
      "label": "头像"
    }
  }, [_c('img', {
    attrs: {
      "width": "60",
      "height": "60",
      "src": _vm.obj.photo ? _vm.obj.photo : '',
      "id": "showimg"
    }
  }), _vm._v("       \n            "), _c('a', {
    staticClass: "file",
    staticStyle: {
      "display": "inline-block",
      "top": "-15px"
    },
    attrs: {
      "href": "javascript:void(0)"
    }
  }, [_vm._v("\n                选择文件"), _c('input', {
    directives: [{
      name: "imgfile",
      rawName: "v-imgfile",
      value: ('showimg'),
      expression: "'showimg'"
    }],
    attrs: {
      "type": "file",
      "id": "file"
    }
  })])]), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "用户名"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "name"
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
      "label": "密码"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "password"
    },
    model: {
      value: (_vm.obj.password),
      callback: function($$v) {
        _vm.obj.password = $$v
      },
      expression: "obj.password"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "年龄"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "age"
    },
    model: {
      value: (_vm.obj.age),
      callback: function($$v) {
        _vm.obj.age = $$v
      },
      expression: "obj.age"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "性别"
    }
  }, [_c('el-select', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "sex"
    },
    model: {
      value: (_vm.obj.sex),
      callback: function($$v) {
        _vm.obj.sex = $$v
      },
      expression: "obj.sex"
    }
  }, [_c('el-option', {
    attrs: {
      "label": "男",
      "value": "男"
    }
  }), _vm._v(" "), _c('el-option', {
    attrs: {
      "label": "女",
      "value": "女"
    }
  })], 1)], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "公司"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "company"
    },
    model: {
      value: (_vm.obj.company),
      callback: function($$v) {
        _vm.obj.company = $$v
      },
      expression: "obj.company"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "qq"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "qq"
    },
    model: {
      value: (_vm.obj.qq),
      callback: function($$v) {
        _vm.obj.qq = $$v
      },
      expression: "obj.qq"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "邮箱"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "email"
    },
    model: {
      value: (_vm.obj.email),
      callback: function($$v) {
        _vm.obj.email = $$v
      },
      expression: "obj.email"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "手机"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "phone"
    },
    model: {
      value: (_vm.obj.phone),
      callback: function($$v) {
        _vm.obj.phone = $$v
      },
      expression: "obj.phone"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "状态"
    }
  }, [_c('el-switch', {
    attrs: {
      "on-color": "#13ce66",
      "off-color": "#ff4949",
      "on-value": 1,
      "off-value": 0
    },
    model: {
      value: (_vm.obj.state),
      callback: function($$v) {
        _vm.obj.state = $$v
      },
      expression: "obj.state"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "提示问题"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "question"
    },
    model: {
      value: (_vm.obj.question),
      callback: function($$v) {
        _vm.obj.question = $$v
      },
      expression: "obj.question"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "答案"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "name": "answer"
    },
    model: {
      value: (_vm.obj.answer),
      callback: function($$v) {
        _vm.obj.answer = $$v
      },
      expression: "obj.answer"
    }
  })], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "laoding": _vm.savePending
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
     require("vue-hot-reload-api").rerender("data-v-7ef680e8", module.exports)
  }
}

/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "用户团队",
      "size": "large"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-tabs', {
    attrs: {
      "type": "card"
    }
  }, [_c('el-tab-pane', {
    staticStyle: {
      "height": "500px",
      "overflow-y": "auto"
    },
    attrs: {
      "label": "创建"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                    名称\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    描述\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    创建时间\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    用户数\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    项目数\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    操作\n                ")])]), _vm._v(" "), _vm._l((_vm.obj.own), function(item, index) {
    return [_c('tr', {
      staticStyle: {
        "height": "50px",
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.dis ? item.dis : "无") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.createdAt) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.userCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.projectCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-button', {
      attrs: {
        "type": "text",
        "title": "转让"
      },
      on: {
        "click": function($event) {
          _vm.transfer(item, index)
        }
      }
    }, [_c('i', {
      staticClass: "fa fa-sign-in"
    })]), _vm._v("  \n                            "), _c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "icon": "close",
        "title": "删除"
      },
      on: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    })], 1)])]
  })], 2)]), _vm._v(" "), _c('el-tab-pane', {
    staticStyle: {
      "height": "500px",
      "overflow-y": "auto"
    },
    attrs: {
      "label": "加入"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                    名称\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    描述\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    创建人\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    创建时间\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    用户数\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    项目数\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    角色\n                ")]), _vm._v(" "), _c('th', [_vm._v("\n                    操作\n                ")])]), _vm._v(" "), _vm._l((_vm.obj.join), function(item, index) {
    return [_c('tr', {
      staticStyle: {
        "height": "50px",
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.dis ? item.dis : "无") + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.owner.name) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "15%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.createdAt) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.userCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                            " + _vm._s(item.projectCount) + "\n                        ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_c('el-select', {
      staticStyle: {
        "width": "60%"
      },
      on: {
        "input": function($event) {
          _vm.role(item, index)
        }
      },
      model: {
        value: (item.role),
        callback: function($$v) {
          item.role = $$v
        },
        expression: "item.role"
      }
    }, [_c('el-option', {
      attrs: {
        "label": "管理员",
        "value": 0
      }
    }), _vm._v(" "), _c('el-option', {
      attrs: {
        "label": "普通成员",
        "value": 1
      }
    })], 1)], 1), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "icon": "close",
        "title": "退出"
      },
      on: {
        "click": function($event) {
          _vm.quit(item, index)
        }
      }
    })], 1)])]
  })], 2)])], 1)], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-87f6188a", module.exports)
  }
}

/***/ }),

/***/ 505:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "新建项目",
      "size": "large"
    },
    model: {
      value: (_vm.showDialog),
      callback: function($$v) {
        _vm.showDialog = $$v
      },
      expression: "showDialog"
    }
  }, [_c('el-form', {
    ref: "form",
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
    attrs: {
      "name": "name",
      "placeholder": "请输入项目名称"
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
      "label": "描述"
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "type": "textarea",
      "rows": 3,
      "name": "dis",
      "placeholder": "请输入项目描述"
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
      "label": "所有者"
    }
  }, [_c('el-autocomplete', {
    staticStyle: {
      "width": "80%"
    },
    attrs: {
      "fetch-suggestions": _vm.querySearchAsync.bind(this, 0),
      "name": "owner",
      "placeholder": "请输入所有者名称"
    },
    on: {
      "select": _vm.sel
    },
    model: {
      value: (_vm.obj.owner.name),
      callback: function($$v) {
        _vm.obj.owner.name = $$v
      },
      expression: "obj.owner.name"
    }
  })], 1), _vm._v(" "), _c('el-form-item', {
    staticStyle: {
      "text-align": "center"
    },
    attrs: {
      "label": "用户"
    }
  }, [_vm._l((_vm.obj.users), function(item, index) {
    return [_c('el-row', {
      staticClass: "row",
      staticStyle: {
        "height": "50px",
        "line-height": "50px",
        "width": "90%",
        "display": "inline-block"
      }
    }, [_c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 12
      }
    }, [_c('el-autocomplete', {
      staticStyle: {
        "width": "80%"
      },
      attrs: {
        "fetch-suggestions": _vm.querySearchAsync.bind(this, index),
        "placeholder": "请输入用户名称"
      },
      on: {
        "input": function($event) {
          index == _vm.obj.users.length - 1 ? _vm.add() : ''
        },
        "select": _vm.selUser
      },
      model: {
        value: (item.name),
        callback: function($$v) {
          item.name = $$v
        },
        expression: "item.name"
      }
    })], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 8
      }
    }, [_c('el-select', {
      staticStyle: {
        "width": "80%"
      },
      model: {
        value: (item.role),
        callback: function($$v) {
          item.role = $$v
        },
        expression: "item.role"
      }
    }, [_c('el-option', {
      attrs: {
        "label": "管理员",
        "value": 0
      }
    }), _vm._v(" "), _c('el-option', {
      attrs: {
        "label": "观察者",
        "value": 1
      }
    })], 1)], 1), _vm._v(" "), _c('el-col', {
      staticClass: "col",
      attrs: {
        "span": 4
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "icon": "close"
      },
      on: {
        "click": function($event) {
          _vm.remove(item, index)
        }
      }
    })], 1)], 1)]
  })], 2)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "laoding": _vm.savePending
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
     require("vue-hot-reload-api").rerender("data-v-c731843e", module.exports)
  }
}

/***/ }),

/***/ 506:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('el-dialog', {
    ref: "box",
    attrs: {
      "title": "管理项目",
      "size": "large"
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
      "line-height": "50px",
      "text-align": "center"
    }
  }, [_c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_vm._v("\n            项目ID\n        ")]), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 16
    }
  }, [_c('el-input', {
    staticStyle: {
      "width": "90%"
    },
    attrs: {
      "placeholder": "请输入项目ID"
    },
    model: {
      value: (_vm.newId),
      callback: function($$v) {
        _vm.newId = $$v
      },
      expression: "newId"
    }
  })], 1), _vm._v(" "), _c('el-col', {
    staticClass: "col",
    attrs: {
      "span": 4
    }
  }, [_c('el-button', {
    attrs: {
      "type": "primary",
      "loading": _vm.pullPending
    },
    on: {
      "click": _vm.add
    }
  }, [_vm._v("\n                拉入\n            ")])], 1)], 1), _vm._v(" "), _c('el-row', {
    staticClass: "row",
    staticStyle: {
      "height": "300px",
      "overflow-y": "auto"
    }
  }, [_c('table', {
    staticClass: "table-hover",
    staticStyle: {
      "width": "100%"
    }
  }, [_c('thead', [_c('th', [_vm._v("\n                名称\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                创建时间\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                创建者\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                接口数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                用户数\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                公开\n            ")]), _vm._v(" "), _c('th', [_vm._v("\n                操作\n            ")])]), _vm._v(" "), _vm._l((_vm.arr), function(item, index) {
    return [_c('tr', {
      staticStyle: {
        "height": "50px",
        "text-align": "center",
        "vertical-align": "middle"
      }
    }, [_c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.createdAt) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "20%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.owner.name) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.interfaceCount) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.userCount) + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_vm._v("\n                        " + _vm._s(item.public ? "公开" : "不公开") + "\n                    ")]), _vm._v(" "), _c('td', {
      staticStyle: {
        "width": "10%"
      }
    }, [_c('el-button', {
      staticStyle: {
        "color": "red"
      },
      attrs: {
        "type": "text",
        "title": "踢出",
        "icon": "close"
      },
      on: {
        "click": function($event) {
          _vm.quit(item, index)
        }
      }
    })], 1)])]
  })], 2)])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-dba195fa", module.exports)
  }
}

/***/ }),

/***/ 52:
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

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, net, $) {var mainNav=__webpack_require__(10)
var user=__webpack_require__(158)
var project=__webpack_require__(154)
var team=__webpack_require__(157)
var inter=__webpack_require__(153)
var setting=__webpack_require__(155)
var statistic=__webpack_require__(156)
var store=__webpack_require__(170)
if(!sessionStorage.getItem("admin"))
{
    location.href="/"
}
var vue=new Vue({
    el: "#app",
    data: {
        tab:"user"
    },
    components:{
        "mainnav":mainNav,
        "project":project,
        "team":team,
        "user":user,
        "interface":inter,
        "setting":setting,
        "statistic":statistic
    },
    store:store,
    methods:{

    },
    created:function () {
        var _this=this;
        Promise.all([
            net.get("/admin/userstatistics"),
            net.get("/admin/projectstatistics"),
            net.get("/admin/teamstatistics"),
            net.get("/admin/interfacestatistics")
        ]).then(function (data) {
            var obj1=data[0];
            var obj2=data[1];
            var obj3=data[2];
            var obj4=data[3];
            if(obj1.code==200)
            {
                store.commit("setUserInfo",obj1.data)
            }
            else
            {
                throw obj1.msg;
            }
            if(obj2.code==200)
            {
                store.commit("setProjectInfo",obj2.data)
            }
            else
            {
                throw obj2.msg;
            }
            if(obj3.code==200)
            {
                store.commit("setTeamInfo",obj3.data)
            }
            else
            {
                throw obj3.msg;
            }
            if(obj4.code==200)
            {
                store.commit("setInterfaceInfo",obj4.data)
            }
            else
            {
                throw obj4.msg;
            }
            $.stopLoading();
        }).catch(function (err) {
            $.stopLoading();
            if(typeof(err)=="string")
            {
                $.notify(err,0);
            }
            else
            {
                $.notify("获取失败",0);
            }
        })
    }
})
$.ready(function () {
    $.startLoading();
})









/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(2), __webpack_require__(0)))

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

/***/ 66:
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

/***/ }),

/***/ 68:
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//

module.exports = {
    data: function data() {
        return {
            page: 0
        };
    },
    methods: {
        pre: function pre() {
            if (this.page > 0) {
                this.page--;
                this.$emit("change", this.page);
            }
        },
        next: function next() {
            this.page++;
            this.$emit("change", this.page);
        },
        init: function init() {
            this.page = 0;
            this.$emit("change", this.page);
        }
    }
};

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by sunxin on 2017/2/21.
 */
var config=__webpack_require__(11);
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

/***/ })

},[522]);
//# sourceMappingURL=admin.js.map