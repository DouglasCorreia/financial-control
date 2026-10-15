import { getPaginationPageNumbers } from './pagination-utils'

describe('pagination utilities', () => {
  it('uses ellipses to keep long page lists compact', () => {
    expect(getPaginationPageNumbers(5, 12)).toEqual([
      1,
      'ellipsis-left',
      4,
      5,
      6,
      'ellipsis-right',
      12,
    ])
  })

  it('lists all pages when there are seven or fewer', () => {
    expect(getPaginationPageNumbers(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(getPaginationPageNumbers(1, 0)).toEqual([])
  })
})
