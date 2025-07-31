'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '../../components/ui/Navigation'
import { Footer } from '../../components/ui/Footer'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Heart, 
  Target, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-jungle-teal/20 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/assets/images/random/u9967959759_natural_coach_observing_movement_posture_vibrant__b4acff36-02a2-45dd-a2d4-e7ac8c785339_0.png"
              alt=""
              width={1200}
              height={800}
              className="w-full h-full object-cover blur-sm"
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
              About
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-jungle-teal">
                {' '}KRIA
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the philosophy and vision behind KRIA Training - where mindful movement meets community connection.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Our Philosophy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                KRIA steht für bewusste Bewegung, die Körper und Geist in Einklang bringt
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Featured Image */}
              <div className="lg:col-span-1">
                <Image
                  src="/assets/images/random/u9967959759_barefoot_athlete_in_mid-squat_grounded_on_natural_fb690755-eedb-4e5e-95d5-7fffb37d247f_0.png"
                  alt="Mindful Movement Training"
                  width={400}
                  height={320}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Philosophy Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-primary-100 rounded-lg mr-4">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Mindful Movement</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Jede Bewegung wird bewusst ausgeführt. Wir glauben daran, dass Qualität vor Quantität steht und dass achtsame Körperarbeit nachhaltige Veränderungen bewirkt.
                  </p>
                </Card>

                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary-jungle-teal/20 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-secondary-jungle-teal" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Community First</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Training ist mehr als individuelle Leistung. In unserer Gemeinschaft unterstützen wir uns gegenseitig und wachsen gemeinsam über uns hinaus.
                  </p>
                </Card>

                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                      <Target className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Holistic Approach</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Wir betrachten den Menschen ganzheitlich. Körperliche Fitness, mentale Stärke und emotionales Wohlbefinden gehören für uns zusammen.
                  </p>
                </Card>

                <Card className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg mr-4">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Authentic Movement</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Echte Bewegung entsteht aus dem Körper heraus. Wir arbeiten mit natürlichen Bewegungsmustern und respektieren die Individualität jedes Körpers.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Training Methods */}
        <section className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src="/assets/images/random/u9967959759_abstract_composition_of_human_anatomy_training_po_5e4895b3-71cb-481d-9fc2-656f91df5602_0.png"
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
                  Unsere Trainingsmethoden
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Vielfältige Ansätze für deine körperliche und mentale Entwicklung
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Training Methods Lists */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Functional Training</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Bewegungen, die deinen Alltag stärken und deine natürliche Mobilität fördern.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Animal Movement</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Von der Natur inspirierte Bewegungsformen für mehr Koordination und Körperbewusstsein.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Aquatic Training</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Kraftvolles und regeneratives Training im Wasser für alle Fitnesslevel.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">HIIT Conditioning</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Intensive Intervalle für maximale Effizienz und nachhaltigen Trainingseffekt.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Mobility & Recovery</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Gezielte Beweglichkeitsarbeit und Regeneration als Basis für alle anderen Aktivitäten.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Mental Training</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Atemarbeit, Meditation und Achtsamkeitstraining für mentale Stärke.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Training Image */}
                <div className="lg:col-span-1">
                  <Image
                    src="/assets/images/random/u9967959759_a_personal_trainer_guiding_an_intense_bodyweight__27ea51a8-c278-46fb-9e0a-9d2e85cae96d_0.png"
                    alt="Personal Training Session"
                    width={400}
                    height={320}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Unsere Werte
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12">
              Diese Prinzipien leiten uns in allem, was wir tun
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Wachstum</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Kontinuierliche Entwicklung und das Überwinden persönlicher Grenzen
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Respekt</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Achtung vor jedem Individuum und dessen einzigartigem Weg
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Neue Wege finden und bewährte Methoden weiterentwickeln
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Bereit für deine Reise?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Werde Teil der KRIA Community und entdecke, was in dir steckt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Kurse entdecken
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg">
                  Kostenlos anmelden
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