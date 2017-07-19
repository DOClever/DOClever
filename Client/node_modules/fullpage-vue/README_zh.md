# fullpage-vue

一个基于vue2.x fullpage 插件 支持移动端和pc端

## 在线demo
[jsfiddle demo](https://jsfiddle.net/e23jiang/6jc3okaq/1/)

## 安装
```
npm install fullpage-vue --save
```
如果你想使用动画指令，请安装``animate.css``
```
npm install animate.css --save
```
[animate.css用法](https://daneden.github.io/animate.css/)

## 文档
[api文档](https://github.com/river-lee/fullpage-vue/blob/master/docs/api.md)

### 选项

- `start` : (default:`0`) 默认显示那一页
- `duration` : (default:`500`) 
- `loop` : (default:`false`) 
- `dir` : (default:`v`) 运动的方向 `v` 垂直 和 `h` 水平
- `der` : (default:`0.1`) 
- `movingFlag` : (default:`false`) 
- `beforeChange` : (default:`function`) 页面切换前回调
- `afterChange` : (default:`function`) 页面切换后回调

### method
- `moveTo` : 移动到指定页面
- `movePrev`: 移动到上一个页面
- `moveNext`: 移动到下一个页面

## 快速上手

#### main.js
在main.js需要引入该插件的css和js文件

```js
import 'fullpage-vue/src/fullpage.css'
import VueFullpage from 'fullpage-vue'
Vue.use(VueFullpage)
```

#### app.vue

**template**

在``page-wp``容器上加``v-fullpage``指令,``v-fullpage``的值是fullpage的配置
在``page``容器上加``v-animate``指令,``v-animate``的值是``animate.css``的动画效果
```html
<div class="fullpage-container">
  <div class="fullpage-wp" v-fullpage="opts" ref="example">
    <div class="page-1 page">
      <p class="part-1" v-animate="{value: 'bounceInLeft'}">fullpage-vue</p>
    </div>
    <div class="page-2 page">
      <p class="part-2" v-animate="{value: 'bounceInRight'}">fullpage-vue</p>
    </div>
    <div class="page-3 page">
      <p class="part-3" v-animate="{value: 'bounceInLeft', delay: 0}">fullpage-vue</p>
      <p class="part-3" v-animate="{value: 'bounceInRight', delay: 600}">fullpage-vue</p>
      <p class="part-3" v-animate="{value: 'zoomInDown', delay: 1200}">fullpage-vue</p>
    </div>
  </div>
  <button @click="moveNext">next</button>
</div>
```

**js**

``fullpage-vue``的值请参考[api文档](https://github.com/river-lee/fullpage-vue/blob/master/doc/api_cn.md)
```js
export default {
  data() {
    return {
      opts: {
        start: 0,
        dir: 'v',
        duration: 500
      }
    }
  },
  method:{
    moveNext(){
      this.$refs.example.$fullpage.moveNext(); //Move to the next page
    }
  }
}
```

**style**
``page-container``需要固定宽度和高度，``fullpage``会自适应父元素的宽度和高度。  
如下设置可使滚动页面充满全屏
```
<style>
.page-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
```