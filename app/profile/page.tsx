'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '../../components/ui/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../lib/contexts/AuthContext'
import { 
  User, 
  Camera,
  Eye,
  EyeOff,
  Calendar,
  Euro,
  TrendingUp,
  Settings,
  Save
} from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

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

export default function ProfilePage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    is_public: true,
    athlete_info: {
      experience: '',
      goals: [] as string[],
      preferences: [] as string[]
    }
  })
  
  const { user, profile, updateProfile, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        is_public: profile.is_public,
        athlete_info: {
          experience: profile.athlete_info?.experience || '',
          goals: profile.athlete_info?.goals || [],
          preferences: profile.athlete_info?.preferences || []
        }
      })
      fetchBookings()
    }
  }, [user, profile, authLoading, router])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await updateProfile({
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        is_public: formData.is_public,
        athlete_info: formData.athlete_info
      })

      if (error) {
        throw error
      }

      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        is_public: profile.is_public,
        athlete_info: {
          experience: profile.athlete_info?.experience || '',
          goals: profile.athlete_info?.goals || [],
          preferences: profile.athlete_info?.preferences || []
        }
      })
    }
    setEditing(false)
  }

  if (authLoading || !user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const upcomingBookings = confirmedBookings.filter(b => 
    new Date(b.schedule.start_time) > new Date()
  )
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + (b.amount || 0), 0)

  const goalOptions = ['strength', 'endurance', 'flexibility', 'weight loss', 'muscle gain', 'overall fitness']
  const preferenceOptions = ['morning classes', 'evening classes', 'group classes', 'individual training', 'high intensity', 'low impact']

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile and training history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-cyan-600" />
                    Profile Information
                  </CardTitle>
                  {!editing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        loading={saving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center overflow-hidden">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-cyan-600" />
                      )}
                    </div>
                    {editing && (
                      <button className="absolute bottom-0 right-0 bg-cyan-500 text-white rounded-full p-2 shadow-lg hover:bg-cyan-600 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile.full_name || 'Unnamed User'}
                    </h3>
                    {profile.username && (
                      <p className="text-gray-600">@{profile.username}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {profile.is_public ? (
                        <>
                          <Eye className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Public Profile</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Private Profile</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!editing}
                  />
                  <Input
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {editing && (
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_public}
                        onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                        className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700">Make my profile public</span>
                    </label>
                  </div>
                )}

                {/* Athlete Info */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Athlete Information</h4>
                  
                  <div className="space-y-4">
                    <Input
                      label="Experience Level"
                      value={formData.athlete_info.experience}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        athlete_info: { ...formData.athlete_info, experience: e.target.value }
                      })}
                      disabled={!editing}
                      placeholder="e.g., Beginner, Intermediate, Advanced"
                    />

                    {editing && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Goals
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {goalOptions.map((goal) => (
                              <label key={goal} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.athlete_info.goals.includes(goal)}
                                  onChange={(e) => {
                                    const goals = e.target.checked
                                      ? [...formData.athlete_info.goals, goal]
                                      : formData.athlete_info.goals.filter(g => g !== goal)
                                    setFormData({
                                      ...formData,
                                      athlete_info: { ...formData.athlete_info, goals }
                                    })
                                  }}
                                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">{goal}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferences
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {preferenceOptions.map((pref) => (
                              <label key={pref} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.athlete_info.preferences.includes(pref)}
                                  onChange={(e) => {
                                    const preferences = e.target.checked
                                      ? [...formData.athlete_info.preferences, pref]
                                      : formData.athlete_info.preferences.filter(p => p !== pref)
                                    setFormData({
                                      ...formData,
                                      athlete_info: { ...formData.athlete_info, preferences }
                                    })
                                  }}
                                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">{pref}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {!editing && (
                      <>
                        {profile.athlete_info?.goals && profile.athlete_info.goals.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                            <div className="flex flex-wrap gap-2">
                              {profile.athlete_info.goals.map((goal: string) => (
                                <span key={goal} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm capitalize">
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {profile.athlete_info?.preferences && profile.athlete_info.preferences.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
                            <div className="flex flex-wrap gap-2">
                              {profile.athlete_info.preferences.map((pref: string) => (
                                <span key={pref} className="px-3 py-1 bg-ultramarine-100 text-ultramarine-800 rounded-full text-sm capitalize">
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Bookings */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-cyan-600 mb-1">
                    {upcomingBookings.length}
                  </div>
                  <div className="text-sm text-gray-600">Upcoming Sessions</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-ultramarine-600 mb-1">
                    {confirmedBookings.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    €{totalSpent}
                  </div>
                  <div className="text-sm text-gray-600">Total Invested</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cyan-600" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div>
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {booking.schedule.course.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {format(new Date(booking.schedule.start_time), 'MMM d, HH:mm')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.schedule.location}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming bookings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}