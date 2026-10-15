import { useThemeStore } from './useThemeStore'

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: 'light' })
  })

  it('alternates the theme and persists the selected value', () => {
    useThemeStore.getState().toggleTheme()

    expect(useThemeStore.getState().theme).toBe('dark')
    expect(JSON.parse(localStorage.getItem('financial-control-theme') ?? '{}')).toMatchObject({
      state: { theme: 'dark' },
    })

    useThemeStore.getState().toggleTheme()

    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('restores the saved theme when the store initializes', async () => {
    localStorage.setItem(
      'financial-control-theme',
      JSON.stringify({ state: { theme: 'dark' }, version: 0 }),
    )
    jest.resetModules()

    const { useThemeStore: restoredStore } = await import('./useThemeStore')

    expect(restoredStore.getState().theme).toBe('dark')
  })
})
