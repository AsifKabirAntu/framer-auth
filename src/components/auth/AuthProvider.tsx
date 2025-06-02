'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  error?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase URL exists:', !!supabaseUrl);
      console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
      // Log first few characters of URL for verification (safely)
      if (supabaseUrl) {
        console.log('Supabase URL starts with:', supabaseUrl.substring(0, 10) + '...');
      }
    }
  }, [supabaseUrl, supabaseAnonKey]);

  const supabase = createClientComponentClient({
    supabaseUrl: supabaseUrl || '',
    supabaseKey: supabaseAnonKey || '',
  });

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      const errorMsg = 'Missing Supabase configuration. Please check your environment variables.';
      console.error(errorMsg, { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseAnonKey,
        env: process.env.NODE_ENV
      });
      setError(errorMsg);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('Error getting session:', err);
      setError('Failed to initialize authentication: ' + err.message);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, supabaseUrl, supabaseAnonKey]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signOut,
    error: error || undefined,
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p className="font-medium">Authentication Error</p>
        <p className="mt-1">{error}</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded">
            {JSON.stringify({ 
              hasUrl: !!supabaseUrl, 
              hasKey: !!supabaseAnonKey,
              env: process.env.NODE_ENV 
            }, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 