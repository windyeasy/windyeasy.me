import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import ArticleList from './components/ArticleList.vue'
import Category from './components/Category.vue'
import store from './store'
import '@shikijs/twoslash/style-rich.css'

import 'normalize.css'
import 'virtual:uno.css'
import './styles/index.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },

  ({ app }) => {
    app.component('Category', Category)
    app.component('ArticleList', ArticleList)
    app.use(store)
  },
)
