'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '../../../components/ui/Navigation'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { CheckCircle, Calendar, Users, ArrowRight } from 'lucide-react'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<{
    courseTitle: string
    amount: string
    date: string
    time: string
    location: string
  } | null>(null)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd verify the session with Stripe and get booking details
      // For now, we'll simulate a successful booking
      setTimeout(() => {
        setBookingDetails({
          courseTitle: 'Course Booked Successfully',
          amount: '€25.00',
          date: new Date().toLocaleDateString(),
          time: '18:00 - 19:00',
          location: 'Studio A'
        })
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Booking Confirmed! 🎉
                </h1>
                <p className="text-lg text-gray-600">
                  Your training session has been successfully booked
                </p>
              </div>

              {bookingDetails && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Booking Details
                  </h2>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course:</span>
                      <span className="font-medium">{bookingDetails.courseTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{bookingDetails.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{bookingDetails.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{bookingDetails.location}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-3">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-green-600">{bookingDetails.amount}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-cyan-800">
                    <Calendar className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">What's Next?</div>
                      <div className="text-sm">
                        You'll receive a confirmation email shortly. Please arrive 10 minutes early.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button variant="primary" className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  
                  <Link href="/schedule">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      View Schedule
                    </Button>
                  </Link>
                  
                  <Link href="/community">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      See Who's Joining
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}