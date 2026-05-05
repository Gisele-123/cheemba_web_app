import React from 'react';
import { bins } from '@/lib/demo/bins';

const Statistics = () => {
  const critical = bins.filter((bin) => bin.fillPercent >= 90).length;
  const averageLevel = Math.round(bins.reduce((acc, bin) => acc + bin.fillPercent, 0) / bins.length);
  const companyBreakdown = bins.reduce<Record<string, number>>((acc, bin) => {
    acc[bin.companyName] = (acc[bin.companyName] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-medium text-[#0E2040]">Statistics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total deployed bins</p>
          <p className="text-4xl font-bold text-[#0E2040]">{bins.length}</p>
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
        <h3 className="text-xl font-semibold text-[#0E2040]">Bins by Waste Collection Company</h3>
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