'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface FlashDesign {
  id: string;
  design_code: string;
  title: string;
  image_url: string;
  estimated_size: string | null;
  estimated_price: number | null;
  status: 'available' | 'claimed';
  created_at?: string;
}

const MOCK_FLASH_DESIGNS: FlashDesign[] = [
  {
    id: 'mock-1',
    design_code: 'JL-OWL-01',
    title: 'The Sentinel Owl',
    image_url: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&q=80&w=800',
    estimated_size: '15cm x 12cm',
    estimated_price: 200,
    status: 'available'
  },
  {
    id: 'mock-2',
    design_code: 'JL-ROSE-04',
    title: 'Nouveau Rose & Dagger',
    image_url: 'https://images.unsplash.com/photo-1515462277126-270d878326e5?auto=format&fit=crop&q=80&w=800',
    estimated_size: '12cm x 6cm',
    estimated_price: 135,
    status: 'available'
  },
  {
    id: 'mock-3',
    design_code: 'JL-SWAL-09',
    title: 'Traditional Swallow',
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800',
    estimated_size: '10cm x 10cm',
    estimated_price: 100,
    status: 'claimed'
  },
  {
    id: 'mock-4',
    design_code: 'JL-SNAK-02',
    title: 'Sacred Geometry Serpent',
    image_url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800',
    estimated_size: '18cm x 10cm',
    estimated_price: 220,
    status: 'available'
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15
    }
  }
};

export function FlashCatalog() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'claimed'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlashDesigns() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('flash_designs')
          .select('id, design_code, title, image_url, estimated_size, estimated_price, status')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (data && data.length > 0) {
          // Map DB status to strictly match the component's state
          const mappedData: FlashDesign[] = data.map((item) => ({
            id: item.id,
            design_code: item.design_code,
            title: item.title,
            image_url: item.image_url,
            estimated_size: item.estimated_size,
            estimated_price: item.estimated_price ? Number(item.estimated_price) : null,
            status: item.status === 'claimed' ? 'claimed' : 'available'
          }));
          setDesigns(mappedData);
        } else {
          setDesigns(MOCK_FLASH_DESIGNS);
        }
      } catch (err: any) {
        console.error('Error loading flash designs:', err);
        setError(err.message);
        setDesigns(MOCK_FLASH_DESIGNS);
      } finally {
        setLoading(false);
      }
    }

    fetchFlashDesigns();
  }, []);

  const handleClaim = (design: FlashDesign) => {
    if (design.status === 'claimed') return;
    
    // Store selected flash details in localStorage to allow the booking form to auto-fill
    localStorage.setItem('selected_flash_id', design.id);
    localStorage.setItem('selected_flash_code', design.design_code);
    localStorage.setItem('selected_flash_title', design.title);
    
    // Dispatch custom event to notify booking form instantly if already mounted
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('flash_selected', { 
        detail: { 
          id: design.id,
          code: design.design_code,
          title: design.title
        } 
      }));
    }
  };

  const filteredDesigns = designs.filter((design) => {
    if (filter === 'all') return true;
    return design.status === filter;
  });

  return (
    <section id="flash-catalog" className="relative py-24 bg-[#121214] text-[#F3F4F6] overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D4AF37] font-mono tracking-widest text-sm uppercase block mb-3">
            Strictly One-Off Originals
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-white mb-6">
            Exclusive Flash Designs
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-[#9CA3AF] text-lg leading-relaxed font-light">
            Pre-drawn, original artwork ready to wear. These designs are prepared with passion and are tattooed <strong className="text-white">only once</strong>. Once a design is claimed, it is gone forever. Select an available design below to secure it for your next session.
          </p>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { key: 'all', label: 'All Designs' },
            { key: 'available', label: 'Available Only' },
            { key: 'claimed', label: 'Claimed / Archives' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                filter === tab.key
                  ? 'bg-[#D4AF37] text-[#121214] shadow-lg shadow-[#D4AF37]/20 font-semibold'
                  : 'bg-[#1C1C1E] text-[#9CA3AF] hover:text-white hover:bg-[#252528] border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#9CA3AF] font-mono text-sm">Loading original flash catalog...</p>
          </div>
        )}

        {/* Flash Catalog Grid */}
        {!loading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredDesigns.map((design) => {
              const isAvailable = design.status === 'available';
              return (
                <motion.div
                  key={design.id}
                  variants={cardVariants}
                  className={`group relative flex flex-col justify-between bg-[#1C1C1E] border rounded-xl overflow-hidden transition-all duration-500 ${
                    isAvailable 
                      ? 'border-white/5 hover:border-[#D4AF37]/40 shadow-xl' 
                      : 'border-white/5 opacity-50'
                  }`}
                >
                  {/* Image Container with Hover Effect */}
                  <div className="relative aspect-[4/5] w-full bg-neutral-900 overflow-hidden">
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                        isAvailable ? 'group-hover:scale-105' : 'grayscale'
                      }`}
                      loading="lazy"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#121214]/90 text-[#D4AF37] border border-[#D4AF37]/50 backdrop-blur-sm">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#121214]/90 text-[#9CA3AF] border border-white/10 backdrop-blur-sm">
                          Claimed
                        </span>
                      )}
                    </div>

                    {/* Quick Code Overlay */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <span className="px-2.5 py-1 rounded text-xs font-mono bg-[#121214]/80 text-[#F3F4F6] border border-white/5">
                        {design.design_code}
                      </span>
                    </div>

                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>

                  {/* Design Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                        {design.title}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-[#9CA3AF] font-light mb-6">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span>Est. Size:</span>
                          <span className="text-white font-mono">{design.estimated_size || 'TBD'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span>Est. Price:</span>
                          <span className="text-[#D4AF37] font-mono font-medium">
                            {design.estimated_price ? `£${design.estimated_price}` : 'Quote on Enquiry'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    {isAvailable ? (
                      <a
                        href="#booking-form"
                        onClick={() => handleClaim(design)}
                        className="w-full py-3 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#c29d2e] text-[#121214] font-semibold text-center text-sm tracking-wider uppercase transition-all duration-300 transform group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1C1C1E]"
                      >
                        Claim this Design
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-lg bg-white/5 text-[#9CA3AF] font-medium text-center text-sm tracking-wider uppercase cursor-not-allowed border border-white/5"
                      >
                        Design Claimed
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredDesigns.length === 0 && (
          <div className="text-center py-16 bg-[#1C1C1E] rounded-xl border border-white/5 p-8 max-w-md mx-auto">
            <svg className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12h-15m0 0l6.75-6.75M4.5 12l6.75 6.75" />
            </svg>
            <p className="text-white font-medium mb-1">No designs found</p>
            <p className="text-[#9CA3AF] text-sm">We currently don't have any designs matching this filter. Check back soon!</p>
          </div>
        )}

        {/* Custom Project Callout */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-[#1C1C1E] to-[#121214] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-left">
            <h4 className="text-xl font-bold text-white mb-2">Have a unique concept of your own?</h4>
            <p className="text-[#9CA3AF] text-sm font-light leading-relaxed">
              If our pre-drawn flash catalog isn't exactly what you are looking for, Jake specializes in crafting 100% custom-tailored artwork mapped specifically to your body and story.
            </p>
          </div>
          <a
            href="#booking-form"
            className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#121214] font-semibold text-sm tracking-widest uppercase transition-all duration-300"
          >
            Request Custom Design
          </a>
        </div>

      </div>
    </section>
  );
}