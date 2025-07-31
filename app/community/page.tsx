'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '../../components/ui/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/contexts/AuthContext'
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  User,
  Eye,
  EyeOff
} from 'lucide-react'
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

interface Participant {
  booking_id: string
  is_visible: boolean
  user: {
    id: string
    username: string | null
    full_name: string
    is_public: boolean
    avatar_url: string | null
  }
}

export default function CommunityPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchSchedules()
    }
  }, [user, authLoading, router])

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules?limit=20')
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipants = async (scheduleId: string) => {
    setParticipantsLoading(true)
    try {
      const response = await fetch(`/api/schedules/${scheduleId}/participants`)
      const data = await response.json()
      setParticipants(data.participants || [])
    } catch (error) {
      console.error('Error fetching participants:', error)
      toast.error('Failed to load participants')
    } finally {
      setParticipantsLoading(false)
    }
  }

  const handleScheduleSelect = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    fetchParticipants(schedule.schedule_id)
  }

  const typeColors = {
    swimming: 'bg-blue-100 text-blue-800',
    functional_training: 'bg-green-100 text-green-800',
    animal_movement: 'bg-orange-100 text-orange-800',
    conditioning: 'bg-red-100 text-red-800',
    fitness: 'bg-purple-100 text-purple-800'
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Community</h1>
          <p className="text-gray-600">See who's joining the upcoming sessions and connect with fellow athletes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-600" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                </div>
              ) : schedules.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {schedules.filter(s => s.participant_count > 0).map((schedule) => (
                    <div
                      key={schedule.schedule_id}
                      onClick={() => handleScheduleSelect(schedule)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedSchedule?.schedule_id === schedule.schedule_id
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 bg-white hover:border-cyan-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{schedule.course_title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          typeColors[schedule.course_type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.course_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(new Date(schedule.start_time), 'EEE, MMM d • HH:mm')}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {schedule.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-cyan-600" />
                          <span className="font-medium text-cyan-600">
                            {schedule.participant_count} joined
                          </span>
                          <span className="text-gray-500">
                            • {schedule.available_spots} spots left
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">€{schedule.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming sessions with participants</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-ultramarine-600" />
                {selectedSchedule ? 'Session Participants' : 'Select a Session'}
              </CardTitle>
              {selectedSchedule && (
                <div className="text-sm text-gray-600">
                  {selectedSchedule.course_title} • {format(new Date(selectedSchedule.start_time), 'EEE, MMM d • HH:mm')}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!selectedSchedule ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Select a session</p>
                  <p className="text-gray-400 text-sm">Choose a session on the left to see who's joining</p>
                </div>
              ) : participantsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                </div>
              ) : participants.length > 0 ? (
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.booking_id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center overflow-hidden">
                        {participant.user.avatar_url ? (
                          <img
                            src={participant.user.avatar_url}
                            alt={participant.user.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-cyan-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {participant.user.full_name}
                        </div>
                        {participant.user.username && (
                          <div className="text-sm text-gray-500">
                            @{participant.user.username}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {participant.is_visible ? (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Private</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center text-sm text-gray-500">
                      {participants.length} of {selectedSchedule.total_spots} spots filled
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(participants.length / selectedSchedule.total_spots) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No participants yet</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to join this session!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">
                {schedules.reduce((sum, s) => sum + s.participant_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Active Participants</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-ultramarine-600 mb-2">
                {schedules.filter(s => s.participant_count > 0).length}
              </div>
              <div className="text-sm text-gray-600">Sessions with Participants</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(
                  schedules.reduce((sum, s) => sum + (s.participant_count / s.total_spots), 0) / 
                  Math.max(schedules.length, 1) * 100
                )}%
              </div>
              <div className="text-sm text-gray-600">Average Capacity</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}