'use client'

import Heading from '@/components/common/Heading';
import Sidebar from '@/components/common/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePathname } from 'next/navigation'; 
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBinRoute = pathname?.startsWith('/bins/'); 

  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Heading />
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
