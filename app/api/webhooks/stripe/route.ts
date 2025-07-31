import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update booking status to confirmed
        const { error } = await supabaseAdmin
          .from('bookings')
          .update({ 
            status: 'confirmed',
            stripe_payment_intent_id: session.payment_intent as string
          })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('Error updating booking:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // TODO: Send confirmation email via SendGrid
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update booking status to cancelled
        await supabaseAdmin
          .from('bookings')
          .update({ 
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Update booking status to refunded
        await supabaseAdmin
          .from('bookings')
          .update({ 
            status: 'refunded',
            cancelled_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', charge.payment_intent)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}