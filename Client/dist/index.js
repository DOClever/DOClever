webpackJsonp([6],{

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue) {(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fullpage = factory());
}(this, (function () { 'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * vue2.x fullpage
 */
function broadcast(children, eventName, params) {
	children && children.forEach(function (child) {
		var context = child.context;

		if (context) {
			context.$emit.apply(context, [eventName].concat(params));
		}

		broadcast(child.children, eventName, params);
	});
}

var Fullpage = function () {
	function Fullpage(el, options, vnode) {
		var _this = this;

		classCallCheck(this, Fullpage);

		var that = this;
		this.assignOpts(options);

		this.vnode = vnode;
		this.vm = vnode.context;
		this.curIndex = this.opts.start;

		this.startY = 0;
		this.opts.movingFlag = false;

		this.el = el;
		this.el.classList.add('fullpage-wp');

		this.parentEle = this.el.parentNode;
		this.parentEle.classList.add('fullpage-container');

		this.pageEles = this.el.children;
		this.total = this.pageEles.length;

		this.initScrollDirection();

		this.initEvent(el);

		window.setTimeout(function () {

			_this.resize();

			//如果是一页 则不移动 直接触发动画
			if (that.curIndex == 0) {
				that.toogleAnimate(that.curIndex);
			} else {
				that.moveTo(that.curIndex, false);
			}
		}, 0);
	}

	createClass(Fullpage, [{
		key: 'resize',
		value: function resize() {
			this.width = this.opts.width || this.parentEle.offsetWidth;
			this.height = this.opts.height || this.parentEle.offsetHeight;

			for (var i = 0; i < this.pageEles.length; i++) {
				var pageEle = this.pageEles[i];
				pageEle.setAttribute('data-id', i);
				pageEle.classList.add('page');
				//pageEle.style.width = this.width + 'px'
				pageEle.style.height = this.height + 'px';
			}
		}
	}, {
		key: 'setOptions',
		value: function setOptions(options) {
			this.assignOpts(options, this.opts);
		}
	}, {
		key: 'toogleAnimate',
		value: function toogleAnimate(curIndex) {
			broadcast(this.vnode.children, 'toogle.animate', curIndex);
		}
	}, {
		key: 'assignOpts',
		value: function assignOpts(opts, o) {
			o = o || Fullpage.defaultOptions;
			opts = opts || {};
			for (var key in opts) {
				if (opts.hasOwnProperty(key)) {
					o[key] = opts[key];
				}
			}
			this.opts = o;
		}
	}, {
		key: 'initScrollDirection',
		value: function initScrollDirection() {
			if (this.opts.dir !== 'v') {
				this.el.classList.add('fullpage-wp-h');
			}
		}
	}, {
		key: 'initEvent',
		value: function initEvent(el) {
			var _this2 = this;

			var that = this;
			that.prevIndex = that.curIndex;

			if ("ontouchstart" in document) {
				/// touch ///
				el.addEventListener('touchstart', function (e) {
					if (that.opts.movingFlag) {
						return false;
					}
					that.startX = e.targetTouches[0].pageX;
					that.startY = e.targetTouches[0].pageY;
				});
				el.addEventListener('touchend', function (e) {
					if (that.opts.movingFlag) {
						return false;
					}
					var preIndex = that.curIndex;
					var dir = that.opts.dir;
					var sub = dir === 'v' ? (e.changedTouches[0].pageY - that.startY) / that.height : (e.changedTouches[0].pageX - that.startX) / that.width;
					var der = sub > that.opts.der ? -1 : sub < -that.opts.der ? 1 : 0;

					var curIndex = der + that.curIndex;

					that.moveTo(curIndex, true);
				});
			} else {

				var isMousedown = false;
				addEventListener(el, 'mousedown', function (e) {
					if (that.opts.movingFlag) {
						return false;
					}
					isMousedown = true;
					that.startX = e.pageX;
					that.startY = e.pageY;
				});
				addEventListener(el, 'mouseup', function (e) {
					isMousedown = false;
				});
				addEventListener(el, 'mousemove', function (e) {
					e.preventDefault();
					if (that.opts.movingFlag || !isMousedown) {
						return false;
					}
					var preIndex = that.curIndex;
					var dir = that.opts.dir;
					var sub = dir === 'v' ? (e.pageY - that.startY) / that.height : (e.pageX - that.startX) / that.width;
					var der = sub > that.opts.der ? -1 : sub < -that.opts.der ? 1 : 0;

					var curIndex = der + that.curIndex;

					that.moveTo(curIndex, true);
				});

				var debounceTimer = void 0,
				    interval = 1200,
				    debounce = true;
				addEventListener(el, (("onwheel" in document.createElement("div")) ? "wheel" :(document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll")), function (e) {
					console.log('mousewheel');
					if (that.opts.movingFlag) {
						return false;
					}
					if (!debounce) {
						return;
					}

					debounce = false;
					clearTimeout(debounceTimer);
					debounceTimer = setTimeout(function () {
						debounce = true;
					}, interval);

					var preIndex = that.curIndex;
					var dir = that.opts.dir;
					var sub = dir === 'v' ? e.deltaY : e.deltaX;
					var der = sub > that.opts.der ? 1 : sub < -that.opts.der ? -1 : 0;

					var curIndex = der + that.curIndex;

					that.moveTo(curIndex, true);
				});
			}

			addEventListener(el, 'webkitTransitionEnd', function () {
				that.opts.afterChange(that.prevIndex, that.nextIndex);
				that.opts.movingFlag = false;
			});

			addEventListener(window, 'resize', function () {
				if (el.offsetHeight != that.height) {
					_this2.resize();
				}
			});
		}
	}, {
		key: 'move',
		value: function move(dist) {
			var xPx = '0px',
			    yPx = '0px';
			if (this.opts.dir === 'v') {
				yPx = dist + 'px';
			} else {
				xPx = dist + 'px';
			}
			this.el.style.cssText += ';-webkit-transform : translate3d(' + xPx + ', ' + yPx + ', 0px);' + 'transform : translate3d(' + xPx + ', ' + yPx + ', 0px);';
		}
	}, {
		key: 'moveTo',
		value: function moveTo(curIndex, anim) {
			var _this3 = this;

			var that = this;
			if (Math.min(Math.max(curIndex, 0), that.total) == that.curIndex) {
				return;
			}
			if (curIndex >= 0 && curIndex < that.total) {
				//that.moveTo(that.curIndex)
				this.curIndex = curIndex;
			} else {
				if (!!that.opts.loop) {
					curIndex = that.curIndex = curIndex < 0 ? that.total - 1 : 0;
				} else {
					that.curIndex = curIndex < 0 ? 0 : that.total - 1;
					return;
				}
			}

			var dist = that.opts.dir === 'v' ? curIndex * -that.height : curIndex * -that.width;
			that.nextIndex = curIndex;
			that.opts.movingFlag = true;

			//beforeChange 返回false取消本次的滑动
			var flag = that.opts.beforeChange(that.prevIndex, that.nextIndex);
			if (flag === false) {
				that.opts.movingFlag = false;
				return false;
			}

			if (anim) {
				that.el.classList.add('anim');
			} else {
				that.el.classList.remove('anim');
			}

			that.move(dist);

			var afterChange = function afterChange() {
				that.opts.afterChange(that.prevIndex, that.nextIndex);
				that.opts.movingFlag = false;
			};

			window.setTimeout(function () {
				that.prevIndex = curIndex;
				_this3.toogleAnimate(curIndex);

				if (!anim) {
					afterChange();
				}
			}, that.opts.duration);
		}
	}, {
		key: 'movePrev',
		value: function movePrev() {
			this.moveTo(this.curIndex - 1, true);
		}
	}, {
		key: 'moveNext',
		value: function moveNext() {
			this.moveTo(this.curIndex + 1, true);
		}
	}]);
	return Fullpage;
}();

function addEventListener(el, eventName, callback, isBubble) {
	if (el.addEventListener) {
		el.addEventListener(eventName, callback, !!isBubble);
	} else {
		el.attachEvent('on' + eventName, callback, !!isBubble);
	}
}

Fullpage.defaultOptions = {
	start: 0,
	duration: 500,
	loop: false,
	dir: 'v',
	der: 0.1,
	movingFlag: false,
	beforeChange: function beforeChange(data) {},
	afterChange: function afterChange(data) {}
};

var Animate = function () {
	function Animate(el, binding, vnode) {
		classCallCheck(this, Animate);

		var that = this,
		    vm = vnode.context,
		    aminate = binding.value;

		el.style.opacity = '0';
		vm.$on('toogle.animate', function (curIndex) {
			var curPage = +el.parentNode.getAttribute('data-id');
			if (curIndex === curPage) {
				that.addAnimated(el, aminate);
			} else {
				el.style.opacity = '0';
				that.removeAnimated(el, aminate);
			}
		});
	}

	createClass(Animate, [{
		key: 'addAnimated',
		value: function addAnimated(el, animate) {
			var delay = animate.delay || 0;
			el.classList.add('animated');
			window.setTimeout(function () {
				el.style.opacity = '1';
				el.classList.add(animate.value);
			}, delay);
		}
	}, {
		key: 'removeAnimated',
		value: function removeAnimated(el, animate) {
			var cls = el.getAttribute('class');
			if (cls && cls.indexOf('animated') > -1) {
				el.classList.remove(animate.value);
			}
		}
	}]);
	return Animate;
}();

var fullpage = {
	install: function install(Vue, options) {
		Vue.directive('fullpage', {
			inserted: function inserted(el, binding, vnode) {
				var opts = binding.value || {};
				el.$fullpage = new Fullpage(el, opts, vnode);
			},
			componentUpdated: function componentUpdated(el, binding, vnode) {
				var opts = binding.value || {};
				var that = el.$fullpage;
				that.setOptions(opts);
			}
		});

		Vue.directive('animate', {
			inserted: function inserted(el, binding, vnode) {
				var opts = binding || {};
				el.$animate = new Animate(el, opts, vnode);
			}
		});
	}
};

if (window.Vue) {
	window.VueFullpage = fullpage;
	Vue.use(fullpage);
}

return fullpage;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

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

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Vue, session) {/**
 * Created by sunxin on 2017/2/16.
 */
var mainNav = __webpack_require__(9);
var VueFullpage = __webpack_require__(102);
Vue.use(VueFullpage);
var vue = new Vue({
    "el": "#app",
    data: {
        dialogVisible: false,
        dis: [{
            title: "DOClever是我目前用到过最好的一个接口管理平台",
            name: "iOS开发者李续续"
        }, {
            title: "有了DOClever，和前端的沟通都顺畅了很多",
            name: "JAVA程序员张洋"
        }, {
            title: "使用DOClever可以让我和后端的数据无缝衔接，再也停不下来",
            name: "前端工程师李彩凤"
        }],
        isLogin: session.get('id') ? true : false,
        opts: {
            start: 0,
            dir: 'v',
            duration: 500,
            beforeChange: function beforeChange(prev, next) {
                if (next == 6) {
                    vue.bShowNext = false;
                } else {
                    vue.bShowNext = true;
                }
                var imgElements = document.body.getElementsByTagName("img");
                for (var i = 0; i < imgElements.length; i++) {
                    if (imgElements[i].hasAttribute("lazy") && imgElements[i].getAttribute("lazy") == next && !imgElements[i].src) {
                        imgElements[i].src = imgElements[i].getAttribute("real_src");
                    }
                }
            },
            afterChange: function afterChange(prev, next) {}
        },
        bShowNext: true
    },
    components: {
        "mainnav": mainNav
    },
    methods: {
        start: function start() {
            if (this.isLogin) {
                location.href = 'project/project.html';
            } else {
                location.href = 'login/login.html';
            }
        },
        moveNext: function moveNext() {
            this.$refs.example.$fullpage.moveNext();
        }
    }
});
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

},[200]);
//# sourceMappingURL=index.js.map