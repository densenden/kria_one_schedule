import { OnboardingForm } from './OnboardingForm'

export const metadata = {
  title: 'Start Your Sports Community | Sports Community Platform',
  description: 'Create your own branded sports community platform. Manage courses, members, and bookings with ease.',
}

export default function OnboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Sports Community
          </h1>
          <p className="text-lg text-gray-600">
            Create your own branded platform for courses, members, and bookings.
            Get started in minutes.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <OnboardingForm />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Already have a community?{' '}
            <a href="/sign-in" className="text-cyan-600 hover:text-cyan-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
