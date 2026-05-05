'use client';
import React from 'react';
import { RiApps2AiLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { bins } from '@/lib/demo/bins';

const Bins = () => {
  const router = useRouter();
  const badgeTone = (fillPercent: number) => {
    if (fillPercent >= 75) return 'bg-red-100 text-red-700';
    if (fillPercent >= 45) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Bins</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="flex flex-col gap-4">
        {bins.map((bin) => (
          <div
            onClick={() => router.push(`/bins/${bin.id}`)}
            className="w-full p-7 rounded-xl cursor-pointer border shadow flex items-center justify-between bg-white hover:border-[#0D99FF]"
            key={bin.id}
          >
            <div className="flex items-center gap-5">
              <div>
                <p className="font-semibold">{bin.name}</p>
                <p className="text-sm">{bin.locationName}</p>
                <p className="text-xs text-slate-500">{bin.district}, Kigali</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <p className={`px-3 py-1 rounded-2xl max-sm:hidden ${badgeTone(bin.fillPercent)}`}>
                {bin.fillPercent >= 75 ? 'Full / urgent' : bin.fillPercent >= 45 ? 'Medium' : 'Low'}
              </p>
              <p className={`px-3 py-1 rounded-2xl ${badgeTone(bin.fillPercent)}`}>
                {bin.fillPercent}%
              </p>
            </div>
            <button className="rounded-lg bg-[#0A3B83] px-4 py-2 text-white">View route</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bins;
