import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

import { getArticle } from '@pengode/data/article'
import {
  GoogleLogin,
  GoogleOAuthProvider,
} from '@pengode/components/google-oauth'
import { env } from '@pengode/common/utils'
import { CommentList } from '@pengode/components/article/comment-list'

export interface ProjectDetailProps {
  params: {
    id: number
  }
}

export default async function ArticleDetail({ params }: ProjectDetailProps) {
  const article = await getArticle(params.id)

  return (
    <main className='mx-auto flex min-h-screen flex-col p-4 py-16'>
      <section className='prose mx-auto mb-4 w-full max-w-screen-xl'>
        <MDXRemote
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode as any, { theme: 'one-dark-pro' }],
              ],
            },
          }}
          source={article.body}
        />
      </section>
      <GoogleOAuthProvider clientId={env('GOOGLE_ID')}>
        <CommentList className='px-4' />
      </GoogleOAuthProvider>
    </main>
  )
}
