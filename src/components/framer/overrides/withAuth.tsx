import React, { useEffect, useState, ComponentType } from 'react';
// import { useRouter } from 'next/navigation'; // Uncomment if Next.js router is needed and contextually appropriate

// Framer-specific type for property controls
type FramerPropertyControlOption = string | number | boolean;
type FramerPropertyControls = Record<string, {
  type: 'string' | 'number' | 'boolean' | 'enum';
  title?: string;
  defaultValue?: FramerPropertyControlOption;
  options?: FramerPropertyControlOption[];
  optionTitles?: string[];
}>;

interface WithAuthOverrideProps {
  signInPageUrl?: string;
  // Any other props that Framer should allow to be set on the override itself
}

// Define a type for a component that can have Framer property controls
interface FramerCompatibleComponent<P = Record<string, unknown>> extends React.FC<P> {
  propertyControls?: FramerPropertyControls;
}

export function withAuth<P extends Record<string, unknown>>(
  WrappedComponent: ComponentType<P>
): FramerCompatibleComponent<P & WithAuthOverrideProps> {
  const ComponentWithAuth: React.FC<P & WithAuthOverrideProps> = (props) => {
    const { signInPageUrl = '/auth/signin', ...restProps } = props as WithAuthOverrideProps & P;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/auth/user');
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setIsAuthenticated(true);
            } else {
              if (typeof window !== 'undefined') {
                window.location.href = signInPageUrl;
              }
            }
          } else {
            if (typeof window !== 'undefined') {
              window.location.href = signInPageUrl;
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          if (typeof window !== 'undefined') {
            window.location.href = signInPageUrl;
          }
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [signInPageUrl]);

    if (isLoading) {
      return null;
    }

    if (isAuthenticated) {
      return <WrappedComponent {...(restProps as P)} />;
    }

    return null;
  };

  // Assign property controls as a static member
  (ComponentWithAuth as FramerCompatibleComponent<P & WithAuthOverrideProps>).propertyControls = {
    signInPageUrl: {
      type: 'string',
      title: 'Sign-In Page URL',
      defaultValue: '/auth/signin',
    },
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithAuth.displayName = `WithAuth(${displayName})`;

  return ComponentWithAuth;
}

// Example of how to potentially register or make it available if Framer needs specific export names for overrides
// export const WithAuthOverride = withAuth; // Or similar, depending on Framer's plugin system 