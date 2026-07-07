'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface DbAftercareGuide {
  id: string;
  title: string;
  section_type: 'pre-appointment' | 'post-tattoo';
  content: string;
  display_order: number;
}

interface StepItem {
  number: string;
  title: string;
  details: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export function AftercareGuide() {
  const [dbGuides, setDbGuides] = useState<DbAftercareGuide[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchAftercareGuides() {
      try {
        const { data, error } = await supabase
          .from('aftercare_guides')
          .select('id, title, section_type, content, display_order')
          .order('display_order', { ascending: true });
        
        if (!error && data) {
          setDbGuides(data as DbAftercareGuide[]);
        }
      } catch (err) {
        console.error('Error fetching aftercare guides:', err);
      }
    }
    fetchAftercareGuides();
  }, []);

  const preSessionSteps: StepItem[] = [
    {
      number: '01',
      title: 'Stay Hydrated & Eat Well',
      details: 'Drink plenty of water the day before and the morning of your session. Eat a substantial meal 1 to 2 hours before your appointment to keep your blood sugar levels stable.'
    },
    {
      number: '02',
      title: 'Avoid Alcohol & Aspirin',
      details: 'Do not consume alcohol, heavy caffeine, or blood-thinning medications (like aspirin) for 24 hours before your session. These thin your blood, which can cause excess bleeding and affect how the ink settles.'
    },
    {
      number: '03',
      title: 'Wear Appropriate Clothing',
      details: "Wear loose, comfortable clothing that easily exposes the area being tattooed. Expect that some ink may get on your clothes, so wear something you don't mind getting stained."
    },
    {
      number: '04',
      title: 'Prep Your Skin',
      details: 'Ensure the area is clean and free of sunburn, cuts, or scrapes. Do not shave the area yourself unless requested; Jake will safely shave the area in a sterile environment immediately before tattooing.'
    }
  ];

  const postSessionPhases: StepItem[] = [
    {
      number: 'PHASE 1',
      title: 'The First 2 to 4 Hours',
      details: 'Keep the protective second-skin wrap or cling film on as advised by Jake. Once removed, wash the tattoo gently with warm water and a mild, unscented antibacterial liquid soap. Use your clean hands—never a washcloth or sponge. Pat dry with a clean paper towel.'
    },
    {
      number: 'PHASE 2',
      title: 'Days 1 to 3 (Moisturize Sparingly)',
      details: 'Apply an extremely thin layer of recommended tattoo aftercare ointment (such as Butterluxe or Bepanthen) twice a day. The tattoo should not look wet or shiny. Less is more.'
    },
    {
      number: 'PHASE 3',
      title: 'Days 4 to 14 (The Peeling Stage)',
      details: 'Your tattoo will begin to flake, peel, and itch, similar to a mild sunburn. Do not scratch, pick, or peel the skin. Let the dead skin fall off naturally to avoid pulling out the ink and causing light patches.'
    }
  ];

  const thingsToAvoid = [
    'No swimming, hot tubs, or baths for 2 full weeks (quick, clean showers only).',
    'No direct sunlight or tanning beds for 3 weeks. Once healed, always use SPF 50 sunscreen to keep your colors bright.',
    'No tight, rubbing clothing over the healing tattoo.'
  ];

