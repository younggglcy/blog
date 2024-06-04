<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'younggglcy\'s blog',
})
</script>

<template>
  <div>
    <nav-bar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>

</style>
