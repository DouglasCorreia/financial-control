import type { Category } from '@/types'

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

type CategoryAlertsProps = {
  categoryToDelete: Category | null
  isActionLoading: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => void | Promise<void>
}

export default function CategoryAlerts({
  categoryToDelete,
  isActionLoading,
  onOpenChange,
  onConfirmDelete,
}: CategoryAlertsProps) {
  return (
    <AlertDialog
      open={categoryToDelete !== null}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent className="card ring-0">
        <AlertDialogHeader>
          <AlertDialogTitle>Atenção</AlertDialogTitle>
          <AlertDialogDescription>
            A categoria &quot;{categoryToDelete?.nome}&quot; será excluída. Essa ação não pode ser desfeita.
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
            onClick={() => void onConfirmDelete()}
            disabled={isActionLoading}
            className="btn-danger-w-max"
          >
            {isActionLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
