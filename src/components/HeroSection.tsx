import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Award, Star, Eye, User } from 'lucide-react';
import { CursorMode, Dish } from '../types';
import { SIGNATURE_DISHES } from '../data/restaurantData';
import { useApp } from '../context/AppContext';

interface HeroSectionProps {
  setCursorMode: (mode: CursorMode) => void;
  onExploreMenu: () => void;
  onReserveTable: () => void;
  onSelectDish?: (dish: Dish) => void;
}

export function HeroSection({
  setCursorMode,
  onExploreMenu,
  onReserveTable,
  onSelectDish,
}: HeroSectionProps) {
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const currentDish = SIGNATURE_DISHES[activeDishIndex] || SIGNATURE_DISHES[0];
  const { t, formatPrice, language, theme, setIsContactModalOpen } = useApp();

  const currentDishName = language === 'fa' && currentDish.nameFa ? currentDish.nameFa : currentDish.name;
  const currentDishSubtitle =
    language === 'fa' && currentDish.subtitleFa ? currentDish.subtitleFa : currentDish.subtitle;
  const currentDishDesc =
    language === 'fa' && currentDish.descriptionFa ? currentDish.descriptionFa : currentDish.description;
  const currentDishTag =
    language === 'fa' && currentDish.highlightTagFa ? currentDish.highlightTagFa : currentDish.highlightTag;

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full flex flex-col justify-center overflow-hidden pt-28 sm:pt-32 md:pt-36 lg:pt-36 pb-16 sm:pb-20 px-4 sm:px-8 md:px-12 lg:px-20"
    >
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.09)_0%,transparent_70%)]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(145,91,23,0.1)_0%,transparent_70%)]" />
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-t from-[#080706] via-transparent to-[#080706]/70'
              : 'bg-gradient-to-t from-[#FAF7F2] via-transparent to-[#FAF7F2]/60'
          }`}
        />
      </div>

      <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center my-auto">
        {/* LEFT COLUMN: HERO CONTENT & TYPOGRAPHY */}
        <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right">
          {/* Top prestige accolades badge: plenty of top margin to never collide with navbar logo */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`inline-flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full border backdrop-blur-md mb-6 sm:mb-8 shadow-sm max-w-full ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#181410]/85 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                : 'border-[#D4AF37]/40 bg-white/95 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[#D4AF37] shrink-0">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-serif font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase whitespace-nowrap">
                {t.hero.badgeTitle}
              </span>
            </div>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#D4AF37]/50 shrink-0" />
            <span
              className={`text-[10px] sm:text-[11px] tracking-wider sm:tracking-widest uppercase font-mono whitespace-nowrap ${
                theme === 'dark' ? 'text-[#C4B7A5]' : 'text-[#7A6E5D]'
              }`}
            >
              {t.hero.badgeSubtitle}
            </span>
          </motion.div>

          {/* MAIN HERO HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] leading-[1.12] sm:leading-[1.08] tracking-tight font-extrabold uppercase max-w-2xl break-words"
          >
            {t.hero.titleMain}{' '}
            <span className="text-gold-gradient italic font-serif inline-block">
              {t.hero.titleHighlight}
            </span>{' '}
            {t.hero.titleMid}{' '}
            <span className="relative inline-block">
              {t.hero.titleEnd}
              <span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
            </span>
          </motion.h1>

          {/* SUB-DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`mt-5 sm:mt-8 text-sm sm:text-base md:text-lg lg:text-xl font-editorial italic font-normal leading-relaxed max-w-xl ${
              theme === 'dark' ? 'text-[#C7BEB2]' : 'text-[#5E5244]'
            }`}
          >
            {t.hero.subheading}
          </motion.p>

          {/* SUBTITLE SPECIFICS */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-2 text-xs sm:text-sm text-[#D4AF37] tracking-wider uppercase font-serif font-medium"
          >
            {t.hero.details}
          </motion.p>

          {/* TWO PREMIUM CTA BUTTONS (Stacked full width on mobile, side-by-side on sm+) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full sm:w-auto"
          >
            {/* CTA 1: EXPLORE MENU */}
            <button
              id="hero-explore-menu-btn"
              onClick={onExploreMenu}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              className={`group relative overflow-hidden rounded-full px-6 sm:px-8 py-3.5 sm:py-4 border transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] active:scale-95 text-center ${
                theme === 'dark'
                  ? 'bg-[#141210] border-[#D4AF37]/40 text-[#FAF6EE] hover:border-[#D4AF37]'
                  : 'bg-white border-[#D4AF37]/50 text-[#1F1A16] hover:border-[#B8860B] shadow-sm'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3 text-xs tracking-[0.2em] font-serif font-semibold">
                {t.hero.ctaExplore}
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform duration-300 rtl:group-hover:-translate-x-1.5 shrink-0" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/15 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* CTA 2: RESERVE A TABLE */}
            <button
              id="hero-reserve-btn"
              onClick={onReserveTable}
              onMouseEnter={() => setCursorMode('reserve')}
              onMouseLeave={() => setCursorMode('default')}
              className="group relative overflow-hidden rounded-full px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#EED58D] via-[#D4AF37] to-[#B38728] text-[#080706] font-serif font-bold text-xs tracking-[0.2em] shadow-[0_4px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_40px_rgba(212,175,55,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#080706] shrink-0" />
                {t.hero.ctaReserve}
              </span>
              <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>

          {/* KEY HERO METRICS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className={`mt-10 sm:mt-14 pt-6 sm:pt-8 border-t grid grid-cols-3 gap-3 sm:gap-6 md:gap-10 w-full max-w-lg ${
              theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
            }`}
          >
            <div>
              <p className="text-lg sm:text-2xl font-serif font-bold tracking-wider">
                12<span className="text-[#D4AF37] text-base sm:text-lg font-light">c</span>
              </p>
              <p
                className={`text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase mt-0.5 truncate ${
                  theme === 'dark' ? 'text-[#8F8474]' : 'text-[#736859]'
                }`}
              >
                {t.hero.statCourses}
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-serif font-bold tracking-wider">
                18<span className="text-[#D4AF37] text-xs sm:text-sm font-light"> {language === 'fa' ? 'صندلی' : 'Seats'}</span>
              </p>
              <p
                className={`text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase mt-0.5 truncate ${
                  theme === 'dark' ? 'text-[#8F8474]' : 'text-[#736859]'
                }`}
              >
                {t.hero.statSeats}
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-serif font-bold tracking-wider">
                4.2k<span className="text-[#D4AF37] text-base sm:text-lg font-light">+</span>
              </p>
              <p
                className={`text-[9px] sm:text-xs tracking-wider sm:tracking-widest uppercase mt-0.5 truncate ${
                  theme === 'dark' ? 'text-[#8F8474]' : 'text-[#736859]'
                }`}
              >
                {t.hero.statVintages}
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: WORLD-CLASS CULINARY SHOWCASE */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`w-full max-w-[420px] mx-auto relative rounded-3xl overflow-hidden border shadow-2xl group ${
              theme === 'dark'
                ? 'bg-[#120F0C] border-[#D4AF37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)]'
                : 'bg-white border-[#D4AF37]/45 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_30px_rgba(212,175,55,0.2)]'
            }`}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
          >
            {/* Dish Imagery with Ambient Reveal */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentDish.id}
                  src={currentDish.image}
                  alt={currentDishName}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient Overlays for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

              {/* Top Michelin Stars Accolade Pill */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/80 border border-[#D4AF37]/40 backdrop-blur-md">
                <div className="flex text-[#D4AF37]">
                  <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-[#D4AF37]" />
                  <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-[#D4AF37]" />
                  <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-[#D4AF37]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#FFF5DC] uppercase font-bold">
                  {t.hero.showcaseBadge}
                </span>
              </div>

              {/* Dynamic Currency Converted Price Tag */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#D4AF37] text-[#120F0C] font-serif font-bold text-xs shadow-lg">
                {formatPrice(currentDish.priceUsd)}
              </div>

              {/* Dish Selector Dots / Chips */}
              <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 z-10 flex gap-1 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-[#D4AF37]/25">
                {SIGNATURE_DISHES.slice(0, 3).map((dish, idx) => (
                  <button
                    key={dish.id}
                    onClick={() => setActiveDishIndex(idx)}
                    className={`px-2 sm:px-2.5 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-mono transition-all ${
                      activeDishIndex === idx
                        ? 'bg-[#D4AF37] text-[#120F0C] font-bold shadow'
                        : 'text-[#C5BBAA] hover:text-[#FAF6EE]'
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Dish Description & Haute Details */}
            <div className={`p-4 sm:p-6 ${theme === 'dark' ? 'bg-[#120F0C]' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-mono font-bold">
                  {currentDishTag || 'Signature Degustation'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]/40 shrink-0" />
                <span
                  className={`text-[9px] sm:text-[10px] font-sans truncate ${
                    theme === 'dark' ? 'text-[#A69B89]' : 'text-[#736859]'
                  }`}
                >
                  {currentDishSubtitle.split('•')[0]}
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-serif font-bold tracking-wide mb-1.5 sm:mb-2 line-clamp-1">
                {currentDishName}
              </h3>

              <p
                className={`text-xs font-sans leading-relaxed line-clamp-2 mb-3 sm:mb-4 ${
                  theme === 'dark' ? 'text-[#B8ADA0]' : 'text-[#5E5244]'
                }`}
              >
                {currentDishDesc}
              </p>

              {/* Sommelier Pairing & Action */}
              <div
                className={`pt-3 border-t flex items-center justify-between gap-3 ${
                  theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`text-[8px] sm:text-[9px] uppercase tracking-wider font-mono ${
                      theme === 'dark' ? 'text-[#A69B89]' : 'text-[#736859]'
                    }`}
                  >
                    {t.hero.sommelierPairing}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#D4AF37] font-serif italic truncate">
                    {language === 'fa' && currentDish.pairingFa
                      ? currentDish.pairingFa
                      : currentDish.pairing}
                  </p>
                </div>

                {onSelectDish && (
                  <button
                    onClick={() => onSelectDish(currentDish)}
                    className="p-1.5 sm:p-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shrink-0"
                    title={t.hero.inspectDish}
                  >
                    <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
