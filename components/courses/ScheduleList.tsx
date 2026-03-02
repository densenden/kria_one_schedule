'use client'

import { format, parseISO } from 'date-fns'
import { Calendar, Clock, MapPin, Users, Euro } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface Schedule {
  id: string
  start_time: string
  end_time: string
  location: string
  location_details?: string | null
  available_spots: number | null
  price_override?: number | null
  is_cancelled: boolean
  instructor?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface ScheduleListProps {
  schedules: Schedule[]
  coursePrice?: number | null
  currency?: string
  onBook?: (scheduleId: string) => void
  loading?: boolean
  showInstructor?: boolean
  className?: string
}

export function ScheduleList({
  schedules,
  coursePrice,
  currency = 'EUR',
  onBook,
  loading = false,
  showInstructor = false,
  className
}: ScheduleListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency
    }).format(amount)
  }

  if (loading) {
    return <ScheduleListSkeleton count={3} />
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No upcoming sessions</p>
        <p className="text-sm mt-1">Check back later for new schedule updates</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {schedules.map((schedule) => {
        const startDate = parseISO(schedule.start_time)
        const endDate = parseISO(schedule.end_time)
        const price = schedule.price_override ?? coursePrice
        const spotsAvailable = schedule.available_spots ?? 0
        const isFull = spotsAvailable === 0
        const isCancelled = schedule.is_cancelled

        return (
          <Card
            key={schedule.id}
            className={cn(
              'p-4 transition-all duration-200 hover:shadow-md',
              isCancelled && 'opacity-60'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                {/* Date and Time */}
                <div className="flex flex-wrap items-center gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-600" />
                    <span className="font-medium">
                      {format(startDate, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    <span>
                      {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{schedule.location}</span>
                  {schedule.location_details && (
                    <span className="text-gray-400">({schedule.location_details})</span>
                  )}
                </div>

                {/* Spots and Instructor */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className={cn(
                      spotsAvailable <= 3 && spotsAvailable > 0 && 'text-orange-600 font-medium',
                      isFull && 'text-red-600 font-medium'
                    )}>
                      {isFull
                        ? 'No spots available'
                        : `${spotsAvailable} spot${spotsAvailable !== 1 ? 's' : ''} available`}
                    </span>
                  </div>

                  {showInstructor && schedule.instructor && (
                    <div className="flex items-center gap-2">
                      {schedule.instructor.avatar_url ? (
                        <img
                          src={schedule.instructor.avatar_url}
                          alt={schedule.instructor.full_name || 'Instructor'}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center">
                          <span className="text-xs text-cyan-600">
                            {schedule.instructor.full_name?.charAt(0) || 'I'}
                          </span>
                        </div>
                      )}
                      <span className="text-gray-600">
                        {schedule.instructor.full_name || 'Instructor'}
                      </span>
                    </div>
                  )}

                  {isCancelled && (
                    <Badge variant="error" size="sm">Cancelled</Badge>
                  )}
                </div>
              </div>

              {/* Price and Book Button */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                {price !== null && price !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(price)}
                    </span>
                  </div>
                )}

                {onBook && !isCancelled && (
                  <Button
                    variant={isFull ? 'outline' : 'primary'}
                    size="sm"
                    disabled={isFull}
                    onClick={() => onBook(schedule.id)}
                    className="min-w-[100px]"
                  >
                    {isFull ? 'Full' : 'Book Now'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// Skeleton loading component
export function ScheduleListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Date and time skeleton */}
                <div className="flex gap-4">
                  <div className="h-5 bg-gray-200 rounded w-40" />
                  <div className="h-5 bg-gray-200 rounded w-24" />
                </div>
                {/* Location skeleton */}
                <div className="h-4 bg-gray-200 rounded w-32" />
                {/* Spots skeleton */}
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-10 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
