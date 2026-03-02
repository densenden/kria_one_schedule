import { createServiceClient } from './server'
import type { Tenant, Course, Schedule, User } from '@/types/database.types'

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching tenant:', error)
    return null
  }

  return data
}

/**
 * Get all active courses for a tenant
 */
export async function getCourses(tenantId: string): Promise<Course[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users!instructor_id(id, full_name, avatar_url)
    `)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('title')

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  return data || []
}

/**
 * Get a single course by ID
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users!instructor_id(*)
    `)
    .eq('id', courseId)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data
}

/**
 * Get upcoming schedules for a tenant
 */
export async function getUpcomingSchedules(
  tenantId: string,
  fromDate: Date = new Date(),
  toDate?: Date,
  limit?: number
) {
  const supabase = createServiceClient()

  let query = supabase
    .from('schedules')
    .select(`
      *,
      course:courses!course_id(*),
      instructor:users!instructor_id(id, full_name, avatar_url)
    `)
    .eq('tenant_id', tenantId)
    .eq('is_cancelled', false)
    .gte('start_time', fromDate.toISOString())
    .order('start_time')

  if (toDate) {
    query = query.lte('start_time', toDate.toISOString())
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching schedules:', error)
    return []
  }

  return data || []
}

/**
 * Get schedules for a specific course
 */
export async function getCourseSchedules(courseId: string, fromDate: Date = new Date()) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('schedules')
    .select(`
      *,
      instructor:users!instructor_id(id, full_name, avatar_url)
    `)
    .eq('course_id', courseId)
    .eq('is_cancelled', false)
    .gte('start_time', fromDate.toISOString())
    .order('start_time')

  if (error) {
    console.error('Error fetching course schedules:', error)
    return []
  }

  return data || []
}

/**
 * Get booking count for a schedule
 */
export async function getBookingCount(scheduleId: string): Promise<number> {
  const supabase = createServiceClient()

  const { count, error } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('schedule_id', scheduleId)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Error fetching booking count:', error)
    return 0
  }

  return count || 0
}

/**
 * Get coaches for a tenant
 */
export async function getCoaches(tenantId: string): Promise<User[]> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('tenant_id', tenantId)
    .in('role', ['coach', 'admin', 'owner'])
    .order('full_name')

  if (error) {
    console.error('Error fetching coaches:', error)
    return []
  }

  return data || []
}

/**
 * Get published pages for a tenant
 */
export async function getPages(tenantId: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_published', true)
    .order('nav_order')

  if (error) {
    console.error('Error fetching pages:', error)
    return []
  }

  return data || []
}

/**
 * Get a single page by slug
 */
export async function getPage(tenantId: string, slug: string) {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching page:', error)
    return null
  }

  return data
}
