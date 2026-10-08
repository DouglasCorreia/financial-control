import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NumericFormat } from 'react-number-format'

import type { Category, Expense } from '@/types'

import { expenseSchema, paymentStatuses, type ExpenseFormData } from '@/schemas/expense'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ExpenseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense?: Expense | null
  initialExpense?: Expense | null
  categories: Category[]
  isLoading: boolean
  isActionLoading: boolean
  onSubmit: (data: ExpenseFormData) => Promise<boolean>
}

const getToday = () => new Date().toISOString().slice(0, 10)

const getDefaultValues = (expense?: Expense | null): ExpenseFormData => ({
  nome: expense?.nome ?? '',
  descricao: expense?.descricao ?? '',
  valor: expense?.valor ?? 0,
  data_gasto: expense?.data_gasto ?? getToday(),
  categoria_id: expense?.categoria_id ?? '',
  status_pagamento:
    (expense?.status_pagamento as ExpenseFormData['status_pagamento']) ?? 'a_pagar',
})

export default function ExpenseDialog({
  open,
  onOpenChange,
  expense,
  initialExpense,
  categories,
  isLoading,
  isActionLoading,
  onSubmit,
}: ExpenseDialogProps) {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: getDefaultValues(expense ?? initialExpense),
  })
  const { reset } = form
  const isEditing = Boolean(expense)

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(expense ?? initialExpense))
    }
  }, [expense, initialExpense, open, reset])

  const handleOpenChange = (nextOpen: boolean) => {
    if (isActionLoading) return

    if (!nextOpen) {
      reset(getDefaultValues())
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async (data: ExpenseFormData) => {
    const success = await onSubmit(data)

    if (success) {
      reset(getDefaultValues())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar despesa' : 'Nova despesa'}</DialogTitle>
          <DialogDescription>
            Preencha os dados da despesa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-name">* Nome</Label>
            <Input
              className="input"
              id="expense-name"
              {...form.register('nome')}
            />
            {form.formState.errors.nome && (
              <p className="text-sm text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-category">* Categoria</Label>
            <select
              id="expense-category"
              className="h-9 w-full rounded-2xl border border-input bg-background px-3 text-sm"
              {...form.register('categoria_id')}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
            {form.formState.errors.categoria_id && (
              <p className="text-sm text-destructive">
                {form.formState.errors.categoria_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-value">* Valor</Label>
            <Controller
              name="valor"
              control={form.control}
              render={({ field }) => (
                <NumericFormat
                  customInput={Input}
                  getInputRef={field.ref}
                  value={field.value || ''}
                  onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  type="text"
                  inputMode="decimal"
                  placeholder="R$ 0,00"
                  className="input"
                  id="expense-value"
                />
              )}
            />
            {form.formState.errors.valor && (
              <p className="text-sm text-destructive">
                {form.formState.errors.valor.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-2 space-y-2 sm:col-span-1">
              <Label htmlFor="expense-date">* Data do gasto</Label>
              <Input
                className="input block w-full min-w-0 max-w-full"
                id="expense-date"
                type="date"
                {...form.register('data_gasto')}
              />
              {form.formState.errors.data_gasto && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.data_gasto.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-2 sm:col-span-1">
              <Label htmlFor="expense-status">Status</Label>
              <select
                id="expense-status"
                className="h-9 w-full rounded-2xl border border-input bg-background px-3 text-sm"
                {...form.register('status_pagamento')}
              >
                {paymentStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description">Descrição</Label>
            <textarea
              id="expense-description"
              className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              {...form.register('descricao')}
            />
            {form.formState.errors.descricao && (
              <p className="text-sm text-destructive">
                {form.formState.errors.descricao.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex-row justify-end gap-4 border-0 bg-transparent max-xs:justify-center">
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isActionLoading}
              className="btn-cancel-w-max"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isActionLoading}
              className="btn-ok-w-max"
            >
              {isLoading || isActionLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}





