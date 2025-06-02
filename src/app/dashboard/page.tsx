import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back, {session.user.email}
              </h1>
              <p className="mt-2 text-gray-600">
                You are successfully signed in to your account.
              </p>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Account Details
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-gray-50 px-4 py-5 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {session.user.email}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {session.user.id}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 