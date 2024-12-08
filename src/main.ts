import { ViteSSG } from 'vite-ssg'
import routes from '~pages'
import App from './App.vue'
import 'uno.css'
import '~/styles/main.css'
import '~/styles/markdown.css'
import '~/styles/prose.css'

export const createApp = ViteSSG(
  App,
  { routes },
)
