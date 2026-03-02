import { Calendar, CreditCard, Users, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

const features = [
  {
    icon: Calendar,
    title: 'Flexible Kurse',
    description:
      'Buche Kurse, die zu deinem Zeitplan passen. Unser vielfaeltiges Angebot bietet fuer jeden das Richtige.',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    icon: CreditCard,
    title: 'Einfache Buchung',
    description:
      'Mit wenigen Klicks zum naechsten Training. Sichere Zahlungen und sofortige Bestaetigung.',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Werde Teil einer aktiven Gemeinschaft. Trainiere mit Gleichgesinnten und motiviert euch gegenseitig.',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Zap,
    title: 'Professionelle Trainer',
    description:
      'Lerne von erfahrenen und zertifizierten Trainern, die dich individuell unterstuetzen.',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Warum bei uns trainieren?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Wir bieten dir alles, was du fuer ein erfolgreiches Training brauchst
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="card-hover group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
