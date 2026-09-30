import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Wine, Compass, Check, Heart, Sparkles } from 'lucide-react';
import { Dish, CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface DishModalProps {
  dish: Dish | null;
  onClose: () => void;
  setCursorMode: (mode: CursorMode) => void;
  onReserveWithDish: (dishName: string) => void;
}

export function DishModal({
  dish,
  onClose,
  setCursorMode,
  onReserveWithDish,
}: DishModalProps) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const { t, formatPrice, formatNumber, language, theme, toggleSaveDish, isDishSaved } = useApp();

  if (!dish) return null;

  const isSaved = isDishSaved(dish.id);
  const isDari = language === 'fa';
  const localizedName = isDari && dish.nameFa ? dish.nameFa : dish.name;
  const localizedSubtitle = isDari && dish.subtitleFa ? dish.subtitleFa : dish.subtitle;
  const localizedLongDesc =
    isDari && dish.longDescriptionFa ? dish.longDescriptionFa : dish.longDescription;
  const localizedIngredients =
    isDari && dish.ingredientsFa ? dish.ingredientsFa : dish.ingredients;
  const localizedPairing =
    isDari && dish.pairingFa ? dish.pairingFa : dish.pairing;
  const localizedTag =
    isDari && dish.highlightTagFa ? dish.highlightTagFa : dish.highlightTag;
  const dynamicPrice = formatPrice(dish.priceUsd);

  // Category translation
  const categoryMap: Record<string, { en: string; da: string }> = {
    starters: { en: 'IMPERIAL STARTER', da: 'پیش‌غذای درباری' },
    mains: { en: 'ROYAL MAIN COURSE', da: 'غذای اصلی سلطنتی' },
    pasta: { en: 'ARTISANAL PASTA & WOODFIRE', da: 'پاستا و تنور هیزمی' },
    desserts: { en: 'ROYAL DESSERT', da: 'دسر و شیرینی شاهانه' },
    drinks: { en: 'SIGNATURE ELIXIR & COCKTAIL', da: 'نوشیدنی و کوکتل خاص' },
  };
  const categoryLabel = categoryMap[dish.category]
    ? isDari
      ? categoryMap[dish.category].da
      : categoryMap[dish.category].en
    : dish.category.toUpperCase();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCursorMode('drag');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation((prev) => prev + delta * 0.5);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCursorMode('default');
  };

  return (
    <AnimatePresence>
      <div
        id="dish-inspect-modal"
        className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-5xl rounded-3xl overflow-hidden border shadow-[0_30px_90px_rgba(0,0,0,0.95)] my-auto ${
            theme === 'dark'
              ? 'bg-[#0E0C0A] border-[#D4AF37]/40 text-[#FAF6EE]'
              : 'bg-[#FAF8F5] border-[#D4AF37]/50 text-[#1F1A16]'
          }`}
        >
          {/* Close button */}
          <button
            id="close-dish-modal-btn"
            onClick={onClose}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            className={`absolute top-5 right-5 z-20 w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#1A1612]/90 text-[#FAF6EE] hover:text-[#D4AF37] hover:border-[#D4AF37]'
                : 'border-[#D4AF37]/40 bg-white text-[#1F1A16] hover:text-[#B8860B] hover:border-[#B8860B]'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT: 360 INTERACTIVE 3D DISH ROTATION STAGE */}
            <div
              className={`lg:col-span-6 relative p-8 sm:p-12 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r select-none cursor-grab active:cursor-grabbing ${
                theme === 'dark'
                  ? 'bg-gradient-to-b from-[#14110E] via-[#0C0A09] to-[#080706] border-[#D4AF37]/20'
                  : 'bg-gradient-to-b from-[#F7F2E9] via-[#EFE8DC] to-[#E8DFC8] border-[#D4AF37]/30'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseEnter={() => setCursorMode('explore')}
            >
              {/* Rotation hint badge */}
              <div
                className={`absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest text-[#D4AF37] ${
                  theme === 'dark'
                    ? 'bg-[#1E1914]/80 border-[#D4AF37]/30'
                    : 'bg-white/80 border-[#D4AF37]/40 shadow-sm'
                }`}
              >
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{t.dishModal.dragRotate}</span>
              </div>

              {/* Dish Visual with dynamic 3D rotation & shadow */}
              <div className="relative my-8 perspective-1000 w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Underplate halo */}
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 filter blur-3xl" />

                {/* Rotating image frame */}
                <div
                  style={{
                    transform: `rotate(${rotation}deg) scale(1.05)`,
                    transition: isDragging ? 'none' : 'transform 0.4s ease-out',
                  }}
                  className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  <img
                    src={dish.image}
                    alt={localizedName}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Glass shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Concentric gold ring */}
                <div
                  className="absolute inset-[-12px] rounded-full border border-dashed border-[#D4AF37]/35 pointer-events-none"
                  style={{ transform: `rotate(${-rotation * 0.5}deg)` }}
                />
              </div>

              {/* Converted Dynamic Price Tag & Calories */}
              <div className="flex items-center gap-4 mt-2">
                <span className="text-3xl font-serif font-bold text-gold-gradient">
                  {dynamicPrice}
                </span>
                {dish.calories && (
                  <span className="text-xs font-mono px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#8C8173]">
                    {isDari
                      ? `${formatNumber(parseInt(dish.calories))} کالری`
                      : dish.calories}
                  </span>
                )}
                <span className="text-xs tracking-wider uppercase font-serif text-[#D4AF37] font-semibold">
                  {t.dishModal.tastingPortion}
                </span>
              </div>
            </div>

            {/* RIGHT: DETAILS, FLAVOR RADAR, SOMMELIER PAIRING & RESERVE */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Badge & Bookmark */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] tracking-[0.25em] font-mono text-[#D4AF37] uppercase font-bold">
                      {categoryLabel}
                    </span>
                    {localizedTag && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-serif tracking-wider font-semibold">
                        {localizedTag}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleSaveDish(dish.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-serif transition-colors ${
                      isSaved
                        ? 'border-red-500 bg-red-500/10 text-red-500'
                        : 'border-[#D4AF37]/30 text-[#8A8072] hover:text-[#D4AF37]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500' : ''}`} />
                    <span>{isSaved ? t.dishModal.savedFavorite : t.dishModal.saveFavorite}</span>
                  </button>
                </div>

                {/* Dish Name */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  {localizedName}
                </h3>
                <p className="font-editorial text-sm sm:text-base text-[#D4AF37] italic mt-1">
                  {localizedSubtitle}
                </p>

                {/* Long Description */}
                <p
                  className={`mt-4 text-xs sm:text-sm font-sans leading-relaxed font-light ${
                    theme === 'dark' ? 'text-[#C5BBAF]' : 'text-[#5E5244]'
                  }`}
                >
                  {localizedLongDesc}
                </p>

                {/* Terroir Ingredients */}
                <div className="mt-6">
                  <h4 className="text-[10px] tracking-[0.25em] font-serif text-[#D4AF37] uppercase mb-2.5 font-bold">
                    {t.dishModal.ingredientsTitle}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {localizedIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${
                          theme === 'dark'
                            ? 'bg-[#1C1814] border-[#D4AF37]/25 text-[#FAF6EE]'
                            : 'bg-white border-[#D4AF37]/35 text-[#1F1A16]'
                        }`}
                      >
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flavor Profile Bars (TRANSLATED INTO DARI & ENGLISH) */}
                <div
                  className={`mt-6 pt-5 border-t ${
                    theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
                  }`}
                >
                  <h4 className="text-[10px] tracking-[0.25em] font-serif text-[#D4AF37] uppercase mb-3 flex items-center gap-2 font-bold">
                    <Flame className="w-3 h-3 text-[#D4AF37]" />
                    {t.dishModal.matrixTitle}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {/* Richness */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={theme === 'dark' ? 'text-[#A69C8E]' : 'text-[#736859]'}>
                          {t.dishModal.metrics.richness}
                        </span>
                        <span className="font-mono text-[#D4AF37]">
                          {formatNumber(dish.flavorProfile.richness)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#241F1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7E7B4] rounded-full"
                          style={{ width: `${dish.flavorProfile.richness}%` }}
                        />
                      </div>
                    </div>

                    {/* Umami */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={theme === 'dark' ? 'text-[#A69C8E]' : 'text-[#736859]'}>
                          {t.dishModal.metrics.umami}
                        </span>
                        <span className="font-mono text-[#D4AF37]">
                          {formatNumber(dish.flavorProfile.umami)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#241F1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7E7B4] rounded-full"
                          style={{ width: `${dish.flavorProfile.umami}%` }}
                        />
                      </div>
                    </div>

                    {/* Sweetness */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={theme === 'dark' ? 'text-[#A69C8E]' : 'text-[#736859]'}>
                          {t.dishModal.metrics.sweetness}
                        </span>
                        <span className="font-mono text-[#D4AF37]">
                          {formatNumber(dish.flavorProfile.sweetness)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#241F1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7E7B4] rounded-full"
                          style={{ width: `${dish.flavorProfile.sweetness}%` }}
                        />
                      </div>
                    </div>

                    {/* Aroma */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={theme === 'dark' ? 'text-[#A69C8E]' : 'text-[#736859]'}>
                          {t.dishModal.metrics.aroma}
                        </span>
                        <span className="font-mono text-[#D4AF37]">
                          {formatNumber(dish.flavorProfile.aroma)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#241F1A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7E7B4] rounded-full"
                          style={{ width: `${dish.flavorProfile.aroma}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sommelier Pairing */}
                <div
                  className={`mt-4 pt-4 border-t flex items-start gap-3 ${
                    theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
                  }`}
                >
                  <Wine className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-serif tracking-widest text-[#D4AF37] uppercase block font-semibold">
                      {t.dishModal.sommelierNote}
                    </span>
                    <p className="font-editorial text-sm italic mt-0.5">{localizedPairing}</p>
                  </div>
                </div>
              </div>

              {/* Action Button: Reserve Table With This Dish */}
              <div
                className={`pt-5 border-t ${
                  theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
                }`}
              >
                <button
                  id="modal-reserve-dish-btn"
                  onClick={() => {
                    onReserveWithDish(localizedName);
                    onClose();
                  }}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.2em] shadow-lg hover:shadow-[0_4px_30px_rgba(212,175,55,0.6)] transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{t.dishModal.reserveBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
