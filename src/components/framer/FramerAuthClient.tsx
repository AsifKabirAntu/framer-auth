import type { User, Session } from '@supabase/supabase-js';
import React, { useState } from 'react';

interface FramerAuthClientProps {
  // Framer properties
  apiBaseUrl?: string;
  mode?: 'signin' | 'signup' | 'forgot-password' | 'update-password';
  onSuccess?: (data: { user?: User | null; session?: Session | null; message?: string }) => void;
  onError?: (error: string) => void;
  className?: string;
  // Props for UI customization
  buttonTextSignIn?: string;
  buttonTextSignUp?: string;
  buttonTextForgotPassword?: string;
  buttonTextUpdatePassword?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  newPasswordPlaceholder?: string;
}

export default function FramerAuthClient({
  apiBaseUrl = 'http://localhost:3000',
  mode = 'signin',
  onSuccess,
  onError,
  className,
  buttonTextSignIn = 'Sign In',
  buttonTextSignUp = 'Sign Up',
  buttonTextForgotPassword = 'Send Reset Link',
  buttonTextUpdatePassword = 'Update Password',
  emailPlaceholder = 'Enter your email',
  passwordPlaceholder = 'Enter your password',
  newPasswordPlaceholder = 'Enter new password',
}: FramerAuthClientProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const getApiEndpoint = () => {
    if (mode === 'forgot-password') return `${apiBaseUrl}/api/auth/forgot-password`;
    if (mode === 'update-password') return `${apiBaseUrl}/api/auth/update-password`;
    return `${apiBaseUrl}/api/auth/${mode}`;
  };

  const getButtonText = () => {
    if (mode === 'signin') return buttonTextSignIn;
    if (mode === 'signup') return buttonTextSignUp;
    if (mode === 'forgot-password') return buttonTextForgotPassword;
    if (mode === 'update-password') return buttonTextUpdatePassword;
    return 'Submit';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const payload: Record<string, string | undefined> = {
      email: undefined,
      password: undefined,
    };

    if (mode === 'update-password') {
      payload.password = newPassword;
    } else {
      payload.email = email;
      if (mode === 'signin' || mode === 'signup') {
        payload.password = password;
      }
    }

    const body = Object.fromEntries(Object.entries(payload).filter(entry => entry[1] !== undefined));

    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred');
      }
      
      setMessage(data.message || 'Success!');
      if (onSuccess) {
        onSuccess(data);
      }
      if (mode === 'signup' || mode === 'forgot-password') setEmail('');
      if (mode === 'signin' || mode === 'signup') setPassword('');
      if (mode === 'update-password') setNewPassword('');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {mode !== 'update-password' && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        )}

        {(mode === 'signin' || mode === 'signup') && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={passwordPlaceholder}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        )}

        {mode === 'update-password' && (
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password 
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={newPasswordPlaceholder}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        {message && (
          <div className="text-sm text-green-600 p-2 bg-green-50 rounded-md">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : getButtonText()}
        </button>
      </div>
    </form>
  );
}

// Add Framer Property Controls
FramerAuthClient.defaultProps = {
  apiBaseUrl: 'http://localhost:3000',
  mode: 'signin',
  buttonTextSignIn: 'Sign In',
  buttonTextSignUp: 'Sign Up',
  buttonTextForgotPassword: 'Send Reset Link',
  buttonTextUpdatePassword: 'Update Password',
  emailPlaceholder: 'Enter your email',
  passwordPlaceholder: 'Enter your password',
  newPasswordPlaceholder: 'Enter new password',
};

// This will be used by Framer to generate the property controls
FramerAuthClient.propertyControls = {
  apiBaseUrl: { type: 'string', title: 'API Base URL' },
  mode: {
    type: 'enum',
    title: 'Mode',
    options: ['signin', 'signup', 'forgot-password', 'update-password'],
    optionTitles: ['Sign In', 'Sign Up', 'Forgot Password', 'Update Password'],
  },
  buttonTextSignIn: { type: 'string', title: 'Sign In Button Text', defaultValue: 'Sign In' },
  buttonTextSignUp: { type: 'string', title: 'Sign Up Button Text', defaultValue: 'Sign Up' },
  buttonTextForgotPassword: { type: 'string', title: 'Forgot Password Button Text', defaultValue: 'Send Reset Link' },
  buttonTextUpdatePassword: { type: 'string', title: 'Update Password Button Text', defaultValue: 'Update Password' },
  emailPlaceholder: { type: 'string', title: 'Email Placeholder', defaultValue: 'Enter your email' },
  passwordPlaceholder: { type: 'string', title: 'Password Placeholder', defaultValue: 'Enter your password' },
  newPasswordPlaceholder: { type: 'string', title: 'New Password Placeholder', defaultValue: 'Enter new password' },
}; 