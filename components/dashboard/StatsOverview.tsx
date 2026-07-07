'use client';

import React from 'react';

interface StatsOverviewProps {
  totalBookings: number;
  pendingBookings: number;
  availableFlash: number;
  portfolioCount: number;
}

export default function StatsOverview({
  totalBookings,
  pendingBookings,
  availableFlash,
  portfolioCount,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-lg shadow-xl hover:border-[#D4AF37]/40 transition duration-300">
        <div className="text-[#9CA3AF] text-xs font-semibold tracking-wider uppercase mb-1">
          Pending Bookings
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#D4AF37] font-sans">
            {pendingBookings}
          </span>
          <span className="text-xs text-neutral-500">needs review</span>
        </div>
        <div className="mt-2 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37]"
            style={{
              width: `${totalBookings > 0 ? (pendingBookings / totalBookings) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-lg shadow-xl hover:border-white/20 transition duration-300">
        <div className="text-[#9CA3AF] text-xs font-semibold tracking-wider uppercase mb-1">
          Total Requests
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#F3F4F6] font-sans">
            {totalBookings}
          </span>
          <span className="text-xs text-neutral-500">all time</span>
        </div>
        <div className="mt-2 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-400 w-full" />
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-lg shadow-xl hover:border-emerald-500/30 transition duration-300">
        <div className="text-[#9CA3AF] text-xs font-semibold tracking-wider uppercase mb-1">
          Available Flash
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-emerald-500 font-sans">
            {availableFlash}
          </span>
          <span className="text-xs text-neutral-500">ready to ink</span>
        </div>
        <div className="mt-2 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-3/4" />
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-lg shadow-xl hover:border-indigo-500/30 transition duration-300">
        <div className="text-[#9CA3AF] text-xs font-semibold tracking-wider uppercase mb-1">
          Portfolio Items
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-[#F3F4F6] font-sans">
            {portfolioCount}
          </span>
          <span className="text-xs text-neutral-500">published works</span>
        </div>
        <div className="mt-2 h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-4/5" />
        </div>
      </div>
    </div>
  );
}