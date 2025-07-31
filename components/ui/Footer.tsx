import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/assets/logos/KRIAWort-Bildmarke_unterzeile_indigo.svg"
                alt="KRIA Training"
                width={160}
                height={50}
                className="w-40 h-auto"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Train smarter, connect better. Join KRIA's mindful training community for a transformative fitness journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-600 dark:text-gray-400 hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gray-600 dark:text-gray-400 hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 dark:text-gray-400 hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/centro" className="text-gray-600 dark:text-gray-400 hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  Centro
                </Link>
              </li>
              <li>
                <Link href="/remo" className="text-gray-600 dark:text-gray-400 hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  Meet Remo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Email: info@kria-training.de</li>
              <li>Phone: +49 123 456789</li>
              <li>
                <Link href="https://kria-training.de" target="_blank" rel="noopener noreferrer" className="hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  kria-training.de
                </Link>
              </li>
              <li>
                <Link href="https://kria-centro.de" target="_blank" rel="noopener noreferrer" className="hover:text-[#3345a6] dark:hover:text-[#3345a6] transition-colors">
                  kria-centro.de
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © 2024 KRIA Training. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Designed by</span>
              <Image
                src="/assets/logos/StudioSen2024slim.svg"
                alt="Studio Sen"
                width={80}
                height={20}
                className="w-20 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}