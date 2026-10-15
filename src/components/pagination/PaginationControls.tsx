import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPaginationPageNumbers } from './pagination-utils'

type PaginationControlsProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  itemLabel?: string
  disabled?: boolean
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = 'itens',
  disabled = false,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const pageNumbers = getPaginationPageNumbers(currentPage, totalPages)

  return (
    <div className="mt-6 space-y-3">
      <p className="text-center text-sm text-muted-foreground">
        Mostrando {startItem} a {endItem} de {totalItems} {itemLabel}
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              type="button"
              className="text-chateau-green-500 hover:text-chateau-green-600 cursor-pointer"
              disabled={currentPage === 1 || disabled}
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              {typeof page === 'number' ? (
                <PaginationLink
                  type="button"
                  className="text-chateau-green-400 hover:text-chateau-green-500 border-chateau-green-500 bg-transparent cursor-pointer"
                  isActive={page === currentPage}
                  disabled={disabled}
                  onClick={() => onPageChange(page)}
                  aria-label={`Ir para a página ${page}`}
                >
                  {page}
                </PaginationLink>
              ) : (
                <PaginationEllipsis />
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              type="button"
              className="text-chateau-green-500 hover:text-chateau-green-600 cursor-pointer"
              disabled={currentPage === totalPages || disabled}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
