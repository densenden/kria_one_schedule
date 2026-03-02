'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { startOfWeek, endOfWeek, addWeeks, parseISO, isValid } from 'date-fns'

export interface ScheduleFilters {
  courseType: string | null
  instructorId: string | null
  weekStart: Date
}

export interface UseScheduleFiltersReturn {
  filters: ScheduleFilters
  setFilter: (key: keyof Omit<ScheduleFilters, 'weekStart'>, value: string | null) => void
  setWeek: (date: Date) => void
  goToPreviousWeek: () => void
  goToNextWeek: () => void
  goToCurrentWeek: () => void
  clearFilters: () => void
  weekEnd: Date
  isCurrentWeek: boolean
}

export function useScheduleFilters(): UseScheduleFiltersReturn {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse filters from URL
  const filters = useMemo<ScheduleFilters>(() => {
    const weekParam = searchParams.get('week')
    let weekStart: Date

    if (weekParam) {
      const parsed = parseISO(weekParam)
      weekStart = isValid(parsed)
        ? startOfWeek(parsed, { weekStartsOn: 1 })
        : startOfWeek(new Date(), { weekStartsOn: 1 })
    } else {
      weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    }

    return {
      courseType: searchParams.get('type'),
      instructorId: searchParams.get('instructor'),
      weekStart,
    }
  }, [searchParams])

  // Calculate week end
  const weekEnd = useMemo(() => {
    return endOfWeek(filters.weekStart, { weekStartsOn: 1 })
  }, [filters.weekStart])

  // Check if current week
  const isCurrentWeek = useMemo(() => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    return filters.weekStart.getTime() === currentWeekStart.getTime()
  }, [filters.weekStart])

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // Set individual filter
  const setFilter = useCallback(
    (key: keyof Omit<ScheduleFilters, 'weekStart'>, value: string | null) => {
      const paramKey = key === 'courseType' ? 'type' : 'instructor'
      updateParams({ [paramKey]: value })
    },
    [updateParams]
  )

  // Set week
  const setWeek = useCallback(
    (date: Date) => {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 })
      updateParams({ week: weekStart.toISOString().split('T')[0] })
    },
    [updateParams]
  )

  // Navigation helpers
  const goToPreviousWeek = useCallback(() => {
    setWeek(addWeeks(filters.weekStart, -1))
  }, [filters.weekStart, setWeek])

  const goToNextWeek = useCallback(() => {
    setWeek(addWeeks(filters.weekStart, 1))
  }, [filters.weekStart, setWeek])

  const goToCurrentWeek = useCallback(() => {
    updateParams({ week: null })
  }, [updateParams])

  // Clear all filters
  const clearFilters = useCallback(() => {
    updateParams({
      type: null,
      instructor: null,
      week: null,
    })
  }, [updateParams])

  return {
    filters,
    setFilter,
    setWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    clearFilters,
    weekEnd,
    isCurrentWeek,
  }
}
