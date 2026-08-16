import { clsx } from 'clsx'

/**
 * High-res vector only:
 * /assets/logos/KRIA-Wort-Bildmarke_indigo.svg
 * (paths from Illustrator — emblem + KRIA, no subtitle)
 */

export const LOGO_SRC = '/assets/logos/KRIA-Wort-Bildmarke_indigo.svg'
/** viewBox aspect 1100 x 340 */
export const LOGO_WIDTH = 1100
export const LOGO_HEIGHT = 340

type LogoSize = 'sm' | 'md' | 'lg' | 'hero'

const FRAME: Record<LogoSize, { height: number; maxWidth: number }> = {
  sm: { height: 28, maxWidth: 120 },
  md: { height: 40, maxWidth: 168 },
  lg: { height: 52, maxWidth: 220 },
  hero: { height: 72, maxWidth: 300 },
}

interface LogoProps {
  size?: LogoSize
  className?: string
  muted?: boolean
  priority?: boolean
  alt?: string
}

export function Logo({
  size = 'md',
  className,
  muted = false,
  priority = false,
  alt = 'KRIA',
}: LogoProps) {
  const frame = FRAME[size]

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-start overflow-visible shrink-0',
        muted && 'opacity-40',
        className
      )}
      style={{ height: frame.height, maxWidth: frame.maxWidth }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_SRC}
        alt={alt}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        draggable={false}
        className="block h-full w-auto max-w-full object-contain object-left select-none"
      />
    </span>
  )
}

export function LogoBanner({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'relative flex items-center justify-center overflow-hidden bg-muted',
        className
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
        aria-hidden
      />
      <Logo size="lg" muted className="relative z-[1]" />
    </div>
  )
}
