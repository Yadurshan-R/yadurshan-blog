import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  description: string
  tags: string[]
}

declare const data: Post[]
export { data }

// Reads every post in blog/posts/, skips drafts, newest first.
export default createContentLoader('blog/posts/*.md', {
  transform(raw): Post[] {
    return raw
      .filter(({ frontmatter }) => !frontmatter.draft)
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : '',
        description: frontmatter.description ?? '',
        tags: frontmatter.tags ?? []
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }
})
