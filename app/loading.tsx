import { LoadingState } from '../components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-ultramarine-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <LoadingState 
        title="Loading KRIA Training"
        message="Please wait while we prepare your training experience..."
      />
    </div>
  )
}