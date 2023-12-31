import { ProjectBody } from '@pengode/components/project/project-body'
import { ProjectHeader } from '@pengode/components/project/project-header'
import { ProjectPreview } from '@pengode/components/project/project-swiper'

export interface ProjectDetailProps {
  params: {
    id: number
  }
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
  return (
    <main className='flex min-h-screen flex-col py-16'>
      <ProjectHeader
        author={{ name: 'John', photo: null }}
        title='Pokemon Deck'
      />
      <ProjectPreview
        previews={[
          {
            image:
              'https://cdn.dribbble.com/userupload/11571183/file/original-d29010993be204d3a35a57af8458524c.png?resize=1595x1200',
            title: 'Dashboard',
          },
          {
            image:
              'https://cdn.dribbble.com/userupload/11571183/file/original-d29010993be204d3a35a57af8458524c.png?resize=1595x1200',
            title: 'Dashboard',
          },
        ]}
      />
      <ProjectBody body='Hello' />
    </main>
  )
}
