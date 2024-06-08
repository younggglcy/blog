<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import NavBar from '~/components/NavBar.vue'

useHead({
  title: 'younggglcy\'s blog',
})
</script>

<template>
  <SpeedInsights />
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>

</style>
