<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { SpeedInsights } from '@vercel/speed-insights/vue'

useHead({
  title: 'younggglcy\'s blog',
})
</script>

<template>
  <SpeedInsights />
  <div>
    <nav-bar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>

</style>
