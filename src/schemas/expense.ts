import { z } from 'zod'

export const expenseSchema = z.object({
  nome: z.string().min(2, 'Informe o nome da despesa'),
  descricao: z.string().max(500, 'A descrição é muito longa'),
  valor: z.number().positive('Informe um valor maior que zero'),
  data_gasto: z.string().min(1, 'Informe a data do gasto'),
  categoria_id: z.string().min(1, 'Selecione uma categoria'),
  status_pagamento: z.enum(['a_pagar', 'pago', 'atrasado']),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>

export const paymentStatuses = [
  { value: 'a_pagar', label: 'A Pagar' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
] as const
