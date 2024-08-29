'use client';

import { useEffect, useState } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import AdminDashboardComponent from '@/components/AdminDashboard';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAuthenticated, user } = useDynamicContext();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('Admin page mounted', { isAuthenticated, user });
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null; // This will prevent any flash of content before redirect
  }

  if (!user) {
    return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Loading user data...</div>;
  }

  return (
    <div>
      {error && <div className="bg-red-500 text-white p-4 mb-4">{error}</div>}
      <AdminDashboardComponent setError={setError} />
    </div>
  );
}