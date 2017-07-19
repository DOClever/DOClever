# fullpage-vue

README：[中文版](https://github.com/river-lee/fullpage-vue/blob/master/README_zh.md)
> A sigle-page scroll plugin based on vue@2.x,support for mobile and PC .

## overview
To achieve sigle-page scroll in mobile, support horizontal scroll and vertical scroll, support all the animation instructions of animate.css.

## Online demo
here's a [jsfiddle demo](https://jsfiddle.net/e23jiang/6jc3okaq/1/)

## Installation
```
npm install fullpage-vue --save
```
If you want use animate instruction, please install animate.css
```
npm install animate.css --save
```
[animate.css usage](https://daneden.github.io/animate.css/)

## Document
[api document](https://github.com/river-lee/fullpage-vue/blob/master/doc/api.md)

### options

- `start` : (default:`0`) Display first page
- `duration` : (default:`500`) 
- `loop` : (default:`false`) 
- `dir` : (default:`v`) Direction of movement
- `der` : (default:`0.1`) 
- `movingFlag` : (default:`false`) 
- `beforeChange` : (default:`function`) Before change callback
- `afterChange` : (default:`function`) After change callback

### method
- `moveTo` : Move to the specified page
- `movePrev`: Move to the previous page
- `moveNext`: Move to the next page

## getting started

#### main.js
Import the plugin of css and js file in main.js

```js
import 'animate.css'
import 'fullpage-vue/src/fullpage.css'
import VueFullpage from 'fullpage-vue'
Vue.use(VueFullpage)
```

#### app.vue

**template**

``fullpage-container``、``fullpage-wp``、``page``are default class name.
Add the ``v-fullpage`` command to the ``page-wp`` container.
Add the ``v-animate`` command to the ``page`` container.
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

**script**

``fullpage-vue`` value please refer to [api document](https://github.com/river-lee/fullpage-vue/blob/master/doc/api.md)
```js
export default {
  data() {
    return {
      opts: {
        start: 0,
        dir: 'v',
        duration: 500,
        beforeChange: function (prev, next) {
        },
        afterChange: function (prev, next) {
        }
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

Set the ``page-container`` container's width and height what do you want, and the ``v-fullpage`` command will adapt the width and height of the parent element.
The following settings allow the scrolling page to fill the full screen.
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