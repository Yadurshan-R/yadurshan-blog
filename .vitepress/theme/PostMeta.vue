<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const isPost = computed(
  () =>
    (page.value.relativePath.startsWith('blog/posts/') ||
      page.value.relativePath.startsWith('drafts/')) &&
    frontmatter.value.date
)

const date = computed(() =>
  new Date(frontmatter.value.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
)
</script>

<template>
  <div v-if="isPost" class="post-meta">
    <time :datetime="frontmatter.date">{{ date }}</time>
    <span v-for="tag in frontmatter.tags ?? []" :key="tag" class="tag">{{ tag }}</span>
  </div>
</template>

<style scoped>
.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.tag {
  font-size: 12px;
  padding: 1px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
}
</style>
