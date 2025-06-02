export const getSiteURL = () => {
  // First try to get the explicitly set URL
  let url = process.env.NEXT_PUBLIC_SITE_URL;
  
  // If not set, try to construct it from Vercel environment variables
  if (!url && process.env.NEXT_PUBLIC_VERCEL_URL) {
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // For local development
  if (!url && process.env.NODE_ENV === 'development') {
    url = 'http://localhost:3000';
  }

  // Ensure URL has no trailing slash
  return url ? url.replace(/\/$/, '') : '';
}; 