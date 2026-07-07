'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Menu, X, Clock, Calendar, Phone, MapPin, ExternalLink } from 'lucide-react';

interface NavLinkItem {
  label: string;
  href: string;
}

export function Navbar() {
  const [isOpenStatus, setIsOpenStatus] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Safely calculate UK business hours client-side to prevent hydration mismatches
  useEffect(() => {
    const checkStatus = () => {
      try {
        const ukString = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
        const ukDate = new Date(ukString);
        const day = ukDate.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
        const hour = ukDate.getHours();

        // Open Tuesday (2) through Saturday (6), 10:00 AM to 6:00 PM (10:00 - 18:00)
        const open = day >= 2 && day <= 6 && hour >= 10 && hour < 18;
        setIsOpenStatus(open);
      } catch (e) {
        setIsOpenStatus(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks: NavLinkItem[] = [
    { label: 'Work', href: '#portfolio-gallery' },
    { label: 'Flash Designs', href: '#flash-catalog' },
    { label: 'Aftercare', href: '#aftercare-guide' },
    { label: 'Contact', href: '#contact-studio' },
  ];

  const sidebarVariants: Variants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const overlayVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 0.6 },
  };

  return (
    <>
      {/* Announcement / Live Status Bar */}
      <div className="w-full bg-[#121214] border-b border-white/5 py-2 px-4 sm:px-6 lg:px-8 text-xs relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Live Status Widget */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpenStatus ? 'bg-[#D4AF37]' : 'bg-zinc-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpenStatus ? 'bg-[#D4AF37]' : 'bg-zinc-500'}`}></span>
            </span>
            <span className="font-mono text-xs tracking-wider uppercase text-[#9CA3AF]">
              {isOpenStatus === null ? (
                'Checking Studio Status...'
              ) : isOpenStatus ? (
                <>
                  Studio Open — <span className="text-[#D4AF37]">Creative Sessions in Progress</span>
                </>
              ) : (
                <>
                  Studio Closed — <span className="text-[#F3F4F6]">Booking Enquiries Open</span>
                </>
              )}
            </span>
          </div>

          {/* Quick Info & Social Links */}
          <div className="flex items-center gap-4 text-[#9CA3AF] font-mono">
            <a href="tel:07729357006" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>07729357006</span>
            </a>
            <span className="text-white/10">|</span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Bargoed, UK</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#121214]/95 backdrop-blur-md border-white/10 shadow-lg py-3'
            : 'bg-[#121214] border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <a
              href="#hero"
              className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-lg p-1"
            >
              <span className="font-sans font-extrabold text-lg sm:text-xl md:text-2xl tracking-wider text-[#F3F4F6] uppercase transition-colors group-hover:text-white">
                Tattoos by <span className="text-[#D4AF37]">Jake Llewellyn</span>
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#9CA3AF] -mt-1 group-hover:text-[#D4AF37] transition-colors">
                Private Studio • Bargoed
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-mono text-sm uppercase tracking-widest text-[#9CA3AF] hover:text-[#D4AF37] transition-colors relative py-2 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Header CTA Button */}
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="#booking-form"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest bg-[#D4AF37] text-[#121214] font-bold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] shadow-md shadow-[#D4AF37]/10"
              >
                Book a Session
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center p-2 text-[#F3F4F6] hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Navigation Drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-[#1C1C1E] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
                  <span className="font-sans font-bold text-sm tracking-wider text-[#F3F4F6] uppercase">
                    Navigation
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-[#9CA3AF] hover:text-[#F3F4F6] focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-mono text-lg uppercase tracking-widest text-[#F3F4F6] hover:text-[#D4AF37] transition-colors py-2 border-b border-white/5 block"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer CTA & Info */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <a
                  href="#booking-form"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-4 rounded-none font-mono text-sm uppercase tracking-widest bg-[#D4AF37] text-[#121214] font-bold hover:bg-white hover:text-black transition-all duration-300"
                >
                  Book a Session
                </a>

                {/* Quick Studio Info */}
                <div className="space-y-2 text-xs text-[#9CA3AF] font-mono">
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tue - Sat: 10am - 6pm</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>6A Gwerthonor Place, Bargoed</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}