import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: `Sign out failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully signed out' },
      { status: 200 }
    );
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Internal server error during sign out';
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