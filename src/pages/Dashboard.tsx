import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'
import { useEffect } from 'react'

export default function Dashboard() {
    const user = useAuthStore((state) => state.user)

    const expenses = useFinancialStore((state) => state.expenses)
    const loadExpenses = useFinancialStore((state) => state.loadExpenses)

    useEffect(() => {
        if (user) {
            loadExpenses(user.id)
        }

    }, [user, loadExpenses])

    return (
        <>
            {expenses.map((expense: { id: string; nome: string; valor: number }) => (
                <div key={expense.id}>
                    <strong>{expense.nome}</strong>
                    <span>R$ {expense.valor}</span>
                </div>
            ))}
        </>
    )
}