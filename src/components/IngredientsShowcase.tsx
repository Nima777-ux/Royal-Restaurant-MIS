import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MapPin,
  Compass,
  Award,
  Utensils,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Layers,
  FileText,
  Calendar,
  Mountain,
  Wind,
  Flame,
} from 'lucide-react';
import { INGREDIENTS_SHOWCASE, SIGNATURE_DISHES } from '../data/restaurantData';
import { Ingredient, CursorMode, Dish } from '../types';
import { useApp } from '../context/AppContext';

interface IngredientsShowcaseProps {
  setCursorMode: (mode: CursorMode) => void;
  onSelectDish?: (dish: Dish) => void;
}

export function IngredientsShowcase({ setCursorMode, onSelectDish }: IngredientsShowcaseProps) {
  const [activeIngredient, setActiveIngredient] = useState<Ingredient>(INGREDIENTS_SHOWCASE[0]);
  const [viewMode, setViewMode] = useState<'atlas' | 'dossier' | 'map'>('atlas');
  const { t, language, theme } = useApp();
  const isDari = language === 'fa';

  const activeName = isDari && activeIngredient.nameFa ? activeIngredient.nameFa : activeIngredient.name;
  const activeOrigin = isDari && activeIngredient.originFa ? activeIngredient.originFa : activeIngredient.origin;
  const activeDesc =
    isDari && activeIngredient.descriptionFa ? activeIngredient.descriptionFa : activeIngredient.description;
  const activeNotes =
    isDari && activeIngredient.tastingNoteFa ? activeIngredient.tastingNoteFa : activeIngredient.tastingNote;
  const activeHarvest =
    isDari && activeIngredient.harvestMethodFa ? activeIngredient.harvestMethodFa : activeIngredient.harvestMethod;
  const activeRarity =
    isDari && activeIngredient.rarityFa ? activeIngredient.rarityFa : activeIngredient.rarity;
  const activeElevation =
    isDari && activeIngredient.elevationFa ? activeIngredient.elevationFa : activeIngredient.elevation;
  const activeHarvestSeason =
    isDari && activeIngredient.harvestSeasonFa ? activeIngredient.harvestSeasonFa : activeIngredient.harvestSeason;
  const activeClimate =
    isDari && activeIngredient.climateFa ? activeIngredient.climateFa : activeIngredient.climate;
  const activeDishName =
    isDari && activeIngredient.pairedDishNameFa ? activeIngredient.pairedDishNameFa : activeIngredient.pairedDishName;

  // Find corresponding signature dish if available
  const pairedDish = SIGNATURE_DISHES.find(
    (d) => d.name.toLowerCase() === (activeIngredient.pairedDishName || '').toLowerCase()
  );

  return (
    <section
      id="ingredients"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t transition-colors duration-500 ${
        theme === 'dark' ? 'border-[#D4AF37]/15 bg-[#0A0807]' : 'border-[#D4AF37]/25 bg-[#FAF8F5]'
      }`}
    >
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full transition-all duration-1000 blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${activeIngredient.color} 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-12">
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
            {t.ingredients.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {t.ingredients.title}{' '}
            <span className="text-gold-gradient italic font-serif">
              {t.ingredients.titleHighlight}
            </span>
          </motion.h2>

          <p
            className={`mt-4 text-sm sm:text-base font-editorial italic max-w-2xl leading-relaxed ${
              theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#615444]'
            }`}
          >
            {t.ingredients.subtitle}
          </p>

          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />

          {/* VIEW MODE TABS: PROVENANCE ATLAS / DEEP DOSSIER / GLOBAL ORIGINS MAP */}
          <div
            className={`p-1.5 rounded-2xl border flex items-center gap-1.5 shadow-lg max-w-md w-full justify-between ${
              theme === 'dark'
                ? 'bg-[#15120F]/90 border-[#D4AF37]/30 backdrop-blur-md'
                : 'bg-white/90 border-[#D4AF37]/40 backdrop-blur-md'
            }`}
          >
            <button
              onClick={() => setViewMode('atlas')}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                viewMode === 'atlas'
                  ? 'bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black shadow-md'
                  : theme === 'dark'
                  ? 'text-[#C5BBAF] hover:text-white'
                  : 'text-[#615444] hover:text-black'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.ingredients.viewModes?.atlas || 'Provenance Atlas'}</span>
            </button>

            <button
              onClick={() => setViewMode('dossier')}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                viewMode === 'dossier'
                  ? 'bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black shadow-md'
                  : theme === 'dark'
                  ? 'text-[#C5BBAF] hover:text-white'
                  : 'text-[#615444] hover:text-black'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.ingredients.viewModes?.dossier || 'Sensory Dossier'}</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-serif font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black shadow-md'
                  : theme === 'dark'
                  ? 'text-[#C5BBAF] hover:text-white'
                  : 'text-[#615444] hover:text-black'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{t.ingredients.viewModes?.map || 'Origins Map'}</span>
            </button>
          </div>
        </div>

        {/* ----------------- VIEW 1: PROVENANCE ATLAS GALLERY (GRID OF LUXURY CARDS) ----------------- */}
        {viewMode === 'atlas' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {INGREDIENTS_SHOWCASE.map((item) => {
              const itemName = isDari && item.nameFa ? item.nameFa : item.name;
              const itemOrigin = isDari && item.originFa ? item.originFa : item.origin;
              const itemRarity = isDari && item.rarityFa ? item.rarityFa : item.rarity;
              const itemElevation = isDari && item.elevationFa ? item.elevationFa : item.elevation;
              const itemDesc = isDari && item.descriptionFa ? item.descriptionFa : item.description;
              const isSelected = activeIngredient.id === item.id;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative rounded-3xl border overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500 ${
                    isSelected
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40'
                      : theme === 'dark'
                      ? 'border-[#D4AF37]/25 bg-[#120F0D] hover:border-[#D4AF37]/60'
                      : 'border-[#D4AF37]/35 bg-white hover:border-[#D4AF37]/70'
                  }`}
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Rarity Ribbon */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 shadow-md">
                        <Award className="w-3 h-3 text-[#D4AF37]" />
                        {itemRarity}
                      </span>

                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>

                    {/* Origin & Elevation banner over image */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D4AF37] mb-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="font-semibold">{itemOrigin}</span>
                      </div>
                      {itemElevation && (
                        <div className="flex items-center gap-1.5 text-[10px] text-white/80 font-sans">
                          <Mountain className="w-2.5 h-2.5 text-[#D4AF37]" />
                          <span>{itemElevation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-gold-gradient mb-2">
                        {itemName}
                      </h3>
                      <p
                        className={`text-xs font-sans leading-relaxed line-clamp-3 ${
                          theme === 'dark' ? 'text-[#C5BBAF]' : 'text-[#615444]'
                        }`}
                      >
                        {itemDesc}
                      </p>
                    </div>

                    {/* Sensory Mini Matrix */}
                    {item.sensoryScores && (
                      <div
                        className={`p-3 rounded-2xl border text-[11px] space-y-1.5 ${
                          theme === 'dark'
                            ? 'bg-[#181410] border-[#D4AF37]/20'
                            : 'bg-[#FAF7F2] border-[#D4AF37]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[#8F8474] font-mono text-[10px] uppercase">
                          <span>{t.ingredients.radar?.umami || 'Umami'}</span>
                          <span className="text-[#D4AF37] font-bold">{item.sensoryScores.umami}%</span>
                        </div>
                        <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6B3] h-full rounded-full"
                            style={{ width: `${item.sensoryScores.umami}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#D4AF37]/15">
                      <button
                        onClick={() => {
                          setActiveIngredient(item);
                          setViewMode('dossier');
                        }}
                        onMouseEnter={() => setCursorMode('hover')}
                        onMouseLeave={() => setCursorMode('default')}
                        className="text-xs font-serif font-bold text-[#D4AF37] hover:underline flex items-center gap-1.5"
                      >
                        <span>{isDari ? 'مشاهده دوسیه کامل' : 'Full Dossier'}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      {pairedDish && onSelectDish && (
                        <button
                          onClick={() => onSelectDish(pairedDish)}
                          className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-serif font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-1"
                        >
                          <Utensils className="w-3 h-3" />
                          <span>{isDari ? 'غذا' : 'Dish'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ----------------- VIEW 2: DEEP SENSORY DOSSIER ----------------- */}
        {viewMode === 'dossier' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Quick Selector Pills */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {INGREDIENTS_SHOWCASE.map((item) => {
                const isSelected = activeIngredient.id === item.id;
                const localizedItemName = isDari && item.nameFa ? item.nameFa : item.name;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIngredient(item)}
                    onMouseEnter={() => setCursorMode('hover')}
                    onMouseLeave={() => setCursorMode('default')}
                    className={`px-4 py-2.5 rounded-2xl border text-xs font-serif tracking-wider font-semibold transition-all duration-300 flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black shadow-lg scale-102 font-bold'
                        : theme === 'dark'
                        ? 'border-[#D4AF37]/25 bg-[#14110E] text-[#C5BBAF] hover:border-[#D4AF37] hover:text-white'
                        : 'border-[#D4AF37]/30 bg-white text-[#5E5244] hover:border-[#B8860B] shadow-sm'
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSelected ? '#000' : item.color }}
                    />
                    <span>{localizedItemName}</span>
                  </button>
                );
              })}
            </div>

            {/* Dossier Grand Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIngredient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
                className={`rounded-3xl border overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 ${
                  theme === 'dark'
                    ? 'bg-[#120F0D] border-[#D4AF37]/35 shadow-[0_25px_80px_rgba(0,0,0,0.85)]'
                    : 'bg-white border-[#D4AF37]/45 shadow-[0_25px_80px_rgba(0,0,0,0.08)]'
                }`}
              >
                {/* Hero Image Side */}
                <div className="lg:col-span-5 relative aspect-square lg:aspect-auto overflow-hidden min-h-[380px] lg:min-h-[540px]">
                  <img
                    src={activeIngredient.image}
                    alt={activeName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Rarity Badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 shadow-md">
                      <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {activeRarity}
                    </span>
                  </div>

                  {/* Terroir Location & Elevation Banner */}
                  <div className="absolute bottom-5 left-5 right-5 z-10 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 text-white space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{t.ingredients.origin}</span>
                    </div>
                    <p className="font-serif font-bold text-base text-gold-gradient">{activeOrigin}</p>
                    {activeElevation && (
                      <div className="flex items-center gap-1.5 text-xs text-white/80 font-sans pt-1 border-t border-white/10">
                        <Mountain className="w-3 h-3 text-[#D4AF37]" />
                        <span>{activeElevation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dossier Information Side */}
                <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Harvest method header */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] mb-2 font-semibold">
                      <Compass className="w-4 h-4 text-[#D4AF37]" />
                      <span>{activeHarvest}</span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight mb-2">
                      {activeName}
                    </h3>

                    <p
                      className={`text-sm sm:text-base font-sans leading-relaxed font-light mt-4 ${
                        theme === 'dark' ? 'text-[#C5BBAF]' : 'text-[#5E5244]'
                      }`}
                    >
                      {activeDesc}
                    </p>

                    {/* Terroir Technical Dossier Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {activeHarvestSeason && (
                        <div
                          className={`p-3.5 rounded-2xl border ${
                            theme === 'dark'
                              ? 'bg-[#181410] border-[#D4AF37]/20'
                              : 'bg-[#FAF8F5] border-[#D4AF37]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-serif font-semibold mb-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{t.ingredients.metrics?.harvest || 'Harvest Period'}</span>
                          </div>
                          <p className="text-xs font-sans text-gray-300 font-medium dark:text-gray-300 light:text-[#332B22]">
                            {activeHarvestSeason}
                          </p>
                        </div>
                      )}

                      {activeClimate && (
                        <div
                          className={`p-3.5 rounded-2xl border ${
                            theme === 'dark'
                              ? 'bg-[#181410] border-[#D4AF37]/20'
                              : 'bg-[#FAF8F5] border-[#D4AF37]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-serif font-semibold mb-1">
                            <Wind className="w-3.5 h-3.5" />
                            <span>{t.ingredients.metrics?.climate || 'Micro-Climate'}</span>
                          </div>
                          <p className="text-xs font-sans text-gray-300 font-medium dark:text-gray-300 light:text-[#332B22]">
                            {activeClimate}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* SENSORY RADAR SCORES */}
                    {activeIngredient.sensoryScores && (
                      <div
                        className={`mt-6 p-5 rounded-2xl border space-y-3 ${
                          theme === 'dark'
                            ? 'bg-[#181410] border-[#D4AF37]/25'
                            : 'bg-[#FAF8F5] border-[#D4AF37]/35 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {t.ingredients.metrics?.sensoryProfile || 'Sensory Intensity Matrix'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                          <div>
                            <div className="flex justify-between text-[11px] font-mono text-[#8C8173] mb-1">
                              <span>{t.ingredients.radar?.earthiness || 'Earthiness'}</span>
                              <span className="text-[#D4AF37] font-bold">
                                {activeIngredient.sensoryScores.earthiness}%
                              </span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6B3] h-full rounded-full transition-all duration-700"
                                style={{ width: `${activeIngredient.sensoryScores.earthiness}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-mono text-[#8C8173] mb-1">
                              <span>{t.ingredients.radar?.umami || 'Umami Depth'}</span>
                              <span className="text-[#D4AF37] font-bold">
                                {activeIngredient.sensoryScores.umami}%
                              </span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6B3] h-full rounded-full transition-all duration-700"
                                style={{ width: `${activeIngredient.sensoryScores.umami}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-mono text-[#8C8173] mb-1">
                              <span>{t.ingredients.radar?.aroma || 'Aroma Volatility'}</span>
                              <span className="text-[#D4AF37] font-bold">
                                {activeIngredient.sensoryScores.aroma}%
                              </span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6B3] h-full rounded-full transition-all duration-700"
                                style={{ width: `${activeIngredient.sensoryScores.aroma}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] font-mono text-[#8C8173] mb-1">
                              <span>{t.ingredients.radar?.intensity || 'Intensity'}</span>
                              <span className="text-[#D4AF37] font-bold">
                                {activeIngredient.sensoryScores.intensity}%
                              </span>
                            </div>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#D4AF37] to-[#F5E6B3] h-full rounded-full transition-all duration-700"
                                style={{ width: `${activeIngredient.sensoryScores.intensity}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Sensory Notes */}
                        <div className="pt-2 border-t border-[#D4AF37]/15">
                          <p className="font-editorial text-base italic text-[#E5D7BE]">
                            "{activeNotes}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Paired Dish Callout */}
                  {activeDishName && (
                    <div
                      className={`pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[#8C8173] uppercase tracking-wider block">
                          {t.ingredients.metrics?.pairedDish || 'Featured in Royal Signature Dish:'}
                        </span>
                        <p className="font-serif font-bold text-base text-[#D4AF37] mt-0.5">
                          {activeDishName}
                        </p>
                      </div>

                      {pairedDish && onSelectDish && (
                        <button
                          onClick={() => onSelectDish(pairedDish)}
                          className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-serif font-bold tracking-wider hover:bg-[#F3CE72] transition-colors flex items-center gap-2 w-fit active:scale-95 shadow-md"
                        >
                          <Utensils className="w-3.5 h-3.5 text-black" />
                          <span>{t.ingredients.metrics?.inspectDish || 'Inspect Dish'}</span>
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ----------------- VIEW 3: GLOBAL ORIGINS MAP ----------------- */}
        {viewMode === 'map' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className={`p-6 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden ${
              theme === 'dark'
                ? 'bg-[#120F0D] border-[#D4AF37]/35'
                : 'bg-white border-[#D4AF37]/45'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-gradient">
                  {isDari ? 'نقشه مسیر خاستگاه‌های نایاب قصر' : 'Imperial Sourcing & Terroir Map'}
                </h3>
                <p className="text-xs font-sans text-[#A69B89] mt-1">
                  {isDari
                    ? 'برای بررسی هر ماده اولیه روی نشانگرهای جغرافیایی کلیک فرمایید.'
                    : 'Click any geographical provenance node to inspect sourcing rarity and transport protocol.'}
                </p>
              </div>

              <span className="px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-semibold">
                6 Sacred Global Terroirs
              </span>
            </div>

            {/* Interactive World Pins List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {INGREDIENTS_SHOWCASE.map((item) => {
                const isSelected = activeIngredient.id === item.id;
                const localizedName = isDari && item.nameFa ? item.nameFa : item.name;
                const localizedOrigin = isDari && item.originFa ? item.originFa : item.origin;
                const localizedElevation = isDari && item.elevationFa ? item.elevationFa : item.elevation;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveIngredient(item);
                      setViewMode('dossier');
                    }}
                    onMouseEnter={() => setCursorMode('hover')}
                    onMouseLeave={() => setCursorMode('default')}
                    className={`p-4 rounded-2xl border text-left rtl:text-right transition-all duration-300 flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-lg scale-102'
                        : theme === 'dark'
                        ? 'border-[#D4AF37]/20 bg-[#161310] hover:border-[#D4AF37]/50'
                        : 'border-[#D4AF37]/30 bg-[#FAF8F5] hover:border-[#D4AF37]/60'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow"
                      style={{ backgroundColor: `${item.color}30` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: item.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-sm font-bold truncate text-gold-gradient">
                          {localizedName}
                        </h4>
                      </div>
                      <p className="text-xs font-mono text-[#D4AF37] mt-0.5">{localizedOrigin}</p>
                      {localizedElevation && (
                        <p className="text-[11px] text-[#8C8173] font-sans truncate mt-1">
                          {localizedElevation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
