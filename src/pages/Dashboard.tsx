import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function Dashboard() {
    const user = useAuthStore((state) => state.user)

    const expenses = useFinancialStore((state) => state.expenses)
    const loadExpenses = useFinancialStore((state) => state.loadExpenses)
    const isLoading = useAuthStore((state) => state.isLoading)

    useEffect(() => {
        if (user) {
            loadExpenses(user.id)
        }

    }, [user, loadExpenses])

    return (
        <>
            {isLoading ? (
                <div className="flex min-h-screen items-center justify-center">
                    <LoaderCircle className="h-12 w-12 animate-spin text-green-300" />
                </div>
            ) : (
                expenses.map((expense: { id: string; nome: string; valor: number }) => (
                    <div key={expense.id}>
                        <strong>{expense.nome}</strong>
                        <span>R$ {expense.valor}</span>
                    </div>
                ))
            )}
        </>
    )
}