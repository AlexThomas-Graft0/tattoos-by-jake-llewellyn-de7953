'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface BusinessHour {
  day_of_week: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  note?: string;
}

const DEFAULT_HOURS: BusinessHour[] = [
  { day_of_week: 'Monday', is_open: false, open_time: null, close_time: null, note: 'Rest & Prep Day' },
  { day_of_week: 'Tuesday', is_open: true, open_time: '10:00 AM', close_time: '6:00 PM', note: 'Open' },
  { day_of_week: 'Wednesday', is_open: true, open_time: '10:00 AM', close_time: '6:00 PM', note: 'Open' },
  { day_of_week: 'Thursday', is_open: true, open_time: '10:00 AM', close_time: '6:00 PM', note: 'Open' },
  { day_of_week: 'Friday', is_open: true, open_time: '10:00 AM', close_time: '6:00 PM', note: 'Open' },
  { day_of_week: 'Saturday', is_open: true, open_time: '10:00 AM', close_time: '6:00 PM', note: 'Open' },
  { day_of_week: 'Sunday', is_open: false, open_time: null, close_time: null, note: 'Closed' },
];

export function ContactStudio() {
  const [hours, setHours] = useState<BusinessHour[]>(DEFAULT_HOURS);
  const [currentDayName, setCurrentDayName] = useState<string>('');
  const [statusIndicator, setStatusIndicator] = useState({
    isOpen: false,
    text: 'Studio Closed — Booking Enquiries Open',
  });

  useEffect(() => {
    // Safely calculate current time/day on client to avoid SSR hydration mismatch
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[now.getDay()];
    setCurrentDayName(dayName);

    const currentDayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    const currentHour = now.getHours();

    // Logic: Tuesday through Saturday, 10:00 AM to 6:00 PM (10:00 to 18:00)
    if (currentDayOfWeek >= 2 && currentDayOfWeek <= 6 && currentHour >= 10 && currentHour < 18) {
      setStatusIndicator({
        isOpen: true,
        text: 'Studio Open — Creative Sessions in Progress',
      });
    } else {
      setStatusIndicator({
        isOpen: false,
        text: 'Studio Closed — Booking Enquiries Open',
      });
    }

    async function fetchBusinessHours() {
      try {
        const { data, error } = await supabase
          .from('business_hours')
          .select('day_of_week, is_open, open_time, close_time');
        
        if (!error && data && data.length > 0) {
          // Map DB response to match days order and format
          const formatted = DEFAULT_HOURS.map((def) => {
            const dbItem = data.find(
              (d) => d.day_of_week.toLowerCase() === def.day_of_week.toLowerCase()
            );
            if (dbItem) {
              const formatTime = (timeStr: string | null) => {
                if (!timeStr) return '';
                // Simple conversion from '10:00:00' to '10:00 AM'
                const parts = timeStr.split(':');
                if (parts.length >= 2) {
                  const hour = parseInt(parts[0], 10);
                  const min = parts[1];
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                  return `${displayHour}:${min} ${ampm}`;
                }
                return timeStr;
              };

              return {
                day_of_week: def.day_of_week,
                is_open: dbItem.is_open,
                open_time: dbItem.is_open ? formatTime(dbItem.open_time) : null,
                close_time: dbItem.is_open ? formatTime(dbItem.close_time) : null,
                note: dbItem.is_open ? 'Open' : def.day_of_week === 'Monday' ? 'Rest & Prep Day' : 'Closed',
              };
            }
            return def;
          });
          setHours(formatted);
        }
      } catch (err) {
        console.error('Failed to load dynamic business hours, using fallback data.', err);
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  // Structured Schema data for SEO injection
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    "name": "Tattoos by Jake Llewellyn",
    "image": "https://images.unsplash.com/photo-1598252573302-a37e5965c26a?auto=format&fit=crop&q=80&w=1200",
    "@id": "https://tattoosbyjakellewellyn.co.uk/#contact-studio",
    "url": "https://tattoosbyjakellewellyn.co.uk",
    "telephone": "07729357006",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "6A Gwerthonor Place, Gilfach",
      "addressLocality": "Bargoed",
      "postalCode": "CF81 8JQ",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.691234,
      "longitude": -3.231234
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://facebook.com/share/1EcPtapnqm/?mibextid=wwXIfr",
      "https://instagram.com/tattoos_by_jake_llewellyn?igsh=cXFlbmJ5cnExYXU1&utm_source=qr"
    ]
  };

  return (
    <section id="contact-studio" className="relative bg-[#121214] text-[#F3F4F6] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Decorative Gold Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-3">
            FIND THE STUDIO
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-sans tracking-tight text-white mb-6">
            Visit the Studio
          </h2>
          <p className="text-lg text-[#9CA3AF] leading-relaxed">
            Located in Gilfach, Bargoed. The studio operates primarily by appointment to ensure a private, focused creative environment. Drop-ins are welcome for consultations when schedule permits.
          </p>

          {/* Dynamic Open/Closed Badge */}
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#1C1C1E] border border-white/10 shadow-lg">
            <span className={`relative flex h-3 w-3`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusIndicator.isOpen ? 'bg-[#16A34A]' : 'bg-[#9CA3AF]'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${statusIndicator.isOpen ? 'bg-[#16A34A]' : 'bg-[#9CA3AF]'}`} />
            </span>
            <span className="text-sm font-medium tracking-wide text-[#F3F4F6]">
              {statusIndicator.text}
            </span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* LEFT SIDE: Contact & Opening Hours */}
          <motion.div className="lg:col-span-5 flex flex-col gap-8" variants={itemVariants}>
            
            {/* Quick Contact Info Card */}
            <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide uppercase font-mono">
                Studio Details
              </h3>
              
              <div className="space-y-6">
                {/* Physical Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#121214] text-[#D4AF37] border border-white/5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono tracking-wider text-[#9CA3AF] uppercase mb-1">Location</h4>
                    <p className="text-white font-medium leading-relaxed">
                      Tattoos by Jake Llewellyn<br />
                      6A Gwerthonor Place, Gilfach,<br />
                      Bargoed, CF81 8JQ,<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <a 
                  href="tel:07729357006" 
                  className="flex items-start gap-4 group/item hover:bg-white/5 p-2 -m-2 rounded-xl transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-[#121214] text-[#D4AF37] border border-white/5 group-hover/item:border-[#D4AF37]/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono tracking-wider text-[#9CA3AF] uppercase mb-1">Phone Number</h4>
                    <p className="text-[#D4AF37] font-bold text-lg tracking-wider group-hover/item:underline">
                      07729357006
                    </p>
                    <span className="text-xs text-[#9CA3AF]">Click to call directly</span>
                  </div>
                </a>

                {/* Email Address */}
                <a 
                  href="mailto:Nllewellyn975682@aol.com" 
                  className="flex items-start gap-4 group/item hover:bg-white/5 p-2 -m-2 rounded-xl transition-all duration-200"
                >
                  <div className="p-3 rounded-xl bg-[#121214] text-[#D4AF37] border border-white/5 group-hover/item:border-[#D4AF37]/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-mono tracking-wider text-[#9CA3AF] uppercase mb-1">Email Address</h4>
                    <p className="text-white font-medium break-all group-hover/item:text-[#D4AF37] transition-colors">
                      Nllewellyn975682@aol.com
                    </p>
                    <span className="text-xs text-[#9CA3AF]">Click to email anytime</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Weekly Operating Hours Table Card */}
            <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide uppercase font-mono">
                Weekly Operating Hours
              </h3>
              
              <div className="divide-y divide-white/5">
                {hours.map((row) => {
                  const isToday = row.day_of_week === currentDayName;
                  return (
                    <div 
                      key={row.day_of_week} 
                      className={`py-3.5 flex items-center justify-between transition-colors ${
                        isToday ? 'bg-[#D4AF37]/5 px-3 -mx-3 rounded-lg border-l-2 border-[#D4AF37]' : ''
                      }`}
                    >
                      <span className={`font-medium ${isToday ? 'text-[#D4AF37] font-bold' : 'text-white'}`}>
                        {row.day_of_week}
                        {isToday && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full font-mono">
                            Today
                          </span>
                        )}
                      </span>
                      
                      <div className="text-right">
                        {row.is_open ? (
                          <span className="text-sm font-semibold text-white">
                            {row.open_time} – {row.close_time}
                          </span>
                        ) : (
                          <span className="text-sm font-mono text-[#9CA3AF]">
                            {row.note || 'Closed'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>

          {/* RIGHT SIDE: Maps, Directions & Socials */}
          <motion.div className="lg:col-span-7 flex flex-col gap-8" variants={itemVariants}>
            
            {/* Interactive Map Embed */}
            <div className="relative bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden shadow-xl h-[340px] group">
              {/* Overlay with instructions */}
              <div className="absolute top-4 left-4 z-10 bg-[#121214]/90 backdrop-blur border border-white/10 px-4 py-2 rounded-xl shadow-md pointer-events-none">
                <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-semibold">Private Studio Location</p>
                <p className="text-[11px] text-[#9CA3AF]">6A Gwerthonor Place, Bargoed</p>
              </div>

              {/* Styled dark-themed Map Frame */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2475.4660991584994!2d-3.233423!3d51.691234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487158bc12a5dbbf%3A0xe74f8382ba036a11!2s6A%20Gwerthonor%20Place%2C%20Gilfach%2C%20Bargoed%20CF81%208JQ!5e0!3m2!1sen!2sgb!4v1710000000000!5m2!1sen!2sgb"
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(110%)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                title="Tattoos by Jake Llewellyn Studio Location Map"
              />

              <div className="absolute bottom-4 right-4 z-10">
                <a 
                  href="https://maps.google.com/?q=6A+Gwerthonor+Place,+Gilfach,+Bargoed,+CF81+8JQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#121214] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-[1.03]"
                >
                  Open in Maps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Travel Directions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white tracking-wide">By Car</h4>
                </div>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  Located on Gwerthonor Place in Gilfach, Bargoed. Free on-street parking is available directly along Gwerthonor Place and nearby residential roads. Please arrive 10 minutes prior to park.
                </p>
              </div>

              <div className="bg-[#1C1C1E] rounded-2xl border border-white/5 p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-white tracking-wide">By Train</h4>
                </div>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  We are a short, 5-minute walk from Bargoed Train Station, making the studio easily accessible from Cardiff, Caerphilly, and the surrounding Valleys.
                </p>
              </div>
            </div>

            {/* Social Media Connections */}
            <div className="bg-gradient-to-r from-[#1C1C1E] to-[#121214] rounded-2xl border border-white/5 p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Connect on Social Media</h4>
                <p className="text-sm text-[#9CA3AF]">See daily stories, newly released flash sheets, and live sessions.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://facebook.com/share/1EcPtapnqm/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1C1C1E] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-white transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                  <span className="text-sm font-semibold">Facebook</span>
                </a>

                <a 
                  href="https://instagram.com/tattoos_by_jake_llewellyn?igsh=cXFlbmJ5cnExYXU1&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1C1C1E] hover:bg-[#D4AF37]/10 border border-white/10 hover:border-[#D4AF37]/40 text-white transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  <span className="text-sm font-semibold">Instagram</span>
                </a>
              </div>
            </div>

            {/* Quick action footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#1C1C1E] rounded-2xl border border-[#D4AF37]/20 gap-4">
              <span className="text-sm text-[#F3F4F6] text-center sm:text-left">
                Ready to book your custom session or claim a flash design?
              </span>
              <a 
                href="#booking-form" 
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#121214] font-bold text-sm tracking-wide transition-all duration-200 shadow-md hover:scale-[1.03]"
              >
                Request a Booking
              </a>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}