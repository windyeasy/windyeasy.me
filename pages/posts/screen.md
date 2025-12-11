---
title: 可视化大屏常用适配方式
catgory: Blog
date: 2025-12-10
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
- 图片模糊问题
  - 切图时切1倍图、2倍图，大屏用大图，小屏用小图。
  - 建议都使用SVG矢量图，保证放大缩小不会失真。
- Echarts 渲染引擎的选择
  - 使用SVG渲染引擎，SVG图扩展性更好
- 动画卡顿优化
  - 创建新的渲染层、启用GPU加速、善用CSS3形变动画
  - 少用渐变和高斯模糊、当不需要动画时，及时关闭动画

### 基于VUE3缩放功能封装

utils:

```ts
// screen.ts
import { throttle } from 'lodash'

export function bigScreenScale(targetWidth = 1920, targetHeight = 1080, targetRatio = 16 / 9) {
  document.body.style.width = `${targetWidth}px`
  document.body.style.height = `${targetHeight}px`

  function changeBodyScale() {
    const currentWidth = document.documentElement.clientWidth || document.body.clientWidth
    const currentHeight = document.documentElement.clientHeight || document.body.clientHeight

    // 计算缩放比例
    let scaleRatio = currentWidth / targetWidth
    // 当前屏幕比例
    const currentRatio = currentWidth / currentHeight

    // 缩放样式
    let scaleStyle = `scale(${scaleRatio})`

    // 超宽屏， 参照高度缩放后居中
    if (currentRatio > targetRatio) {
      scaleRatio = currentHeight / targetHeight
      scaleStyle = `scale(${scaleRatio}) translateX(-50%)`
      document.body.style.left = '50%'
    }
    else {
      // 不是参照高度进行缩放，不居中
      document.body.style.left = '0'
    }

    document.body.style.transform = scaleStyle
  }

  changeBodyScale()

  const throttleChangeBodyScale = throttle(changeBodyScale, 100)

  // 可以使用节流
  window.addEventListener('resize', throttleChangeBodyScale)
  return () => {
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
