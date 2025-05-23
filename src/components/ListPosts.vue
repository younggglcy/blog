<script setup lang="ts">
import type { Post } from '~/types'
import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { vInfiniteScroll } from '~/directives'
import { parseDate } from '~/lib/day'
import PostItem from './PostItem.vue'

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

const allPostsRoutes: Post[] = router.getRoutes()
  .filter(i => i.path.match(/^\/posts\/.*$/))
  .sort((a, b) => {
    return parseDate(b.meta.frontmatter.date) - parseDate(a.meta.frontmatter.date)
  })
  .map(i => ({
    ...i.meta.frontmatter,
    path: i.path,
  }))

const allPostsNum = allPostsRoutes.length

function load() {
  if (initialNum.value + 2 <= allPostsNum) {
    initialNum.value += 2
  }
  else {
    initialNum.value = allPostsNum
  }
}

const posts = computed(() => {
  return allPostsRoutes
    .filter(i => tags.value.every(tag => i.tags.includes(tag)))
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
