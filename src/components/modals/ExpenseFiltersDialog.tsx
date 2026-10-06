import type { Category } from '@/types'

import { paymentStatuses } from '@/schemas/expense'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type ExpenseFiltersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  selectedCategoryId: string
  selectedPaymentStatus: string
  hasActiveFilter: boolean
  isActionLoading: boolean
  onCategoryChange: (categoryId: string) => void
  onPaymentStatusChange: (status: string) => void
  onClearFilters: () => void
}

export default function ExpenseFiltersDialog({
  open,
  onOpenChange,
  categories,
  selectedCategoryId,
  selectedPaymentStatus,
  hasActiveFilter,
  isActionLoading,
  onCategoryChange,
  onPaymentStatusChange,
  onClearFilters,
}: ExpenseFiltersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 block h-dvh w-full max-w-sm translate-x-0 translate-y-0 overflow-y-auto rounded-none sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Filtrar despesas</DialogTitle>
          <DialogDescription>
            Selecione a categoria e o status das despesas que deseja visualizar.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <Label htmlFor="category-filter">Categoria</Label>
          <select
            id="category-filter"
            className="h-9 w-full rounded-2xl border border-input bg-background px-3 text-sm"
            value={selectedCategoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="my-4 space-y-2">
          <Label htmlFor="payment-status-filter">Status do pagamento</Label>
          <select
            id="payment-status-filter"
            className="h-9 w-full rounded-2xl border border-input bg-background px-3 text-sm"
            value={selectedPaymentStatus}
            onChange={(event) => onPaymentStatusChange(event.target.value)}
          >
            <option value="all">Todos os status</option>
            {paymentStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-0 bg-transparent">
          <Button
            type="button"
            className="btn-edit-w-max"
            onClick={onClearFilters}
            disabled={!hasActiveFilter || isActionLoading}
          >
            Limpar filtro
          </Button>
          <Button
            type="button"
            className="btn-ok-w-max"
            onClick={() => onOpenChange(false)}
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
