'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '../../components/ui/Navigation'
import { Footer } from '../../components/ui/Footer'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Award, 
  Heart, 
  Target, 
  Users,
  BookOpen,
  MessageCircle,
  ArrowRight
} from 'lucide-react'

export default function RemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 relative">
          {/* Background Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Image
              src="/assets/logos/KRIA_logo_outlines.svg"
              alt=""
              width={600}
              height={600}
              className="max-w-none"
            />
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Meet
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-jungle-teal">
                    {' '}Remo
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Gründer und Visionär von KRIA Training - ein Mensch, der Bewegung als Weg zur persönlichen Transformation versteht.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/schedule">
                    <Button variant="primary" size="lg" className="flex items-center gap-2">
                      Kurse mit Remo
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="outline" size="lg">
                      Community beitreten
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/assets/images/remo1.png"
                  alt="Remo bei KRIA Training"
                  width={500}
                  height={384}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Personal Story Section */}
        <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Eine Reise der Transformation
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Remos Geschichte - von persönlichen Herausforderungen zur Vision einer bewussten Trainingskultur
                </p>
              </div>

              <div className="space-y-8">
                <Card className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Der Wendepunkt
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Nach Jahren im klassischen Fitnessstudio erkannte Remo, dass echter Fortschritt nicht nur aus körperlicher Anstrengung entsteht. 
                        Ein Burnout zwang ihn, seinen Ansatz zu überdenken - und führte ihn zu einer ganzheitlicheren Sichtweise auf Bewegung und Gesundheit.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="p-3 bg-secondary-jungle-teal/20 rounded-lg flex-shrink-0">
                      <Target className="h-6 w-6 text-secondary-jungle-teal" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Die Suche nach Authentizität
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Remo begann, natürliche Bewegungsmuster zu erforschen - von Animal Movement bis hin zu funktionellen Trainingsformen. 
                        Er studierte die Verbindung zwischen Körper und Geist und entwickelte seine eigene Philosophie der achtsamen Bewegung.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Community als Katalysator
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Die Erkenntnis, dass Transformation am besten in Gemeinschaft geschieht, führte zur Gründung von KRIA. 
                        Remo wollte einen Raum schaffen, in dem Menschen sich gegenseitig unterstützen und gemeinsam über ihre Grenzen hinauswachsen können.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy & Approach */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Remos Trainingsphilosophie
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Ein ganzheitlicher Ansatz, der Körper, Geist und Seele in Einklang bringt
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary-jungle-teal/10 rounded-2xl p-8 mb-12">
              <div className="text-center">
                <blockquote className="text-xl text-gray-700 dark:text-gray-300 italic mb-4">
                  "Wahre Stärke entsteht nicht durch das Überwinden des Körpers, 
                  sondern durch das Verstehen und Ehren seiner natürlichen Weisheit."
                </blockquote>
                <cite className="text-gray-600 dark:text-gray-400 font-medium">- Remo, KRIA Gründer</cite>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Award className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Qualität vor Quantität</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Jede Bewegung wird bewusst und präzise ausgeführt. Remo lehrt, dass weniger oft mehr ist.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Heart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Emotionale Intelligenz</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Training als Weg zur Selbsterkenntnis - Remo hilft dabei, körperliche und emotionale Blockaden zu lösen.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Kontinuierliches Lernen</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Remo bildet sich ständig weiter und integriert neue Erkenntnisse aus Sportwissenschaft und Körperarbeit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Individuelle Betreuung</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Jeder Mensch ist einzigartig - Remo passt das Training an die individuellen Bedürfnisse an.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Nachhaltige Ziele</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Langfristige Gesundheit und Wohlbefinden stehen im Mittelpunkt, nicht kurzfristige Erfolge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MessageCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Offene Kommunikation</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Remo schafft eine Atmosphäre des Vertrauens, in der sich jeder öffnen und wachsen kann.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications & Background */}
        <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Qualifikationen & Hintergrund
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Remos Expertise basiert auf fundierten Ausbildungen und jahrelanger praktischer Erfahrung
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <div className="text-3xl mb-4">🎓</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Sportwissenschaft</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Studium der Sportwissenschaft mit Schwerpunkt Bewegungsanalyse
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-4">🏊</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Aquatic Training</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Zertifizierter Trainer für Wassertraining und Schwimmtechnik
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-4">🧘</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Körperarbeit</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Ausbildungen in Yoga, Pilates und verschiedenen Körpertherapien
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-4">🦎</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Animal Movement</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Spezialisierung auf natürliche Bewegungsmuster und Mobility
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-4">💪</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Functional Training</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Zertifizierungen in funktionellem Training und HIIT
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="text-3xl mb-4">🧠</div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Mental Coaching</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Weiterbildungen in Sportpsychologie und Mentaltraining
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Touch */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              Training mit Remo
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  "Mein Ziel ist es nicht, euch zu zeigen, wie stark ihr sein könnt - sondern euch dabei zu helfen, 
                  eure eigene Stärke zu entdecken. Jeder Mensch trägt ein enormes Potenzial in sich. 
                  Manchmal braucht es nur jemanden, der daran glaubt und den Weg weist."
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  In Remos Kursen erlebt ihr eine einzigartige Mischung aus präziser Technik, 
                  achtsamer Bewegung und echter menschlicher Verbindung. Er schafft es, 
                  auch die schüchternsten Teilnehmer aus ihrer Komfortzone zu locken - 
                  immer mit Respekt und einem Lächeln.
                </p>
                <Link href="/schedule">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    Kurse mit Remo buchen
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <Image
                  src="/assets/images/remo2.png"
                  alt="Remo beim Training"
                  width={400}
                  height={320}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}