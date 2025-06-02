import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json(); // Changed from new_password for consistency
    const supabase = createRouteHandlerClient({ cookies });

    // Supabase client needs an active session to update password this way.
    // This route is intended to be called when the user has followed a password reset link,
    // which should establish a temporary session, or if the user is already logged in.
    const { data, error } = await supabase.auth.updateUser({
      password: password, 
    });

    if (error) {
      return NextResponse.json(
        { error: `Password update failed: ${error.message}` },
        { status: 400 }
      );
    }

    // data.user will contain the updated user information
    return NextResponse.json(
      { message: 'Password updated successfully.', user: data.user },
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
      'Access-Control-Allow-Origin': '*', // Adjust in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 