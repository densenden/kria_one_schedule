'use client'

import { CourseCard } from './CourseCard'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  title: string
  description: string
  short_description?: string
  type: string
  image_url: string
  instructor_id: string
  max_participants: number
  price: number
  duration_minutes: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'all' | null
  instructor?: {
    id: string
    full_name: string
    username?: string
    avatar_url?: string
  }
}

interface CourseGridProps {
  courses: Course[]
  onSelect?: (course: Course) => void
  onBook?: (course: Course) => void
  viewMode?: 'grid' | 'list'
  className?: string
}

export function CourseGrid({
  courses,
  onSelect,
  onBook,
  viewMode = 'grid',
  className
}: CourseGridProps) {
  if (courses.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'flex flex-col gap-4',
        className
      )}
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onSelect={onSelect}
          onBook={onBook}
        />
      ))}
    </div>
  )
}

// Skeleton loading component for CourseGrid
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image skeleton */}
            <div className="bg-gray-200 h-48 w-full" />

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>

              {/* Meta info */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <div className="h-10 bg-gray-200 rounded flex-1" />
                <div className="h-10 bg-gray-200 rounded flex-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
