import { Check } from 'lucide-react'

type ExpenseSelectionCheckboxProps = {
  checked: boolean
  label: string
  onChange: () => void
}

export default function ExpenseSelectionCheckbox({
  checked,
  label,
  onChange,
}: ExpenseSelectionCheckboxProps) {
  return (
    <label className="absolute right-4 top-4 z-10 flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span
        aria-hidden="true"
        className={`flex size-5 items-center justify-center rounded-sm border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-chateau-green-300 ${
          checked
            ? 'border-chateau-green-400 bg-chateau-green-400'
            : 'border-border bg-card'
        }`}
      >
        {checked && <Check className="size-4 text-white" strokeWidth={3} />}
      </span>
    </label>
  )
}
