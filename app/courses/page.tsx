'use client'

import { useState, useEffect } from 'react'
import { CourseCard } from '../../components/courses/CourseCard'
import { CourseModal } from '../../components/courses/CourseModal'
import { CourseFilters } from '../../components/courses/CourseFilters'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/contexts/AuthContext'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data.courses || [])
      setFilteredCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: {
    search: string
    type: string
    priceRange: [number, number]
    instructor: string
  }) => {
    let filtered = courses

    if (filters.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.type) {
      filtered = filtered.filter(course => course.type === filters.type)
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) {
      filtered = filtered.filter(course =>
        course.price >= filters.priceRange[0] && course.price <= filters.priceRange[1]
      )
    }

    if (filters.instructor) {
      filtered = filtered.filter(course =>
        course.instructor?.full_name?.toLowerCase().includes(filters.instructor.toLowerCase())
      )
    }

    setFilteredCourses(filtered)
  }

  const handleBookSchedule = async (scheduleId: string) => {
    if (!user) {
      toast.error('Please sign in to book a course')
      return
    }

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scheduleId,
          userId: user.id 
        })
      })

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error booking course:', error)
      toast.error('Failed to start booking process')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
              <p className="text-gray-600 mt-1">
                Discover and book from {courses.length} available courses
              </p>
            </div>
          </div>

          {!user && (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <CourseFilters onFilterChange={handleFilterChange} />

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={setSelectedCourse}
                onBook={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        )}

        <CourseModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onBookSchedule={handleBookSchedule}
        />
      </div>
    </div>
  )
}