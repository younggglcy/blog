<script setup lang="ts">
import type { PackageVersionOptions } from '~/utils/package-versions'
import { useDark } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import MarkdownItShikiExtraIcon from '~icons/local/markdown-it-shiki-extra?raw'
import { vMarkdownIt } from '~/directives'
import { getPackageVersion, prefetchVersions } from '~/utils/package-versions'
import ZenBarIcon from '../assets/icons/zenbar_icon.png'

const isDark = useDark()
const versions = ref<Record<string, string>>({})

interface Project {
  name: string
  description: string
  link: string
  archived?: boolean
  icon: string
  iconType?: 'unocss' | 'url' | 'svg'
  type?: 'npm' | 'vscode-extension' | 'mac-app'
  id?: string
  repo?: string
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
    {
      name: 'OfficeViewer',
      description: `Finder 'Open With' utility for macOS that unpacks Office files (.docx, .xlsx, .pptx) and opens the extracted folder in your editor.`,
      icon: 'https://raw.githubusercontent.com/younggglcy/OfficeViewer/refs/heads/main/OfficeViewer/Assets.xcassets/AppIcon.appiconset/icon_128x128%402x.png',
      iconType: 'url' as const,
      link: 'https://github.com/younggglcy/OfficeViewer',
      type: 'mac-app' as const,
      id: 'com.younggglcy.OfficeViewer',
      repo: 'younggglcy/OfficeViewer',
    },
    {
      name: 'ZenBar',
      description: 'Effortlessly declutter by dragging icons under the ZenBar anchor. Reveal your hidden apps in a clean, floating list with a single click. Minimalist, native, and distraction-free.',
      icon: ZenBarIcon,
      iconType: 'url' as const,
      link: 'https://github.com/younggglcy/ZenBar',
      type: 'mac-app' as const,
      id: 'com.younggglcy.ZenBar',
      repo: 'younggglcy/ZenBar',
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
  const target = event.target as HTMLElement
  if (target.tagName === 'A' || target.closest('a'))
    return
  window.open(link, '_blank')
}

onMounted(async () => {
  const versionFetchOptions: PackageVersionOptions[] = projects.value
    .filter(p => p.type && p.id)
    .map(p => ({
      type: p.type!,
      id: p.id!,
      repo: p.repo,
    }))

  await prefetchVersions(versionFetchOptions)

  const results = await Promise.all(
    versionFetchOptions.map(async (option) => {
      const version = await getPackageVersion(option)
      return { key: option.id, version }
    }),
  )

  const versionMap: Record<string, string> = {}
  results.forEach(({ key, version }) => {
    if (version)
      versionMap[key] = version
  })
  versions.value = versionMap
})
</script>

<template>
  <div class="project-list">
    <a
      v-for="project in projects"
      :key="project.name"
      class="project-item"
      :href="project.link"
      target="_blank"
      @click="handleClick(project.link, $event)"
    >
      <div class="project-icon">
        <img v-if="project.iconType === 'url'" :src="project.icon" alt="">
        <div v-else-if="project.iconType === 'unocss'" :class="project.icon" />
        <div v-else class="project-icon-svg" v-html="project.icon" />
      </div>
      <div class="project-info">
        <div class="project-header">
          <span class="project-name">{{ project.name }}</span>
          <span v-if="versions[project.id!]" class="project-version">v{{ versions[project.id!] }}</span>
          <span v-if="project.archived" class="project-archived">archived</span>
        </div>
        <div
          v-markdown-it="project.description"
          class="prose project-description"
        />
      </div>
    </a>
  </div>
</template>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 0;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
  border-bottom: 1px dashed rgba(125, 125, 125, 0.15);
}

.project-item:last-child {
  border-bottom: none;
}

.project-item:hover {
  opacity: 0.7;
}

.project-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.125rem;
}

.project-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.375rem;
}

.project-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.project-icon > div {
  width: 2.5rem;
  height: 2.5rem;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project-name {
  font-weight: 600;
  font-size: 1rem;
}

.project-version {
  font-size: 0.75rem;
  opacity: 0.5;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
}

.project-archived {
  font-size: 0.75rem;
  opacity: 0.4;
  font-style: italic;
}

.project-description {
  opacity: 0.6;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-top: 0.125rem;
}

.project-description :deep(p) {
  margin: 0;
}
</style>
