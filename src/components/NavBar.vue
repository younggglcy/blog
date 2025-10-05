<script setup lang="ts">
import ToggleTheme from './ToggleTheme.vue'
</script>

<template>
  <header z-24>
    <router-link
      absolute lg:fixed outline-none no-underline m-6 select-none
      class="text-[2em]"
      to="/"
      focusable="false"
      aria-label="Home"
    >
      <div i-emojione:cat-face class="hover:scale-120 transition duration-300" />
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/posts" title="Blog">
          <span class="lt-sm:hidden darker">Blog</span>
          <div i-ri-article-line sm:hidden />
        </router-link>
        <router-link to="/projects" title="Projects">
          <span class="lt-sm:hidden darker">Projects</span>
          <div i-ix:projects sm:hidden />
        </router-link>
        <router-link to="/friends" title="friends' link" class="lt-sm:hidden">
          <span class="lt-sm:hidden darker">Friends</span>
          <div i-fa-solid:user-friends sm:hidden />
        </router-link>
        <router-link to="/use" title="Use">
          <span class="lt-sm:hidden darker">Use</span>
          <div i-clarity:tools-solid sm:hidden />
        </router-link>
        <a href="https://github.com/younggglcy" target="_blank" title="GitHub">
          <div i-uil-github-alt />
        </a>
        <a href="/feed.xml" target="_blank" title="RSS" class="lt-md:hidden">
          <div i-la-rss-square style="font-size:1.25rem; margin: 0 -0.125rem;" />
        </a>
        <ToggleTheme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  @apply grid p-8 w-full box-border;
  grid-template-columns: auto max-content;
}

.nav > * {
  margin: auto;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}

html:not(.dark) .darker {
  color: #111;
}
</style>
