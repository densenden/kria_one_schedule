'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '../../components/ui/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/contexts/AuthContext'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Euro
} from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
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

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedType, setSelectedType] = useState<string>('')
  const [loading, setLoading] = useState(true)
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
  }, [user, authLoading, router, currentWeek])

  const fetchSchedules = async () => {
    try {
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
      const weekEnd = addDays(weekStart, 6)
      
      const response = await fetch(
        `/api/schedules?from=${weekStart.toISOString()}&to=${weekEnd.toISOString()}`
      )
      const data = await response.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error('Failed to load schedules')
    } finally {
      setLoading(false)
    }
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

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7))
  }

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const getSchedulesForDay = (day: Date) => {
    return schedules.filter(schedule => {
      const scheduleDate = parseISO(schedule.start_time)
      return isSameDay(scheduleDate, day)
    }).filter(schedule => {
      if (selectedType) {
        return schedule.course_type === selectedType
      }
      return true
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  }

  const courseTypes = [
    { value: '', label: 'All Types' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'functional_training', label: 'Functional Training' },
    { value: 'animal_movement', label: 'Animal Movement' },
    { value: 'conditioning', label: 'Conditioning' },
    { value: 'fitness', label: 'Fitness' }
  ]

  const typeColors = {
    swimming: 'bg-blue-100 text-blue-800 border-blue-200',
    functional_training: 'bg-green-100 text-green-800 border-green-200',
    animal_movement: 'bg-orange-100 text-orange-800 border-orange-200',
    conditioning: 'bg-red-100 text-red-800 border-red-200',
    fitness: 'bg-purple-100 text-purple-800 border-purple-200'
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const weekDays = getWeekDays()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Schedule</h1>
          <p className="text-gray-600">Plan and book your training sessions</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousWeek}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="text-center">
                  <h2 className="text-lg font-semibold">
                    {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                  </h2>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextWeek}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none text-sm font-medium"
                >
                  {courseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const daySchedules = getSchedulesForDay(day)
              const isToday = isSameDay(day, new Date())
              
              return (
                <Card key={index} className={`min-h-[400px] ${isToday ? 'ring-2 ring-primary/50' : ''}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center">
                      <div className="text-sm text-gray-500">
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-lg ${isToday ? 'text-primary font-bold' : 'text-gray-900'}`}>
                        {format(day, 'd')}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {daySchedules.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Calendar className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">No sessions</p>
                        </div>
                      ) : (
                        daySchedules.map((schedule) => (
                          <div
                            key={schedule.schedule_id}
                            className={`p-3 rounded-lg border-l-4 bg-white shadow-sm hover:shadow-md transition-shadow ${
                              typeColors[schedule.course_type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            <div className="font-medium text-sm mb-1 line-clamp-2">
                              {schedule.course_title}
                            </div>
                            
                            <div className="space-y-1 text-xs text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(parseISO(schedule.start_time), 'HH:mm')} - {format(parseISO(schedule.end_time), 'HH:mm')}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {schedule.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {schedule.available_spots} spots left
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary">€{schedule.price}</span>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={schedule.available_spots === 0}
                                onClick={() => handleBookSchedule(schedule.schedule_id)}
                                className="text-xs px-2 py-1 h-6"
                              >
                                {schedule.available_spots === 0 ? 'Full' : 'Book'}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Course Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(typeColors).map(([type, colorClass]) => (
                <div key={type} className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                  {type.replace('_', ' ').toUpperCase()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}