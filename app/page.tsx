'use client'

import Link from 'next/link'
import { Navigation } from '../components/ui/Navigation'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { 
  Calendar, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Train Smarter,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-ultramarine-500">
                {' '}Connect Better
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join KRIA's mindful training community. Book courses, track your progress, and connect with fellow athletes on your fitness journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Browse Courses
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need for Your Training Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From course booking to community connection, KRIA provides all the tools you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Smart Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Book sessions effortlessly with our intuitive calendar system. See availability, track your progress, and never miss a workout.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-ultramarine-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-ultramarine-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with like-minded athletes, see who's joining your sessions, and build lasting training partnerships.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Diverse Programs</h3>
              <p className="text-gray-600 dark:text-gray-300">
                From swimming to animal movement, functional training to HIIT conditioning. Find the perfect program for your goals.
              </p>
            </Card>
          </div>
        </section>

        {/* Course Types */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Choose Your Training Style
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Explore our range of mindfully designed training programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Swimming',
                description: 'Energizing aquatic sessions',
                color: 'from-blue-400 to-blue-600',
                icon: '🏊‍♀️'
              },
              {
                title: 'Animal Movement',
                description: 'Natural movement patterns',
                color: 'from-orange-400 to-orange-600',
                icon: '🐾'
              },
              {
                title: 'Functional Training',
                description: 'Real-world strength building',
                color: 'from-green-400 to-green-600',
                icon: '💪'
              },
              {
                title: 'HIIT Conditioning',
                description: 'High-intensity intervals',
                color: 'from-red-400 to-red-600',
                icon: '🔥'
              }
            ].map((course, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-32 bg-gradient-to-br ${course.color} flex items-center justify-center text-4xl`}>
                  {course.icon}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{course.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Why Choose KRIA?
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Join hundreds of athletes who've transformed their training with our platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[
                    'Mindfully designed training programs',
                    'Expert certified instructors',
                    'Flexible scheduling system',
                    'Community-driven approach',
                    'Progress tracking & analytics',
                    'Secure payment processing'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-cyan-500 to-ultramarine-500 rounded-xl p-8 text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">500+</div>
                    <div className="text-cyan-100 mb-6">Active Members</div>
                    
                    <div className="text-4xl font-bold mb-2">50+</div>
                    <div className="text-cyan-100 mb-6">Weekly Sessions</div>
                    
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-cyan-100">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join the KRIA community today and discover a more mindful approach to fitness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Browse Available Courses
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}