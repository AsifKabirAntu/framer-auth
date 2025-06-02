import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

// Definition for a single Framer property control
interface FramerPropertyControlDefinition {
  type: 'string' | 'number' | 'boolean' | 'enum';
  title?: string;
  defaultValue?: string | number | boolean;
  options?: (string | number | boolean)[];
  optionTitles?: string[];
}

// Collection of property controls
type FramerControlCollection = Record<string, FramerPropertyControlDefinition>;

// Actual props for the FramerUserProfile component
interface FramerUserProfileProps {
  title?: string;
  labelEmail?: string;
  labelLoading?: string;
  labelErrorText?: string;
  buttonTextSignOut?: string;
  buttonTextUpdatePassword?: string;
  updatePasswordPageUrl?: string;
  showUpdatePasswordLink?: boolean;
  className?: string;
  signedOutRedirectUrl?: string;
}

export default function FramerUserProfile({
  title = 'User Profile',
  labelEmail = 'Email:',
  labelLoading = 'Loading profile...',
  labelErrorText = 'Failed to load profile.',
  buttonTextSignOut = 'Sign Out',
  buttonTextUpdatePassword = 'Update Password',
  updatePasswordPageUrl = '/auth/update-password',
  showUpdatePasswordLink = true,
  className = '',
  signedOutRedirectUrl = '/',
}: FramerUserProfileProps): JSX.Element | null {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [signOutMessage, setSignOutMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch user');
        }
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setError('No user session found.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    setError(null);
    setSignOutMessage(null);
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Sign out failed');
      }
      const data = await response.json();
      setSignOutMessage(data.message || 'Successfully signed out.');
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = signedOutRedirectUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    } finally {
      setSignOutLoading(false);
    }
  };

  if (loading) {
    return <div className={className}><p>{labelLoading}</p></div>;
  }

  if (error && !user && !signOutMessage) {
    return <div className={className}><p className="text-red-600">{labelErrorText}: {error}</p></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`p-4 border rounded-md shadow-sm bg-white ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div className="space-y-3">
        <div>
          <span className="font-medium">{labelEmail}</span> {user.email}
        </div>
        {error && !signOutMessage && <p className="text-sm text-red-600">Error: {error}</p>}
        {signOutMessage && <p className="text-sm text-green-600">{signOutMessage}</p>}

        <div className="mt-4 space-y-2">
          {showUpdatePasswordLink && (
            <a
              href={updatePasswordPageUrl}
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {buttonTextUpdatePassword}
            </a>
          )}
          <button
            onClick={handleSignOut}
            disabled={signOutLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {signOutLoading ? 'Signing out...' : buttonTextSignOut}
          </button>
        </div>
      </div>
    </div>
  );
}

FramerUserProfile.defaultProps = {
  title: 'User Profile',
  labelEmail: 'Email:',
  labelLoading: 'Loading profile...',
  labelErrorText: 'Failed to load profile.',
  buttonTextSignOut: 'Sign Out',
  buttonTextUpdatePassword: 'Update Password',
  updatePasswordPageUrl: '/auth/update-password',
  showUpdatePasswordLink: true,
  className: '',
  signedOutRedirectUrl: '/',
};

FramerUserProfile.propertyControls = {
  title: { type: 'string', title: 'Profile Title', defaultValue: 'User Profile' },
  labelEmail: { type: 'string', title: 'Email Label', defaultValue: 'Email:' },
  labelLoading: { type: 'string', title: 'Loading Text', defaultValue: 'Loading profile...' },
  labelErrorText: { type: 'string', title: 'Error Text', defaultValue: 'Failed to load profile.' },
  buttonTextSignOut: { type: 'string', title: 'Sign Out Button', defaultValue: 'Sign Out' },
  buttonTextUpdatePassword: { type: 'string', title: 'Update Password Button', defaultValue: 'Update Password' },
  updatePasswordPageUrl: { type: 'string', title: 'Update Password Page URL', defaultValue: '/auth/update-password' },
  showUpdatePasswordLink: { type: 'boolean', title: 'Show Update Password Link', defaultValue: true },
  className: { type: 'string', title: 'CSS ClassName', defaultValue: '' },
  signedOutRedirectUrl: { type: 'string', title: 'Signed Out Redirect URL', defaultValue: '/' },
} as FramerControlCollection; 