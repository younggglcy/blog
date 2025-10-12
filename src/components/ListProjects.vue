<script setup lang="ts">
import type { PackageVersionOptions } from '~/utils/package-versions'
import { useDark } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import MarkdownItShikiExtraIcon from '~icons/local/markdown-it-shiki-extra?raw'
import { vMarkdownIt } from '~/directives'
import { getPackageVersion, prefetchVersions } from '~/utils/package-versions'

const isDark = useDark()
const versions = ref<Record<string, string>>({})

interface Project {
  name: string
  description: string
  link: string
  archived?: boolean
  icon: string
  iconType?: 'unocss' | 'url' | 'svg'
  type?: 'npm' | 'vscode-extension'
  id?: string
}

const projects = computed(() => {
  const projectsData: Project[] = [
    {
      name: 'markdown-it-shiki-extra',
      description: '[Markdown It](https://markdown-it.github.io/) plugin for [Shiki](https://github.com/shikijs/shiki) with extra options.',
      icon: MarkdownItShikiExtraIcon,
      iconType: 'svg' as const,
      archived: true,
      link: 'https://github.com/younggglcy/markdown-it-shiki-extra',
      type: 'npm' as const,
      id: 'markdown-it-shiki-extra',
    },
    {
      name: 'Simple Reminder',
      description: 'A simple reminder for vscode',
      icon: 'https://raw.githubusercontent.com/GODLiangCY/reminder/main/reminder.png',
      iconType: 'url' as const,
      archived: true,
      link: 'https://github.com/younggglcy/reminder',
      type: 'vscode-extension' as const,
      id: 'younggglcy.simple-routine-reminder',
    },
    {
      name: '@younggglcy/create-npm-lib',
      description: 'My custom CLI tool for creating a npm library with a starter template',
      icon: isDark.value ? 'i-skill-icons:npm-dark' : 'i-skill-icons:npm-light',
      iconType: 'unocss' as const,
      link: 'https://github.com/younggglcy/create-npm-lib',
      type: 'npm' as const,
      id: '@younggglcy/create-npm-lib',
    },
  ]

  return projectsData
    .toSorted((a, b) => {
      if (a.archived && !b.archived)
        return 1
      if (!a.archived && b.archived)
        return -1
      return 0
    })
})

function handleClick(link: string, event: MouseEvent) {
  // 如果点击的是链接，不执行卡片的点击事件
  const target = event.target as HTMLElement
  if (target.tagName === 'A' || target.closest('a')) {
    return
  }
  window.open(link, '_blank')
}

const iconClass = 'icon-container w-14 h-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-2 group-hover:scale-110 transition-transform duration-300'

// Fetch versions on mount
onMounted(async () => {
  // Prepare version fetch options
  const versionFetchOptions: PackageVersionOptions[] = projects.value
    .filter(p => p.type && p.id)
    .map(p => ({
      type: p.type!,
      id: p.id!,
    }))

  // Prefetch all versions
  await prefetchVersions(versionFetchOptions)

  // Get versions and store them
  const versionPromises = versionFetchOptions.map(async (option) => {
    const version = await getPackageVersion(option)
    return { key: option.id, version }
  })

  const results = await Promise.all(versionPromises)
  const versionMap: Record<string, string> = {}
  results.forEach(({ key, version }) => {
    if (version) {
      versionMap[key] = version
    }
  })

  versions.value = versionMap
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div
      v-for="project in projects"
      :key="project.name"
      class="project-card group p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-800/30"
      @click="handleClick(project.link, $event)"
    >
      <!-- Version badge at top right -->
      <div v-if="versions[project.id!] && project.type" class="version-badge">
        <span class="version-label">v{{ versions[project.id!] }}</span>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="project.iconType === 'url'" :class="iconClass">
          <img :src="project.icon" alt="" class="w-full h-full object-contain">
        </div>
        <div v-else-if="project.iconType === 'unocss'" :class="iconClass">
          <div :class="project.icon" w-14 h-14 />
        </div>
        <div v-else :class="iconClass" v-html="project.icon" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="text-lg font-bold m-0 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ project.name }}
            </h3>
            <span v-if="project.archived" class="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
              Archived
            </span>
          </div>
          <div
            v-markdown-it="project.description"
            class="prose project-description"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.project-card {
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.project-card:hover::before {
  transform: scaleX(1);
}

.project-card:hover {
  transform: translateY(-4px);
}

.version-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
}

.version-label {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.3s ease;
  letter-spacing: 0.025em;
  /* Light mode styling */
  color: #5b21b6;
  background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
  box-shadow: 0 2px 6px rgba(91, 33, 182, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.version-label:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(91, 33, 182, 0.25);
  border-color: rgba(139, 92, 246, 0.3);
}

.dark .version-label {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.dark .version-label:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
  border-color: rgba(102, 126, 234, 0.5);
}

.project-description {
  opacity: 0.75;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 0.25rem;
}

.project-description :deep(p) {
  margin: 0;
  line-height: 1.5;
}

.project-description :deep(a) {
  text-decoration: none;
  color: #3b82f6;
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
}

.dark .project-description :deep(a) {
  color: #60a5fa;
}

.project-description :deep(a:hover) {
  color: #2563eb;
  text-decoration: underline;
}

.dark .project-description :deep(a:hover) {
  color: #93c5fd;
}

h3 {
  line-height: 1.3;
}
</style>
