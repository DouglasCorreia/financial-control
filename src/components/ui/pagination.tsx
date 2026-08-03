import type { ComponentProps } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Pagination({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: ComponentProps<'li'>) {
  return <li className={cn('', className)} {...props} />
}

type PaginationLinkProps = ComponentProps<typeof Button> & {
  isActive?: boolean
}

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      variant={isActive ? 'outline' : 'ghost'}
      size="icon"
      className={cn(isActive && 'border-primary', className)}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft />
      <span>Anterior</span>
    </Button>
  )
}

function PaginationNext({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>Próxima</span>
      <ChevronRight />
    </Button>
  )
}

function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn('flex size-8 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
