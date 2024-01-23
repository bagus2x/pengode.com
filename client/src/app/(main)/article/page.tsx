import { ArticleList } from '@pengode/components/article/article-list'
import { MotionMain } from '@pengode/components/ui/motion'
import { getArticles } from '@pengode/data/article'

export default async function BlogPage() {
  const articles = await getArticles({
    size: 20,
    search: '',
  })

  return (
    <MotionMain
      className='min-h-screen py-16'
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}>
      <ArticleList articles={articles} />
    </MotionMain>
  )
}
