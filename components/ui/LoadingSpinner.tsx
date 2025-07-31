import Image from 'next/image'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'primary' | 'secondary' | 'white'
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div
      className={cn(
        'animate-pulse',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <Image
        src="/assets/logos/StudioSen2024slim.svg"
        alt="Loading..."
        width={48}
        height={12}
        className="w-full h-auto opacity-30 filter grayscale"
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingStateProps {
  title?: string
  message?: string
  children?: React.ReactNode
  className?: string
}

export function LoadingState({ 
  title = 'Loading...',
  message,
  children,
  className
}: LoadingStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <LoadingSpinner size="lg" className="mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-gray-600 dark:text-gray-300 max-w-sm">
          {message}
        </p>
      )}
      {children}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        className
      )}
    />
  )
}