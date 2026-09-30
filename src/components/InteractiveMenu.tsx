import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Wine, Eye, Heart } from 'lucide-react';
import { FULL_MENU } from '../data/restaurantData';
import { Dish, CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface InteractiveMenuProps {
  setCursorMode: (mode: CursorMode) => void;
  onSelectDish: (dish: Dish) => void;
}

type MenuCategory = 'all' | 'starters' | 'mains' | 'pasta' | 'desserts' | 'drinks';

export function InteractiveMenu({ setCursorMode, onSelectDish }: InteractiveMenuProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const { t, formatPrice, language, theme, toggleSaveDish, isDishSaved } = useApp();
  const isDari = language === 'fa';

  const categories: { id: MenuCategory; label: string }[] = [
    { id: 'all', label: t.menu.categories.all },
    { id: 'starters', label: t.menu.categories.starters },
    { id: 'mains', label: t.menu.categories.mains },
    { id: 'pasta', label: t.menu.categories.pasta },
    { id: 'desserts', label: t.menu.categories.desserts },
    { id: 'drinks', label: t.menu.categories.drinks },
  ];

  const categoryMap: Record<string, { en: string; da: string }> = {
    starters: { en: 'STARTER', da: 'پیش‌غذا' },
    mains: { en: 'MAIN COURSE', da: 'غذای اصلی' },
    pasta: { en: 'PASTA & WOODFIRE', da: 'پاستا و تنور' },
    desserts: { en: 'DESSERT', da: 'دسر شاهی' },
    drinks: { en: 'ELIXIR & DRINK', da: 'نوشیدنی خاص' },
  };

  const filteredDishes =
    activeCategory === 'all'
      ? FULL_MENU
      : FULL_MENU.filter((item) => {
          if (activeCategory === 'pasta') {
            return item.category === 'pasta';
          }
          return item.category === activeCategory;
        });

  return (
    <section
      id="menu"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-10 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-1/4 left-10 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(26,20,15,0.4)_0%,transparent_70%)]" />
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
            <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.menu.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {t.menu.title}{' '}
            <span className="text-gold-gradient italic font-serif">
              {t.menu.titleHighlight}
            </span>
          </motion.h2>

          <p
            className={`mt-4 text-sm sm:text-base font-editorial italic max-w-xl ${
              theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#615444]'
            }`}
          >
            {t.menu.subtitle}
          </p>

          <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />

          {/* CATEGORY SELECTOR PILLS */}
          <div
            className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border max-w-4xl mx-auto mt-2 backdrop-blur-md ${
              theme === 'dark'
                ? 'bg-[#120F0C]/80 border-[#D4AF37]/25'
                : 'bg-white/80 border-[#D4AF37]/35 shadow-sm'
            }`}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`menu-tab-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-serif tracking-[0.18em] font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-[#080706] bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] shadow-[0_2px_15px_rgba(212,175,55,0.4)]'
                      : theme === 'dark'
                      ? 'text-[#C5BBAF] hover:text-[#FAF6EE] hover:bg-white/5'
                      : 'text-[#66594B] hover:text-[#1F1A16] hover:bg-black/5'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* DISHES LIST / GRID - EQUAL FIT SIZED CARDS */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish, i) => {
              const isSaved = isDishSaved(dish.id);
              const localizedName = isDari && dish.nameFa ? dish.nameFa : dish.name;
              const localizedSubtitle = isDari && dish.subtitleFa ? dish.subtitleFa : dish.subtitle;
              const localizedDesc = isDari && dish.descriptionFa ? dish.descriptionFa : dish.description;
              const localizedPairing = isDari && dish.pairingFa ? dish.pairingFa : dish.pairing;
              const dynamicPrice = formatPrice(dish.priceUsd);
              const catLabel = categoryMap[dish.category]
                ? isDari
                  ? categoryMap[dish.category].da
                  : categoryMap[dish.category].en
                : dish.category.toUpperCase();

              return (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  onClick={() => onSelectDish(dish)}
                  onMouseEnter={() => setCursorMode('explore')}
                  onMouseLeave={() => setCursorMode('default')}
                  className={`group relative rounded-3xl p-6 border transition-all duration-500 cursor-pointer flex flex-col sm:flex-row gap-6 items-center shadow-lg h-full ${
                    theme === 'dark'
                      ? 'bg-[#120F0D]/90 border-[#D4AF37]/20 hover:border-[#D4AF37]/70 hover:bg-[#1A1612]/90 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
                      : 'bg-white border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#FFFDF9] shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
                  }`}
                >
                  {/* DISH CIRCULAR THUMBNAIL */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 shadow-xl group-hover:border-[#D4AF37] transition-all duration-500">
                    <img
                      src={dish.image}
                      alt={localizedName}
                      className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-6 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Eye className="w-5 h-5 text-[#FAF6EE]" />
                    </div>
                  </div>

                  {/* DISH BODY */}
                  <div className="flex-1 flex flex-col justify-between text-center sm:text-left rtl:sm:text-right space-y-1.5 w-full h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#D4AF37] uppercase font-bold">
                          {catLabel}
                        </span>

                        <div className="flex items-center gap-3">
                          {/* Bookmark Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveDish(dish.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              isSaved
                                ? 'text-red-500 hover:text-red-400'
                                : 'text-[#8A8072] hover:text-[#D4AF37]'
                            }`}
                            title={isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
                          </button>

                          {/* Converted Dynamic Price */}
                          <span className="font-serif text-lg sm:text-xl font-bold text-gold-gradient">
                            {dynamicPrice}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif text-lg font-bold tracking-tight group-hover:text-gold-gradient transition-colors line-clamp-1">
                        {localizedName}
                      </h3>

                      <p className="font-editorial text-xs sm:text-sm text-[#D4AF37] italic truncate">
                        {localizedSubtitle}
                      </p>

                      <p
                        className={`text-xs font-sans font-light line-clamp-2 pt-1 leading-relaxed ${
                          theme === 'dark' ? 'text-[#B0A597]' : 'text-[#615444]'
                        }`}
                      >
                        {localizedDesc}
                      </p>
                    </div>

                    {/* Sommelier Pairing Note */}
                    <div
                      className={`pt-2 mt-auto border-t flex items-center gap-1.5 text-[11px] font-sans ${
                        theme === 'dark'
                          ? 'border-[#D4AF37]/10 text-[#8A7E70]'
                          : 'border-[#D4AF37]/20 text-[#7A6E5D]'
                      }`}
                    >
                      <Wine className="w-3 h-3 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{localizedPairing}</span>
                    </div>
                  </div>

                  {/* Shimmer Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-tr-3xl pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
