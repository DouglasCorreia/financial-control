export type PaginationPage = number | 'ellipsis-left' | 'ellipsis-right'

export function getPaginationPageNumbers(
  activePage: number,
  totalPages: number,
): PaginationPage[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: PaginationPage[] = [1]

  if (activePage > 4) {
    pages.push('ellipsis-left')
  }

  const firstVisiblePage = Math.max(2, activePage - 1)
  const lastVisiblePage = Math.min(totalPages - 1, activePage + 1)

  for (let page = firstVisiblePage; page <= lastVisiblePage; page += 1) {
    pages.push(page)
  }

  if (activePage < totalPages - 3) {
    pages.push('ellipsis-right')
  }

  pages.push(totalPages)

  return pages
}
