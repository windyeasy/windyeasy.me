---
title: 可视化大屏常用适配方式
catgory: Blog
date: 2025-12-23
---

# 可视化大屏常用适配方式

生活中经常会见到一些比较大的屏幕，比如：指挥大厅、展厅、展会中的大屏。这此设备就可以称为大屏设备， 当然`1920*1080` 和`3840*2160`（4k屏）也可以当成大屏设备

## 大屏分类

### 拼接屏

很多屏幕按照一定拼接方式拼接而成，常见的使用场景有：指挥大厅、展厅、展会等等。

#### 拼接方式取决于使用场景的需求

- 1920 * 1080px ,即 1 * 1 个显屏（16：9）
- 3840 * 2160px ,即 2 * 2 个显屏（16：9）
- 5760 * 3240px ,即 3 * 3 个显屏（16：9）
- 7680 * 3240px ,即 4 * 3 个显屏（64：27）
- 9600 * 3240px ,即 5 * 3 个显屏（80：27）

### LED屏

LED是现在大屏中常用的硬件，它是由若干单体屏幕组成的，它的像素点计算及拼接方式与拼接屏有很大的区别。

LED可以看成是矩形点阵，具体拼接方式也会根据现场实际情况有所不同，拼接方式的不同直接影响到设计的尺寸规则。

LED屏有很多规格，各规格计算方法相同：

- 使用500 * 500作为标准计算，每个单体模块像素点都为128px;
  - 在 LED 相关领域，“LED 单体 500 * 500 标准” 通常是指 LED 单体屏幕模块的尺寸为 500mm * 500mm。
  - 这种规格的 LED 单体模块在一些 LED 大屏拼接中较为常见，常被用作标准尺寸来计算大屏的整体分辨率和像素数量。例如，若一个 LED 大屏横向由 12 块、竖向由 6 块这种 500 * 500 的单体模块组成，每个单体模块像素点横竖都为 128px，那么该大屏的横向像素为 128×12 = 1536px，竖向像素为 128×6 = 768px。为什么500没有使用，这是由于写搭配的时候是使用像素，而不是根据屏幕的毫米尺寸
  - 横向12块竖向6块，横向像素为 128 * 12 = 1536px, 竖向128 * 6 = 768px。可以使横竖总像素去设计

## 适配方案

### 常见适配方案

1. 百分比设置
2. rem单位+动态设置html的font-size
3. vw单位
4. flex弹性布局
5. scale方案（推荐），可以不用考虑echarts图表变化问题，比较方便

#### 适配方案一-rem+font-size

- 动态设置HTML根字体大小和body字体大小(lib_flexible.js)
  - 将设计稿的宽(1920)平均分为24等份，每一份80px。移动端分为10等份(350/10)
  - HTML字体大小就设置为80px，即1rem=80px， 24rem=1920px
  - body字体大小为16px(移动端适配可能不一样)，移动端或者其它设备可以通过网络查询body字体大小
  - 安装cssrem插件，root font size 设置为80px。 这个是px单位转rem的参考值
    - px转rem方式：手动、less/scss函数、cssrem插件、webpack插件、vite插件

```js
// lib_flexible.js

(function flexible(window, document) {
  const docEl = document.documentElement
  const dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      // body 字体大小默认为 16px
      document.body.style.fontSize = `${16 * dpr}px`
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // 这里默认平均分成 10 等分(适用移动端)
  // set 1rem = viewWidth / 24 ；（使用pc端）
  function setRemUnit() {
    const rem = docEl.clientWidth / 24 // 1920 / 24 = 80
    docEl.style.fontSize = `${rem}px` // 设置 html字体的大小 80px
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    const fakeBody = document.createElement('body')
    const testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body, ul, li {
      margin: 0;
      padding: 0;
    }
    .wrapper {
      width: 24rem;
      height: 13.5rem;
      margin: 0 auto;
    }
    ul, li {
      list-style: none;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    ul li {
      width: 33.333%;
      height: 50%;
      font-size: .375rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border: .025rem solid black;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
    </ul>
  </div>
  <script src="./lib_flexible.js"></script>
</body>
</html>
```

#### 大屏适配方案二-vw

- 直接使用vw单位
  - 屏幕的宽默认为100vw，那么100vw=1920px， 1vw=19.2px
  - 安装cssrem插件，body的宽高(1920*1080px)直接把px转为vw单位
    - px转rem方式：手动、less/scss函数、cssrem插件、webpack插件、vite插件
