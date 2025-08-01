#!/bin/bash

# Set up Vercel environment variables
echo "Setting up Vercel environment variables..."

# Public environment variables
vercel env add NEXT_PUBLIC_APP_URL production < <(echo "https://kria-one-schedule-1.vercel.app")
vercel env add NEXT_PUBLIC_SUPABASE_URL production < <(echo "YOUR_SUPABASE_URL")
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production < <(echo "YOUR_SUPABASE_ANON_KEY")

# Secret environment variables
vercel env add STRIPE_SECRET_KEY production < <(echo "YOUR_STRIPE_SECRET_KEY")
vercel env add SENDGRID_API_KEY production < <(echo "YOUR_SENDGRID_API_KEY")

echo "Environment variables setup complete!"