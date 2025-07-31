'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Clock,
  Euro,
  Users
} from 'lucide-react'
import { Navigation } from '../../../components/ui/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { useAuth } from '../../../lib/contexts/AuthContext'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  type: string
  instructor_id: string
  max_participants: number
  price: number
  duration_minutes: number
  image_url: string
  created_at: string
  instructor?: {
    full_name: string
  }
  _count?: {
    schedules: number
    bookings: number
  }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/dashboard')
      return
    }

    if (user && isAdmin) {
      fetchCourses()
    }
  }, [user, isAdmin, authLoading, router])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      } else {
        toast.error('Failed to load courses')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all associated schedules and bookings.')) {
      return
    }

    setDeleting(courseId)
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Course deleted successfully')
        setCourses(courses.filter(course => course.id !== courseId))
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete course')
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Failed to delete course')
    } finally {
      setDeleting(null)
    }
  }

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const typeColors = {
    swimming: 'bg-blue-100 text-blue-800',
    functional_training: 'bg-green-100 text-green-800',
    animal_movement: 'bg-orange-100 text-orange-800',
    conditioning: 'bg-red-100 text-red-800',
    fitness: 'bg-purple-100 text-purple-800',
    yoga: 'bg-pink-100 text-pink-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Course Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all courses and training programs
            </p>
          </div>
          <Link href="/admin/courses/new">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Course
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first course</p>
              <Link href="/admin/courses/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-jungle-teal/20 flex items-center justify-center">
                  {course.image_url ? (
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          typeColors[course.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Euro className="h-4 w-4" />
                        Price
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">€{course.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        Duration
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{course.duration_minutes} min</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        Max participants
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{course.max_participants}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/courses/${course.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      disabled={deleting === course.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleting === course.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}