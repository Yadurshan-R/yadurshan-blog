import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Yadurshan Rajakumar',
  description:
    'Writing on full stack development, Cardano and developer platforms by Yadurshan Rajakumar.',
  base: '/yadurshan-blog/',
  cleanUrls: true,

  // Drafts can be previewed with `npm run dev`, but are never published by `npm run build`.
  srcExclude: process.argv.includes('build') ? ['drafts/**', 'README.md'] : ['README.md'],

  // One light theme, like a printed page. No dark mode switch.
  appearance: false,

  head: [
    ['meta', { name: 'author', content: 'Yadurshan Rajakumar' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Yadurshan Rajakumar' }],
    // Playfair Display for the name and headings, PT Sans for menus and labels.
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=PT+Sans:wght@400;700&display=swap'
      }
    ]
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

    footer: {
      copyright: `© ${new Date().getFullYear()} Yadurshan Rajakumar`
    }
  }
})
