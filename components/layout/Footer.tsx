import Link from 'next/link'
import Image from 'next/image'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import type { Tenant } from '@/types/database.types'
import type { TenantSettings } from '@/types/tenant.types'

interface SocialLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  linkedin?: string
}

interface FooterProps {
  tenant?: Tenant | null
}

const socialIcons: Record<keyof SocialLinks, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
}

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
]

const legalLinks = [
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/imprint', label: 'Imprint' },
]

export function Footer({ tenant }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const tenantName = tenant?.name || 'Sports Community'
  const logoUrl = tenant?.logo_url || '/assets/logos/KRIAWort-Bildmarke_unterzeile_indigo.svg'

  // Parse social links from tenant settings
  const settings = tenant?.settings as { social_links?: SocialLinks } | null
  const socialLinks: SocialLinks = settings?.social_links || {}

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={logoUrl}
                alt={tenantName}
                width={160}
                height={50}
                className="w-40 h-auto"
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              Your community for fitness and wellness. Book courses, connect with fellow athletes, and achieve your training goals together.
            </p>

            {/* Social Links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex items-center gap-3">
                {(Object.entries(socialLinks) as [keyof SocialLinks, string][]).map(([platform, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[platform]
                  if (!Icon) return null

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-tenant hover:text-white transition-all duration-200"
                      aria-label={`Follow us on ${platform}`}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-tenant dark:hover:text-tenant transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {tenant?.email && (
                <li>
                  <a
                    href={`mailto:${tenant.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-tenant transition-colors"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>{tenant.email}</span>
                  </a>
                </li>
              )}
              {tenant?.phone && (
                <li>
                  <a
                    href={`tel:${tenant.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-tenant transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{tenant.phone}</span>
                  </a>
                </li>
              )}
              {tenant?.address && (
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{tenant.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} {tenantName}. All rights reserved.
            </p>

            {/* Legal Links */}
            <nav className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-tenant transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
