import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-4xl leading-[1.32] font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl md:text-[3.35rem] dark:text-gray-100">
      {children}
    </h1>
  )
}
