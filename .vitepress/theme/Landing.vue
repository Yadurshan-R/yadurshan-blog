<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useData, withBase } from 'vitepress'

// Everything here is set in the front matter of index.md.
interface Slide {
  src: string
  alt: string
  position?: string
  // "whole" shows the full photo over a blurred copy of itself, for wide
  // group photos that would otherwise be cut off. The default fills the space.
  fit?: 'fill' | 'whole'
}

const { frontmatter } = useData()

const slides = computed<Slide[]>(() => frontmatter.value.slides ?? [])
const seconds = computed<number>(() => frontmatter.value.slideSeconds ?? 3)
const links = [
  { text: 'Writing', href: withBase('/blog/') },
  { text: 'Talks', href: withBase('/talks') },
  { text: 'About', href: withBase('/about') }
]

const current = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function next() {
  if (slides.value.length > 1) current.value = (current.value + 1) % slides.value.length
}

function start() {
  stop()
  timer = setInterval(next, seconds.value * 1000)
}

function stop() {
  if (timer) clearInterval(timer)
  timer = undefined
}

// Pause while the tab is hidden, so it doesn't jump ahead when you come back.
function onVisibility() {
  document.hidden ? stop() : start()
}

onMounted(() => {
  // Respect people who have turned off animations on their device.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  start()
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <main class="landing">
    <section class="photo" aria-label="Photos of Yadurshan at work and events">
      <div
        v-for="(slide, i) in slides"
        :key="slide.src"
        :class="['slide', slide.fit === 'whole' ? 'whole' : 'fill', { active: i === current }]"
      >
        <img
          v-if="slide.fit === 'whole'"
          class="backdrop"
          :src="withBase(`/images/hero/${slide.src}`)"
          alt=""
          aria-hidden="true"
        />
        <img
          class="main"
          :src="withBase(`/images/hero/${slide.src}`)"
          :alt="slide.alt"
          :style="slide.position ? { objectPosition: slide.position } : undefined"
          :loading="i === 0 ? 'eager' : 'lazy'"
        />
      </div>
    </section>

    <section class="text">
      <h1>{{ frontmatter.name }}</h1>
      <p class="role">{{ frontmatter.role }}</p>

      <nav>
        <a v-for="link in links" :key="link.text" :href="link.href">{{ link.text }}</a>
        <span class="icons">
          <a href="https://www.linkedin.com/in/yadurshan-rajakumar" aria-label="LinkedIn" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.25H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.93 1.3-1.93 2.64V21h-4z"/></svg>
          </a>
          <a href="https://github.com/Yadurshan-R" aria-label="GitHub" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>
          </a>
        </span>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.landing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background: #fff;
  color: #3a3a3a;
}

/* Left half: photos stacked on top of each other, fading in turn. */
.photo {
  position: relative;
  overflow: hidden;
  background: #e9e9e9;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.slide.active {
  opacity: 1;
}

.slide img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.fill .main {
  object-fit: cover;
}

.whole .main {
  object-fit: contain;
}

/* Soft, darkened copy of the same photo behind a "whole" photo. */
.whole .backdrop {
  object-fit: cover;
  filter: blur(28px) brightness(0.75);
  transform: scale(1.15);
}

/* Right half: name, role and links. */
.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 8%;
}

h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 500;
  font-size: clamp(36px, 4.4vw, 64px);
  line-height: 1.1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #3a3a3a;
}

.role {
  margin: 20px 0 0;
  font-family: 'PT Sans', system-ui, sans-serif;
  font-size: clamp(14px, 1.3vw, 18px);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #6f6f6f;
}

nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 32px;
  margin-top: clamp(64px, 14vh, 200px);
  font-family: 'PT Sans', system-ui, sans-serif;
}

nav > a {
  font-size: 14px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #555;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

nav > a:hover {
  color: #3a3a3a;
  border-color: #3a3a3a;
}

.icons {
  display: flex;
  gap: 16px;
}

.icons a {
  display: flex;
  color: #555;
  opacity: 0.85;
}

.icons a:hover {
  opacity: 1;
}

.icons svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Phones and small tablets: photo on top, text underneath. */
@media (max-width: 860px) {
  .landing {
    grid-template-columns: 1fr;
    grid-template-rows: 62vh auto;
  }

  .text {
    padding: 40px 24px 56px;
  }

  nav {
    margin-top: 48px;
    gap: 14px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slide {
    transition: none;
  }
}
</style>
