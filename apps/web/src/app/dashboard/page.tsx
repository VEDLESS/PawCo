'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@petco/shared';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === Role.ADMIN) {
        router.replace('/dashboard/admin');
      } else if (user.role === Role.HELPER) {
        router.replace('/dashboard/helper');
      } else {
        router.replace('/dashboard/owner');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
