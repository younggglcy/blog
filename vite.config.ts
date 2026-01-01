import { basename, resolve } from 'node:path'
import Shiki from '@shikijs/markdown-it'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import Vue from '@vitejs/plugin-vue'
import fs from 'fs-extra'
import matter from 'gray-matter'
import Anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import TOC from 'markdown-it-table-of-contents'
import Unocss from 'unocss/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import MarkDown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Pages from 'vite-plugin-pages'
import { mdImageSize } from './plugins/vite-plugin-md-image-size'
import { slugify } from './scripts/slugify'
import { getLastUpdateTime } from './scripts/utils'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),

    mdImageSize(),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Pages({
      extensions: ['vue', 'md'],
      dirs: [
        { dir: './pages', baseRoute: '' },
        { dir: './pages/posts', baseRoute: 'posts' },
        { dir: './pages/monthly', baseRoute: 'monthly' },
      ],
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        const md = fs.readFileSync(path, 'utf8')
        const { data } = matter(md)

        route.meta = Object.assign(
          route.meta || {},
          {
            frontmatter: {
              ...data,
              lastUpdateTime: getLastUpdateTime(path),
            },
            filename: basename(path, '.md'),
          },
        )

        return route
      },
    }),

    Components({
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver(),
      ],
    }),

    Icons({
      compiler: 'vue3',
      customCollections: {
        local: FileSystemIconLoader('./src/assets/icons'),
      },
    }),

    Unocss(),

    MarkDown({
      wrapperComponent: 'PageWrapper',
      wrapperClasses: 'prose m-auto',
      headEnabled: true,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      async markdownItSetup(md) {
        md.use(Anchor, {
          slugify,
          permalink: Anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true', 'tabIndex': -1 }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
        })

        md.use(await Shiki({
          themes: {
            dark: 'github-dark',
            light: 'github-light',
          },
          langs: [
            'javascript',
            'typescript',
            'tsx',
            'mermaid',
            'json',
          ],
          transformers: [
            transformerMetaHighlight(),
            transformerNotationDiff(),
          ],
          defaultColor: false,
        }))
      },
    }),
  ],
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, './src')}/`,
    },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/customParseFormat',
    ],
  },
})
