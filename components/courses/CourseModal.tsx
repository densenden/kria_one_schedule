'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Clock, Users, MapPin, Euro, Calendar } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Card, CardContent } from '../ui/Card'
import { Logo, LogoBanner } from '../ui/Logo'
import { format } from 'date-fns'
import { useLocale } from '../../lib/contexts/LocaleContext'

interface Course {
  id: string
  title: string
  description: string
  type: string
  image_url: string
  instructor_id: string
  max_participants: number
  price: number
  duration_minutes: number
  instructor?: {
    id: string
    full_name: string
    username: string
    avatar_url?: string
  }
}

interface Schedule {
  schedule_id: string
  start_time: string
  end_time: string
  location: string
  available_spots: number
  total_spots: number
  participant_count: number
}

interface CourseModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onBookSchedule?: (scheduleId: string) => void
}

export function CourseModal({ course, isOpen, onClose, onBookSchedule }: CourseModalProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const { t } = useLocale()

  useEffect(() => {
    if (course && isOpen) {
      fetchSchedules()
    }
  }, [course, isOpen])

  const fetchSchedules = async () => {
    if (!course) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/schedules?course_id=${course.id}`)
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!course) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-lg">
          {course.image_url ? (
            <>
              <Image
                src={course.image_url}
                alt={course.title}
                width={800}
                height={300}
                className="w-full h-64 object-cover"
              />
              {/* Fade so type label stays readable on photos */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
                aria-hidden
              />
            </>
          ) : (
            <LogoBanner className="h-64 w-full" />
          )}
          <div className="absolute top-4 left-4 z-[1]">
            <span className="inline-flex items-center rounded-md bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-[2px]">
              {course.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          {course.image_url && (
            <div className="absolute bottom-4 left-4 z-[1] flex items-center rounded-md bg-background/95 px-2 py-1 leading-none shadow-sm">
              <Logo size="sm" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Euro className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
              <div className="text-2xl font-bold">€{course.price}</div>
              <div className="text-sm text-gray-500">{t('courses.modalPerSession')}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
              <div className="text-2xl font-bold">{course.duration_minutes}</div>
              <div className="text-sm text-gray-500">{t('courses.modalMinutes')}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-cyan-600" />
              <div className="text-2xl font-bold">{course.max_participants}</div>
              <div className="text-sm text-gray-500">{t('courses.modalMaxPeople')}</div>
            </div>
          </div>

          {course.instructor && (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="text-sm text-cyan-600">👤</span>
                </div>
                <div className="text-sm font-medium">{course.instructor.full_name}</div>
                <div className="text-xs text-gray-500">{t('courses.modalInstructor')}</div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">{t('courses.modalUpcomingSessions')}</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">{t('courses.modalLoadingSchedules')}</p>
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {schedules.map((schedule) => (
                <Card key={schedule.schedule_id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(new Date(schedule.start_time), 'EEE, MMM d')}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-2" />
                          {format(new Date(schedule.start_time), 'HH:mm')} - {format(new Date(schedule.end_time), 'HH:mm')}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2" />
                          {schedule.location}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {t('courses.modalSpotsAvailable', {
                          available: schedule.available_spots,
                          total: schedule.total_spots,
                        })}
                        {schedule.participant_count > 0 && (
                          <span className="ml-2">
                            {t('courses.modalJoined', { count: schedule.participant_count })}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={schedule.available_spots === 0}
                      onClick={() => onBookSchedule?.(schedule.schedule_id)}
                    >
                      {schedule.available_spots === 0
                        ? t('schedule.badgeFull')
                        : t('schedule.badgeBook')}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>{t('courses.modalNoSessions')}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}