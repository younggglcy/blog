<script setup lang="ts">
import { useElementSize, useWindowScroll, useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  el: HTMLElement
}>()

const { y } = useWindowScroll()
const { height: windowHeight } = useWindowSize()
const { height: elHeight } = useElementSize(() => props.el)

const top = computed(() => props.el.offsetTop)
const scrollTotal = computed(() => y.value + windowHeight.value)

const read = computed(() => {
  const val = scrollTotal.value - top.value
  return val < 0 ? 0 : val > elHeight.value ? elHeight.value : val
})

const progress = computed(() => {
  return (read.value / elHeight.value * 100).toFixed(2)
})
</script>

<template>
  <div v-if="!isNaN(Number(progress))" class="prose m-auto" fixed bottom-8 left-12 op50 text-ellipsis>
    {{ progress }} %
  </div>
</template>

<style scoped>

</style>
