<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from './posts.data'

const props = defineProps<{ limit?: number }>()
const shown = props.limit ? posts.slice(0, props.limit) : posts

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <p v-if="shown.length === 0" class="empty">No posts yet. The first one is in progress.</p>

  <ul v-else class="post-list">
    <li v-for="post in shown" :key="post.url">
      <a :href="withBase(post.url)">{{ post.title }}</a>
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      <p v-if="post.description">{{ post.description }}</p>
    </li>
  </ul>
</template>

<style scoped>
.empty {
  color: var(--vp-c-text-2);
}

.post-list {
  list-style: none;
  padding: 0 !important;
  margin: 16px 0 0;
}

.post-list li {
  margin: 0 0 28px !important;
}

.post-list a {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
}

.post-list a:hover {
  text-decoration: underline;
}

.post-list time {
  display: block;
  margin-top: 2px;
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.post-list p {
  margin: 6px 0 0 !important;
  color: var(--vp-c-text-2);
}
</style>
