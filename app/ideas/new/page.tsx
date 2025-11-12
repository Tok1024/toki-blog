import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import AddIdeaForm from '@/components/AddIdeaForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Idea',
  description: 'Add a new idea',
}

export default function Page() {
  return (
    <SectionContainer>
      <div className="py-12">
        <PageTitle>添加想法</PageTitle>
        <div className="mt-6">
          <AddIdeaForm />
        </div>
      </div>
    </SectionContainer>
  )
}
