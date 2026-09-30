import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Maximize2, X } from 'lucide-react';
import { GALLERY_IMAGES } from '../data/restaurantData';
import { GalleryItem, CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface AtmosphereGalleryProps {
  setCursorMode: (mode: CursorMode) => void;
}

export function AtmosphereGallery({ setCursorMode }: AtmosphereGalleryProps) {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const { t, language, theme } = useApp();

  return (
    <section
      id="gallery"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(36,26,16,0.3)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-serif tracking-[0.25em] uppercase mb-4 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#161310]/80 text-[#D4AF37]'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#B8860B] shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.gallery.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {t.gallery.title}{' '}
            <span className="text-gold-gradient italic font-serif">
              {t.gallery.titleHighlight}
            </span>
          </motion.h2>

          <p
            className={`mt-4 text-sm sm:text-base font-editorial italic max-w-xl ${
              theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#615444]'
            }`}
          >
            {t.gallery.subtitle}
          </p>

          <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />
        </div>

        {/* ARTISTIC MASONRY GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GALLERY_IMAGES.map((item, index) => {
            const localizedTitle = language === 'fa' && item.titleFa ? item.titleFa : item.title;
            const localizedCategory =
              language === 'fa' && item.categoryFa ? item.categoryFa : item.category;
            const localizedCaption =
              language === 'fa' && item.captionFa ? item.captionFa : item.caption;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                onClick={() => setActiveItem(item)}
                onMouseEnter={() => setCursorMode('view')}
                onMouseLeave={() => setCursorMode('default')}
                className={`group relative rounded-3xl overflow-hidden border cursor-pointer shadow-lg ${
                  theme === 'dark'
                    ? 'border-[#D4AF37]/25 bg-[#14110E]'
                    : 'border-[#D4AF37]/35 bg-white'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={localizedTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase font-semibold">
                      {localizedCategory}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Maximize2 className="w-6 h-6 text-[#FAF6EE]" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold tracking-wide">{localizedTitle}</h3>
                  <p
                    className={`text-xs font-sans mt-1 line-clamp-2 ${
                      theme === 'dark' ? 'text-[#A69B89]' : 'text-[#615444]'
                    }`}
                  >
                    {localizedCaption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {activeItem && (
            <div
              className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
              onClick={() => setActiveItem(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl bg-black"
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center border border-[#D4AF37]/40"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full max-h-[75vh] object-cover"
                />
                <div className="p-6 bg-[#0E0C0A] border-t border-[#D4AF37]/30">
                  <h3 className="font-serif text-xl font-bold text-[#FAF6EE]">
                    {language === 'fa' && activeItem.titleFa ? activeItem.titleFa : activeItem.title}
                  </h3>
                  <p className="text-xs text-[#A69B89] mt-1 font-sans">
                    {language === 'fa' && activeItem.captionFa
                      ? activeItem.captionFa
                      : activeItem.caption}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
