'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface PortfolioItem {
  id: string;
  image_url: string;
  title: string;
  style_category: string;
  created_at?: string;
}

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'mock-1',
    title: 'Realistic Lion & Compass Sleeve',
    style_category: 'Black & Grey',
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mock-2',
    title: 'Classic Panther & Rose',
    style_category: 'Traditional',
    image_url: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mock-3',
    title: 'Delicate Floral Bouquet',
    style_category: 'Fine Line',
    image_url: 'https://images.unsplash.com/photo-1542343633-ce78a9bc640e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mock-4',
    title: 'Peony Flower Cover-up',
    style_category: 'Cover-up',
    image_url: 'https://images.unsplash.com/photo-1512413313758-044e347a909a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mock-5',
    title: 'Neo-Traditional Kingfisher',
    style_category: 'Colour',
    image_url: 'https://images.unsplash.com/photo-1590246814883-57f511e76533?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mock-6',
    title: 'Geometric Mandala Elbow',
    style_category: 'Black & Grey',
    image_url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=1000&q=80',
  },
];

const FILTERS = ['All Work', 'Black & Grey', 'Traditional', 'Fine Line', 'Colour', 'Cover-ups'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export function PortfolioGallery() {
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO);
  const [selectedFilter, setSelectedFilter] = useState('All Work');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch from Supabase
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('Error fetching portfolio items, falling back to static content:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  // Filter items matching the current category
  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'All Work') return true;
    
    const normalizedFilter = selectedFilter.toLowerCase().replace('s', '').replace('-', ' ');
    const normalizedCategory = item.style_category.toLowerCase().replace('-', ' ');
    
    return normalizedCategory.includes(normalizedFilter) || normalizedFilter.includes(normalizedCategory);
  });

  // Lightbox navigation handlers
  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
  }, [lightboxIndex, filteredItems.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNext, handlePrev, handleClose]);

  return (
    <section 
      id="portfolio-gallery" 
      className="relative bg-[#121214] text-[#F3F4F6] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1C1C1E] overflow-hidden"
    >
      {/* Background radial gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D4AF37] font-mono tracking-widest text-xs uppercase font-semibold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 inline-block mb-4">
            Custom Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-serif mb-6">
            The Portfolio
          </h2>
          <p className="text-[#9CA3AF] text-lg leading-relaxed">
            Browse a curated collection of completed custom tattoos. From bold, striking lines to soft, realistic shading, see the level of detail and care brought to every session in our Bargoed studio.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-30 bg-[#121214]/90 backdrop-blur-md py-4 mb-10 border-b border-[#1C1C1E] flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 max-w-full overflow-x-auto px-2 py-1 scrollbar-none">
            {FILTERS.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter);
                    setLightboxIndex(null);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#121214] shadow-[0_4px_20px_rgba(212,175,55,0.25)]'
                      : 'bg-[#1C1C1E] text-[#F3F4F6] border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#1C1C1E]/80'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={selectedFilter}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group relative bg-[#1C1C1E] rounded-xl overflow-hidden border border-white/5 shadow-xl hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col aspect-[4/5] cursor-pointer"
              onClick={() => setLightboxIndex(index)}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden flex-grow bg-[#121214]">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-wider font-bold mb-2 inline-block">
                      {item.style_category}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] font-medium">
                      <Maximize2 className="w-4.5 h-4.5 text-[#D4AF37]" />
                      <span>Click to view larger</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile/Static Title card info */}
              <div className="p-4 bg-[#1C1C1E] border-t border-white/5 flex items-center justify-between sm:hidden">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{item.title}</h3>
                  <p className="text-xs text-[#D4AF37] font-mono mt-0.5">{item.style_category}</p>
                </div>
                <Maximize2 className="w-4 h-4 text-[#9CA3AF]" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-[#1C1C1E] rounded-2xl border border-white/5">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 opacity-60" />
            <p className="text-[#9CA3AF] text-lg">No tattoos found in the "{selectedFilter}" category.</p>
            <button 
              onClick={() => setSelectedFilter('All Work')}
              className="mt-4 text-[#D4AF37] hover:underline text-sm font-semibold"
            >
              View all work
            </button>
          </div>
        )}

        {/* Closing Callout Section */}
        <div className="mt-20 bg-gradient-to-r from-[#1C1C1E] to-[#121214] rounded-2xl p-8 lg:p-12 border border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
              See a style you love?
            </h3>
            <p className="text-[#9CA3AF]">
              Every piece is custom-tailored to suit your body. Let's design something unique together at our sterile, welcoming Bargoed studio.
            </p>
          </div>
          <a
            href="#booking-form"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#121214] font-bold uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] text-center"
          >
            <Calendar className="w-5 h-5" />
            Request a Design Consultation
          </a>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
            role="dialog"
            aria-modal="true"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto z-10">
              <div className="flex flex-col">
                <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest font-bold">
                  {filteredItems[lightboxIndex].style_category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {filteredItems[lightboxIndex].title}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-3 bg-[#1C1C1E] hover:bg-[#D4AF37] hover:text-[#121214] text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Media Container */}
            <div className="relative flex-grow flex items-center justify-center my-6 max-w-7xl mx-auto w-full">
              {/* Left Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-10 p-4 bg-[#1C1C1E]/80 hover:bg-[#D4AF37] hover:text-[#121214] text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image */}
              <div className="relative max-h-[70vh] md:max-h-[75vh] max-w-full flex items-center justify-center">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  src={filteredItems[lightboxIndex].image_url}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-h-[70vh] md:max-h-[75vh] w-auto max-w-full object-contain rounded-lg border border-white/10"
                />
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-10 p-4 bg-[#1C1C1E]/80 hover:bg-[#D4AF37] hover:text-[#121214] text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-4 border-t border-white/10 pt-4 z-10">
              <span className="text-sm text-[#9CA3AF] font-mono">
                Image {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <a
                href="#booking-form"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c29f2e] text-[#121214] font-bold uppercase tracking-wider text-xs rounded-md transition-all duration-300 hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4" />
                Enquire About a Style Like This
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}