import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, ArrowUpRight, Heart, Wine } from 'lucide-react';
import { SIGNATURE_DISHES } from '../data/restaurantData';
import { Dish, CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface SignatureDishesProps {
  setCursorMode: (mode: CursorMode) => void;
  onSelectDish: (dish: Dish) => void;
}

export function SignatureDishes({ setCursorMode, onSelectDish }: SignatureDishesProps) {
  const [hoveredDishId, setHoveredDishId] = useState<string | null>(null);
  const { t, formatPrice, formatNumber, language, theme, toggleSaveDish, isDishSaved } = useApp();
  const isDari = language === 'fa';

  return (
    <section
      id="signature"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      {/* Dynamic ambient background light that shifts with dish hover */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000">
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full transition-opacity duration-700 ${
            hoveredDishId
              ? 'bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_70%)]'
              : 'bg-[radial-gradient(circle,rgba(30,25,20,0.3)_0%,transparent_70%)]'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-20">
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
            {t.signature.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {t.signature.title}{' '}
            <span className="text-gold-gradient italic font-serif">
              {t.signature.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className={`mt-4 text-sm sm:text-base font-editorial italic max-w-xl ${
              theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#615444]'
            }`}
          >
            {t.signature.subtitle}
          </motion.p>

          <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />
        </div>

        {/* 3D PRODUCT SHOWCASE GRID - PERFECT FIT UNIFORM SIZED CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
          {SIGNATURE_DISHES.map((dish, index) => {
            const isSaved = isDishSaved(dish.id);
            const localizedName = isDari && dish.nameFa ? dish.nameFa : dish.name;
            const localizedSubtitle = isDari && dish.subtitleFa ? dish.subtitleFa : dish.subtitle;
            const localizedDesc = isDari && dish.descriptionFa ? dish.descriptionFa : dish.description;
            const localizedTag = isDari && dish.highlightTagFa ? dish.highlightTagFa : dish.highlightTag;
            const dynamicPrice = formatPrice(dish.priceUsd);

            return (
              <motion.div
                key={dish.id}
                id={`signature-dish-${dish.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="perspective-1000 h-full flex flex-col"
                onMouseEnter={() => {
                  setHoveredDishId(dish.id);
                  setCursorMode('explore');
                }}
                onMouseLeave={() => {
                  setHoveredDishId(null);
                  setCursorMode('default');
                }}
              >
                <div
                  onClick={() => onSelectDish(dish)}
                  className={`group relative rounded-3xl overflow-hidden border transition-all duration-700 cursor-pointer transform-style-3d hover:-translate-y-2.5 shadow-xl h-full flex flex-col ${
                    theme === 'dark'
                      ? 'bg-[#120F0D] border-[#D4AF37]/25 hover:border-[#D4AF37]/80 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.2)]'
                      : 'bg-white border-[#D4AF37]/35 hover:border-[#D4AF37] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1),0_0_30px_rgba(212,175,55,0.25)]'
                  }`}
                >
                  {/* TOP IMAGE STAGE (UNIFORM RATIO) */}
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={localizedName}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Accolade Tag */}
                    {localizedTag && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase font-semibold">
                          {localizedTag}
                        </span>
                      </div>
                    )}

                    {/* Dynamic Converted Price */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black font-serif font-bold text-xs shadow-lg">
                        {dynamicPrice}
                      </span>
                    </div>

                    {/* Center hover inspect icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-xl group-hover:scale-110 transition-transform">
                        <Eye className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM CONTENT: UNIFORM PADDED CONTAINER WITH EQUAL HEIGHT ALIGNMENT */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Category & Wishlist Button */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
                          {dish.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveDish(dish.id);
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            isSaved ? 'text-red-500' : 'text-[#8A8072] hover:text-[#D4AF37]'
                          }`}
                          title={isSaved ? t.signature.saved : t.signature.saveFavorite}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
                        </button>
                      </div>

                      {/* Title with min-height for uniform alignment */}
                      <h3 className="font-serif text-xl font-bold tracking-tight group-hover:text-gold-gradient transition-colors line-clamp-2 min-h-[3.25rem]">
                        {localizedName}
                      </h3>

                      {/* Subtitle with fixed height */}
                      <p className="font-editorial text-xs sm:text-sm text-[#D4AF37] italic truncate min-h-[1.25rem] mt-1">
                        {localizedSubtitle}
                      </p>

                      {/* Description with fixed clamp height */}
                      <p
                        className={`text-xs font-sans leading-relaxed line-clamp-2 min-h-[2.5rem] mt-2 ${
                          theme === 'dark' ? 'text-[#B0A597]' : 'text-[#615444]'
                        }`}
                      >
                        {localizedDesc}
                      </p>
                    </div>

                    {/* Action Bar (Always bottom-pinned across all cards) */}
                    <div
                      className={`mt-auto pt-4 border-t flex items-center justify-between text-xs font-serif ${
                        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
                      }`}
                    >
                      <span className="text-[#D4AF37] font-semibold flex items-center gap-1.5">
                        {t.signature.inspectBtn}
                        <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90" />
                      </span>

                      <div className="flex items-center gap-1 text-[11px] text-[#A69B89]">
                        <Wine className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="font-mono">
                          {formatNumber(dish.flavorProfile.umami)}% {t.signature.umamiLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
