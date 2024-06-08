<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark()

function toggleDark() {
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="container-div" title="Toggle Color Scheme" @click="toggleDark">
    <div v-show="isDark" i-ri-moon-line />
    <div v-show="!isDark" i-ri-sun-line />
  </div>
</template>

<style scoped>
.container-div {
  cursor: pointer;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.container-div:hover {
  opacity: 1;
}
</style>
