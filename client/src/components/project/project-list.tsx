import { ProjectItem } from '@pengode/components/project/project-item'

export function ProjectList() {
  return (
    <section className='mx-auto grid max-w-screen-xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <ProjectItem
        id={1}
        title='Pokemon Desk'
        author={{ name: 'Tubagus', photo: null }}
        summary='A pokemon who tried to find his father'
        image='https://tif.uad.ac.id/wp-content/uploads/deep-dark-web.jpg'
      />
      <ProjectItem
        id={1}
        title='Pokemon Desk'
        author={{ name: 'Tubagus', photo: null }}
        summary='A pokemon who tried to find his father'
        image='https://tif.uad.ac.id/wp-content/uploads/deep-dark-web.jpg'
      />
      <ProjectItem
        id={1}
        title='Pokemon Desk'
        author={{ name: 'Tubagus', photo: null }}
        summary='A pokemon who tried to find his father'
        image='https://tif.uad.ac.id/wp-content/uploads/deep-dark-web.jpg'
      />
      <ProjectItem
        id={1}
        title='Pokemon Desk'
        author={{ name: 'Tubagus', photo: null }}
        summary='A pokemon who tried to find his father'
        image='https://tif.uad.ac.id/wp-content/uploads/deep-dark-web.jpg'
      />
    </section>
  )
}
