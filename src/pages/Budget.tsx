import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const salarySchema = z.object({
  valor: z.number().positive('Informe um salário maior que zero'),
})

type SalaryFormData = z.infer<typeof salarySchema>

export default function Budget(){
    const user = useAuthStore((state) => state.user)

    const salary = useFinancialStore((state) => state.salary)
    const loadSalary = useFinancialStore((state) => state.loadSalary)
    const saveSalary = useFinancialStore((state) => state.saveSalary)
    const isLoading = useFinancialStore((state) => state.isLoading)
    const error = useFinancialStore((state) => state.error)

    const [salaryMessage, setSalaryMessage] = useState('')  
    const [isActionLoading, setIsActionLoading] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SalaryFormData>({
        resolver: zodResolver(salarySchema),
        defaultValues: {
            valor: salary?.valor ?? 0,
        },
    })

    useEffect(() => {
        if (user) {
            loadSalary(user.id)
        }
    }, [user, loadSalary])

    useEffect(() => {
        reset({
        valor: salary?.valor ?? 0,
        })
    }, [salary, reset])

    const onSubmit = async (data: SalaryFormData) => {
        setIsActionLoading(true)

        if (!user) return

        try{
            await saveSalary(user.id, data.valor)

            setSalaryMessage('Salário atualizado com sucesso')

            setTimeout(() => {
                setSalaryMessage('')
            }, 3000)

        } finally{
            setIsActionLoading(false)
        }
    }

    return (
        <>
            <div className="w-full max-w-2xl">
                <Card className="card-full">
                    <CardHeader>
                        <CardTitle>Meu salário mensal</CardTitle>

                        <CardDescription>
                            Atualize ou adicione seu salário.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="salario">Valor do salário</Label>

                                <Controller
                                    name="valor"
                                    control={control}
                                    render={({ field }) => (
                                        <NumericFormat
                                            className="input"
                                            customInput={Input} 
                                            getInputRef={field.ref}
                                            value={field.value ?? ''}
                                            onValueChange={(values) => {
                                                field.onChange(values.floatValue)
                                            }}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            prefix="R$ "
                                            decimalScale={2}
                                            fixedDecimalScale
                                            allowNegative={false}
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="R$ 0,00"
                                            aria-invalid={Boolean(errors.valor)}
                                        />
                                    )}
                                />

                                {errors.valor && (
                                    <p className="text-sm text-destructive">
                                        {errors.valor.message}
                                    </p>
                                )}
                            </div>

                            {error && (
                                <p className="text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            {salaryMessage && (
                                <p className="text-sm text-center text-green-500 space-y-2 bg-green-100 p-2 rounded-2xl">
                                    {salaryMessage}
                                </p>
                            )}

                            <Button className="btn-ok-w-max" type="submit" disabled={isLoading || isActionLoading}>
                                {isActionLoading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}