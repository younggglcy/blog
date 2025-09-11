import {
  presetWind3,
} from '@unocss/preset-wind3'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
