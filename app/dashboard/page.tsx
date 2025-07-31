'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock,
  MapPin,
  Euro
} from 'lucide-react'
import { Navigation } from '../../components/ui/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/contexts/AuthContext'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Schedule {
  schedule_id: string
  course_title: string
  course_type: string
  start_time: string
  end_time: string
  location: string
  available_spots: number
  total_spots: number
  participant_count: number
  price: number
}

interface Booking {
  id: string
  status: string
  amount: number
  booked_at: string
  schedule: {
    id: string
    start_time: string
    end_time: string
    location: string
    course: {
      title: string
      type: string
    }
  }
}

export default function DashboardPage() {
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      const [schedulesRes, bookingsRes] = await Promise.all([
        fetch('/api/schedules?limit=6'),
        fetch('/api/bookings')
      ])

      const schedulesData = await schedulesRes.json()
      const bookingsData = await bookingsRes.json()

      setUpcomingSchedules(schedulesData.schedules || [])
      setUserBookings(bookingsData.bookings || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const upcomingBookings = userBookings
    .filter(booking => booking.status === 'confirmed')
    .slice(0, 3)

  const stats = {
    totalBookings: userBookings.filter(b => b.status === 'confirmed').length,
    upcomingSessions: upcomingBookings.length,
    totalSpent: userBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.amount || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || 'Athlete'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready for your next training session?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-secondary-jungle-teal/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-secondary-jungle-teal" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalSpent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Upcoming Sessions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Your Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h4 className="font-semibold text-gray-900">
                        {booking.schedule.course.title}
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(new Date(booking.schedule.start_time), 'EEE, MMM d • HH:mm')}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {booking.schedule.location}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/schedule">
                    <Button variant="outline" className="w-full mt-4">
                      View Full Schedule
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming sessions</p>
                  <Link href="/courses">
                    <Button variant="primary">Book Your First Session</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Sessions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary-jungle-teal" />
                Available Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : upcomingSchedules.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSchedules.slice(0, 4).map((schedule) => (
                    <div
                      key={schedule.schedule_id}
                      className="p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {schedule.course_title}
                          </h4>
                          <div className="mt-1 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {format(new Date(schedule.start_time), 'EEE, MMM d • HH:mm')}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {schedule.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {schedule.available_spots} spots left
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">€{schedule.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/courses">
                    <Button variant="primary" className="w-full mt-4">
                      Browse All Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No sessions available right now</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/courses">
                <Button variant="primary" className="w-full h-16 flex flex-col items-center justify-center">
                  <BookOpen className="h-6 w-6 mb-1" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/schedule">
                <Button variant="secondary" className="w-full h-16 flex flex-col items-center justify-center">
                  <Calendar className="h-6 w-6 mb-1" />
                  My Schedule
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-1" />
                  Community
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="w-full h-16 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-1" />
                  My Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}