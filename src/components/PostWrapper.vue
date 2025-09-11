<script setup lang="ts">
import type { FrontMatter } from '~/types'
import { useWindowScroll, watchThrottled } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOffsetTop } from '~/utils'
import BackToTop from './BackToTop.vue'
import FooterBar from './FooterBar.vue'
import ProgressBar from './ProgressBar.vue'

const { frontmatter } = defineProps<{
  frontmatter: FrontMatter
}>()

useHead({
  title: frontmatter.title,
  meta: [
    {
      name: 'keywords',
      content: frontmatter.tags?.join(', '),
    },
  ],
})

const route = useRoute()

// the vite-plugin-vue-markdown plugin will only parse
// native frontmatter of the markdown file
// so I put time on here
const lastUpdateTime = route.meta.frontmatter.lastUpdateTime

const isPostsRoute = route.path.match(/^\/posts\/.+/)

const showProgress = isPostsRoute && frontmatter.withProgress !== false

const articleEl = ref<null | HTMLElement>(null)

onMounted(() => {
  if (route.hash) {
    const el = document.querySelector<HTMLAnchorElement>(`${decodeURIComponent(route.hash)}`)
    el?.scrollIntoView({
      behavior: 'smooth',
    })
  }
  const toc = document.querySelector('article .table-of-contents')
  if (isPostsRoute && toc) {
    const lists = Array.from(toc.querySelectorAll<HTMLAnchorElement>('li > a'))

    // highlight current title
    const names = lists.map(i => decodeURIComponent(i.hash).slice(1))
    const tops = names.map((name) => {
      const el = document.querySelector<HTMLElement>(`#${name}`)!
      return getOffsetTop(el)
    })

    const { y } = useWindowScroll()
    const windowHeight = window.innerHeight
    const scrollDistance = computed(() => y.value + windowHeight)
    let lastIdx: null | number = null
    let idx = 0

    watchThrottled(
      scrollDistance,
      (scroll) => {
        for (let i = 0; i < tops.length; i++) {
          if (tops[i] + windowHeight * 0.7 < scroll)
            idx = i
        }
        if (idx === lastIdx)
          return
        if (lastIdx !== null)
          lists[lastIdx].classList.toggle('highlight-title')
        lists[idx!].classList.toggle('highlight-title')
        lastIdx = idx
      },
      {
        throttle: 300,
        immediate: true,
      },
    )
  }
})
</script>

<template>
  <div>
    <div v-if="route.path !== '/posts' && frontmatter.title" class="prose m-auto mb-8">
      <h1 class="mb-0">
        {{ frontmatter.title }}
      </h1>
      <p v-if="frontmatter.date" class="opacity-50 !-mt-2">
        {{ frontmatter.date }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
      </p>
    </div>
    <article ref="articleEl">
      <slot />
    </article>
    <div v-if="lastUpdateTime" class="prose m-auto mt-12 opacity-50">
      上次修改时间: {{ lastUpdateTime }}
    </div>
    <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8">
      <router-link
        :to="route.path.split('/').slice(0, -1).join('/') || '/'"
        class="font-mono no-underline opacity-50 hover:opacity-75"
      >
        cd ..
      </router-link>
    </div>
    <ClientOnly>
      <BackToTop />
      <ProgressBar v-if="showProgress && articleEl" :el="articleEl" />
    </ClientOnly>
    <FooterBar />
  </div>
</template>

<style>
.highlight-title {
  color: aqua !important;
}
html:not(.dark) .highlight-title {
  color: orangered !important;
}
</style>
