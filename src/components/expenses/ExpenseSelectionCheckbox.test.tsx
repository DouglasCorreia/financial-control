import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import ExpenseSelectionCheckbox from './ExpenseSelectionCheckbox'

describe('ExpenseSelectionCheckbox', () => {
  let container: HTMLDivElement
  let root: Root

  beforeAll(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('uses theme surface and border tokens when unchecked', () => {
    act(() => {
      root.render(
        <ExpenseSelectionCheckbox
          checked={false}
          label="Selecionar despesa"
          onChange={() => undefined}
        />,
      )
    })

    const checkbox = container.querySelector('input[type="checkbox"]')
    const visualBox = container.querySelector('span[aria-hidden="true"]')

    expect(checkbox).not.toBeNull()
    expect(visualBox?.className).toContain('bg-card')
    expect(visualBox?.className).toContain('border-border')
    expect(visualBox?.className).not.toContain('bg-white')
  })
})
