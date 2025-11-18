import React from 'react'

interface CodeProps {
  children: React.ReactNode
  className?: string
}

export default function Code({ children, className }: CodeProps) {
  // 如果有className，说明是代码块，使用默认处理
  if (className) {
    return <code className={className}>{children}</code>
  }

  // 如果没有className，说明是内联代码，使用特殊样式
  return (
    <code className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      {children}
    </code>
  )
}
