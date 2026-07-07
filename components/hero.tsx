'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Clock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Menu, 
  X, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface BusinessHourRow {
  day_of_week: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

export function Hero() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbHours, setDbHours] = useState<BusinessHourRow[]>([]);

  // Safely calculate current studio status on mount to avoid server/client hydration mismatch
  useEffect(() => {
    try {
      const now = new Date();
      const ukTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/London' });
      const ukDate = new Date(ukTimeString);
      const day = ukDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hours = ukDate.getHours();

      // Tuesday (2) through Saturday (6), 10:00 AM (10) to 6:00 PM (18)
      const isStudioDay = day >= 2 && day <= 6;
      const isStudioHour = hours >= 10 && hours < 18;
      setIsOpen(isStudioDay && isStudioHour);
    } catch (e) {
      setIsOpen(false);
    }
  }, []);

  // Fetch live business hours from Supabase
  useEffect(() => {
    async function fetchBusinessHours() {
      const { data, error } = await supabase
        .from('business_hours')
        .select('day_of_week, is_open, open_time, close_time')
        .order('created_at', { ascending: true });
      
      if (data && !error) {
        setDbHours(data as BusinessHourRow[]);
      }
    }
    fetchBusinessHours();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen bg-[#121214] text-[#F3F4F6] overflow-hidden flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#121214]"
    >
      {/* Background Subtle Radial Glow & Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.07),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(28,28,30,0.5),transparent_50%)] pointer-events-none" />
      
      {/* Navigation Header */}
      <header className="relative z-50 w-full border-b border-white/5 bg-[#121214]/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a 
            href="#hero" 
            className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md p-1"
          >
            <span className="font-sans text-lg sm:text-xl font-extrabold uppercase tracking-widest text-[#F3F4F6] group-hover:text-[#D4AF37] transition-colors duration-300">
              Tattoos by Jake Llewellyn
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#9CA3AF] font-mono group-hover:text-white transition-colors duration-300">
              Bargoed, United Kingdom
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#portfolio-gallery" className="text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-200">
              Work
            </a>
            <a href="#flash-catalog" className="text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-200">
              Flash Designs
            </a>
            <a href="#aftercare-guide" className="text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-200">
              Aftercare
            </a>
            <a href="#contact-studio" className="text-sm font-medium tracking-wide hover:text-[#D4AF37] transition-colors duration-200">
              Contact
            </a>
          </nav>

          {/* Dynamic Business Hours Widget & Header CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Live Indicator Pill */}
            <div className="relative group cursor-help">
              <div className="flex items-center space-x-2 bg-[#1C1C1E] px-3.5 py-1.5 rounded-full border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300">
                <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isOpen === true ? 'bg-[#16A34A]' : 'bg-[#9CA3AF]'}`} />
                <span className="text-xs font-medium tracking-wide text-[#9CA3AF]">
                  {isOpen === null ? 'Checking studio...' : isOpen ? 'Studio Open' : 'Studio Closed'}
                </span>
              </div>
              
              {/* Dynamic Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#1C1C1E] border border-white/10 rounded-xl p-4 shadow-2xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none transition-all duration-300 z-50">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">
                  {isOpen ? 'Creative Sessions in Progress' : 'Booking Enquiries Open'}
                </p>
                <p className="text-xs text-[#9CA3AF] mb-3">
                  Jake is active in the studio Tuesday – Saturday, 10am to 6pm.
                </p>
                <div className="space-y-1 text-[11px] border-t border-white/5 pt-2">
                  <div className="flex justify-between text-[#9CA3AF]">
                    <span>Tue – Sat</span>
                    <span className="text-white">10:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[#9CA3AF]">
                    <span>Sun & Mon</span>
                    <span className="text-[#9CA3AF]">Closed (Rest & Prep)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header CTA */}
            <a 
              href="#booking-form" 
              className="inline-flex items-center justify-center bg-[#D4AF37] text-[#121214] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-[#D4AF37]/10"
            >
              Book a Session
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F3F4F6] hover:text-[#D4AF37] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#1C1C1E] border-b border-white/5 px-4 py-6 space-y-4 absolute top-20 left-0 w-full z-40"
          >
            <div className="flex flex-col space-y-4">
              <a 
                href="#portfolio-gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium tracking-wide text-[#F3F4F6] hover:text-[#D4AF37]"
              >
                Work
              </a>
              <a 
                href="#flash-catalog" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium tracking-wide text-[#F3F4F6] hover:text-[#D4AF37]"
              >
                Flash Designs
              </a>
              <a 
                href="#aftercare-guide" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium tracking-wide text-[#F3F4F6] hover:text-[#D4AF37]"
              >
                Aftercare
              </a>
              <a 
                href="#contact-studio" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium tracking-wide text-[#F3F4F6] hover:text-[#D4AF37]"
              >
                Contact
              </a>
            </div>

            <div className="border-t border-white/5 pt-4 flex flex-col space-y-4">
              {/* Mobile Hours indicator */}
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-[#16A34A]' : 'bg-[#9CA3AF]'}`} />
                <span className="text-xs text-[#9CA3AF]">
                  {isOpen ? 'Studio Open — Sessions in Progress' : 'Studio Closed — Enquiries Open'}
                </span>
              </div>
              {/* Mobile CTA */}
              <a 
                href="#booking-form"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#D4AF37] text-[#121214] font-bold py-3 rounded-md text-sm uppercase tracking-widest"
              >
                Book a Session
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Hero Split Content */}
      <div className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Prop */}
            <motion.div 
              className="lg:col-span-7 flex flex-col justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Dynamic Business Hours Widget (Hero Area) */}
              <motion.div variants={itemVariants} className="mb-6 inline-flex self-start">
                <div className="flex items-center space-x-2.5 bg-[#1C1C1E] border border-[#D4AF37]/20 px-4 py-2 rounded-full shadow-lg">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen === true ? 'bg-[#16A34A]' : 'bg-amber-500'}`} />
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen === true ? 'bg-[#16A34A]' : 'bg-[#9CA3AF]'}`} />
                  </span>
                  <span className="text-xs font-mono font-medium tracking-wider text-[#F3F4F6]">
                    {isOpen === null 
                      ? 'Syncing Studio Hours...' 
                      : isOpen 
                        ? 'Studio Open — Creative Sessions in Progress' 
                        : 'Studio Closed — Booking Enquiries Open'}
                  </span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] mb-6"
              >
                Your Vision, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37] bg-[length:200%_auto] animate-pulse">
                  Expertly Inked.
                </span>
              </motion.h1>

              {/* Subheadline Description */}
              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg text-[#9CA3AF] max-w-2xl leading-relaxed mb-8 sm:mb-10 font-sans"
              >
                Welcome to Tattoos by Jake Llewellyn—a clean, professional, and friendly private tattoo studio in Bargoed. Whether you are planning your very first tattoo or adding a new custom piece to your collection, we make the process comfortable, collaborative, and entirely stress-free. All styles are welcome.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
              >
                <a 
                  href="#booking-form"
                  className="inline-flex items-center justify-center bg-[#D4AF37] text-[#121214] font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-md hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-[#D4AF37]/15 group"
                >
                  Request a Booking
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="#flash-catalog"
                  className="inline-flex items-center justify-center bg-[#1C1C1E] hover:bg-white/5 text-[#F3F4F6] border border-white/10 hover:border-white/20 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-md transition-all duration-200"
                >
                  Browse Available Flash
                </a>
              </motion.div>

              {/* Rapid Contact Quick Links */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-8"
              >
                <div className="flex items-center space-x-3 text-sm text-[#9CA3AF]">
                  <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <a href="tel:07729357006" className="hover:text-white transition-colors">07729357006</a>
                </div>
                <div className="flex items-center space-x-3 text-sm text-[#9CA3AF]">
                  <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span className="truncate">6A Gwerthonor Place, Gilfach, Bargoed</span>
                </div>
              </motion.div>

            </motion.div>

            {/* Right Column: Visual Close-up Studio Image */}
            <div className="lg:col-span-5 relative h-[350px] sm:h-[450px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl group">
              {/* Decorative Frame */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none z-20" />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/10 to-transparent blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Image Container with Framer Motion */}
              <motion.div 
                className="relative w-full h-full"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Fallback & High Contrast Artful Tattoo Image */}
                <img 
                  src="https://images.unsplash.com/photo-1598252573302-b35c0c5670a9?auto=format&fit=crop&w=1200&q=80" 
                  alt="Professional friendly private tattoo studio in Bargoed"
                  className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[1.5s] ease-out"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60 pointer-events-none" />
                
                {/* Floating Studio Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#1C1C1E]/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl flex items-center justify-between z-10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white">Private Studio Session</p>
                      <p className="text-[11px] text-[#9CA3AF]">Bargoed (Gilfach) Location</p>
                    </div>
                  </div>
                  <a 
                    href="#meet-your-artist" 
                    className="text-xs font-bold text-[#D4AF37] hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>Meet Jake</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* Trust Banner Ribbon */}
      <div className="relative z-20 w-full bg-[#1C1C1E] border-t border-b border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Metric 1 */}
            <div className="flex items-center space-x-4 py-4 md:py-0 md:px-6 justify-center md:justify-start">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-white">Fully Licensed</p>
                <p className="text-xs text-[#9CA3AF]">Hygiene Registered Bargoed Council</p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center space-x-4 py-4 md:py-0 md:px-6 justify-center">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-white">100% Custom Artwork</p>
                <p className="text-xs text-[#9CA3AF]">Bespoke Designs & Expert Cover-Ups</p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center space-x-4 py-4 md:py-0 md:px-6 justify-center md:justify-end">
              <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-white">Welcoming Vibe</p>
                <p className="text-xs text-[#9CA3AF]">No-Pressure, Inclusive Environment</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}