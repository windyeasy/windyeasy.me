import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import store from './store'

import 'normalize.css'
import 'virtual:uno.css'
import './styles/index.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },

  ({ app }) => {
    app.use(store)
  },
)
