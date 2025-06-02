import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json(
        { error: `Failed to get session: ${sessionError.message}` },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json({ user: null, session: null }, { status: 200 });
    }

    // Optionally, you might want to fetch more user details from your own tables here
    // For now, we return the user object from the session
    return NextResponse.json(
      { user: session.user, session: session }, 
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS', // Allow GET for this route
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 