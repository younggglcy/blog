import 'vue-router'

declare module 'vue-router' {
  export interface FrontMatter {
    title: string
    date: string
    tags: string[]
    categories?: string[]
    description: string
    words: number
    duration: string
    lastUpdateTime: string
    withProgress?: boolean
  }
  interface RouteMeta {
    frontmatter: FrontMatter
  }
}
