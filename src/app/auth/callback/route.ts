import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      // After successful verification, redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      // If there's an error, redirect to sign in with error message
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/signin?error=Verification failed. Please try again.`
      );
    }
  }

  // If no code is present, redirect to home page
  return NextResponse.redirect(requestUrl.origin);
} 