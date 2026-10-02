import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Heart,
  Calendar,
  Settings,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RefreshCw,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Award,
  Wine,
  UtensilsCrossed,
  Crown,
  LogOut,
  Mail,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SoundPreset } from '../utils/ambientAudio';

interface ProfileModalProps {
  onReserveWithDish?: (dishName: string) => void;
  onNavigateToReservation?: () => void;
  onReplayInvitation?: () => void;
}

export function ProfileModal({
  onReserveWithDish,
  onNavigateToReservation,
  onReplayInvitation,
}: ProfileModalProps) {
  const {
    isProfileOpen,
    setIsProfileOpen,
    profileTab,
    setProfileTab,
    language,
    setLanguage,
    theme,
    setTheme,
    exchangeRate,
    lastRateUpdate,
    isRateLoading,
    refreshExchangeRate,
    formatPrice,
    savedDishes,
    toggleSaveDish,
    audioPlaying,
    toggleAudio,
    soundVolume,
    setSoundVolume,
    soundPreset,
    setSoundPreset,
    activeReservation,
    currentUser,
    setIsAuthModalOpen,
    logout,
    t,
  } = useApp();

  const isDari = language === 'fa';

  if (!isProfileOpen) return null;

  const tabs = [
    { id: 'profile', label: t.profileModal.tabs.profile, icon: User },
    { id: 'favorites', label: t.profileModal.tabs.favorites, icon: Heart, count: savedDishes.length },
    { id: 'reservations', label: t.profileModal.tabs.reservations, icon: Calendar },
    { id: 'settings', label: t.profileModal.tabs.settings, icon: Settings },
  ] as const;

  return (
    <AnimatePresence>
      <div
        id="profile-modal-backdrop"
        className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
        onClick={() => setIsProfileOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border shadow-[0_30px_90px_rgba(0,0,0,0.95)] my-auto transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-[#0E0C0A] border-[#D4AF37]/35 text-[#FAF6EE]'
              : 'bg-[#FAF8F5] border-[#D4AF37]/40 text-[#1F1A16]'
          }`}
        >
          {/* MODAL HEADER */}
          <div
            className={`p-4 sm:p-6 md:p-8 flex items-center justify-between border-b gap-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#17130F] to-[#0E0C0A] border-[#D4AF37]/20'
                : 'bg-gradient-to-r from-[#F4EFE6] to-[#FAF8F5] border-[#D4AF37]/25'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-transparent shadow-lg shrink-0">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] flex items-center justify-center text-[8px] text-black font-bold">
                  ★
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-wide truncate">
                    {t.profileModal.title}
                  </h2>
                  <span className="text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono tracking-wider font-semibold shrink-0">
                    {t.profileModal.badge}
                  </span>
                </div>
                <p
                  className={`text-[10px] sm:text-xs font-sans mt-0.5 truncate ${
                    theme === 'dark' ? 'text-[#A69B89]' : 'text-[#7A6E5D]'
                  }`}
                >
                  {t.brand.tagline} • 3 Michelin Stars
                </p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              id="close-profile-btn"
              onClick={() => setIsProfileOpen(false)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                theme === 'dark'
                  ? 'border-[#D4AF37]/30 bg-[#1A1612] text-[#FAF6EE] hover:text-[#D4AF37] hover:border-[#D4AF37]'
                  : 'border-[#D4AF37]/40 bg-white text-[#1F1A16] hover:text-[#B8860B] hover:border-[#B8860B]'
              }`}
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB BAR NAVIGATION */}
          <div
            className={`flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b overflow-x-auto no-scrollbar ${
              theme === 'dark'
                ? 'bg-[#120F0C] border-[#D4AF37]/15'
                : 'bg-[#F2ECE1] border-[#D4AF37]/20'
            }`}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = profileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`profile-tab-${tab.id}`}
                  onClick={() => setProfileTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-xs font-serif tracking-wider font-semibold whitespace-nowrap transition-all duration-300 border-b-2 ${
                    isActive
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent hover:text-[#D4AF37] opacity-70 hover:opacity-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {'count' in tab && tab.count !== undefined && tab.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-mono flex items-center justify-center font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MODAL BODY CONTENT */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {/* ============================================================== */}
            {/* TAB 1: GUEST VIP PROFILE */}
            {/* ============================================================== */}
            {profileTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Member VIP Card */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-[#1C1814] via-[#14110E] to-[#0A0908] border-[#D4AF37]/40'
                      : 'bg-gradient-to-br from-[#FFF9EE] via-[#FBF5EA] to-[#F0E6D2] border-[#D4AF37]/50'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-1 bg-[#1A1612]">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                          alt="VIP Guest Avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-xl sm:text-2xl font-bold">
                            {currentUser.name || t.profileModal.profileTab.guestName}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="text-xs font-mono text-[#D4AF37] font-semibold mt-0.5">
                          {isDari ? currentUser.tierFa || currentUser.tier : currentUser.tier || t.profileModal.profileTab.memberTier}
                        </p>
                        <p
                          className={`text-[11px] font-mono ${
                            theme === 'dark' ? 'text-[#8F8474]' : 'text-[#736859]'
                          }`}
                        >
                          {currentUser.memberId || t.profileModal.profileTab.memberId}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-serif text-xs font-semibold">
                        {t.profileModal.profileTab.vipStatus}
                      </span>
                      <span className="text-[10px] font-mono text-[#A69B89]">
                        3 Michelin Star Royal Patron
                      </span>
                    </div>
                  </div>

                  {/* Loyalty Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-[#15120F] border-[#D4AF37]/20'
                          : 'bg-white border-[#D4AF37]/25'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-serif text-[#D4AF37] mb-1">
                        <Award className="w-4 h-4" />
                        <span>Michelin Pass</span>
                      </div>
                      <p className="font-serif text-lg font-bold">
                        {t.profileModal.profileTab.stamps}
                      </p>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-[#15120F] border-[#D4AF37]/20'
                          : 'bg-white border-[#D4AF37]/25'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-serif text-[#D4AF37] mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Imperial Points</span>
                      </div>
                      <p className="font-serif text-lg font-bold">
                        {t.profileModal.profileTab.points}
                      </p>
                    </div>

                    <div
                      className={`col-span-2 sm:col-span-1 p-3.5 rounded-2xl border ${
                        theme === 'dark'
                          ? 'bg-[#15120F] border-[#D4AF37]/20'
                          : 'bg-white border-[#D4AF37]/25'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-serif text-[#D4AF37] mb-1">
                        <Coins className="w-4 h-4" />
                        <span>Active Currency</span>
                      </div>
                      <p className="font-serif text-lg font-bold text-[#D4AF37]">
                        {isDari ? 'افغانی (AFN)' : 'USD ($)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Culinary Preferences Section */}
                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark'
                      ? 'bg-[#14110E] border-[#D4AF37]/20'
                      : 'bg-white border-[#D4AF37]/25'
                  }`}
                >
                  <h4 className="font-serif text-sm font-bold tracking-wider text-[#D4AF37] uppercase mb-4 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-[#D4AF37]" />
                    {t.profileModal.profileTab.preferencesTitle}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'bg-[#1C1814] border-[#D4AF37]/15'
                          : 'bg-[#FAF7F2] border-[#D4AF37]/20'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{t.profileModal.profileTab.favTable}</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'bg-[#1C1814] border-[#D4AF37]/15'
                          : 'bg-[#FAF7F2] border-[#D4AF37]/20'
                      }`}
                    >
                      <Wine className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{t.profileModal.profileTab.sommelierPref}</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'bg-[#1C1814] border-[#D4AF37]/15'
                          : 'bg-[#FAF7F2] border-[#D4AF37]/20'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{t.profileModal.profileTab.allergies}</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'bg-[#1C1814] border-[#D4AF37]/15'
                          : 'bg-[#FAF7F2] border-[#D4AF37]/20'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{t.profileModal.profileTab.waterPref}</span>
                    </div>
                  </div>

                  {/* Switch account, Replay Invitation and Logout buttons */}
                  <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        id="profile-logout-btn"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="px-4 py-2 rounded-xl border border-red-500/40 text-xs font-serif text-red-400 hover:bg-red-500/15 transition-all flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        <span>{isDari ? 'خروج از حساب سلطنتی' : 'Logout of Account'}</span>
                      </button>

                      {onReplayInvitation && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onReplayInvitation();
                          }}
                          className="px-4 py-2 rounded-xl border border-[#D4AF37]/40 text-xs font-serif text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all flex items-center gap-2"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{isDari ? 'مشاهده پیام خیرمقدم سلطنتی' : 'Royal Welcome Message'}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl border border-[#D4AF37]/40 text-xs font-serif text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{isDari ? 'تغییر حساب یا ورود مجدد' : 'Switch VIP Account / Sign In'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: SAVED DISHES & WISHLIST */}
            {/* ============================================================== */}
            {profileTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold">
                    {t.profileModal.favoritesTab.title} ({savedDishes.length})
                  </h3>
                  <span className="text-xs text-[#A69B89]">
                    {isDari ? 'محاسبه شده بر اساس نرخ روز بازار' : 'Converted at daily market rate'}
                  </span>
                </div>

                {savedDishes.length === 0 ? (
                  <div
                    className={`p-12 text-center rounded-3xl border ${
                      theme === 'dark'
                        ? 'bg-[#14110E] border-[#D4AF37]/20 text-[#A69B89]'
                        : 'bg-white border-[#D4AF37]/25 text-[#736859]'
                    }`}
                  >
                    <Heart className="w-10 h-10 mx-auto text-[#D4AF37]/40 mb-3" />
                    <p className="font-editorial text-base italic">
                      {t.profileModal.favoritesTab.empty}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedDishes.map((dish) => {
                      const localizedName = isDari && dish.nameFa ? dish.nameFa : dish.name;
                      const localizedSubtitle =
                        isDari && dish.subtitleFa ? dish.subtitleFa : dish.subtitle;
                      const dynamicPrice = formatPrice(dish.priceUsd);

                      return (
                        <div
                          key={dish.id}
                          className={`p-4 rounded-2xl border flex gap-4 items-center group transition-all ${
                            theme === 'dark'
                              ? 'bg-[#15120F] border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
                              : 'bg-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
                          }`}
                        >
                          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37]/40">
                            <img
                              src={dish.image}
                              alt={localizedName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono text-[#D4AF37] uppercase">
                                {dish.category}
                              </span>
                              <span className="font-serif font-bold text-[#D4AF37] text-base">
                                {dynamicPrice}
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-sm truncate">{localizedName}</h4>
                            <p className="text-[11px] text-[#A69B89] truncate font-editorial italic">
                              {localizedSubtitle}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => {
                                  if (onReserveWithDish) {
                                    onReserveWithDish(localizedName);
                                    setIsProfileOpen(false);
                                  }
                                }}
                                className="px-3 py-1 rounded-full bg-[#D4AF37] text-black text-[10px] font-serif font-bold tracking-wider hover:bg-[#F3CE72] transition-colors"
                              >
                                {t.profileModal.favoritesTab.reserveWithDish}
                              </button>
                              <button
                                onClick={() => toggleSaveDish(dish.id)}
                                title="Remove from favorites"
                                className="p-1 rounded-full hover:text-red-400 text-[#8F8474] transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: RESERVATIONS */}
            {/* ============================================================== */}
            {profileTab === 'reservations' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-lg font-bold">
                  {t.profileModal.reservationsTab.title}
                </h3>

                {activeReservation ? (
                  <div
                    className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-[#1A1612] via-[#120F0D] to-[#0A0908] border-[#D4AF37]/50'
                        : 'bg-gradient-to-br from-[#FFF8ED] via-[#FBF5EB] to-[#F1E8D5] border-[#D4AF37]/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                          {t.profileModal.reservationsTab.statusConfirmed}
                        </span>
                        <h4 className="font-serif text-2xl font-bold mt-1">
                          Royal Table Pass • {activeReservation.seatingArea}
                        </h4>
                        <p className="text-xs font-mono text-[#D4AF37] mt-0.5">
                          {activeReservation.bookingRef || 'REF: RC-9824-VIP'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-serif text-xl font-bold text-[#D4AF37]">
                          {activeReservation.time}
                        </p>
                        <p className="text-xs font-mono">{activeReservation.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[#D4AF37]/20 text-xs">
                      <div>
                        <span className="text-[#8F8474] font-mono">GUEST</span>
                        <p className="font-bold text-sm mt-0.5">{activeReservation.name}</p>
                      </div>
                      <div>
                        <span className="text-[#8F8474] font-mono">PARTY SIZE</span>
                        <p className="font-bold text-sm mt-0.5">
                          {activeReservation.guests} {t.profileModal.reservationsTab.seats}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#8F8474] font-mono">SEATING</span>
                        <p className="font-bold text-sm mt-0.5">{activeReservation.seatingArea}</p>
                      </div>
                      <div>
                        <span className="text-[#8F8474] font-mono">CONTACT</span>
                        <p className="font-bold text-sm mt-0.5 truncate">{activeReservation.email}</p>
                      </div>
                    </div>

                    {activeReservation.dietaryNotes && (
                      <div className="pt-4 text-xs">
                        <span className="text-[#8F8474] font-mono uppercase font-bold">
                          {t.profileModal.reservationsTab.notes}:
                        </span>
                        <p className="font-editorial italic text-sm mt-1">
                          "{activeReservation.dietaryNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`p-10 text-center rounded-3xl border ${
                      theme === 'dark'
                        ? 'bg-[#14110E] border-[#D4AF37]/20 text-[#A69B89]'
                        : 'bg-white border-[#D4AF37]/25 text-[#736859]'
                    }`}
                  >
                    <Calendar className="w-10 h-10 mx-auto text-[#D4AF37]/50 mb-3" />
                    <p className="font-editorial text-base italic max-w-md mx-auto">
                      {t.profileModal.reservationsTab.empty}
                    </p>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (onNavigateToReservation) onNavigateToReservation();
                      }}
                      className="mt-6 px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-serif font-bold text-xs tracking-widest hover:bg-[#F3CE72] transition-colors"
                    >
                      {t.hero.ctaReserve}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: SETTINGS (DARI LANGUAGE & CURRENCY ENGINE) */}
            {/* ============================================================== */}
            {profileTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* 1. LANGUAGE SWITCHER: DARI & ENGLISH */}
                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark'
                      ? 'bg-[#15120F] border-[#D4AF37]/25'
                      : 'bg-white border-[#D4AF37]/35'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <h4 className="font-serif text-base font-bold">
                        {t.profileModal.settingsTab.languageTitle}
                      </h4>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-[#A69B89]' : 'text-[#736859]'
                        }`}
                      >
                        {t.profileModal.settingsTab.languageDesc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    {/* DARI (دری) BUTTON */}
                    <button
                      id="lang-btn-dari"
                      onClick={() => setLanguage('fa')}
                      className={`p-4 rounded-2xl border flex items-center justify-between text-right transition-all ${
                        isDari
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/30 shadow-md'
                          : theme === 'dark'
                          ? 'border-[#29221C] bg-[#1A1612] hover:border-[#D4AF37]/40'
                          : 'border-[#E0D8CB] bg-[#FAF8F5] hover:border-[#D4AF37]'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-row-reverse sm:flex-row">
                        <span className="text-2xl">🇦🇫</span>
                        <div className="text-right sm:text-left">
                          <p className="font-serif font-bold text-sm">دری (Dari)</p>
                          <p className="text-[11px] text-[#A69B89]">واحد پولی فعال: افغانی (AFN)</p>
                        </div>
                      </div>
                      {isDari && <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />}
                    </button>

                    {/* ENGLISH BUTTON */}
                    <button
                      id="lang-btn-english"
                      onClick={() => setLanguage('en')}
                      className={`p-4 rounded-2xl border flex items-center justify-between text-left transition-all ${
                        !isDari
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 ring-2 ring-[#D4AF37]/30 shadow-md'
                          : theme === 'dark'
                          ? 'border-[#29221C] bg-[#1A1612] hover:border-[#D4AF37]/40'
                          : 'border-[#E0D8CB] bg-[#FAF8F5] hover:border-[#D4AF37]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇬🇧</span>
                        <div>
                          <p className="font-serif font-bold text-sm">English</p>
                          <p className="text-[11px] text-[#A69B89]">Default Currency: USD ($)</p>
                        </div>
                      </div>
                      {!isDari && <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />}
                    </button>
                  </div>
                </div>

                {/* 2. CURRENCY & DAILY MARKET EXCHANGE RATE */}
                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark'
                      ? 'bg-[#15120F] border-[#D4AF37]/25'
                      : 'bg-white border-[#D4AF37]/35'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-[#D4AF37]" />
                      <div>
                        <h4 className="font-serif text-base font-bold">
                          {t.profileModal.settingsTab.currencyTitle}
                        </h4>
                        <p
                          className={`text-xs ${
                            theme === 'dark' ? 'text-[#A69B89]' : 'text-[#736859]'
                          }`}
                        >
                          {t.profileModal.settingsTab.currencyDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      id="refresh-rate-btn"
                      onClick={() => refreshExchangeRate()}
                      disabled={isRateLoading}
                      className="px-3 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono flex items-center gap-1.5 hover:bg-[#D4AF37]/20 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRateLoading ? 'animate-spin' : ''}`} />
                      <span>{t.profileModal.settingsTab.refreshRateBtn}</span>
                    </button>
                  </div>

                  {/* Market Rate Banner */}
                  <div
                    className={`mt-4 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      theme === 'dark'
                        ? 'bg-[#1F1A15] border-[#D4AF37]/30'
                        : 'bg-[#FAF6EE] border-[#D4AF37]/40'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
                        {t.profileModal.settingsTab.marketRateActive}
                      </span>
                      <p className="font-serif text-xl sm:text-2xl font-bold text-gold-gradient">
                        1 USD ($) = {exchangeRate.toFixed(2)} AFN (افغانی)
                      </p>
                      <p className="text-[11px] text-[#A69B89] font-mono mt-0.5">
                        {lastRateUpdate}
                      </p>
                    </div>

                    {/* LIVE CALCULATION EXAMPLE AS SPECIFIED BY USER */}
                    <div
                      className={`p-3 rounded-xl border text-xs sm:text-right ${
                        theme === 'dark'
                          ? 'bg-[#15120F] border-[#D4AF37]/20'
                          : 'bg-white border-[#D4AF37]/30'
                      }`}
                    >
                      <p className="font-bold text-[#D4AF37]">
                        {t.profileModal.settingsTab.calculationExampleTitle}
                      </p>
                      <p className="font-mono text-sm mt-0.5 font-semibold">
                        34$ × {exchangeRate.toFixed(0)} AFN ={' '}
                        <span className="text-[#D4AF37]">
                          {(34 * exchangeRate).toLocaleString()} AFN
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. LIGHT & DARK MODE */}
                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark'
                      ? 'bg-[#15120F] border-[#D4AF37]/25'
                      : 'bg-white border-[#D4AF37]/35'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sun className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <h4 className="font-serif text-base font-bold">
                        {t.profileModal.settingsTab.themeTitle}
                      </h4>
                      <p
                        className={`text-xs ${
                          theme === 'dark' ? 'text-[#A69B89]' : 'text-[#736859]'
                        }`}
                      >
                        {t.profileModal.settingsTab.themeDesc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    {/* DARK MODE BUTTON */}
                    <button
                      id="theme-btn-dark"
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        theme === 'dark'
                          ? 'border-[#D4AF37] bg-[#1C1814] ring-2 ring-[#D4AF37]/30 shadow-lg text-[#FAF6EE]'
                          : 'border-[#D4AF37]/30 bg-[#120F0C] text-[#FAF6EE] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#080706] border border-[#D4AF37]/40 flex items-center justify-center">
                          <Moon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div className="text-left">
                          <p className="font-serif font-bold text-sm">
                            {t.profileModal.settingsTab.darkThemeBtn}
                          </p>
                          <p className="text-[11px] text-[#A69B89]">Obsidian Noir & Gold</p>
                        </div>
                      </div>
                      {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                    </button>

                    {/* LIGHT MODE BUTTON */}
                    <button
                      id="theme-btn-light"
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        theme === 'light'
                          ? 'border-[#D4AF37] bg-white ring-2 ring-[#D4AF37]/30 shadow-lg text-[#1F1A16]'
                          : 'border-[#D4AF37]/30 bg-[#FAF7F2] text-[#1F1A16] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#F4EFE6] border border-[#D4AF37]/40 flex items-center justify-center">
                          <Sun className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div className="text-left">
                          <p className="font-serif font-bold text-sm">
                            {t.profileModal.settingsTab.lightThemeBtn}
                          </p>
                          <p className="text-[11px] text-[#736859]">Warm Alabaster & Cream</p>
                        </div>
                      </div>
                      {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
                    </button>
                  </div>
                </div>

                {/* 4. PEACEFUL, EAR-FRIENDLY CALM ACOUSTIC CHIMES */}
                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark'
                      ? 'bg-[#15120F] border-[#D4AF37]/25'
                      : 'bg-white border-[#D4AF37]/35'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-[#D4AF37]" />
                      <div>
                        <h4 className="font-serif text-base font-bold">
                          {t.profileModal.settingsTab.soundTitle}
                        </h4>
                        <p
                          className={`text-xs ${
                            theme === 'dark' ? 'text-[#A69B89]' : 'text-[#736859]'
                          }`}
                        >
                          {t.profileModal.settingsTab.soundDesc}
                        </p>
                      </div>
                    </div>

                    <button
                      id="profile-audio-toggle"
                      onClick={toggleAudio}
                      className={`px-4 py-2 rounded-full border text-xs font-serif font-semibold tracking-wider flex items-center gap-2 transition-all ${
                        audioPlaying
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg'
                          : 'bg-transparent border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                      }`}
                    >
                      {audioPlaying ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                          <span>PLAYING</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>MUTED</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sound Preset Selector */}
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-serif text-[#D4AF37] block mb-2 font-semibold">
                        {t.profileModal.settingsTab.soundPresetLabel}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'lounge', label: t.profileModal.settingsTab.presetLounge },
                          { id: 'zen', label: t.profileModal.settingsTab.presetZen },
                          { id: 'hearth', label: t.profileModal.settingsTab.presetHearth },
                        ].map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => setSoundPreset(preset.id as SoundPreset)}
                            className={`p-3 rounded-xl border text-xs font-sans text-left transition-all ${
                              soundPreset === preset.id
                                ? 'border-[#D4AF37] bg-[#D4AF37]/15 font-bold text-[#D4AF37]'
                                : theme === 'dark'
                                ? 'border-[#241F1A] bg-[#1A1612] hover:border-[#D4AF37]/40'
                                : 'border-[#E2D9CC] bg-[#FAF8F5] hover:border-[#D4AF37]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Volume Slider */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-serif">
                        <span className="text-[#A69B89]">
                          {t.profileModal.settingsTab.volumeLabel}
                        </span>
                        <span className="font-mono text-[#D4AF37]">
                          {Math.round(soundVolume * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={soundVolume}
                        onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-[#2B231B] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
