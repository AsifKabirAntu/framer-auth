'use client';

import { useState } from 'react';
import FramerAuth from '@/components/framer/FramerAuth';
import type { Session } from '@supabase/supabase-js';

export default function ExamplePage() {
  const [authStatus, setAuthStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Replace these with your actual Supabase credentials
  const supabaseConfig = {
    apiUrl: 'your-supabase-project-url',
    anonKey: 'your-supabase-anon-key',
  };

  const handleSuccess = (session: Session | null) => {
    setAuthStatus({
      type: 'success',
      message: `Successfully authenticated! User ID: ${session?.user.id}`,
    });
    console.log('Authentication successful:', session);
  };

  const handleError = (error: string) => {
    setAuthStatus({
      type: 'error',
      message: `Authentication error: ${error}`,
    });
    console.error('Authentication error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Authentication Example</h1>
          <p className="mt-2 text-gray-600">
            Sign in or create an account using Framer Auth
          </p>
        </div>

        {/* Status Message */}
        {authStatus && (
          <div
            className={`mb-4 p-4 rounded-md ${
              authStatus.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {authStatus.message}
          </div>
        )}

        {/* Sign In Form */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <FramerAuth
            apiUrl={supabaseConfig.apiUrl}
            anonKey={supabaseConfig.anonKey}
            redirectUrl="/dashboard" // Redirect to dashboard after successful auth
            mode="signin" // or "signup" for registration
            onSuccess={handleSuccess}
            onError={handleError}
            className="w-full"
          />
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Want to see the signup form instead? Just change the mode prop to &quot;signup&quot;
          </p>
        </div>
      </div>
    </div>
  );
} 