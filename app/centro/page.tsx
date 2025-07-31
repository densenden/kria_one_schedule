'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '../../components/ui/Navigation'
import { Footer } from '../../components/ui/Footer'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  MapPin, 
  Clock, 
  Users, 
  Dumbbell,
  Waves,
  Heart,
  ArrowRight,
  ExternalLink
} from 'lucide-react'

export default function CentroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-8">
            <Image
              src="/assets/images/random/u9967959759_athlete_running_uphill_barefoot_on_a_muddy_jungle_299b5136-6564-4c9f-b74b-837dfc0e7dc7_0.png"
              alt=""
              width={1200}
              height={800}
              className="w-full h-full object-cover blur-md"
            />
          </div>
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
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              KRIA
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-jungle-teal">
                {' '}Centro
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Unser Trainingszentrum in München - der Ort, wo Bewegung, Gemeinschaft und persönliche Entwicklung zusammenkommen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://kria-centro.de" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Besuche kria-centro.de
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/schedule">
                <Button variant="outline" size="lg">
                  Kurse buchen
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Unser Zuhause
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Das KRIA Centro ist mehr als nur ein Fitnessstudio - es ist ein Ort der Begegnung und Transformation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Mitten im Herzen Münchens
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Zentrale Lage</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Optimal erreichbar mit öffentlichen Verkehrsmitteln und dem Auto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Flexible Zeiten</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Kurse von früh bis spät - passend zu deinem Alltag
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Community</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        Ein Ort, wo sich Gleichgesinnte treffen und gemeinsam wachsen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/assets/images/random/u9967959759_natural_coach_observing_movement_posture_vibrant__c733ca94-c9ca-4678-9ed1-65fea36a385a_2.png"
                  alt="KRIA Centro Training Session"
                  width={500}
                  height={320}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src="/assets/images/random/u9967959759_a_personal_trainer_guiding_an_intense_bodyweight__27ea51a8-c278-46fb-9e0a-9d2e85cae96d_2.png"
              alt=""
              width={1200}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Unsere Ausstattung
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Moderne Trainingsräume und Ausstattung für alle KRIA Trainingsmethoden
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary-100 rounded-lg mr-4">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Functional Training</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Hochwertige Geräte für funktionelles Training, Kettlebells, TRX und mehr für ganzheitliche Bewegung.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary-jungle-teal/20 rounded-lg mr-4">
                      <Waves className="h-6 w-6 text-secondary-jungle-teal" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Aquatic Training</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Partnerschaft mit erstklassigen Schwimmbädern für unser einzigartiges Wassertraining.
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Wellness Bereich</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Ruhezone für Meditation, Stretching und Recovery - der perfekte Ausklang nach dem Training.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Mehr als nur Training
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Das KRIA Centro verkörpert unsere Philosophie von bewusster Bewegung und authentischer Gemeinschaft
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary-jungle-teal/10 rounded-2xl p-8 mb-12">
              <div className="text-center">
                <blockquote className="text-xl text-gray-700 dark:text-gray-300 italic mb-4">
                  "Ein Ort, an dem jeder Einzelne seinen eigenen Weg zu Stärke und Wohlbefinden findet - 
                  unterstützt von einer Gemeinschaft, die gemeinsam wächst."
                </blockquote>
                <cite className="text-gray-600 dark:text-gray-400 font-medium">- KRIA Centro Vision</cite>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Moderne Räume</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Lichtdurchflutete, offene Trainingsräume mit natürlichen Materialien
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Nachhaltigkeit</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Umweltbewusst gestaltet mit erneuerbaren Energien und nachhaltigen Materialien
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">💫</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Atmosphäre</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Ruhige, inspirierende Umgebung, die zu Achtsamkeit und Fokus einlädt
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Besuche uns im Centro
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Erlebe die KRIA Philosophie vor Ort und werde Teil unserer Community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://kria-centro.de" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Mehr erfahren
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/schedule">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  Kurse buchen
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}