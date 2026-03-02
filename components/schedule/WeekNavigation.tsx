'use client'

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Button } from '@/components/ui/Button'

interface WeekNavigationProps {
  weekStart: Date
  weekEnd: Date
  isCurrentWeek: boolean
  onPreviousWeek: () => void
  onNextWeek: () => void
  onCurrentWeek: () => void
}

export function WeekNavigation({
  weekStart,
  weekEnd,
  isCurrentWeek,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
}: WeekNavigationProps) {
  const formatDateRange = () => {
    const startMonth = format(weekStart, 'MMM', { locale: de })
    const endMonth = format(weekEnd, 'MMM', { locale: de })
    const startDay = format(weekStart, 'd')
    const endDay = format(weekEnd, 'd')
    const year = format(weekEnd, 'yyyy')

    if (startMonth === endMonth) {
      return `${startDay}. - ${endDay}. ${startMonth} ${year}`
    }
    return `${startDay}. ${startMonth} - ${endDay}. ${endMonth} ${year}`
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousWeek}
          className="flex items-center gap-1"
          aria-label="Vorherige Woche"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Vorherige</span>
        </Button>

        {!isCurrentWeek && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCurrentWeek}
            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700"
          >
            <Calendar className="h-4 w-4" />
            <span>Heute</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onNextWeek}
          className="flex items-center gap-1"
          aria-label="Naechste Woche"
        >
          <span className="hidden sm:inline">Naechste</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {formatDateRange()}
        </span>
        {isCurrentWeek && (
          <span className="px-2 py-0.5 text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300 rounded-full">
            Diese Woche
          </span>
        )}
      </div>
    </div>
  )
}
