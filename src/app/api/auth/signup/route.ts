import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSiteURL } from '@/lib/utils/url';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    const siteUrl = getSiteURL();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        user: data.user,
        message: 'Sign up successful. Please check your email to confirm your account.'
      },
      { status: 200 }
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Enable CORS for Framer
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 