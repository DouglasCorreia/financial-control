import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { NumericFormat } from 'react-number-format'
import { Filter, Pencil, Plus, Trash2 } from 'lucide-react'

import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'
import type { Expense } from '@/types'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import GlobalLoading from '@/components/GlobalLoading'

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
    className: 'bg-corn-200 text-corn-700',
  },
  pago: {
    label: 'Pago',
    className: 'bg-chateau-green-200 text-chateau-green-700',
  },
  atrasado: {
    label: 'Atrasado',
    className: 'bg-mojo-200 text-red-700',
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

const ITEMS_PER_PAGE = 30

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
  const deleteAllExpenses = useFinancialStore((state) => state.deleteAllExpenses)
  const isLoading = useFinancialStore((state) => state.isLoading)
  const error = useFinancialStore((state) => state.error)

  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [deleteAllOpen, setDeleteAllOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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

  const filteredExpenses = useMemo(
    () =>
      selectedCategoryId === 'all'
        ? expenses
        : expenses.filter((expense) => expense.categoria_id === selectedCategoryId),
    [expenses, selectedCategoryId],
  )

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE)
  const activePage = totalPages === 0
    ? 1
    : Math.min(currentPage, totalPages)

  const visibleExpenses = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE

    return filteredExpenses.slice(start, start + ITEMS_PER_PAGE)
  }, [activePage, filteredExpenses])

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const pages: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [1]

    if (activePage > 4) {
      pages.push('ellipsis-left')
    }

    const firstVisiblePage = Math.max(2, activePage - 1)
    const lastVisiblePage = Math.min(totalPages - 1, activePage + 1)

    for (let page = firstVisiblePage; page <= lastVisiblePage; page += 1) {
      pages.push(page)
    }

    if (activePage < totalPages - 3) {
      pages.push('ellipsis-right')
    }

    pages.push(totalPages)

    return pages
  }, [activePage, totalPages])

  useEffect(() => {
    if (!user) return

    void loadCategories(user.id)
    void loadExpenses(user.id)
  }, [user, loadCategories, loadExpenses])

  const openCreateDialog = () => {
    if (isActionLoading) return

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

  const openEditDialog = (expense: Expense) => {
    if (isActionLoading) return

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

  const onSubmit = async (data: ExpenseFormData) => {
    if (!user || isActionLoading) return

    setIsActionLoading(true)

    try {
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

        if (!editingExpense) {
          setCurrentPage(1)
        }
      }
    } finally {
      setIsActionLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!expenseToDelete || isActionLoading) return

    setIsActionLoading(true)

    try {
      const success = await deleteExpense(expenseToDelete.id)

      if (success) {
        setExpenseToDelete(null)
      }
    } finally {
      setIsActionLoading(false)
    }
  }

  const confirmDeleteAll = async () => {
    if (!user || isActionLoading) return

    setIsActionLoading(true)

    try {
      const success = await deleteAllExpenses(user.id)

      if (success) {
        setDeleteAllOpen(false)
        setCurrentPage(1)
      }
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCategoryFilterChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setCurrentPage(1)
  }

  const clearCategoryFilter = () => {
    handleCategoryFilterChange('all')
  }

  if (isLoading) {
    return <GlobalLoading />
  }

  return (
    <section className="w-full">
      <div className="sm:flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Despesas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas despesas e seus pagamentos.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-end md:justify-center gap-2">
          <Button
            className="btn-danger-w-max"
            type="button"
            variant="destructive"
            disabled={expenses.length === 0 || isLoading || isActionLoading}
            onClick={() => setDeleteAllOpen(true)}
          >
            <Trash2 /> <span className="hidden md:inline">Excluir todas</span>
          </Button>

          <Button
            className="w-max btn-edit-w-max"
            type="button"
            disabled={isLoading || isActionLoading}
            onClick={() => setFilterOpen(true)}
          >
            <Filter /> <span className="hidden md:inline">{selectedCategoryId === 'all' ? 'Filtrar' : 'Filtro ativo'}</span>
          </Button>

          <Button
            className="btn-ok-w-max"
            type="button"
            onClick={openCreateDialog}
            disabled={isLoading || isActionLoading}
          >
            <Plus /> <span className="hidden md:inline">Despesa</span>
          </Button>
        </div>
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

      {!isLoading && filteredExpenses.length === 0 && (
        <Card className="mt-4">
          <CardContent className="text-center text-muted-foreground">
            {expenses.length === 0
              ? 'Nenhuma despesa cadastrada.'
              : 'Nenhuma despesa encontrada para esta categoria.'}
          </CardContent>
        </Card>
      )}

      <div
        className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 ${filteredExpenses.length > 0 ? 'mt-4' : 'mt-0' }`}
      >
        {visibleExpenses.map((expense) => {
          const category = expense.categoria_id
            ? categoryById.get(expense.categoria_id)
            : undefined
          const paymentStatus = paymentStatusStyles[expense.status_pagamento] ?? {
            label: expense.status_pagamento,
            className: 'bg-gray-100 text-gray-800',
          }

          return (
            <Card key={expense.id} className="justify-start">
              <CardHeader className="flex flex-wrap flex-row items-start justify-between gap-4 space-y-0">
                <div className="w-full">
                  <div className='w-full md:w-[60%] flex flex-wrap max-sm:flex-col items-start md:items-center gap-2'>
                    <span
                      className={`block w-fit items-center rounded-md px-2.5 py-1 text-xs font-normal ${paymentStatus.className}`}
                    >
                      {paymentStatus.label}
                    </span>

                    <span className="block w-fit items-center rounded-md px-2.5 py-1 text-xs font-normal bg-lochmara-300 text-white">
                      {formatDate(expense.data_gasto)}
                    </span>

                    <span className="block w-fit items-center rounded-md px-2.5 py-1 text-xs font-normal bg-gray-400 text-white">
                      {category?.nome ?? 'Sem categoria'}
                    </span>
                  </div>

                  <CardTitle className="font-bold text-lg my-4 leading-none">{expense.nome}</CardTitle>

                  <p className="text-lg font-bold leading-none m-0">
                    {formatCurrency(expense.valor)}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {expense.descricao && (
                  <p className="text-xs text-muted-foreground">
                    {expense.descricao}
                  </p>
                )}

                <div className="w-full grid grid-cols-2 gap-4">
                  <Button
                    className="col-span-1 btn-edit"
                    type="button"
                    onClick={() => openEditDialog(expense)}
                    disabled={isLoading || isActionLoading}
                    aria-label={`Editar ${expense.nome}`}
                  >
                    <Pencil />
                  </Button>

                  <Button
                    className="col-span-1 btn-danger"
                    type="button"
                    onClick={() => setExpenseToDelete(expense)}
                    disabled={isLoading || isActionLoading}
                    aria-label={`Excluir ${expense.nome}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            Mostrando {(activePage - 1) * ITEMS_PER_PAGE + 1} a{' '}
            {Math.min(activePage * ITEMS_PER_PAGE, filteredExpenses.length)} de{' '}
            {filteredExpenses.length} despesas
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  type="button"
                  className="text-chateau-green-500 hover:text-chateau-green-600 cursor-pointer"
                  disabled={activePage === 1 || isActionLoading}
                  onClick={() => setCurrentPage(activePage - 1)}
                />
              </PaginationItem>

              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  {typeof page === 'number' ? (
                    <PaginationLink
                      type="button"
                      className="text-chateau-green-400 hover:text-chateau-green-500 border-chateau-green-500 bg-transparent cursor-pointer"
                      isActive={page === activePage}
                      disabled={isActionLoading}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Ir para a página ${page}`}
                    >
                      {page}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  type="button"
                  className="text-chateau-green-500 hover:text-chateau-green-600 cursor-pointer"
                  disabled={activePage === totalPages || isActionLoading}
                  onClick={() => setCurrentPage(activePage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
              <Label htmlFor="nome">* Nome</Label>

              <Input
                className="input"
                id="nome"
                {...form.register('nome')}
              />
              
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria_id">* Categoria</Label>

              <select
                id="categoria_id"
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
              <Label htmlFor="valor">* Valor</Label>
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
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <Label htmlFor="data_gasto">* Data do gasto</Label>

                <Input
                  className="input block w-full min-w-0 max-w-full"
                  id="data_gasto"
                  type="date"
                  {...form.register('data_gasto')}
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-2">
                <Label htmlFor="status_pagamento">Status</Label>
                <select
                  id="status_pagamento"
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
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                {...form.register('descricao')}
              />
            </div>

            <DialogFooter className="flex justify-end gap-4 flex-row max-xs:justify-center bg-transparent border-0">
              <Button
                type="button"
                onClick={() => setFormOpen(false)}
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

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="left-auto right-0 top-0 h-dvh rounded-none w-full max-w-sm translate-x-0 translate-y-0 overflow-y-auto sm:max-w-sm block">
          <DialogHeader>
            <DialogTitle>Filtrar despesas</DialogTitle>
            
            <DialogDescription>
              Selecione a categoria das despesas que deseja visualizar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 my-4">
            <Label htmlFor="category-filter">Categoria</Label>

            <select
              id="category-filter"
              className="h-9 w-full rounded-2xl border border-input bg-background px-3 text-sm"
              value={selectedCategoryId}
              onChange={(event) => handleCategoryFilterChange(event.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 bg-transparent border-0">
            <Button
              type="button"
              className="btn-edit-w-max"
              onClick={clearCategoryFilter}
              disabled={selectedCategoryId === 'all' || isActionLoading}
            >
              Limpar filtro
            </Button>

            <Button
              type="button"
              className="btn-ok-w-max"
              onClick={() => setFilterOpen(false)}
            >
              Aplicar
            </Button>
          </DialogFooter>
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

          <AlertDialogFooter className="flex justify-end gap-4 flex-row max-xs:justify-center bg-transparent border-0">
            <AlertDialogCancel className="btn-cancel-w-max" disabled={isActionLoading}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              className="btn-danger-w-max"
              onClick={() => void confirmDelete()}
              disabled={isActionLoading}
            >
              {isActionLoading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteAllOpen}
        onOpenChange={setDeleteAllOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir todas as despesas?
            </AlertDialogTitle>
            <AlertDialogDescription>
              As {expenses.length} despesas serão excluídas permanentemente.
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex justify-end gap-4 flex-row max-xs:justify-center bg-transparent border-0">
            <AlertDialogCancel className="btn-cancel-w-max" disabled={isActionLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn-danger-w-max"
              onClick={() => void confirmDeleteAll()}
              disabled={isActionLoading}
            >
              {isActionLoading ? 'Excluindo...' : 'Excluir todas'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
