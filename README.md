# KRIA Training Community App

A modern, mindful training community platform built with Next.js, Supabase, and Stripe. Book sports courses, connect with fellow athletes, and track your fitness journey.

![KRIA Training](https://img.shields.io/badge/KRIA-Training%20Community-00CED1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

## 🌟 Features

### Core Functionality
- **🔐 Authentication**: Secure user registration and login with Supabase Auth
- **📚 Course Catalog**: Browse and filter training courses (Swimming, Animal Movement, Functional Training, HIIT)
- **📅 Smart Scheduling**: Weekly calendar view with real-time availability
- **👥 Community Features**: See who's joining your sessions and build connections
- **👤 Profile Management**: Customize your athlete profile with goals and preferences
- **💳 Secure Payments**: Stripe integration for course bookings
- **🌓 Dark Mode**: Beautiful dark theme with system preference detection

### Technical Features
- **Real-time Updates**: Live participant counts and booking status
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and user-friendly messages
- **Testing**: Jest and React Testing Library setup
- **Performance**: Optimized builds with Next.js 14 App Router

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (free tier works)
- Stripe account for payments (test mode available)

### Environment Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd kria_one_schedule-1
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Copy the environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

1. Create a new Supabase project
2. Run the migrations in order:
```bash
# In Supabase SQL editor, run each file in the migrations folder:
- 001_initial_schema.sql
- 002_rls_policies.sql
- 003_functions_triggers.sql
- 004_storage_buckets.sql
```

3. (Optional) Add seed data for testing

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
kria-training-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course browsing
│   ├── schedule/          # Calendar/booking
│   ├── community/         # Participant views
│   └── profile/           # User profiles
├── components/            # Reusable UI components
│   ├── ui/               # Base components
│   ├── auth/             # Auth forms
│   └── courses/          # Course components
├── lib/                   # Utilities and contexts
│   ├── contexts/         # React contexts
│   └── supabase/         # Database client
├── supabase/             # Database schema
│   └── migrations/       # SQL migrations
├── __tests__/            # Test files
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom cyan/ultramarine theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout
- **State Management**: React Context API
- **Testing**: Jest, React Testing Library
- **Icons**: Lucide React

## 🎨 Design System

The app features a mindful, minimalist design with:
- **Primary Colors**: Cyan (#00CED1) and Ultramarine
- **Typography**: Clean, readable Inter font
- **Components**: Consistent button, card, and modal patterns
- **Dark Mode**: Full dark theme support with smooth transitions
- **Animations**: Subtle hover effects and loading states

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project includes:
- Unit tests for components
- Utility function tests
- Mock implementations for Next.js features

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication flow
- Protected API routes
- Sanitized user inputs
- Environment variables for secrets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the KRIA Training Community
- Designed with mindfulness and accessibility in mind
- Special thanks to all contributors and testers

---

**Need help?** Open an issue or contact the development team.

**Ready to train?** [Sign up now](http://localhost:3000/auth/register) and join the community!