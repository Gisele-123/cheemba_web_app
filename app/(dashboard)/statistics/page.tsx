'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { bins } from '@/lib/demo/bins';
import { supabase } from '@/lib/supabase/client';
import { APP_ROLES } from '@/lib/auth/constants';

const Statistics = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const metadata = data.user?.user_metadata;
      setIsAdmin(metadata?.role === APP_ROLES.ADMIN);
      setCompanyName(String(metadata?.company_name || metadata?.display_name || ''));
    };
    load();
  }, []);

  const scopedBins = useMemo(() => {
    if (isAdmin) return bins;
    return bins.filter((bin) => bin.companyName === companyName);
  }, [isAdmin, companyName]);

  const critical = scopedBins.filter((bin) => bin.fillPercent >= 90).length;
  const averageLevel = scopedBins.length
    ? Math.round(scopedBins.reduce((acc, bin) => acc + bin.fillPercent, 0) / scopedBins.length)
    : 0;
  const companyBreakdown = scopedBins.reduce<Record<string, number>>((acc, bin) => {
    acc[bin.companyName] = (acc[bin.companyName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-medium text-[#0E2040]">Statistics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total deployed bins</p>
          <p className="text-4xl font-bold text-[#0E2040]">{scopedBins.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Critical bins (90%+)</p>
          <p className="text-4xl font-bold text-red-600">{critical}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average fill level</p>
          <p className="text-4xl font-bold text-emerald-600">{averageLevel}%</p>
        </div>
      </div>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="text-xl font-semibold text-[#0E2040]">
          {isAdmin ? 'Bins by Waste Collection Company' : 'Your Bin Distribution'}
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Object.entries(companyBreakdown).map(([company, total]) => (
            <div key={company} className="rounded-lg border p-4">
              <p className="font-medium">{company}</p>
              <p className="text-sm text-slate-600">{total} deployed bins</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;