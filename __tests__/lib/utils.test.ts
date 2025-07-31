import { cn, formatCurrency, formatDate, formatTime, truncateText, debounce } from '../../lib/utils'

describe('Utility Functions', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(25)).toMatch(/€25/)
    })

    it('handles different currencies', () => {
      expect(formatCurrency(100, 'USD')).toMatch(/\$100/)
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/January 15, 2024/)
    })

    it('handles string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toMatch(/January 15, 2024/)
    })
  })

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const date = new Date('2024-01-15T14:30:00')
      const formatted = formatTime(date)
      expect(formatted).toBe('14:30')
    })
  })

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long...')
    })

    it('returns original text if under limit', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe(shortText)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    afterAll(() => {
      jest.useRealTimers()
    })
  })
})