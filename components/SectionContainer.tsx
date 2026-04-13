import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">{children}</div>
}
