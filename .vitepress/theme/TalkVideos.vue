<script setup lang="ts">
import { ref } from 'vue'

// A list of YouTube recordings for one talk or event.
// The first one is shown as a playable video; the rest are listed underneath.
interface Video {
  id: string // the part after "watch?v=" or "youtu.be/"
  title: string
  date: string // e.g. "September 2025"
}

const props = defineProps<{ videos: Video[] }>()

const [featured, ...others] = props.videos
const playing = ref(false)

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`
// The privacy-friendly YouTube domain only sets cookies once someone presses play.
const embed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
</script>

<template>
  <div class="talk-videos">
    <figure v-if="featured" class="featured">
      <div class="frame">
        <iframe
          v-if="playing"
          :src="embed(featured.id)"
          :title="featured.title"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
        />
        <button v-else type="button" class="poster" :aria-label="`Play: ${featured.title}`" @click="playing = true">
          <img :src="thumb(featured.id)" :alt="''" loading="lazy" />
          <span class="play" aria-hidden="true" />
        </button>
      </div>
      <figcaption>
        <span class="label">{{ featured.date }}</span>
        <a :href="watch(featured.id)" target="_blank" rel="noopener">{{ featured.title }}</a>
      </figcaption>
    </figure>

    <ul v-if="others.length" class="others">
      <li v-for="video in others" :key="video.id">
        <span class="label">{{ video.date }}</span>
        <a :href="watch(video.id)" target="_blank" rel="noopener">{{ video.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.talk-videos {
  margin: 24px 0 8px;
}

.featured {
  margin: 0;
}

.frame {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 4px;
  overflow: hidden;
  background: #111;
}

.frame iframe,
.poster,
.poster img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.poster {
  padding: 0;
  cursor: pointer;
  background: none;
}

.poster img {
  object-fit: cover;
  transition: opacity 0.2s;
}

.poster:hover img {
  opacity: 0.9;
}

/* A quiet round play button: dark circle, white triangle. */
.play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 68px;
  height: 68px;
  margin: -34px 0 0 -34px;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.72);
  transition: background 0.2s;
}

.play::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 54%;
  transform: translate(-50%, -50%);
  border-style: solid;
  border-width: 12px 0 12px 20px;
  border-color: transparent transparent transparent #fff;
}

.poster:hover .play {
  background: rgba(20, 20, 20, 0.88);
}

figcaption,
.others li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 14px;
}

figcaption {
  margin-top: 10px;
}

.label {
  flex: 0 0 132px;
  font-family: var(--font-label);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7a7a7a;
}

.talk-videos a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid #cfcfcf;
}

.talk-videos a:hover {
  border-color: var(--ink);
}

.others {
  list-style: none;
  padding: 0 !important;
  margin: 18px 0 0 !important;
  border-top: 1px solid #ececec;
}

.others li {
  margin: 0 !important;
  padding: 12px 0;
  border-bottom: 1px solid #ececec;
}

@media (max-width: 640px) {
  .label {
    flex-basis: 100%;
  }
}
</style>
