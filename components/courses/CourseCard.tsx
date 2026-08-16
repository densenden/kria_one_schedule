'use client'

import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import { Logo, LogoBanner } from '../ui/Logo'
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

interface CourseCardProps {
  course: Course
  onSelect?: (course: Course) => void
  onBook?: (course: Course) => void
}

const COURSE_TYPE_KEYS = [
  'swimming',
  'functional_training',
  'animal_movement',
  'conditioning',
  'fitness',
] as const

function courseTypeLabel(type: string, t: (key: string) => string) {
  if (COURSE_TYPE_KEYS.includes(type as (typeof COURSE_TYPE_KEYS)[number])) {
    return t(`common.courseTypes.${type}`)
  }
  return type.replace(/_/g, ' ')
}

export function CourseCard({ course, onSelect, onBook }: CourseCardProps) {
  const { t } = useLocale()

  return (
    <article className="surface overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/10] bg-muted">
        {course.image_url ? (
          <>
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Fade so type label stays readable on photos */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-3 left-3 flex items-center rounded-md bg-background/95 px-2 py-1 leading-none shadow-sm">
              <Logo size="sm" alt={t('nav.brandAlt')} />
            </div>
          </>
        ) : (
          <LogoBanner className="absolute inset-0" />
        )}
        <div className="absolute top-3 left-3 z-[1]">
          <span className="inline-flex items-center rounded-md bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-[2px]">
            {courseTypeLabel(course.type, t)}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-[1]">
          <span className="rounded-md bg-background/95 px-2.5 py-1 text-sm font-semibold text-foreground shadow-sm">
            €{course.price}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-h3 mb-2">{course.title}</h3>
        <p className="text-caption mb-4 line-clamp-2 flex-1">{course.description}</p>

        <div className="space-y-1.5 mb-5 text-caption">
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t('courses.cardDuration', { minutes: course.duration_minutes })}
          </p>
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('courses.cardMaxParticipants', { count: course.max_participants })}
          </p>
          {course.instructor && <p>{course.instructor.full_name}</p>}
        </div>

        <div className="flex gap-2">
          {onSelect && (
            <Button variant="outline" size="sm" onClick={() => onSelect(course)} className="flex-1">
              {t('courses.cardDetails')}
            </Button>
          )}
          {onBook && (
            <Button variant="primary" size="sm" onClick={() => onBook(course)} className="flex-1">
              {t('courses.cardBook')}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
