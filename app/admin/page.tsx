'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Euro,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react'
import { Navigation } from '../../components/ui/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/contexts/AuthContext'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalBookings: number
  totalRevenue: number
  thisMonthBookings: number
  thisMonthRevenue: number
}

interface RecentActivity {
  id: string
  type: 'booking' | 'user' | 'course'
  description: string
  timestamp: string
  amount?: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalBookings: 0,
    totalRevenue: 0,
    thisMonthBookings: 0,
    thisMonthRevenue: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/dashboard')
      return
    }

    if (user && isAdmin) {
      fetchAdminData()
    }
  }, [user, isAdmin, authLoading, router])

  const fetchAdminData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/activity')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json()
        setRecentActivity(activityData.activities || [])
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your KRIA training platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-secondary-jungle-teal/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-secondary-jungle-teal" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Euro className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">€{stats.totalRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Link href="/admin/courses/new">
                  <Button variant="primary" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Course
                  </Button>
                </Link>
                <Link href="/admin/schedules/new">
                  <Button variant="secondary" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add Schedule
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Management Links */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <Link href="/admin/courses" className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-secondary-jungle-teal mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Courses</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stats.totalCourses} courses</p>
                    </div>
                  </div>
                  <Edit className="h-4 w-4 text-gray-400" />
                </Link>

                <Link href="/admin/schedules" className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Schedules</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage class times</p>
                    </div>
                  </div>
                  <Edit className="h-4 w-4 text-gray-400" />
                </Link>

                <Link href="/admin/bookings" className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Bookings</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stats.totalBookings} bookings</p>
                    </div>
                  </div>
                  <Eye className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'booking' ? 'bg-green-100 text-green-600' :
                        activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'booking' ? <Calendar className="h-4 w-4" /> :
                         activity.type === 'user' ? <Users className="h-4 w-4" /> :
                         <BookOpen className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                          </p>
                          {activity.amount && (
                            <span className="text-xs font-medium text-green-600">€{activity.amount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* This Month Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Bookings</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.thisMonthBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                  <span className="text-2xl font-bold text-green-600">€{stats.thisMonthRevenue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payments</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Storage</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Healthy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}