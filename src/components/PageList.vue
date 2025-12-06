<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { vInfiniteScroll } from '~/directives'
import { parseDate } from '~/lib/day'
import PostItem from './PostItem.vue'

const route = useRoute()
const router = useRouter()

const tags = ref<string[]>([])
const initialNum = ref(4)

function selectTag(name: string) {
  const _tags = unref(tags)
  const idx = _tags.indexOf(name)
  if (idx === -1)
    tags.value.push(name)

  else
    tags.value.splice(idx, 1)
}

function deselectTag(idx: number) {
  tags.value.splice(idx, 1)
}

const allPostsRoutes = computed(() => {
  // 获取当前路由的基础前缀（posts 或 monthly）
  const routePrefix = route.matched[0]?.path || ''

  return router.getRoutes()
    .filter(({ path }) => path.startsWith(routePrefix) && path !== routePrefix)
    .sort((a, b) => {
      return parseDate(b.meta.frontmatter?.date || '') - parseDate(a.meta.frontmatter?.date || '')
    })
    .map(i => ({
      ...i.meta.frontmatter,
      path: i.path,
    }))
})

const allPostsNum = computed(() => allPostsRoutes.value.length)

function load() {
  if (initialNum.value + 2 <= allPostsNum.value) {
    initialNum.value += 2
  }
  else {
    initialNum.value = allPostsNum.value
  }
}

const posts = computed(() => {
  return allPostsRoutes.value
    .filter(i => tags.value.every(tag => i.tags?.includes(tag)))
    .slice(0, initialNum.value)
})
</script>

<template>
  <div>
    <div v-if="tags.length" flex>
      <span>Tag: &nbsp;&nbsp;</span>
      <span v-for="(tag, idx) of tags" :key="idx" inline-flex items-center mr-2>
        <i-carbon:tag-group hover:cursor-pointer @click="deselectTag(idx)" />
        <span hover:cursor-pointer hover:underline @click="deselectTag(idx)">
          {{ tag }}
        </span>
      </span>
    </div>
    <main v-infinite-scroll="load" overflow-auto>
      <PostItem v-for="post in posts" :key="post.path" v-bind="post" @tag-click="selectTag" />
    </main>
  </div>
</template>

<style scoped>

</style>