  const faqs: FaqItem[] = [
    {
      question: 'Is it normal for my new tattoo to leak fluid under the second-skin bandage?',
      answer: "Yes, absolutely. It is completely normal for blood, plasma, and excess ink to collect under the wrap, forming a dark, cloudy bubble. This is your body's natural healing process. Unless the seal breaks and fluid leaks out, leave the wrap on for the recommended time."
    },
    {
      question: 'When can I return to the gym or exercise?',
      answer: 'We recommend taking at least 2 to 3 days off from intense, sweat-inducing workouts. Avoid any exercises that stretch or rub the newly tattooed skin, and never let your healing tattoo touch dirty gym equipment.'
    },
    {
      question: 'What should I do if my tattoo looks red or feels hot after a few days?',
      answer: 'Some redness, swelling, and tenderness are normal for the first 48 hours. However, if the redness spreads, feels increasingly hot to the touch, or oozes thick yellow fluid, please contact the studio immediately and consult a healthcare professional.'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section 
      id="aftercare-guide" 
      className="relative bg-[#121214] text-[#F3F4F6] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden print:bg-white print:text-black"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] opacity-[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white opacity-[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 print:text-left print:mb-8">
          <span className="text-[#D4AF37] font-mono tracking-wider text-xs uppercase block mb-3 font-semibold">
            Expert Healing & Preparation
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase font-sans text-white mb-6 print:text-black print:text-3xl">
            Caring For Your Tattoo
          </h2>
          <p className="text-[#9CA3AF] text-lg md:text-xl font-normal leading-relaxed font-sans print:text-black">
            A beautiful tattoo starts with professional application and ends with proper aftercare. Follow these clean, simple guidelines to prepare for your session and protect your skin while it heals.
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1E] border border-stone-800 hover:border-[#D4AF37] rounded-full text-sm font-medium transition-all duration-300 hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Instructions
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C1C1E] border border-stone-800 hover:border-[#D4AF37] rounded-full text-sm font-medium transition-all duration-300 hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.028-2.014m0 0a3.5 3.5 0 10-4.887-4.76l-4.028 2.014m4.028 2.014a3.5 3.5 0 11-4.887 4.76l4.028-2.014m0 0a3.5 3.5 0 104.887-4.76l-4.028-2.014" />
              </svg>
              {isCopied ? 'Link Copied!' : 'Share Guide'}
            </button>
          </div>
        </div>

        {/* Dynamic Database Content Banner (if available) */}
        {dbGuides.length > 0 && (
          <div className="mb-16 p-6 bg-[#1C1C1E] border-l-4 border-[#D4AF37] rounded-r-lg max-w-4xl mx-auto print:hidden">
            <h3 className="text-lg font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">Latest Studio Updates</h3>
            <div className="space-y-3">
              {dbGuides.map((guide) => (
                <div key={guide.id} className="text-sm">
                  <span className="font-semibold text-white mr-2">[{guide.section_type === 'pre-appointment' ? 'PRE-SESSION' : 'POST-SESSION'}] {guide.title}:</span>
                  <span className="text-[#9CA3AF]">{guide.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-Column Grid: Pre-Session & Post-Session */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24 print:grid-cols-1">
          
          {/* Column 1: Pre-Session Preparation */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="space-y-8"
          >
            <div className="border-b border-stone-800 pb-6 mb-8 print:border-black">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase">Preparation</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight uppercase font-sans text-white print:text-black">
                Pre-Session Preparation
              </h3>
              <p className="text-[#9CA3AF] text-sm mt-2">Steps to take before you arrive at the studio to ensure a smooth session.</p>
            </div>

            <div className="space-y-6">
              {preSessionSteps.map((step) => (
                <motion.div 
                  key={step.number} 
                  variants={cardVariants}
                  className="bg-[#1C1C1E] p-6 rounded-xl border border-stone-800 hover:border-stone-700 transition-all duration-300 flex gap-5 print:bg-white print:text-black print:border-none print:p-0"
                >
                  <span className="text-[#D4AF37] font-mono text-xl font-bold tracking-tight select-none">
                    {step.number}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-wide uppercase font-sans print:text-black">
                      {step.title}
                    </h4>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed print:text-black">
                      {step.details}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Visual Callout Pre-session */}
            <div className="relative h-64 rounded-xl overflow-hidden group print:hidden">
              <img 
                src="https://images.unsplash.com/photo-1598252571565-794637de7724?auto=format&fit=crop&q=80&w=1200" 
                alt="Sterile tattoo equipment preparation in Bargoed studio" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest mb-1">Studio Standard</p>
                <p className="text-sm font-bold text-white tracking-wide">100% Sterile, Single-use Disposable Equipment Always</p>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Post-Session Healing */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="space-y-8"
          >
            <div className="border-b border-stone-800 pb-6 mb-8 print:border-black">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase">Post-Session</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight uppercase font-sans text-white print:text-black">
                Post-Session Healing
              </h3>
              <p className="text-[#9CA3AF] text-sm mt-2">How to care for your skin during the critical healing phases.</p>
            </div>

            <div className="space-y-6">
              {postSessionPhases.map((phase) => (
                <motion.div 
                  key={phase.number} 
                  variants={cardVariants}
                  className="bg-[#1C1C1E] p-6 rounded-xl border border-stone-800 hover:border-stone-700 transition-all duration-300 flex gap-5 print:bg-white print:text-black print:border-none print:p-0"
                >
                  <span className="text-[#D4AF37] font-mono text-xs font-semibold tracking-widest uppercase pt-1 whitespace-nowrap">
                    {phase.number}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 tracking-wide uppercase font-sans print:text-black">
                      {phase.title}
                    </h4>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed print:text-black">
                      {phase.details}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Things to Avoid completely */}
              <motion.div 
                variants={cardVariants}
                className="bg-[#1C1C1E]/50 p-6 rounded-xl border border-[#D4AF37]/20 print:bg-white print:text-black print:border-none print:p-0"
              >
                <h4 className="text-md font-bold text-[#D4AF37] mb-4 tracking-wider uppercase font-mono flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Things to Avoid Completely
                </h4>
                <ul className="space-y-3">
                  {thingsToAvoid.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm text-[#9CA3AF] leading-relaxed print:text-black">
                      <span className="text-[#D4AF37] select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="max-w-4xl mx-auto mt-24 print:hidden">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-2">Common Concerns</span>
            <h3 className="text-3xl font-black uppercase tracking-tight text-white font-sans">
              Aftercare & Healing FAQ
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#1C1C1E] rounded-xl border border-stone-800 overflow-hidden transition-colors duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 text-white hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors"
                  >
                    <span className="font-bold text-base md:text-lg tracking-wide">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 p-1 bg-stone-800 rounded-full text-[#D4AF37]">
                      <svg 
                        className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2 text-[#9CA3AF] text-sm md:text-base leading-relaxed border-t border-stone-800/40">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing conversion block */}
        <div className="mt-24 text-center max-w-xl mx-auto print:hidden">
          <h4 className="text-2xl font-black uppercase text-white font-sans tracking-tight mb-4">
            Ready to Start Your Next Piece?
          </h4>
          <p className="text-[#9CA3AF] text-sm mb-8 leading-relaxed">
            Every custom tattoo is designed specifically for your body shape, skin tone, and personal story. Let's bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="#booking-form"
              className="px-8 py-4 bg-[#D4AF37] hover:bg-amber-500 text-[#121214] rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
            >
              Request a Booking
            </a>
            <a
              href="#contact-studio"
              className="px-8 py-4 bg-[#1C1C1E] border border-stone-800 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300"
            >
              Contact Studio
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}