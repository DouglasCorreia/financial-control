import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Card, CardContent } from '@/components/ui/card'

import { Trash, SquarePen, Plus } from 'lucide-react';

import type { Category } from '@/types'

const categorySchema = z.object({
  nome: z.string().min(2, 'Informe o nome da categoria'),
  cor: z.string().min(1, 'Escolha uma cor'),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function Categories() {
    const user = useAuthStore((state) => state.user)

    const categories = useFinancialStore((state) => state.categories)
    const loadCategories = useFinancialStore((state) => state.loadCategories)
    const createCategory = useFinancialStore((state) => state.createCategory)
    const updateCategory = useFinancialStore((state) => state.updateCategory)
    const deleteCategory = useFinancialStore((state) => state.deleteCategory)

    const [formOpen, setFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            nome: '',
            cor: '#22c55e',
        },
    })

    useEffect(() => {
        if (user) {
            loadCategories(user.id)
        }
    }, [user, loadCategories])

    const handleCreate = () => {
        setEditingCategory(null)

        reset({
            nome: '',
            cor: '#22c55e',
        })

        setFormOpen(true)
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)

        reset({
            nome: category.nome,
            cor: category.cor ?? '#22c55e',
        })

        setFormOpen(true)
    }

    const onSubmit = async (data: CategoryFormData) => {
        if (!user) return

        const success = editingCategory
            ? await updateCategory(
                editingCategory.id,
                data.nome,
                data.cor,
            )
            : await createCategory(
                user.id,
                data.nome,
                data.cor,
            )

        if (success) {
            setFormOpen(false)
            reset()
        }
    }

    return(
        <>
            <h1 className="text-2xl uppercase font-bold text-center mb-8">Categoria das despesas</h1>

            {
                categories.length === 0 && (
                    <p className="mb-4">Nenhuma categoria cadastrada</p>
                )
            }

            <div className="flex flex-wrap w-full justify-end">
                <Button className="btn-ok-w-max" type="button" onClick={handleCreate}>
                    <Plus /> Categoria
                </Button>
            </div>

            <div
                className={`grid grid-cols-1 gap-4 w-full ${categories.length > 0 ? 'mt-4' : 'mt-0' }`}
            >
                {categories.map((category) => (
                    <Card key={category.id} className="card-full col-span-1">
                        <CardContent className="grid grid-cols-12 gap-2.5">
                            <div className="col-span-12 sm:col-span-10 flex flex-wrap items-center gap-4">
                                <span className="block size-8 rounded-full" style={{ backgroundColor: category.cor ?? '#999' }}></span>

                                <h2 className="text-lg font-medium">{category.nome}</h2>
                            </div>

                            <div className="col-span-12 sm:col-span-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-1">
                                        <Button className="btn-ok" type="button" onClick={() => handleEdit(category)}>
                                            <SquarePen />
                                        </Button>
                                    </div>

                                    <div className="col-span-1">
                                        <Button className="btn-danger" type="button" variant="destructive" onClick={() => setCategoryToDelete(category)}>
                                            <Trash />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="card ring-0">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory
                            ? 'Editar categoria'
                            : 'Nova categoria'}
                        </DialogTitle>

                        <DialogDescription>
                            Informe o nome e a cor da categoria.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>

                            <Input
                                className="input"
                                id="nome"
                                {...register('nome')}
                            />

                            {errors.nome && (
                                <p className="text-sm text-destructive">
                                    {errors.nome.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cor">Cor</Label>

                            <Input
                                className="
                                input p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
                                id="cor"
                                type="color"
                                {...register('cor')}
                            />
                        </div>

                        <DialogFooter className="bg-transparent border-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormOpen(false)}
                                className="btn-cancel-w-max"
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                className="btn-ok-w-max"
                            >
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={categoryToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                    setCategoryToDelete(null)
                    }
                }}
            >
                    <AlertDialogContent className="card ring-0">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Atenção
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                A categoria "{categoryToDelete?.nome}" será excluída.
                                Essa ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="bg-transparent border-0">
                            <AlertDialogCancel className="btn-cancel-w-max">Cancelar</AlertDialogCancel>

                            <AlertDialogAction
                                onClick={async () => {
                                    if (!categoryToDelete) return

                                    const success = await deleteCategory(
                                        categoryToDelete.id,
                                    )

                                    if (success) {
                                        setCategoryToDelete(null)
                                    }
                                }}
                                className="btn-danger-w-max"
                            >
                                Excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
            </AlertDialog>
        </>
    )
}