'use client'

import { Clock, MapPin, Users, AlertCircle } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { clsx } from 'clsx'

export interface ScheduleData {
  schedule_id: string
  course_id: string
  course_title: string
  course_type: string
  course_image: string | null
  instructor_name: string | null
  instructor_avatar: string | null
  start_time: string
  end_time: string
  location: string
  available_spots: number | null
  total_spots: number | null
  booked_count: number
  price: number | null
  is_cancelled: boolean
}

interface ScheduleBlockProps {
  schedule: ScheduleData
  onClick?: (schedule: ScheduleData) => void
  compact?: boolean
}

// Course type to color mapping
const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  swimming: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-l-blue-500',
  },
  functional_training: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-l-green-500',
  },
  animal_movement: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-l-orange-500',
  },
  conditioning: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-l-red-500',
  },
  fitness: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-l-purple-500',
  },
  yoga: {
    bg: 'bg-pink-50 dark:bg-pink-950',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-l-pink-500',
  },
  default: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-l-gray-500',
  },
}

export function ScheduleBlock({ schedule, onClick, compact = false }: ScheduleBlockProps) {
  const colors = typeColors[schedule.course_type] || typeColors.default
  const startTime = parseISO(schedule.start_time)
  const endTime = parseISO(schedule.end_time)

  const spotsLeft = schedule.available_spots ?? 0
  const totalSpots = schedule.total_spots ?? 0
  const isFull = spotsLeft === 0
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 3
  const isCancelled = schedule.is_cancelled

  const handleClick = () => {
    if (!isCancelled && onClick) {
      onClick(schedule)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isCancelled && onClick) {
      e.preventDefault()
      onClick(schedule)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isCancelled}
        className={clsx(
          'w-full text-left p-2 rounded-lg border-l-4 transition-all duration-200',
          colors.bg,
          colors.border,
          isCancelled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:shadow-md hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500'
        )}
      >
        <div className={clsx('font-medium text-sm line-clamp-1', colors.text)}>
          {schedule.course_title}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Clock className="h-3 w-3" />
          {format(startTime, 'HH:mm')}
        </div>
        {isCancelled && (
          <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
            <AlertCircle className="h-3 w-3" />
            Abgesagt
          </div>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isCancelled}
      className={clsx(
        'schedule-slot w-full text-left p-3 rounded-lg border-l-4 transition-all duration-200',
        colors.bg,
        colors.border,
        isCancelled
          ? 'opacity-50 cursor-not-allowed grayscale'
          : 'hover:shadow-lg hover:scale-[1.01] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500'
      )}
    >
      {/* Header with title and type badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={clsx('font-semibold text-sm line-clamp-2', colors.text)}>
          {schedule.course_title}
        </h4>
        {isCancelled && (
          <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full">
            Abgesagt
          </span>
        )}
      </div>

      {/* Time */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span>
          {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-1.5">
        <MapPin className="h-3.5 w-3.5" />
        <span className="line-clamp-1">{schedule.location}</span>
      </div>

      {/* Instructor */}
      {schedule.instructor_name && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 mb-2">
          {schedule.instructor_avatar ? (
            <img
              src={schedule.instructor_avatar}
              alt={schedule.instructor_name}
              className="h-4 w-4 rounded-full object-cover"
            />
          ) : (
            <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600" />
          )}
          <span>{schedule.instructor_name}</span>
        </div>
      )}

      {/* Bottom row: spots and price */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-500" />
          <span
            className={clsx(
              'text-xs font-medium',
              isFull
                ? 'text-red-600 dark:text-red-400'
                : isAlmostFull
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {isFull ? (
              'Ausgebucht'
            ) : (
              <>
                {spotsLeft} {spotsLeft === 1 ? 'Platz' : 'Plaetze'} frei
              </>
            )}
          </span>
          {isAlmostFull && !isFull && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded">
              Fast voll
            </span>
          )}
        </div>

        {schedule.price !== null && schedule.price > 0 && (
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {schedule.price.toFixed(2)} EUR
          </span>
        )}
      </div>
    </button>
  )
}
