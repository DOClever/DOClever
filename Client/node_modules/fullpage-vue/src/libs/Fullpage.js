/**
 * vue2.x fullpage
 */
 function broadcast(children, eventName, params) {
   children && children.forEach(child => {
     var context = child.context;

     if (context) {
       context.$emit.apply(context, [eventName].concat(params) );
     }

     broadcast(child.children,eventName, params)

   });
 }

class Fullpage {
	constructor(el, options, vnode){
		var that = this;
		this.assignOpts(options);

		this.vnode = vnode;
		this.vm = vnode.context
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

		window.setTimeout(()=>{
			
			this.resize();

			//如果是一页 则不移动 直接触发动画
			if(that.curIndex == 0){
				that.toogleAnimate(that.curIndex)
			}else{
				that.moveTo(that.curIndex, false);
			}
			
		}, 0)
		
	}
	resize(){
		this.width = this.opts.width || this.parentEle.offsetWidth
		this.height = this.opts.height || this.parentEle.offsetHeight

		for (var i = 0; i < this.pageEles.length; i++) {
			var pageEle = this.pageEles[i]
			pageEle.setAttribute('data-id', i)
			pageEle.classList.add('page')
			//pageEle.style.width = this.width + 'px'
			pageEle.style.height = this.height + 'px'
		}
	}
	setOptions(options){
		this.assignOpts(options,this.opts);
	}
	toogleAnimate(curIndex){
		broadcast(this.vnode.children,'toogle.animate',curIndex)
	}
	assignOpts(opts,o) {
		o = o || Fullpage.defaultOptions
		opts = opts || {};
		for (var key in opts) {
			if (opts.hasOwnProperty(key)) {
				o[key] = opts[key]
			}
		}
		this.opts = o;
	}
	initScrollDirection() {
		if (this.opts.dir !== 'v') {
			this.el.classList.add('fullpage-wp-h')
		}
	}
	initEvent(el) {
		var that = this
		that.prevIndex = that.curIndex

		if ("ontouchstart" in document) {
			/// touch ///
			el.addEventListener('touchstart', function(e) {
				if (that.opts.movingFlag) {
					return false;
				}
				that.startX = e.targetTouches[0].pageX;
				that.startY = e.targetTouches[0].pageY;
			})
			el.addEventListener('touchend', function(e) {
				if (that.opts.movingFlag) {
					return false;
				}
				var preIndex = that.curIndex;
				var dir = that.opts.dir;
				var sub = dir === 'v' ? (e.changedTouches[0].pageY - that.startY) / that.height : (e.changedTouches[0].pageX - that.startX) / that.width;
				var der = sub > that.opts.der ? -1 : sub < -that.opts.der ? 1 : 0;

				var curIndex = der + that.curIndex;

				that.moveTo(curIndex,true);
			})
		} else {

			var isMousedown = false;
			addEventListener(el, 'mousedown', function(e) {
				if (that.opts.movingFlag) {
					return false;
				}
				isMousedown = true;
				that.startX = e.pageX;
				that.startY = e.pageY;
			});
			addEventListener(el, 'mouseup', function(e) {
				isMousedown = false;
			})
			addEventListener(el, 'mousemove', function(e) {
				e.preventDefault();
				if (that.opts.movingFlag || !isMousedown) {
					return false;
				}
				var preIndex = that.curIndex;
				var dir = that.opts.dir;
				var sub = dir === 'v' ? (e.pageY - that.startY) / that.height : (e.pageX - that.startX) / that.width;
				var der = sub > that.opts.der ? -1 : sub < -that.opts.der ? 1 : 0;

				var curIndex = der + that.curIndex;

				that.moveTo(curIndex,true);
			});

			let debounceTimer,
				interval = 1200,
				debounce = true;
			addEventListener(el, 'mousewheel', function(e) {
				console.log('mousewheel')
				if (that.opts.movingFlag) {
					return false;
				}
				if(!debounce){
					return;
				}

				debounce = false;
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(()=>{
					debounce = true;
				},interval);

				
				var preIndex = that.curIndex;
				var dir = that.opts.dir;
				var sub = dir === 'v' ? e.deltaY : e.deltaX;
				var der = sub > that.opts.der ? 1 : sub < -that.opts.der ? -1 : 0;

				var curIndex = der + that.curIndex;

				that.moveTo(curIndex,true);
			});
		}

		addEventListener(el, 'webkitTransitionEnd',()=>{
			that.opts.afterChange(that.prevIndex, that.nextIndex)
			that.opts.movingFlag = false;
		});

		addEventListener(window,'resize',()=>{
			if(el.offsetHeight != that.height){
				this.resize();
			}
		})

	}
	move(dist) {
		var xPx = '0px',
			yPx = '0px';
		if (this.opts.dir === 'v') {
			yPx = dist + 'px';
		} else {
			xPx = dist + 'px'
		}
		this.el.style.cssText += (';-webkit-transform : translate3d(' + xPx + ', ' + yPx + ', 0px);' +
			'transform : translate3d(' + xPx + ', ' + yPx + ', 0px);');
	}
	moveTo(curIndex, anim) {
		var that = this;
		if (Math.min(Math.max(curIndex, 0), that.total) == that.curIndex) {
			return
		}
		if (curIndex >= 0 && curIndex < that.total) {
			//that.moveTo(that.curIndex)
			this.curIndex = curIndex;
		} else {
			if (!!that.opts.loop) {
				curIndex = that.curIndex = curIndex < 0 ? that.total - 1 : 0
			} else {
				that.curIndex = curIndex < 0 ? 0 : that.total - 1;
				return 
			}
		}
		
		var dist = that.opts.dir === 'v' ? (curIndex) * (-that.height) : curIndex * (-that.width)
		that.nextIndex = curIndex;
		that.opts.movingFlag = true;

		//beforeChange 返回false取消本次的滑动
		var flag = that.opts.beforeChange(that.prevIndex, that.nextIndex);
		if (flag === false) {
			that.opts.movingFlag = false;
			return false;
		}

		if (anim) {
			that.el.classList.add('anim')
		} else {
			that.el.classList.remove('anim')
		}

		that.move(dist);

		const afterChange = ()=>{
			that.opts.afterChange(that.prevIndex, that.nextIndex)
			that.opts.movingFlag = false;
		}

		window.setTimeout(()=>{
			that.prevIndex = curIndex
			this.toogleAnimate(curIndex)

			if (!anim) {
				afterChange();
			}			
		}, that.opts.duration)
	}
	movePrev(){
		this.moveTo(this.curIndex-1,true);
	}
	moveNext(){
		this.moveTo(this.curIndex+1,true);
	}
}


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
	beforeChange: function(data) {},
	afterChange: function(data) {}
};

export default Fullpage;