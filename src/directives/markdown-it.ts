import type { Directive } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

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
