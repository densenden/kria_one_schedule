'use client'

import { AuthProvider } from '../../lib/contexts/AuthContext'
import { ThemeProvider } from '../../lib/contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#00CED1',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}