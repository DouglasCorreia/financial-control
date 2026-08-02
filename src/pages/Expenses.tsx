import { useFinancialStore } from '@/stores/useFinancialStore'

import { Button } from '@/components/ui/button'

import { Plus } from 'lucide-react';

export default function Expenses() {
    const expenses = useFinancialStore((state) => state.expenses)

    return(
        <>
            <h1 className="text-2xl uppercase font-bold text-center mb-8">Despesas</h1>

            {
                expenses.length === 0 && (
                    <p className="mb-4">Nenhuma despesa cadastrada</p>
                )
            }

            <div className="flex flex-wrap w-full justify-end">
                <Button className="btn-ok-w-max" type="button">
                    <Plus /> Despesa
                </Button>
            </div>
        </>
    )
}