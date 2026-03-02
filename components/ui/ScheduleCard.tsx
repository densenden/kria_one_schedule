'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, MapPin, Users, Euro } from 'lucide-react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import type { CSSProperties } from 'react'

interface ScheduleData {
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

interface ScheduleCardProps {
  schedule: ScheduleData
  className?: string
  style?: CSSProperties
}

const typeColors: Record<string, string> = {
  swimming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  functional_training: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  animal_movement: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  conditioning: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  fitness: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  yoga: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  pilates: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Heute'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Morgen'
  }

  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function ScheduleCard({ schedule, className = '', style }: ScheduleCardProps) {
  const typeColor =
    typeColors[schedule.course_type] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

  const availableSpots =
    schedule.available_spots !== null
      ? schedule.available_spots
      : schedule.total_spots !== null
      ? schedule.total_spots - schedule.booked_count
      : null

  const isFull = availableSpots !== null && availableSpots <= 0
  const isAlmostFull = availableSpots !== null && availableSpots <= 3 && availableSpots > 0

  return (
    <Card className={`card-hover group overflow-hidden ${className}`} style={style}>
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={schedule.course_image || '/placeholder-course.jpg'}
          alt={schedule.course_title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${typeColor}`}>
            {schedule.course_type.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Price Badge */}
        {schedule.price !== null && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white backdrop-blur-sm font-semibold">
              {schedule.price > 0 ? `${schedule.price} EUR` : 'Gratis'}
            </span>
          </div>
        )}

        {/* Date Overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-medium text-sm">
            {formatDate(schedule.start_time)}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-tenant transition-colors">
          {schedule.course_title}
        </h3>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Time */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{schedule.location}</span>
          </div>

          {/* Instructor */}
          {schedule.instructor_name && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              {schedule.instructor_avatar ? (
                <Image
                  src={schedule.instructor_avatar}
                  alt={schedule.instructor_name}
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded-full mr-2"
                />
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 mr-2 flex items-center justify-center">
                  <span className="text-[8px] text-gray-500 dark:text-gray-400">
                    {schedule.instructor_name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="truncate">{schedule.instructor_name}</span>
            </div>
          )}

          {/* Spots */}
          {availableSpots !== null && (
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span
                className={
                  isFull
                    ? 'text-red-600 dark:text-red-400'
                    : isAlmostFull
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400'
                }
              >
                {isFull
                  ? 'Ausgebucht'
                  : isAlmostFull
                  ? `Nur noch ${availableSpots} Plaetze`
                  : `${availableSpots} Plaetze frei`}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/courses/${schedule.course_id}?schedule=${schedule.schedule_id}`}>
          <Button
            variant={isFull ? 'secondary' : 'primary'}
            size="sm"
            className="w-full"
            disabled={isFull}
          >
            {isFull ? 'Warteliste' : 'Jetzt buchen'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
