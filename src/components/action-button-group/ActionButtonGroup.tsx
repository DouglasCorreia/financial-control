import type { ReactNode } from 'react'

type ActionButtonGroupProps = {
  children: ReactNode
}

export default function ActionButtonGroup({ children }: ActionButtonGroupProps) {
  return (
    <div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-end md:justify-center gap-2">
      {children}
    </div>
  )
}
