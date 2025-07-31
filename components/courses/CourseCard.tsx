'use client'

import Image from 'next/image'
import { Clock, Users, MapPin, Euro } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

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

export function CourseCard({ course, onSelect, onBook }: CourseCardProps) {
  const typeColors = {
    swimming: 'bg-blue-100 text-blue-800',
    functional_training: 'bg-green-100 text-green-800',
    animal_movement: 'bg-orange-100 text-orange-800',
    conditioning: 'bg-red-100 text-red-800',
    fitness: 'bg-purple-100 text-purple-800'
  }

  const typeColor = typeColors[course.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'

  return (
    <Card className="course-card group">
      <div className="relative">
        <div className="course-card-image">
          <Image
            src={course.image_url || '/placeholder-course.jpg'}
            alt={course.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
            priority={false}
          />
        </div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
            {course.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900">
            €{course.price}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            {course.duration_minutes} minutes
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            Max {course.max_participants} participants
          </div>
          {course.instructor && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-4 h-4 mr-2 rounded-full bg-cyan-100 flex items-center justify-center">
                <span className="text-xs text-cyan-600">👤</span>
              </div>
              {course.instructor.full_name}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {onSelect && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(course)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          {onBook && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBook(course)}
              className="flex-1"
            >
              Book Course
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}