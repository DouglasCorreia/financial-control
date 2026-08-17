import { useEffect, useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ReceiptText, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GlobalLoading from '@/components/GlobalLoading'

const monthNames = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const formatCurrency = (value: number) => currencyFormatter.format(value)

const chartColors = ['#16a34a', '#eab308', '#ef4444']

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)

  const salary = useFinancialStore((state) => state.salary)
  const categories = useFinancialStore((state) => state.categories)
  const expenses = useFinancialStore((state) => state.expenses)
  const loadSalary = useFinancialStore((state) => state.loadSalary)
  const loadCategories = useFinancialStore((state) => state.loadCategories)
  const loadExpenses = useFinancialStore((state) => state.loadExpenses)
  const isLoading = useFinancialStore((state) => state.isLoading)
  const error = useFinancialStore((state) => state.error)

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    if (!user) return

    void Promise.all([
      loadSalary(user.id),
      loadCategories(user.id),
      loadExpenses(user.id),
    ])
  }, [user, loadSalary, loadCategories, loadExpenses])

  const salaryValue = Number(salary?.valor ?? 0)

  const currentMonthExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const date = new Date(`${expense.data_gasto}T00:00:00`)

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        )
      }),
    [expenses, currentMonth, currentYear],
  )

  const totalSpent = useMemo(
    () =>
      currentMonthExpenses.reduce(
        (total, expense) => total + Number(expense.valor),
        0,
      ),
    [currentMonthExpenses],
  )

  const remaining = salaryValue - totalSpent

  const categoryExpenses = useMemo(() => {
    const categoryById = new Map(
      categories.map((category) => [category.id, category]),
    )
    const totals = new Map<
      string,
      { name: string; value: number; color: string }
    >()

    currentMonthExpenses.forEach((expense) => {
      const category = expense.categoria_id
        ? categoryById.get(expense.categoria_id)
        : undefined
      const key = category?.id ?? 'without-category'
      const current = totals.get(key)

      totals.set(key, {
        name: category?.nome ?? 'Sem categoria',
        value: (current?.value ?? 0) + Number(expense.valor),
        color: category?.cor ?? '#94a3b8',
      })
    })

    return Array.from(totals.values()).sort((a, b) => b.value - a.value)
  }, [categories, currentMonthExpenses])

  const pieData = useMemo(() => {
    const available = Math.max(remaining, 0)
    const exceeded = Math.max(-remaining, 0)

    return [
      { name: 'Gasto', value: totalSpent },
      ...(available > 0
        ? [{ name: 'Disponível', value: available }]
        : []),
      ...(exceeded > 0
        ? [{ name: 'Excedido', value: exceeded }]
        : []),
    ]
  }, [remaining, totalSpent])

  const monthlyExpenses = useMemo(() => {
    const totals = Array.from({ length: 12 }, (_, month) => ({
      month: monthNames[month],
      currentYear: 0,
    }))

    expenses.forEach((expense) => {
      const date = new Date(`${expense.data_gasto}T00:00:00`)

      if (date.getFullYear() === currentYear) {
        totals[date.getMonth()].currentYear += Number(expense.valor)
      }
    })

    return totals
  }, [expenses, currentYear])

  if (isLoading && expenses.length === 0 && !salary) {
    return <GlobalLoading />
  }

  return (
    <section className="w-full max-w-7xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Visão geral</h1>
        <p className="text-muted-foreground">
          Acompanhe sua vida financeira neste mês.
        </p>
      </header>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Salário do mês

              <Link
                to="/budget"
                aria-label="Abrir página de salário"
                className="bg-blue-400 text-white size-8 flex items-center justify-center rounded-sm"
              >
                <WalletCards className="size-4" />
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative">
            <p className="text-2xl font-bold">
              {formatCurrency(salaryValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total gasto no mês

              <Link
                to="/expenses"
                aria-label="Abrir página de despesas"
                className="bg-blue-400 text-white size-8 flex items-center justify-center rounded-sm"
              >
                <ReceiptText className="size-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold text-mojo-600">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                remaining >= 0 ? 'text-chateau-green-600' : 'text-mojo-600'
              }`}
            >
              {formatCurrency(remaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-full min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Gastos por categoria</CardTitle>

            <p className="text-sm text-muted-foreground">
              Distribuição dos gastos deste mes por categoria.
            </p>
          </CardHeader>
          
          <CardContent className="min-w-0 overflow-hidden">
            {categoryExpenses.length === 0 ? (
              <p className="py-20 text-center text-muted-foreground">
                Nenhum gasto categorizado neste mes.
              </p>
            ) : (
              <div className="grid min-w-0 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)] md:items-center">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryExpenses}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                      >
                        {categoryExpenses.map((category) => (
                          <Cell
                            key={category.name}
                            fill={category.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="min-w-0 space-y-3">
                  {categoryExpenses.map((category) => (
                    <div
                      key={category.name}
                      className="flex min-w-0 w-full items-center justify-between gap-2 border-b pb-3 last:border-0"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="truncate text-sm text-muted-foreground">
                          {category.name}
                        </span>
                      </div>
                      <strong className="shrink-0 whitespace-nowrap text-sm">
                        {formatCurrency(category.value)}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="card-full">
          <CardHeader>
            <CardTitle>Salário x gastos</CardTitle>
          </CardHeader>

          <CardContent>
            {salaryValue === 0 && totalSpent === 0 ? (
              <p className="py-20 text-center text-muted-foreground">
                Cadastre seu salário e suas despesas para visualizar o gráfico.
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {pieData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-full">
          <CardHeader>
            <CardTitle>Gastos por mês</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${value}`} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="currentYear"
                    name={String(currentYear)}
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
