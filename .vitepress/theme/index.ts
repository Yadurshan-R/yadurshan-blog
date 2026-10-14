import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './PostList.vue'
import PostMeta from './PostMeta.vue'
import Landing from './Landing.vue'
import TalkVideos from './TalkVideos.vue'
// Fonts are bundled with the site, so nothing loads from Google.
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/pt-sans/400.css'
import '@fontsource/pt-sans/700.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    // Show the date and tags above every blog post.
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostMeta)
    })
  },
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('Landing', Landing)
    app.component('TalkVideos', TalkVideos)
  }
} satisfies Theme
