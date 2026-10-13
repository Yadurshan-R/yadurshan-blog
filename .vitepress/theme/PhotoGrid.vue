<script setup lang="ts">
import { withBase } from 'vitepress'

// Each photo is a file name in public/images/.
// A smaller copy with the same name lives in public/images/thumbs/.
interface Photo {
  src: string
  alt: string
  caption?: string
}

defineProps<{
  photos: Photo[]
  // "strip" shows square crops in one row (home page).
  // "grid" keeps each photo's shape and shows captions (Talks, About).
  layout?: 'strip' | 'grid'
}>()

const thumb = (name: string) => withBase(`/images/thumbs/${name}`)
const full = (name: string) => withBase(`/images/${name}`)
</script>

<template>
  <div :class="['photos', layout ?? 'grid']">
    <figure v-for="photo in photos" :key="photo.src">
      <a :href="full(photo.src)" target="_blank" rel="noopener">
        <img :src="thumb(photo.src)" :alt="photo.alt" loading="lazy" />
      </a>
      <figcaption v-if="photo.caption && layout !== 'strip'">{{ photo.caption }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.photos {
  display: grid;
  gap: 12px;
  margin: 20px 0 28px;
}

.photos.strip {
  grid-template-columns: repeat(3, 1fr);
}

.photos.grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  align-items: start;
}

figure {
  margin: 0;
}

figure a {
  display: block;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
}

img {
  display: block;
  width: 100%;
  transition: transform 0.25s ease;
}

figure a:hover img {
  transform: scale(1.03);
}

.strip img {
  aspect-ratio: 1;
  object-fit: cover;
}

.grid img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

figcaption {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .photos.strip {
    gap: 8px;
  }

  .photos.grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
