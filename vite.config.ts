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

let cacheMarkdownItShiki: any = null

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
    Markdown({
      async markdownItSetup(md) {
        if (!cacheMarkdownItShiki) {
          cacheMarkdownItShiki = await MarkdownItShiki({
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
        }
        md.use(cacheMarkdownItShiki)
      },
    }),
    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      dts: 'types/typed-router.d.ts',
    }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: 'types/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    }),
    AutoImport({
      dts: 'types/auto-imports.d.ts', // or a custom path
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md

      ],
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
