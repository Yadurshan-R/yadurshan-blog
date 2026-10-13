# Yadurshan Rajakumar's blog

My personal developer blog, built with [VitePress](https://vitepress.dev) (Vue 3 and Markdown).

## Run it on your computer

You need Node.js 18 or newer.

```bash
npm install      # install VitePress (first time only)
npm run dev      # start the site at http://localhost:5173
```

Changes to any `.md` file show up in the browser straight away.

## Build for production

```bash
npm run build    # writes the finished site to .vitepress/dist
npm run preview  # check the built site locally
```

## Folder layout

```
.
├── index.md                  Home page
├── about.md                  About page
├── talks.md                  Talks page
├── blog/
│   ├── index.md              List of all posts
│   └── posts/                Published posts go here
├── drafts/                   Work in progress (never published)
└── .vitepress/
    ├── config.mts            Site title, menu and social links
    └── theme/                Colours, post list and post date header
```

## Write a new post

1. Create a file in `drafts/`, for example `drafts/my-post.md`, starting with:

   ```md
   ---
   title: My post title
   description: One sentence on what the reader will learn.
   date: 2026-10-20
   tags: [Go, Choreo]
   ---
   ```

2. Write the post in Markdown. While `npm run dev` is running, open
   `http://localhost:5173/drafts/my-post` to see it.
3. When it's ready, move the file into `blog/posts/`. It appears on the home page and
   the Writing page automatically, newest first.

To hide a post in `blog/posts/` without moving it, add `draft: true` to its front matter.
