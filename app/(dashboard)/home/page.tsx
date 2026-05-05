import React from 'react';
import { RiApps2AiLine } from 'react-icons/ri';
import { bins } from '@/lib/demo/bins';

const HomeDashboard = () => {
  const fullBins = bins.filter((bin) => bin.fillPercent >= 75).length;

  return (
    <div className="flex flex-col gap-4 p-6 max-md:p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl text-[#0E2040] font-medium">Dashboard</h3>
        <RiApps2AiLine size={28} color="#6B7280" />
      </div>
      <div className="rounded-2xl border bg-gradient-to-r from-[#0b1f43] to-[#0D99FF] p-8 text-white shadow-lg">
        <h4 className="text-2xl font-semibold">Cheemba Kigali Live Demo</h4>
        <p className="mt-2 max-w-2xl text-sm text-blue-100">
          Smart waste routing, predictive fill-level monitoring, and role-based operations are active. Additional modules are still under development.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Tracked bins</p>
          <p className="text-4xl font-bold text-[#0E2040]">{bins.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Urgent pickups</p>
          <p className="text-4xl font-bold text-[#dc2626]">{fullBins}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Route optimization gain</p>
          <p className="text-4xl font-bold text-[#059669]">23%</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 shadow">
        <h3 className="mb-3 text-xl font-medium text-[#0E2040]">Current Kigali Bin Snapshot</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {bins.map((bin) => (
            <div key={bin.id} className="rounded-lg border p-3">
              <p className="font-semibold">{bin.name}</p>
              <p className="text-sm text-slate-600">{bin.locationName}</p>
              <div className="mt-2 h-2 rounded bg-slate-100">
                <div className="h-2 rounded bg-[#0D99FF]" style={{ width: `${bin.fillPercent}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{bin.fillPercent}% full</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
