'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient, type SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { AuthForm } from '../auth/AuthForm';
import type { Session } from '@supabase/supabase-js';

interface FramerAuthProps {
  // Framer properties
  apiUrl?: string;
  anonKey?: string;
  redirectUrl?: string;
  mode?: 'signin' | 'signup';
  onSuccess?: (session: Session | null) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function FramerAuth({
  apiUrl,
  anonKey,
  redirectUrl = '/',
  mode = 'signin',
  onSuccess,
  onError,
  className,
}: FramerAuthProps) {
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    // Validate configuration and initialize Supabase client
    if (!apiUrl || !anonKey) {
      setError('Please provide Supabase API URL and Anonymous Key');
      setIsConfigValid(false);
      return;
    }
    
    const client = createClientComponentClient({
      supabaseUrl: apiUrl,
      supabaseKey: anonKey,
    });
    setSupabase(client);
    setIsConfigValid(true);
  }, [apiUrl, anonKey]);

  if (!isConfigValid || !supabase) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error || 'Invalid configuration'}
      </div>
    );
  }

  const handleSuccess = () => {
    // Get the session after successful auth
    supabase.auth.getSession().then(({ data: { session }}) => {
      if (onSuccess) {
        onSuccess(session);
      }
      // Handle redirect if provided
      if (redirectUrl && window) {
        window.location.href = redirectUrl;
      }
    });
  };

  const handleError = (error: string) => {
    if (onError) {
      onError(error);
    }
    setError(error);
  };

  return (
    <div className={className}>
      <AuthForm
        mode={mode}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

// Add Framer Property Controls
FramerAuth.defaultProps = {
  apiUrl: '',
  anonKey: '',
  redirectUrl: '/',
  mode: 'signin',
};

// This will be used by Framer to generate the property controls
FramerAuth.propertyControls = {
  apiUrl: { type: 'string', title: 'Supabase API URL' },
  anonKey: { type: 'string', title: 'Supabase Anon Key' },
  redirectUrl: { type: 'string', title: 'Redirect URL' },
  mode: {
    type: 'enum',
    title: 'Mode',
    options: ['signin', 'signup'],
    optionTitles: ['Sign In', 'Sign Up'],
  },
}; 