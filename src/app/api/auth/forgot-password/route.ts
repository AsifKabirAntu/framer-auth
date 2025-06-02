import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSiteURL } from '@/lib/utils/url';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    const siteUrl = getSiteURL();

    // Note: It's important that your Supabase project has email templates configured for password resets.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/update-password`, // Page where user can set a new password
    });

    if (error) {
      // Do not reveal if the email exists or not for security reasons
      // Log the actual error server-side for debugging
      console.error('Forgot password error:', error.message);
      // Return a generic message to the client
      return NextResponse.json(
        { message: 'If an account with this email exists, a password reset link has been sent.' },
        { status: 200 } // Return 200 to avoid email enumeration
      );
    }

    return NextResponse.json(
      { message: 'If an account with this email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (e) {
    // Log the actual error server-side
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    console.error('Forgot password exception:', errorMessage);
    // Return a generic message to the client
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Enable CORS for Framer
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Adjust in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 