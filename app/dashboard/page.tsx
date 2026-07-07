'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseAuthed';

// Components
import StatsOverview from '@/components/dashboard/StatsOverview';
import BookingManager from '@/components/dashboard/BookingManager';
import PortfolioManager from '@/components/dashboard/PortfolioManager';
import FlashManager from '@/components/dashboard/FlashManager';
import AftercareManager from '@/components/dashboard/AftercareManager';
import BusinessHoursManager from '@/components/dashboard/BusinessHoursManager';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('bookings');
  
  // Aggregate Stats (passed to StatsOverview)
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [pendingBookings, setPendingBookings] = useState<number>(0);
  const [availableFlash, setAvailableFlash] = useState<number>(0);
  const [portfolioCount, setPortfolioCount] = useState<number>(0);

  useEffect(() => {
    fetchGlobalStats();
  }, [activeTab]); // Refresh stats when switching tabs

  async function fetchGlobalStats() {
    try {
      // 1. Booking counts
      const { data: bData } = await supabase
        .from('booking_requests')
        .select('status');
      
      if (bData) {
        setTotalBookings(bData.length);
        setPendingBookings(bData.filter(b => b.status === 'pending').length);
      }

      // 2. Flash counts
      const { data: fData } = await supabase
        .from('flash_designs')
        .select('status');
      
      if (fData) {
        setAvailableFlash(fData.filter(f => f.status === 'available').length);
      }

      // 3. Portfolio count
      const { count } = await supabase
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true });
      
      setPortfolioCount(count || 0);
    } catch (err) {
      console.error('Error fetching global stats:', err);
    }
  }

  return (
    <div className="min-h-screen bg-[#121214] text-[#F3F4F6] font-sans antialiased">
      {/* Top Header Navigation */}
      <header className="border-b border-neutral-800 bg-[#1C1C1E] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#D4AF37] text-[#121214] font-extrabold p-2 rounded-md text-sm tracking-tighter">
              JL
            </div>
            <div>
              <h1 className="text-white font-bold text-sm tracking-wider uppercase font-mono">
                Jake Llewellyn
              </h1>
              <p className="text-[10px] text-[#9CA3AF] tracking-widest uppercase">
                Owner Studio Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs text-[#9CA3AF] hover:text-white border border-neutral-700 hover:border-neutral-500 px-3 py-1.5 rounded transition font-medium"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Studio Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
              Welcome back, Jake. Here is a live summary of your Bargoed studio data.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded text-xs text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected &amp; Authed</span>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <StatsOverview
          totalBookings={totalBookings}
          pendingBookings={pendingBookings}
          availableFlash={availableFlash}
          portfolioCount={portfolioCount}
        />

        {/* Admin Navigation Tabs */}
        <div className="border-b border-neutral-800 mb-8 overflow-x-auto">
          <nav className="flex space-x-1 sm:space-x-4 min-w-max pb-px" aria-label="Tabs">
            {[
              { id: 'bookings', label: 'Booking Requests', badge: pendingBookings },
              { id: 'portfolio', label: 'Portfolio Gallery', badge: null },
              { id: 'flash', label: 'Flash Catalog', badge: availableFlash },
              { id: 'aftercare', label: 'Aftercare Guides', badge: null },
              { id: 'hours', label: 'Business Hours', badge: null },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-3 px-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 -mb-px ${
                    isActive
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-[#9CA3AF] hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <span className="flex items-center space-x-1.5">
                    <span>{tab.label}</span>
                    {tab.badge !== null && tab.badge > 0 && (
                      <span className="bg-[#D4AF37] text-[#121214] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Tab Render Area */}
        <div className="bg-[#121214] min-h-[400px]">
          {activeTab === 'bookings' && <BookingManager />}
          {activeTab === 'portfolio' && <PortfolioManager />}
          {activeTab === 'flash' && <FlashManager />}
          {activeTab === 'aftercare' && <AftercareManager />}
          {activeTab === 'hours' && <BusinessHoursManager />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 mt-20 py-6 bg-[#121214]">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-neutral-500">
          <p>&copy; 2025 Tattoos by Jake Llewellyn &bull; Private Studio Admin System &bull; Bargoed, UK</p>
        </div>
      </footer>
    </div>
  );
}