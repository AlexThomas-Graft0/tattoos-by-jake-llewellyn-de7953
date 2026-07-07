'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface BusinessHour {
  day_of_week: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 20,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export function Footer() {
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);

  useEffect(() => {
    async function fetchBusinessHours() {
      const { data, error } = await supabase
        .from('business_hours')
        .select('day_of_week, is_open, open_time, close_time')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        setBusinessHours(data as BusinessHour[]);
      } else {
        // Fallback static schedule matching the copy requirements
        setBusinessHours([
          { day_of_week: 'Monday', is_open: false, open_time: null, close_time: null },
          { day_of_week: 'Tuesday', is_open: true, open_time: '10:00', close_time: '18:00' },
          { day_of_week: 'Wednesday', is_open: true, open_time: '10:00', close_time: '18:00' },
          { day_of_week: 'Thursday', is_open: true, open_time: '10:00', close_time: '18:00' },
          { day_of_week: 'Friday', is_open: true, open_time: '10:00', close_time: '18:00' },
          { day_of_week: 'Saturday', is_open: true, open_time: '10:00', close_time: '18:00' },
          { day_of_week: 'Sunday', is_open: false, open_time: null, close_time: null },
        ]);
      }
    }

    fetchBusinessHours();
  }, []);

  // Format time helper (e.g. "10:00:00" or "10:00" -> "10:00 AM")
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <footer className="relative bg-[#121214] text-[#F3F4F6] border-t border-[#D4AF37]/20 pt-16 pb-8 overflow-hidden font-sans">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Call to Action Banner inside Footer */}
        <div className="relative mb-16 p-8 md:p-12 bg-[#1C1C1E] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase block mb-2">Ready to collaborate?</span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-serif mb-3">
                Your Vision, Expertly Inked.
              </h3>
              <p className="text-[#9CA3AF] text-sm md:text-base leading-relaxed">
                Book a custom design session or claim one of our pre-drawn, exclusive flash designs today. Let&apos;s create something incredible together in Bargoed.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <a
                href="#booking-form"
                className="inline-flex items-center justify-center px-6 py-3 border border-[#D4AF37] bg-[#D4AF37] text-[#121214] font-semibold text-sm rounded-lg hover:bg-transparent hover:text-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] text-center"
              >
                Request a Booking
              </a>
              <a
                href="#flash-catalog"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/20 bg-transparent text-white font-medium text-sm rounded-lg hover:bg-white/5 hover:border-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center"
              >
                Browse Flash Art
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <span className="text-xl font-bold tracking-wider text-white uppercase font-serif block">
              Tattoos by <span className="text-[#D4AF37]">Jake Llewellyn</span>
            </span>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              A clean, professional, and friendly private tattoo studio in Bargoed. Breaking the traditional boundaries to offer a welcoming, high-end collaborative experience.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1E] border border-[#D4AF37]/30 text-[#D4AF37]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs text-[#F3F4F6] font-medium tracking-wide">Fully Licensed & Hygiene Registered</span>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#hero" className="text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
                  Home / Overview
                </a>
              </li>
              <li>
                <a href="#meet-your-artist" className="text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
                  Meet the Artist
                </a>
              </li>
              <li>
                <a href="#portfolio-gallery" className="text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
                  Portfolio Gallery
                </a>
              </li>
              <li>
                <a href="#flash-catalog" className="text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
                  Exclusive Flash
                </a>
              </li>
              <li>
                <a href="#aftercare-guide" className="text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline">
                  Aftercare Instructions
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Details Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase font-mono">
              Studio Location
            </h4>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              6A Gwerthonor Place<br />
              Gilfach, Bargoed<br />
              CF81 8JQ, UK
            </p>
            <div className="space-y-2 pt-1">
              <a 
                href="tel:07729357006" 
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
              >
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                07729357006
              </a>
              <a 
                href="mailto:Nllewellyn975682@aol.com" 
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
              >
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nllewellyn975682@aol.com
              </a>
            </div>
          </motion.div>

          {/* Operating Hours Column */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-xs font-semibold tracking-widest text-[#D4AF37] uppercase font-mono">
              Opening Hours
            </h4>
            <div className="space-y-1.5 text-sm">
              {businessHours.map((hour) => (
                <div key={hour.day_of_week} className="flex justify-between items-center py-0.5 border-b border-white/5 last:border-b-0">
                  <span className="text-[#9CA3AF] font-medium">{hour.day_of_week}</span>
                  <span className="text-right">
                    {hour.is_open && hour.open_time && hour.close_time ? (
                      <span className="text-[#F3F4F6]">
                        {formatTime(hour.open_time)} – {formatTime(hour.close_time)}
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF] italic text-xs">Closed</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Social Links & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a 
              href="https://facebook.com/share/1EcPtapnqm/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] p-2 rounded-lg bg-[#1C1C1E] border border-white/5"
              aria-label="Follow Tattoos by Jake Llewellyn on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://instagram.com/tattoos_by_jake_llewellyn?igsh=cXFlbmJ5cnExYXU1&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] p-2 rounded-lg bg-[#1C1C1E] border border-white/5"
              aria-label="Follow Tattoos by Jake Llewellyn on Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.052 1.9.23 2.5.464a4.904 4.904 0 011.77 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.5.047.954.056 1.278.056 3.71 0 2.43-.01 2.8-.054 3.71-.052 1.14-.23 1.9-.464 2.5a4.901 4.901 0 01-1.153 1.772 4.907 4.907 0 01-1.772 1.153c-.636.247-1.363.416-2.5.465-.954.047-1.278.056-3.711.056-2.43 0-2.8-.01-3.71-.054-1.14-.052-1.9-.23-2.5-.464a4.906 4.906 0 01-1.77-1.153 4.902 4.902 0 01-1.154-1.772c-.247-.636-.416-1.363-.465-2.5-.047-.954-.056-1.278-.056-3.71 0-2.43.01-2.8.054-3.71.052-1.14.23-1.9.464-2.5a4.903 4.903 0 011.153-1.772A4.907 4.907 0 015.45 2.525c.636-.247 1.363-.416 2.5-.465C8.901 2.01 9.224 2 11.656 2h.659zm-1.16 2.185c-2.3 0-2.56.009-3.464.051-.83.038-1.278.177-1.577.294a3.717 3.717 0 00-1.378.898c-.412.413-.68.873-.898 1.378-.117.299-.256.747-.294 1.577-.04 1.01-.051 1.27-.051 3.586 0 2.302.011 2.562.051 3.464.038.83.177 1.278.294 1.577.218.505.486.965.898 1.378.413.412.873.68 1.378.898.299.117.747.256 1.577.294 1.01.04 1.27.051 3.586.051 2.302 0 2.562-.011 3.464-.051.83-.038 1.278-.177 1.577-.294a3.711 3.711 0 001.378-.898c.413-.413.68-.873.898-1.378.117-.299.256-.747.294-1.577.04-1.01.051-1.27.051-3.586 0-2.302-.011-2.562-.051-3.464-.038-.83-.177-1.278-.294-1.577a3.716 3.716 0 00-.898-1.378 3.712 3.712 0 00-1.378-.898c-.299-.117-.747-.256-1.577-.294-.95-.04-1.21-.051-3.56-.051h-.29zm-.11 4.315a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6zm5.884-7.89a1.125 1.125 0 102.25 0 1.125 1.125 0 00-2.25 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <p className="text-xs text-[#9CA3AF] text-center md:text-right">
            &copy; 2026 Tattoos by Jake Llewellyn. All rights reserved. 
            <span className="block sm:inline sm:ml-2 text-white/40">6A Gwerthonor Place, Gilfach, Bargoed, CF81 8JQ</span>
          </p>
        </div>

      </div>
    </footer>
  );
}