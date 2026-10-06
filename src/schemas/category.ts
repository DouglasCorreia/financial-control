import { z } from 'zod'

export const categorySchema = z.object({
  nome: z.string().min(2, 'Informe o nome da categoria'),
  cor: z.string().min(1, 'Escolha uma cor'),
})

export type CategoryFormData = z.infer<typeof categorySchema>
