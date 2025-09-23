<script setup lang="ts">
const { sourceLink } = defineProps<{
  sourceLink: string
}>()
</script>

<template>
  <div class="mt-10 mb-6 prose m-auto opacity-50 flex justify-between items-center">
    <span class="text-sm">
      <a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>
      <span class="deeper-color" ml-2>2022-PRESENT © younggglcy</span>
    </span>
    <a class="text-sm" target="_blank" :href="sourceLink">View Source Code</a>
  </div>
</template>

<style scoped>
.deeper-color {
  color: var(--fg-deeper);
}
</style>
