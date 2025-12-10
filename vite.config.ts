import { fileURLToPath, URL } from 'node:url'
import MarkdownItShiki from '@shikijs/markdown-it'
import { transformerNotationDiff, transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-md'

import GenerateInfosData from './plugins/generate-infos-data'

const cacheMarkdownItShiki: any = MarkdownItShiki({
  themes: {
    dark: 'vitesse-dark',
    light: 'vitesse-light',
  },
  defaultColor: false,
  cssVariablePrefix: '--s-',
  transformers: [
    transformerTwoslash({
      explicitTrigger: true,
      renderer: rendererRich(),
    }),
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
  ],
})

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
    ],
  },
  plugins: [
    UnoCSS(),
    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      dts: 'types/typed-router.d.ts',
    }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      async markdownItSetup(md) {
        md.use(await cacheMarkdownItShiki)
      },
    }),
    AutoImport({
      dts: 'types/auto-imports.d.ts', // or a custom path
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
      ],
    }),
    Components({
      extensions: ['vue', 'md'],
      dts: 'types/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    GenerateInfosData(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
