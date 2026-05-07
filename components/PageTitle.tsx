import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-[2.45rem] leading-[1.24] font-medium tracking-[-0.03em] text-gray-950 sm:text-[3rem] md:text-[3.2rem] dark:text-gray-100">
      {children}
    </h1>
  )
}