- 适配方式是将屏幕的宽度设置为100vw,1920px/ 100 分为100份，1vw=19.2px, 把像素转为vw就可以实现适配

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body, ul, li {
      margin: 0;
      padding: 0;
    }
    .wrapper {
      width: 100vw;
      height: 56.25vw;
      margin: 0 auto;
    }
    ul, li {
      list-style: none;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    ul li {
      width: 33.333%;
      height: 50%;
      font-size: 1.5625vw;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border: .1042vw solid black;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
    </ul>
  </div>
</body>
</html>
```

#### 适配方案三-scale

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body, ul, li {
      margin: 0;
      padding: 0;

    }

    .wrapper {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      border: 4px solid green;
    }
    ul, li {
      list-style: none;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
    ul li {
      width: 33.333%;
      height: 50%;
      font-size: 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid black;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <ul>
      <li>1
        <button onClick="reset()">还原默认样式</button>
      </li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
    </ul>
  </div>
  <script>
    const targetWidth = 1920
    const targetHeight = 1080
    const targetRatio = 16 / 9

    const originStyle = document.body.style
    const originWidth = originStyle.width
    const originHeight = originStyle.height
    const originTransform = originStyle.transform
    const originTransformOrigin = originStyle.transformOrigin
    const originPosition = originStyle.position
    const originLeft = originStyle.left

    const currentWidth = document.documentElement.clientWidth || document.body.clientWidth
    const currentHeight = document.documentElement.clientHeight || document.body.clientWidth

    let scaleRatio = currentWidth / targetWidth

    // 当前缩放比例
    const currentRatio = currentWidth / currentHeight
    // 判断是否超宽屏幕
    if (currentRatio > targetRatio){
      scaleRatio = currentHeight / targetHeight
    }

    // 缓存默认样式用于还原

    document.body.style.transform = `scale(${scaleRatio}) translateX(-50%)`
    document.body.style.transformOrigin = 'left top'
    document.body.style.width = targetWidth + 'px'
    document.body.style.height = targetHeight + 'px'
    document.body.style.position = 'absolute'
    document.body.style.left = '50%'

    function reset(){
      document.body.style.transform = originTransform
      document.body.style.transformOrigin = originTransformOrigin
      document.body.style.width = originWidth
      document.body.style.height = originHeight
      document.body.style.position = originPosition
      document.body.style.left = originLeft
    }
  </script>
</body>
</html>
```

### 设计稿尺寸

对于移动端大屏展示，基本按照实际尺寸设计即可，比如：

750px * auto， 设计稿尺寸： 750px * auto
大屏设计稿尺寸总结：

设计尺寸建议按照输出分辨率设计（重点）
拼接后像素在4k左右直接按照总和设计就行
总和设计不要超过4k,可以按比例缩小设计稿（非固定，超过也是可以，只是强烈建议）
建议定设计稿尺寸前，先了解硬件及信号输入输出，确定设计稿尺寸。
特殊尺寸，需到现场调试最佳设计稿尺寸
大屏适配方案总结：

1. 特殊尺寸不要考虑适配电脑又适配拼接屏，因为完成没有必要，也不可能一稿既适配电脑也适配各种尺寸的大屏。
2. 这种情况应该优先考虑目标屏幕的适配，要针对性设计，而在小屏根据等比例缩放显示，这才是最佳解决方法。

### 开发注意事项

- 字体大小设置问题（非scale方案要考虑）
  - 如果使用rem或vw单位时，在JS添加样式时，单位需要手动设置rem或vw。
  - 第三方为的字体默认都是px单位，比如：element、echarts，因此通常需要层叠第三方为的样式。
  - 当大展比例更大时，有此字体学需要相应的调整字号。

### 基于VUE3缩放功能封装

utils:

```ts
// screen.ts
import { throttle } from 'lodash'

export function bigScreenScale(targetWidth = 1920, targetHeight = 1080, targetRatio = 16 / 9) {
  // 缓存默认样式用于还原
  const originStyle = document.body.style
  const originWidth = originStyle.width
  const originHeight = originStyle.height
  const originTransform = originStyle.transform
  const originTransformOrigin = originStyle.transformOrigin
  const originPosition = originStyle.position
  const originLeft = originStyle.left

  // 设置body的宽高
  document.body.style.width = `${targetWidth}px`
  document.body.style.height = `${targetHeight}px`

  // body缩放函数
  function changeBodyScale() {
    const currentWidth = document.documentElement.clientWidth || document.body.clientWidth
    const currentHeight = document.documentElement.clientHeight || document.body.clientWidth

    let scaleRatio = currentWidth / targetWidth

    // 当前缩放比例
    const currentRatio = currentWidth / currentHeight
    // 判断是否超宽屏幕
    if (currentRatio > targetRatio) {
      scaleRatio = currentHeight / targetHeight
    }

    document.body.style.transform = `scale(${scaleRatio}) translateX(-50%)`
    document.body.style.transformOrigin = 'left top'
    document.body.style.width = `${targetWidth}px`
    document.body.style.height = `${targetHeight}px`
    document.body.style.position = 'absolute'
    document.body.style.left = '50%'
  }

  changeBodyScale()

  const throttleChangeBodyScale = throttle(changeBodyScale, 100)

  window.addEventListener('resize', throttleChangeBodyScale)
  // 返回取消释放函数释放
  return () => {
    document.body.style.transform = originTransform
    document.body.style.transformOrigin = originTransformOrigin
    document.body.style.width = originWidth
    document.body.style.height = originHeight
    document.body.style.position = originPosition
    document.body.style.left = originLeft

    window.removeEventListener('resize', throttleChangeBodyScale)
  }
}
```

composables:

```ts
// useScreenScale.ts
import { bigScreenScale } from '@/utils/screen'

export default function useScreenScale(targetWidth = 1920, targetHeight = 1080, targetRatio = 16 / 9) {
  let cancelChangeEvent: Function | null = null
  onMounted(() => {
    cancelChangeEvent = bigScreenScale(targetWidth, targetHeight, targetRatio)
  })
  onUnmounted(() => {
    cancelChangeEvent && cancelChangeEvent()
  })
}
```

use:

App.vue
```html
<script setup lang="ts">
import useScreenScale from './composables/useScreenScale'

// 屏幕适配
useScreenScale()
</script>

```
