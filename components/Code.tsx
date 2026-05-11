import React from 'react'

interface CodeProps {
  children: React.ReactNode
  className?: string
}

export default function Code({ children, className }: CodeProps) {
  return <code className={className}>{children}</code>
}
