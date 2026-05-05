'use client'

import Heading from '@/components/common/Heading';
import Sidebar from '@/components/common/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_ROLES } from '@/lib/auth/constants';
import { supabase } from '@/lib/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isBinRoute = pathname?.startsWith('/bins/');
  const [authorized, setAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.replace('/login');
        return;
      }

      const role = String(user.user_metadata?.role || "");
      setIsAdmin(role === APP_ROLES.ADMIN);
      setAuthorized(true);
    };

    verify();
  }, [router]);

  if (!authorized) {
    return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex flex-col overflow-hidden">
        <Heading isAdmin={isAdmin} />
        <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-[#F0F6FF] overflow-y-auto">
          {!isBinRoute ? (
            <ScrollArea className="example">{children}</ScrollArea>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
