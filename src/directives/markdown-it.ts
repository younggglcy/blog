import type { Directive } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// Copied from https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
// Remember the old renderer if overridden, or proxy to the default renderer.
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // Add a new `target` attribute, or replace the value of the existing one.
  tokens[idx].attrSet('target', '_blank')

  // Pass the token to the default renderer.
  return defaultRender(tokens, idx, options, env, self)
}

export const vMarkdownIt: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    if (binding.value) {
      el.innerHTML = md.render(binding.value)
    }
  },
  updated(el, binding) {
    if (binding.value) {
      el.innerHTML = md.render(binding.value)
    }
  },
}
