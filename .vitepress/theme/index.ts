import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './PostList.vue'
import PostMeta from './PostMeta.vue'
import PhotoGrid from './PhotoGrid.vue'
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
    app.component('PhotoGrid', PhotoGrid)
  }
} satisfies Theme
