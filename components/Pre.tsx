'use client'

import { ReactNode, useRef } from 'react'
import CopyButton from './CopyButton'

export default function Pre({ children, ...props }: { children: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null)

  return (
    <div className="group relative">
      <CopyButton codeRef={preRef} />
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}
