import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFinancialStore } from '@/stores/useFinancialStore'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import GlobalLoading from '@/components/GlobalLoading'
import CategoryAlerts from '@/components/alerts/CategoryAlerts'
import CategoryDialog from '@/components/modals/CategoryDialog'

import { Trash2, Pencil, Plus } from 'lucide-react';

import type { Category } from '@/types'
import type { CategoryFormData } from '@/schemas/category'

export default function Categories() {
    const user = useAuthStore((state) => state.user)

    const categories = useFinancialStore((state) => state.categories)
    const loadCategories = useFinancialStore((state) => state.loadCategories)
    const createCategory = useFinancialStore((state) => state.createCategory)
    const updateCategory = useFinancialStore((state) => state.updateCategory)
    const deleteCategory = useFinancialStore((state) => state.deleteCategory)
    const isLoading = useFinancialStore((state) => state.isLoading)

    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const [isActionLoading, setIsActionLoading] = useState(false)

    useEffect(() => {
        if (user) {
            loadCategories(user.id)
        }
    }, [user, loadCategories])

    const handleCreate = () => {
        if (isActionLoading) return

        setEditingCategory(null)
        setCategoryDialogOpen(true)
    }

    const handleEdit = (category: Category) => {
        if (isActionLoading) return

        setEditingCategory(category)
        setCategoryDialogOpen(true)
    }

    const onSubmit = async (data: CategoryFormData) => {
        if (!user || isActionLoading) return false

        setIsActionLoading(true)

        try {
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

            return success
        } finally {
            setIsActionLoading(false)
        }
    }

    const confirmDelete = async () => {
        if (!categoryToDelete || isActionLoading) return

        setIsActionLoading(true)

        try {
            const success = await deleteCategory(categoryToDelete.id)

            if (success) {
                setCategoryToDelete(null)
            }
        } finally {
            setIsActionLoading(false)
        }
    }

    if (isLoading) {
        return <GlobalLoading />
    }

    return(
        <section className="w-full">
            <div className="sm:flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Categoria das despesas</h1>

                    <p className="text-sm text-muted-foreground">Gerencie as categorias de suas despesas.</p>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-end md:justify-center gap-2">
                    <Button className="btn-ok-w-max" type="button" onClick={handleCreate} disabled={isActionLoading || isLoading}>
                        <Plus /> <span className="hidden md:inline">Categoria</span>
                    </Button>
                </div>
            </div>

            {isLoading && categories.length === 0 && (
                <Card className="mt-4">
                    <CardContent className="text-center text-muted-foreground">
                        Carregando categorias...
                    </CardContent>
                </Card>
            )}

            {!isLoading && categories.length === 0 && (
                <Card className="mt-4">
                    <CardContent className="text-center text-muted-foreground">
                        Nenhuma despesa cadastrada.
                    </CardContent>
                </Card>
            )}

            <div
                className={`grid grid-cols-1 gap-4 w-full ${categories.length > 0 ? 'mt-4' : 'mt-0' }`}
            >
                {categories.map((category) => (
                    <Card key={category.id} className="card-full col-span-1">
                        <CardContent className="grid grid-cols-12 gap-2.5">
                            <div className="col-span-12 sm:col-span-10 flex flex-wrap items-center gap-3">
                                <span className="block h-8 w-2" style={{ backgroundColor: category.cor ?? '#999' }}></span>

                                <h2 className="text-lg font-medium">{category.nome}</h2>
                            </div>

                            <div className="col-span-12 sm:col-span-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-1">
                                        <Button className="btn-ok" type="button" onClick={() => handleEdit(category)} disabled={isActionLoading || isLoading}>
                                            <Pencil />
                                        </Button>
                                    </div>

                                    <div className="col-span-1">
                                        <Button className="btn-danger" type="button" variant="destructive" onClick={() => setCategoryToDelete(category)} disabled={isActionLoading || isLoading}>
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CategoryDialog
                open={categoryDialogOpen}
                onOpenChange={(open) => {
                    setCategoryDialogOpen(open)
                    if (!open) setEditingCategory(null)
                }}
                category={editingCategory}
                isLoading={isLoading}
                isActionLoading={isActionLoading}
                onSubmit={onSubmit}
            />

            <CategoryAlerts
                categoryToDelete={categoryToDelete}
                isActionLoading={isActionLoading}
                onOpenChange={(open) => {
                    if (!open) setCategoryToDelete(null)
                }}
                onConfirmDelete={confirmDelete}
            />
        </section>
    )
}
