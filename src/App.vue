<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { useHead } from '@vueuse/head'
import NavBar from '~/components/NavBar.vue'

useHead({
  title: 'younggglcy\'s blog',
})
</script>

<template>
  <SpeedInsights />
  <Analytics />
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>

</style>
