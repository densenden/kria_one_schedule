import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const { scheduleId, userId } = await req.json()

    if (!scheduleId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get schedule and course details
    const { data: schedule, error: scheduleError } = await supabaseAdmin
      .from('course_schedules')
      .select(`
        *,
        courses (
          id,
          title,
          description,
          price,
          type,
          image_url
        )
      `)
      .eq('id', scheduleId)
      .single()

    if (scheduleError || !schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Check if user can book
    const { data: canBook } = await supabaseAdmin
      .rpc('can_user_book_schedule', {
        p_user_id: userId,
        p_schedule_id: scheduleId
      })

    if (!canBook) {
      return NextResponse.json(
        { error: 'Cannot book this schedule' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: schedule.courses.title,
              description: `${new Date(schedule.start_time).toLocaleDateString()} ${new Date(schedule.start_time).toLocaleTimeString()} - ${schedule.location}`,
              images: schedule.courses.image_url ? [schedule.courses.image_url] : [],
            },
            unit_amount: Math.round(schedule.courses.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/calendar`,
      metadata: {
        scheduleId,
        userId,
        courseId: schedule.courses.id,
      },
    })

    // Create pending booking
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        schedule_id: scheduleId,
        stripe_session_id: session.id,
        status: 'pending',
        amount: schedule.courses.price,
      })
      .select()
      .single()

    if (bookingError) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      checkoutUrl: session.url,
      bookingId: booking.id 
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}