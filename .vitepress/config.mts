import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Yadurshan Rajakumar',
  description:
    'Writing on full stack development, Cardano and developer platforms by Yadurshan Rajakumar.',
  cleanUrls: true,

  // Drafts can be previewed with `npm run dev`, but are never published by `npm run build`.
  srcExclude: process.argv.includes('build') ? ['drafts/**', 'README.md'] : ['README.md'],

  head: [
    ['meta', { name: 'author', content: 'Yadurshan Rajakumar' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Yadurshan Rajakumar' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Writing', link: '/blog/' },
      { text: 'Talks', link: '/talks' },
      { text: 'About', link: '/about' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yadurshan-R' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/yadurshan-rajakumar' }
    ],

    outline: { level: [2, 3], label: 'On this page' },

    search: { provider: 'local' },

    footer: {
      copyright: `© ${new Date().getFullYear()} Yadurshan Rajakumar`
    }
  }
})
