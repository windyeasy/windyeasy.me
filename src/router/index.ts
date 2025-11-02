// 从插件自动生成的路由配置导入
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export default createRouter({
  history: createWebHistory(),
  // pass the generated routes written by the plugin 🤖
  routes,
})
