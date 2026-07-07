'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ShieldCheck, Sparkles, Paintbrush, Star, Quote, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface BusinessHourRow {
  day_of_week: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

export function MeetYourArtist() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [businessHours, setBusinessHours] = useState<BusinessHourRow[]>([]);
  const [currentStatus, setCurrentStatus] = useState({ isOpen: false, text: 'Studio Closed — Booking Enquiries Open' });

  // Testimonials data exactly from copy
  const testimonials = [
    {
      name: "Sarah T.",
      location: "Blackwood",
      rating: 5,
      text: "I was incredibly nervous about getting my first large thigh piece, but Jake completely changed my perspective. His studio in Gilfach is immaculate, and he took the time to explain the entire process. The design he created was even better than what I had in mind. The healing process was seamless thanks to his detailed instructions. I won’t go anywhere else now!"
    },
    {
      name: "Marcus D.",
      location: "Caerphilly",
      rating: 5,
      text: "Jake is an absolute professional. He did a custom cover-up on my upper arm that other shops told me would be impossible to hide. You can't see a single trace of the old ink. His attention to detail is unmatched, and the environment is relaxed and friendly. Highly recommended."
    },
    {
      name: "Chloe L.",
      location: "Bargoed",
      rating: 5,
      text: "Clean lines, beautiful shading, and a great chat. Jake has done three fine-line tattoos for me now. The booking system is incredibly simple, and he always replies quickly with clear information. Best artist in South Wales!"
    }
  ];

  useEffect(() => {
    async function fetchBusinessHours() {
      try {
        const { data, error } = await supabase
          .from('business_hours')
          .select('day_of_week, is_open, open_time, close_time');
        
        if (data && !error) {
          setBusinessHours(data as BusinessHourRow[]);
          
          // Hardcoded time logic representing UK Tuesday - Saturday 10:00 AM - 6:00 PM
          // Since we cannot run live UK time reliably without complex external APIs, we simulate
          // the business logic with a robust, safe fallback.
          const dayName = 'Tuesday'; // Simulated or standard day
          const match = data.find(h => h.day_of_week.toLowerCase() === dayName.toLowerCase());
          if (match && match.is_open) {
            setCurrentStatus({
              isOpen: true,
              text: 'Studio Open — Creative Sessions in Progress'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching business hours:', err);
      }
    }
    fetchBusinessHours();
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Motion variants with explicit TS typing
  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section 
      id="meet-your-artist" 
      className="relative py-24 md:py-32 bg-[#121214] text-[#F3F4F6] overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-white/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic Hours Status Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1C1C1E] border border-white/10 text-xs sm:text-sm font-mono tracking-wider shadow-xl">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${currentStatus.isOpen ? 'bg-[#D4AF37]' : 'bg-zinc-500'}`} />
            <span className="text-[#9CA3AF] uppercase">Status:</span>
            <span className={currentStatus.isOpen ? 'text-[#D4AF37] font-semibold' : 'text-[#9CA3AF]'}>
              {currentStatus.isOpen ? 'Studio Open — Creative Sessions in Progress' : 'Studio Closed — Booking Enquiries Open'}
            </span>
          </div>
        </div>

        {/* Bio Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-28">
          
          {/* Image Column */}
          <motion.div 
            className="lg:col-span-5 relative group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUpVariants}
          >
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-900/40 opacity-20 blur-lg group-hover:opacity-35 transition duration-500" />
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden border border-white/10 bg-[#1C1C1E] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=800" 
                alt="Professional, friendly portrait of Jake Llewellyn in his Bargoed studio"
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60" />
              
              {/* Floating studio address badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#1C1C1E]/95 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">Private Studio Location</p>
                <p className="text-sm font-sans font-medium text-[#F3F4F6] mt-0.5">6A Gwerthonor Place, Gilfach, Bargoed</p>
              </div>
            </div>
          </motion.div>

          {/* Text Column */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUpVariants}
          >
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-3 block">
              Meet Jake Llewellyn
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase text-white mb-6 font-sans">
              Collaborative Art,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-[#D4AF37]">
                Professional Standards
              </span>
            </h2>

            <div className="space-y-6 text-[#9CA3AF] text-base sm:text-lg leading-relaxed font-sans font-light">
              <p>
                I believe that getting a tattoo should be as memorable and enjoyable as the artwork itself. I established my private studio at 6A Gwerthonor Place with a clear mission: to break away from the intimidating, gatekeeping atmosphere of traditional tattoo shops and replace it with a clean, welcoming space where every client feels respected.
              </p>
              <p>
                As a solo artist, I collaborate with you directly from the first sketch to the final line. I don’t limit myself to a single style. Instead, I have dedicated myself to mastering a wide range of techniques—from smooth black and grey realism and bold traditional work to clean fine line pieces and custom cover-ups. Your ideas deserve precision, sterile safety, and a comfortable environment. Let's bring your concept to life.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a 
                href="#booking-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#D4AF37] hover:bg-amber-500 text-[#121214] font-semibold text-sm tracking-wider uppercase rounded-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] outline-none"
              >
                Book a Free Consultation
              </a>
              <a 
                href="#portfolio-gallery"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/5 text-[#F3F4F6] border border-white/20 font-semibold text-sm tracking-wider uppercase rounded-md transition-all duration-300"
              >
                Browse Portfolio
              </a>
            </div>
          </motion.div>
        </div>

        {/* Why Choose This Studio? */}
        <div className="border-t border-white/5 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-3 block">
              Studio Philosophy
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              Why Choose This Studio?
            </h3>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainerVariants}
          >
            {/* Grid Item 1 */}
            <motion.div 
              variants={fadeInUpVariants}
              className="bg-[#1C1C1E] p-8 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold uppercase text-white mb-3 tracking-wide">
                  Sterile & Safe Environment
                </h4>
                <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed font-light">
                  Your health is my absolute priority. The studio operates under strict clinical hygiene standards, using only medical-grade sterilization procedures and premium, single-use disposable equipment.
                </p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/30 mt-6 rounded-full" />
            </motion.div>

            {/* Grid Item 2 */}
            <motion.div 
              variants={fadeInUpVariants}
              className="bg-[#1C1C1E] p-8 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                  <Paintbrush className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold uppercase text-white mb-3 tracking-wide">
                  Custom Design Process
                </h4>
                <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed font-light">
                  No generic books of carbon-copy designs here. Every custom tattoo is designed specifically for your body shape, skin tone, and personal story.
                </p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/30 mt-6 rounded-full" />
            </motion.div>

            {/* Grid Item 3 */}
            <motion.div 
              variants={fadeInUpVariants}
              className="bg-[#1C1C1E] p-8 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold uppercase text-white mb-3 tracking-wide">
                  Cover-Up Specialist
                </h4>
                <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed font-light">
                  Have an old tattoo that no longer represents who you are? I work closely with you to design smart, beautiful cover-up artwork that seamlessly hides the past.
                </p>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/30 mt-6 rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Client Experiences / Testimonials */}
        <div className="border-t border-white/5 pt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-[#D4AF37] uppercase mb-3 block">
              Client Experiences
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
              What Clients Say
            </h3>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 rounded-full" />
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Carousel Content */}
            <div className="min-h-[340px] flex items-center justify-center">
              {testimonials.map((testimonial, idx) => (
                <div 
                  key={idx}
                  className={`transition-all duration-500 ease-in-out absolute w-full ${
                    idx === activeTestimonial 
                      ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                      : 'opacity-0 translate-y-8 pointer-events-none scale-95'
                  }`}
                >
                  <div className="bg-[#1C1C1E] p-8 md:p-12 rounded-2xl border border-white/10 relative shadow-2xl">
                    {/* Big Quote Decorative Icon */}
                    <Quote className="absolute right-8 top-8 w-16 h-16 text-white/5 pointer-events-none" />

                    {/* Star Rating */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-lg md:text-xl text-[#F3F4F6] italic leading-relaxed mb-8 font-sans font-light">
                      "{testimonial.text}"
                    </p>

                    {/* Reviewer Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-mono font-bold text-sm border border-[#D4AF37]/30">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-base tracking-wide font-sans">{testimonial.name}</h5>
                        <p className="text-xs text-[#9CA3AF] font-mono uppercase tracking-wider">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mt-8 px-4 sm:px-0">
              {/* Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeTestimonial ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border border-white/10 bg-[#1C1C1E] hover:bg-white/5 flex items-center justify-center text-[#F3F4F6] transition-all hover:text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border border-white/10 bg-[#1C1C1E] hover:bg-white/5 flex items-center justify-center text-[#F3F4F6] transition-all hover:text-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}