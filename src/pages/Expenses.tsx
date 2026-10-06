import { useEffect, useMemo, useState } from 'react'
import { Filter, Pencil, Plus, Trash2 } from 'lucide-react'

import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'
import type { Expense } from '@/types'
import type { ExpenseFormData } from '@/schemas/expense'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExpenseAlerts from '@/components/alerts/ExpenseAlerts'
import ExpenseDialog from '@/components/modals/ExpenseDialog'
import ExpenseFiltersDialog from '@/components/modals/ExpenseFiltersDialog'
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

const ITEMS_PER_PAGE = 30

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR').format(
    new Date(`${value}T00:00:00`),
  )

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

const getExpenseMonthKey = (value: string) => {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return ''

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  const label = monthFormatter.format(new Date(year, month - 1, 1))

  return label.charAt(0).toUpperCase() + label.slice(1)
}

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

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null)
  const [deleteAllOpen, setDeleteAllOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

    const categoryById = useMemo(
      () => new Map(categories.map((category) => [category.id, category])),
      [categories],
    )

  const monthlyExpenseSummaries = useMemo(() => {
    const totals = new Map<string, { total: number; count: number }>()

    expenses.forEach((expense) => {
      const monthKey = getExpenseMonthKey(expense.data_gasto)
      if (!monthKey) return

      const current = totals.get(monthKey)

      totals.set(monthKey, {
        total: (current?.total ?? 0) + Number(expense.valor),
        count: (current?.count ?? 0) + 1,
      })
    })

    return Array.from(totals.entries())
      .sort(([firstMonth], [secondMonth]) => secondMonth.localeCompare(firstMonth))
      .map(([key, summary]) => ({
        key,
        label: formatMonthLabel(key),
        ...summary,
      }))
  }, [expenses])

  const totalExpenseValue = useMemo(
    () => expenses.reduce((total, expense) => total + Number(expense.valor), 0),
    [expenses],
  )

  const filteredExpenses = useMemo(
    () => expenses.filter((expense) => {
      const matchesMonth =
        selectedMonth === 'all' || getExpenseMonthKey(expense.data_gasto) === selectedMonth
      const matchesCategory =
        selectedCategoryId === 'all' || expense.categoria_id === selectedCategoryId
      const matchesPaymentStatus =
        selectedPaymentStatus === 'all' || expense.status_pagamento === selectedPaymentStatus

      return matchesMonth && matchesCategory && matchesPaymentStatus
    }),
    [expenses, selectedMonth, selectedCategoryId, selectedPaymentStatus],
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
    setExpenseDialogOpen(true)
  }

  const openEditDialog = (expense: Expense) => {
    if (isActionLoading) return

    setEditingExpense(expense)
    setExpenseDialogOpen(true)
  }

  const onExpenseSubmit = async (data: ExpenseFormData) => {
    if (!user || isActionLoading) return false

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
        setCurrentPage(1)
      }

      return success
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

  const handleMonthChange = (monthKey: string) => {
    setSelectedMonth(monthKey)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedMonth('all')
    setSelectedCategoryId('all')
    setSelectedPaymentStatus('all')
    setCurrentPage(1)
  }

  const hasActiveFilter =
    selectedMonth !== 'all' ||
    selectedCategoryId !== 'all' ||
    selectedPaymentStatus !== 'all'

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
            <Filter /> <span className="hidden md:inline">{hasActiveFilter ? 'Filtro ativo' : 'Filtrar'}</span>
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

      {expenses.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            className={`min-w-0 cursor-pointer transition-colors hover:ring-2 hover:ring-chateau-green-300 ${
              selectedMonth === 'all' ? 'ring-2 ring-chateau-green-400' : ''
            }`}
            role="button"
            tabIndex={0}
            aria-pressed={selectedMonth === 'all'}
            onClick={() => handleMonthChange('all')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleMonthChange('all')
              }
            }}
          >
            <CardHeader>
              <CardTitle className="text-base">Todos os meses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{formatCurrency(totalExpenseValue)}</p>
              <p className="text-sm text-muted-foreground">
                {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
              </p>
            </CardContent>
          </Card>

          {monthlyExpenseSummaries.map((month) => (
            <Card
              key={month.key}
              className={`min-w-0 cursor-pointer transition-colors hover:ring-2 hover:ring-chateau-green-300 ${
                selectedMonth === month.key ? 'ring-2 ring-chateau-green-400' : ''
              }`}
              role="button"
              tabIndex={0}
              aria-pressed={selectedMonth === month.key}
              onClick={() => handleMonthChange(month.key)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleMonthChange(month.key)
                }
              }}
            >
              <CardHeader>
                <CardTitle className="text-base">{month.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">{formatCurrency(month.total)}</p>
                <p className="text-sm text-muted-foreground">
                  {month.count} {month.count === 1 ? 'despesa' : 'despesas'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
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
              : 'Nenhuma despesa encontrada com os filtros selecionados.'}
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

      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={(open) => {
          setExpenseDialogOpen(open)
          if (!open) setEditingExpense(null)
        }}
        expense={editingExpense}
        categories={categories}
        isLoading={isLoading}
        isActionLoading={isActionLoading}
        onSubmit={onExpenseSubmit}
      />

      <ExpenseFiltersDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        selectedPaymentStatus={selectedPaymentStatus}
        hasActiveFilter={hasActiveFilter}
        isActionLoading={isActionLoading}
        onCategoryChange={handleCategoryFilterChange}
        onPaymentStatusChange={(status) => {
          setSelectedPaymentStatus(status)
          setCurrentPage(1)
        }}
        onClearFilters={clearFilters}
      />

      <ExpenseAlerts
        expenseToDelete={expenseToDelete}
        deleteAllOpen={deleteAllOpen}
        expenseCount={expenses.length}
        isActionLoading={isActionLoading}
        onExpenseDeleteOpenChange={(open) => {
          if (!open) setExpenseToDelete(null)
        }}
        onDeleteAllOpenChange={setDeleteAllOpen}
        onConfirmDelete={confirmDelete}
        onConfirmDeleteAll={confirmDeleteAll}
      />
    </section>
  )
}
