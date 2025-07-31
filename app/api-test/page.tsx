'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (endpoint: string, method = 'GET', body?: any) => {
    setLoading(true)
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await response.json()
      setResult({ endpoint, status: response.status, data })
    } catch (error) {
      setResult({ endpoint, error: error instanceof Error ? error.message : String(error) })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Endpoint Tester</h1>
        
        <div className="grid gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Public Endpoints</h2>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint('/api/courses')}
                className="btn-primary mr-2"
                disabled={loading}
              >
                GET /api/courses
              </button>
              <button
                onClick={() => testEndpoint('/api/schedules')}
                className="btn-primary mr-2"
                disabled={loading}
              >
                GET /api/schedules
              </button>
              <button
                onClick={() => testEndpoint('/api/schedules/test-id/participants')}
                className="btn-primary"
                disabled={loading}
              >
                GET /api/schedules/[id]/participants
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Endpoints</h2>
            <div className="space-y-2">
              <button
                onClick={() => testEndpoint('/api/auth/register', 'POST', {
                  email: 'test@example.com',
                  password: 'testpassword123',
                  fullName: 'Test User',
                  username: 'testuser'
                })}
                className="btn-secondary mr-2"
                disabled={loading}
              >
                POST /api/auth/register
              </button>
              <button
                onClick={() => testEndpoint('/api/auth/login', 'POST', {
                  email: 'test@example.com',
                  password: 'testpassword123'
                })}
                className="btn-secondary"
                disabled={loading}
              >
                POST /api/auth/login
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Result</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}