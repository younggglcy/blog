import type { Plugin } from 'vite'
import { dirname, resolve } from 'node:path'
import { imageSizeFromFile } from 'image-size/fromFile'

export function mdImageSize(): Plugin {
  return {
    name: 'md-image-size',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      const mdDir = dirname(id)
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const imgRegex = /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*)>/g

      let cursor = 0
      let output = ''

      for (const match of Array.from(code.matchAll(imgRegex))) {
        const [full, before, src, after] = match

        output += code.slice(cursor, match.index)
        cursor = match.index + full.length

        // Skip if width/height already provided or remote URL
        if (/\b(?:width|height)\s*=/.test(before + after) || /^https?:\/\//.test(src)) {
          output += full
          continue
        }

        try {
          const imgPath = resolve(mdDir, src)
          const imgSize = await imageSizeFromFile(imgPath)
          let { width, height } = imgSize

          // https://jpegclub.org/exif_orientation.html
          if (imgSize.orientation && [5, 6, 7, 8].includes(imgSize.orientation)) {
            ;[width, height] = [height, width]
          }

          if (width && height) {
            output += `<img ${before}src="${src}" style="height: auto;" width="${imgSize.width}" height="${imgSize.height}"${after}>`
            continue
          }
        }
        catch {
          console.warn(`[md-image-size] Failed to get size for: ${src}`)
        }

        output += full
      }

      output += code.slice(cursor)
      return output
    },
  }
}
