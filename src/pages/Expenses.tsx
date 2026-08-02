import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NumericFormat } from 'react-number-format'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'
import type { Expense } from '@/types'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const paymentStatuses = [
  { value: 'a_pagar', label: 'A Pagar' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
] as const

const paymentStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  a_pagar: {
    label: 'A pagar',
    className: 'bg-yellow-100 text-yellow-800',
  },
  pago: {
    label: 'Pago',
    className: 'bg-green-100 text-green-800',
  },
  atrasado: {
    label: 'Atrasado',
    className: 'bg-red-100 text-red-800',
  },
}

const expenseSchema = z.object({
  nome: z.string().min(2, 'Informe o nome da despesa'),
  descricao: z.string().max(500, 'A descrição é muito longa'),
  valor: z.number().positive('Informe um valor maior que zero'),
  data_gasto: z.string().min(1, 'Informe a data do gasto'),
  categoria_id: z.string().min(1, 'Selecione uma categoria'),
  status_pagamento: z.enum(['a_pagar', 'pago', 'atrasado']),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

const today = () => new Date().toISOString().slice(0, 10)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR').format(
    new Date(`${value}T00:00:00`),
  )

export default function Expenses() {
  const user = useAuthStore((state) => state.user)

  const categories = useFinancialStore((state) => state.categories)
  const expenses = useFinancialStore((state) => state.expenses)
  const loadCategories = useFinancialStore((state) => state.loadCategories)
  const loadExpenses = useFinancialStore((state) => state.loadExpenses)
  const createExpense = useFinancialStore((state) => state.createExpense)
  const updateExpense = useFinancialStore((state) => state.updateExpense)
  const deleteExpense = useFinancialStore((state) => state.deleteExpense)
  const isLoading = useFinancialStore((state) => state.isLoading)
  const error = useFinancialStore((state) => state.error)

  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      valor: 0,
      data_gasto: today(),
      categoria_id: '',
      status_pagamento: 'a_pagar',
    },
  })

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories],
  )

  useEffect(() => {
    if (!user) return

    void loadCategories(user.id)
    void loadExpenses(user.id)
  }, [user, loadCategories, loadExpenses])

  function openCreateDialog() {
    setEditingExpense(null)
    form.reset({
      nome: '',
      descricao: '',
      valor: 0,
      data_gasto: today(),
      categoria_id: '',
      status_pagamento: 'a_pagar',
    })
    setFormOpen(true)
  }

  function openEditDialog(expense: Expense) {
    setEditingExpense(expense)
    form.reset({
      nome: expense.nome,
      descricao: expense.descricao ?? '',
      valor: expense.valor,
      data_gasto: expense.data_gasto,
      categoria_id: expense.categoria_id ?? '',
      status_pagamento: expense.status_pagamento as ExpenseFormData['status_pagamento'],
    })
    setFormOpen(true)
  }

  async function onSubmit(data: ExpenseFormData) {
    if (!user) return

    const payload = {
      ...data,
      descricao: data.descricao.trim() || null,
    }

    const success = editingExpense
      ? await updateExpense(editingExpense.id, payload)
      : await createExpense(user.id, payload)

    if (success) {
      setFormOpen(false)
      form.reset()
    }
  }

  async function confirmDelete() {
    if (!expenseToDelete) return

    const success = await deleteExpense(expenseToDelete.id)

    if (success) {
      setExpenseToDelete(null)
    }
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Despesas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas despesas e seus pagamentos.
          </p>
        </div>

        <Button className="btn-ok-w-max" type="button" onClick={openCreateDialog}>
            <Plus /> Despesa
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {isLoading && expenses.length === 0 && (
        <Card className="mt-4">
            <CardContent className="text-center text-muted-foreground">
                Carregando despesas...
            </CardContent>
        </Card>
      )}

      {!isLoading && expenses.length === 0 && (
        <Card className="mt-4">
          <CardContent className="text-center text-muted-foreground">
            Nenhuma despesa cadastrada.
          </CardContent>
        </Card>
      )}

      <div
        className={`grid gap-4 md:grid-cols-2 ${expenses.length > 0 ? 'mt-4' : 'mt-0' }`}
    >
        {expenses.map((expense) => {
          const category = expense.categoria_id
            ? categoryById.get(expense.categoria_id)
            : undefined
          const paymentStatus = paymentStatusStyles[expense.status_pagamento] ?? {
            label: expense.status_pagamento,
            className: 'bg-gray-100 text-gray-800',
          }

          return (
            <Card key={expense.id}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle>{expense.nome}</CardTitle>
                  <CardDescription>
                    {category?.nome ?? 'Sem categoria'} · {formatDate(expense.data_gasto)}
                  </CardDescription>
                </div>

                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => openEditDialog(expense)}
                    aria-label={`Editar ${expense.nome}`}
                  >
                    <Pencil />
                  </Button>

                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setExpenseToDelete(expense)}
                    aria-label={`Excluir ${expense.nome}`}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-2xl font-bold">
                  {formatCurrency(expense.valor)}
                </p>

                <span
                  className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatus.className}`}
                >
                  {paymentStatus.label}
                </span>

                {expense.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {expense.descricao}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? 'Editar despesa' : 'Nova despesa'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da despesa.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" {...form.register('nome')} />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria_id">Categoria</Label>
              <select
                id="categoria_id"
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
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
              <Label htmlFor="valor">Valor</Label>
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
              <div className="space-y-2">
                <Label htmlFor="data_gasto">Data do gasto</Label>
                <Input
                  id="data_gasto"
                  type="date"
                  {...form.register('data_gasto')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status_pagamento">Status</Label>
                <select
                  id="status_pagamento"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
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
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                {...form.register('descricao')}
              />
            </div>

            <DialogFooter className="bg-transparent border-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="btn-cancel-w-max"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-ok-w-max"
            >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={expenseToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setExpenseToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription>
              A despesa "{expenseToDelete?.nome}" será excluída. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="bg-transparent border-0">
            <AlertDialogCancel className="btn-cancel-w-max">Cancelar</AlertDialogCancel>

            <AlertDialogAction
              className="btn-danger-w-max"
              onClick={() => void confirmDelete()}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
