import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ScheduleCard } from '@/components/ui/ScheduleCard'
import { createServiceClient } from '@/lib/supabase/server'
import type { Tenant } from '@/types/database.types'

interface UpcomingClassesProps {
  tenant: Tenant
}

// Type for schedule data from the RPC function
interface ScheduleData {
  schedule_id: string
  course_id: string
  course_title: string
  course_type: string
  course_image: string | null
  instructor_name: string | null
  instructor_avatar: string | null
  start_time: string
  end_time: string
  location: string
  available_spots: number | null
  total_spots: number | null
  booked_count: number
  price: number | null
  is_cancelled: boolean
}

async function getUpcomingSchedules(tenantId: string): Promise<ScheduleData[]> {
  const supabase = createServiceClient()

  const now = new Date()
  const weekLater = new Date()
  weekLater.setDate(weekLater.getDate() + 7)

  const { data, error } = await supabase.rpc('get_tenant_schedules', {
    p_tenant_id: tenantId,
    p_from_date: now.toISOString(),
    p_to_date: weekLater.toISOString(),
  })

  if (error) {
    console.error('Error fetching schedules:', error)
    return []
  }

  // Filter out cancelled schedules and limit to 4
  return (data || [])
    .filter((schedule: ScheduleData) => !schedule.is_cancelled)
    .slice(0, 4)
}

export async function UpcomingClasses({ tenant }: UpcomingClassesProps) {
  const schedules = await getUpcomingSchedules(tenant.id)

  if (schedules.length === 0) {
    return null
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Naechste Kurse
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sichere dir jetzt deinen Platz in unseren beliebten Kursen
            </p>
          </div>
          <Link href="/schedule">
            <Button variant="outline" className="btn-outline group">
              Alle Kurse ansehen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schedules.map((schedule, index) => (
            <ScheduleCard
              key={schedule.schedule_id}
              schedule={schedule}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>

        {/* CTA for more */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Finde den perfekten Kurs fuer dich in unserem vollstaendigen Stundenplan
          </p>
          <Link href="/courses">
            <Button variant="primary" size="lg" className="btn-primary">
              Kursangebot entdecken
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
