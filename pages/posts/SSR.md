---
title: SSR学习
catgory: Blog
date: 2026-02-22
---

# SSR学习

##  SSR是什么

服务端渲染，相当于在服务端生成静态页面字符串，然后返回给用户。通过node+express模拟就是，生成html一个字符串，然后返回给用户。

```js
import express from 'express'

const app = express()

const port = 3000

// 获取数据
function fetchData() {
  return {
    title: 'SSR 示例 - 服务端渲染',
    content: '这是服务端渲染的内容，首屏加载更快、SEO更优化',
  }
}

function basicHtml() {
  const data = fetchData()
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
    </head>
    <body>
      <h1>${data.title}</h1>
      <p>${data.content}</p>
    </body>
    </html>
  `
}

// 基础示例
app.get('/', (req, res) => {
  const html = basicHtml()
  // 将字符串返回给浏览器
  res.send(html)
})

app.listen(port, () => {
  console.log(`服务器启动成功，请访问 http://localhost:${port}`)
})
```

### hydration 水合

React/Vue要做“水合”，而PHP不需要，核心原因是两者的“渲染目标”和“交互模型”完全不同。

PHP是服务端一次性交付完整页面，页面交互靠“刷新和跳转”，而React/Vue是服务端渲染静态骨架+客户端交互激活，水合就是“交互激活”的关键步骤，php是需要多个页面的渲染才能完成，php虽然也有局部刷新，但是不同页面不同路由处理方式与vue/react/angular不一样,php是一个页面就是一个路由，而React/Vue是一个静态骨架，然后通过JS激活交互生成页面。如果不设计水合，可能会导致服务端与客户端的渲染结果不一致，导致某些功能不能体现或者出现特殊BUG。

#### 水合出现缘由

如果不设计hydration会出现以下问题：

流程改变：
1. 服务端输出HTML
2. 浏览器加载JS
3. Vue直接重新mount整个应用，把服务器生成的DOM全部销毁，再重新生成
4. 会出现什么问题
   1. 页面闪烁
   2. 用户交互丢失
   3. 性能浪费
   4. 其它特殊bug

Hydration解决了什么？

- 不重新创建DOM，而是“接管”现有DOM
- 绑定事件
- 建立响应式
- 验证结构一致
  - 一致->进入正常模式
  - 不一致->报警告
- hydration虽然带来复杂性，但是可保证运行时体验

### vue或reactSSR场景局部刷新如何处理

需要区分两种“更新”。

#### 1. 服务端已经渲染好数据

- 数据在服务端准备好
- 客户端hydrate后保持一致
- 后续再局部更新，局部更新是通过按钮触发的所以不需要复杂处理

#### 2. 客户端再请求数据（避免水合错误）

如果数据只能客户端拿：

```html
<template>
  <div v-if="mounted">
    {{ data }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const mounted = ref(false)

onMounted(async () => {
  const res = await fetch('/api')
  data.value = await res.json()
  mounted.value = true
})
</script>
```

- 服务端输出空
- 客户端第一次也是空
- hydrate 不会报错
- mounted 后再局部更新
- 避免水合错误，这样有缺点不利于SEO优化

##### 什么时候“客户端请求”是可以接受的

✅ 适合客户端请求

- 用户信息（登录态）
- 评论区
- 点赞数
- 个性化推荐
- 不重要的统计数据

这些不是 SEO 核心内容。

❌ 不适合客户端请求

- 文章正文
- 商品详情
- 标题
- 描述
- 列表页内容

#### Nuxt.js的server层相当于BFF(Backend For Frontend)层

BFF（Backend For Frontend）是：

- 专门为前端定制的后端接口层
- 它的作用是：
- 聚合多个后端接口
- 数据裁剪
- 统一鉴权
- 隐藏内部 API
- 减少前端请求次数

Nuxt 的 server 层：

✅ 可以做 BFF
✅ 可以做 SSR 数据准备
✅ 可以做代理
❌ 不适合承载重型业务系统
