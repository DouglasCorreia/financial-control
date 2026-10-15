import { LayoutGrid, List } from 'lucide-react'

import { Button } from '@/components/ui/button'

export type ExpenseView = 'cards' | 'list'

type ExpenseViewToggleProps = {
  value: ExpenseView
  onChange: (value: ExpenseView) => void
}

export default function ExpenseViewToggle({ value, onChange }: ExpenseViewToggleProps) {
  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card p-1" aria-label="Modo de visualização">
      <Button
        type="button"
        variant={value === 'cards' ? 'secondary' : 'ghost'}
        size="icon"
        aria-label="Visualização em cartões"
        aria-pressed={value === 'cards'}
        onClick={() => onChange('cards')}
      >
        <LayoutGrid aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant={value === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        aria-label="Visualização em lista"
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
      >
        <List aria-hidden="true" />
      </Button>
    </div>
  )
}
