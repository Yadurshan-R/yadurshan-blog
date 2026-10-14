<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from './posts.data'

const props = defineProps<{ limit?: number }>()
const shown = props.limit ? posts.slice(0, props.limit) : posts

// The name and role shown on every card.
const author = { name: 'Yadurshan Rajakumar', role: 'Developer & Community Speaker' }

// "14 OCT, 2026", like the WSO2 cards.
function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  return `${day} ${month}, ${d.getUTCFullYear()}`
}
</script>

<template>
  <p v-if="shown.length === 0" class="empty">No posts yet. The first one is in progress.</p>

  <div v-else class="cards">
    <a v-for="post in shown" :key="post.url" :href="withBase(post.url)" class="card">
      <div class="top">
        <span class="type">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="3.5" y="2.5" width="13" height="15" rx="1" />
            <line x1="6.5" y1="6.5" x2="13.5" y2="6.5" />
            <line x1="6.5" y1="9.5" x2="13.5" y2="9.5" />
            <line x1="6.5" y1="12.5" x2="11" y2="12.5" />
          </svg>
          {{ post.type }}
        </span>
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </div>

      <h3>{{ post.title }}</h3>

      <div class="author">
        <strong>{{ author.name }}</strong>
        <span>{{ author.role }}</span>
      </div>

      <div v-if="post.tags.length" class="tags">
        <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.empty {
  color: var(--vp-c-text-2);
}

/* Light grey panel behind the cards. */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin: 24px 0 0;
  padding: 24px;
  border-radius: 16px;
  background: #f1f1f0;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 26px 28px 28px;
  border-radius: 18px;
  background: #fff;
  color: var(--ink) !important;
  text-decoration: none !important;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--font-label);
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8a8a8a;
}

.type {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.type svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: #9a9a9a;
  stroke-width: 1.2;
}

.card h3 {
  margin: 22px 0 0 !important;
  padding: 0 !important;
  border: none !important;
  font-family: var(--vp-font-family-base) !important;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
  color: var(--ink);
}

.author {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 22px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dcdcda;
}

.author strong {
  font-size: 15px;
  font-weight: 600;
}

.author span {
  font-size: 13px;
  letter-spacing: 0.04em;
  color: #555;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.tags span {
  padding: 6px 14px;
  border-radius: 999px;
  background: #ececea;
  font-size: 13px;
  color: var(--ink);
}

@media (max-width: 640px) {
  .cards {
    padding: 14px;
    gap: 14px;
  }

  .card {
    padding: 22px;
  }
}
</style>
