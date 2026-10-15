import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import ExpenseViewToggle from './ExpenseViewToggle'

describe('ExpenseViewToggle', () => {
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

  it('marks the current card view selected by default', () => {
    act(() => {
      root.render(<ExpenseViewToggle value="cards" onChange={() => undefined} />)
    })

    expect(container.querySelector('[aria-label="Visualização em cartões"]')?.getAttribute('aria-pressed')).toBe('true')
    expect(container.querySelector('[aria-label="Visualização em lista"]')?.getAttribute('aria-pressed')).toBe('false')
  })

  it('switches to list view when selected', () => {
    const onChange = jest.fn()
    act(() => {
      root.render(<ExpenseViewToggle value="cards" onChange={onChange} />)
    })

    act(() => {
      container.querySelector<HTMLButtonElement>('[aria-label="Visualização em lista"]')?.click()
    })

    expect(onChange).toHaveBeenCalledWith('list')
  })
})
