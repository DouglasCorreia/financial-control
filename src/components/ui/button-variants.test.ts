import { buttonVariants } from './button-variants'

describe('buttonVariants destructive variant', () => {
  it('uses the same solid red palette in light and dark themes', () => {
    const classes = buttonVariants({ variant: 'destructive' })

    expect(classes).toContain('bg-mojo-500')
    expect(classes).toContain('text-white')
    expect(classes).toContain('hover:bg-mojo-600')
    expect(classes).not.toContain('dark:bg-destructive/20')
  })
})

describe('buttonVariants disabled state', () => {
  it('shows a blocked cursor and preserves hover on disabled buttons', () => {
    const classes = buttonVariants()

    expect(classes).toContain('disabled:cursor-not-allowed')
    expect(classes).toContain('disabled:pointer-events-auto')
    expect(classes).not.toContain('disabled:pointer-events-none')
  })
})
