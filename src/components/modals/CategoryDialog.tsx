import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import type { Category } from '@/types'

import { categorySchema, type CategoryFormData } from '@/schemas/category'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  isLoading: boolean
  isActionLoading: boolean
  onSubmit: (data: CategoryFormData) => Promise<boolean>
}

const getDefaultValues = (category?: Category | null): CategoryFormData => ({
  nome: category?.nome ?? '',
  cor: category?.cor ?? '#22c55e',
})

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  isLoading,
  isActionLoading,
  onSubmit,
}: CategoryDialogProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: getDefaultValues(category),
  })
  const { reset } = form
  const isEditing = Boolean(category)

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(category))
    }
  }, [category, open, reset])

  const handleOpenChange = (nextOpen: boolean) => {
    if (isActionLoading) return

    if (!nextOpen) {
      reset(getDefaultValues())
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async (data: CategoryFormData) => {
    const success = await onSubmit(data)

    if (success) {
      reset(getDefaultValues())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="card ring-0">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>
            Informe o nome e a cor da categoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              className="input"
              id="category-name"
              {...form.register('nome')}
            />
            {form.formState.errors.nome && (
              <p className="text-sm text-destructive">
                {form.formState.errors.nome.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-color">Cor</Label>
            <Input
              className="input p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
              id="category-color"
              type="color"
              {...form.register('cor')}
            />
            {form.formState.errors.cor && (
              <p className="text-sm text-destructive">
                {form.formState.errors.cor.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex-row justify-end gap-4 border-0 bg-transparent max-xs:justify-center">
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isActionLoading}
              className="btn-cancel-w-max"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn-ok-w-max"
              disabled={isLoading || isActionLoading}
            >
              {isLoading || isActionLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
