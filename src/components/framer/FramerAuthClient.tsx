import type { User, Session } from '@supabase/supabase-js';

interface FramerAuthClientProps {
  // Framer properties
  apiBaseUrl?: string;
  mode?: 'signin' | 'signup';
  onSuccess?: (data: { user: User | null; session: Session | null }) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function FramerAuthClient({
  apiBaseUrl = 'http://localhost:3000',
  mode = 'signin',
  onSuccess,
  onError,
  className,
}: FramerAuthClientProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
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
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

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
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
}

// Add Framer Property Controls
FramerAuthClient.defaultProps = {
  apiBaseUrl: 'http://localhost:3000',
  mode: 'signin',
};

// This will be used by Framer to generate the property controls
FramerAuthClient.propertyControls = {
  apiBaseUrl: { type: 'string', title: 'API Base URL' },
  mode: {
    type: 'enum',
    title: 'Mode',
    options: ['signin', 'signup'],
    optionTitles: ['Sign In', 'Sign Up'],
  },
}; 