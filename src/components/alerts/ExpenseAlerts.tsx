import type { Expense } from '@/types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ExpenseAlertsProps = {
  expenseToDelete: Expense | null
  deleteAllOpen: boolean
  deleteSelectedOpen: boolean
  expenseCount: number
  selectedExpenseCount: number
  isActionLoading: boolean
  onExpenseDeleteOpenChange: (open: boolean) => void
  onDeleteAllOpenChange: (open: boolean) => void
  onDeleteSelectedOpenChange: (open: boolean) => void
  onConfirmDelete: () => void | Promise<void>
  onConfirmDeleteAll: () => void | Promise<void>
  onConfirmDeleteSelected: () => void | Promise<void>
}

export default function ExpenseAlerts({
  expenseToDelete,
  deleteAllOpen,
  deleteSelectedOpen,
  expenseCount,
  selectedExpenseCount,
  isActionLoading,
  onExpenseDeleteOpenChange,
  onDeleteAllOpenChange,
  onDeleteSelectedOpenChange,
  onConfirmDelete,
  onConfirmDeleteAll,
  onConfirmDeleteSelected,
}: ExpenseAlertsProps) {
  return (
    <>
      <AlertDialog
        open={expenseToDelete !== null}
        onOpenChange={onExpenseDeleteOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription>
              A despesa &quot;{expenseToDelete?.nome}&quot; será excluída. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row justify-end gap-4 border-0 bg-transparent max-xs:justify-center">
            <AlertDialogCancel
              className="btn-cancel-w-max"
              disabled={isActionLoading}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn-danger-w-max"
              onClick={() => void onConfirmDelete()}
              disabled={isActionLoading}
            >
              {isActionLoading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteSelectedOpen}
        onOpenChange={onDeleteSelectedOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir despesas selecionadas?</AlertDialogTitle>
            <AlertDialogDescription>
              As {selectedExpenseCount} despesas selecionadas serão excluídas permanentemente. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row justify-end gap-4 border-0 bg-transparent max-xs:justify-center">
            <AlertDialogCancel
              className="btn-cancel-w-max"
              disabled={isActionLoading}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn-danger-w-max"
              onClick={() => void onConfirmDeleteSelected()}
              disabled={isActionLoading}
            >
              {isActionLoading ? 'Excluindo...' : 'Excluir selecionadas'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllOpen} onOpenChange={onDeleteAllOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir todas as despesas?</AlertDialogTitle>
            <AlertDialogDescription>
              As {expenseCount} despesas serão excluídas permanentemente. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row justify-end gap-4 border-0 bg-transparent max-xs:justify-center">
            <AlertDialogCancel
              className="btn-cancel-w-max"
              disabled={isActionLoading}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn-danger-w-max"
              onClick={() => void onConfirmDeleteAll()}
              disabled={isActionLoading}
            >
              {isActionLoading ? 'Excluindo...' : 'Excluir todas'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
