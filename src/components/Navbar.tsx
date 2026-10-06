import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  User,
  Sun,
  Moon,
  Globe,
  Crown,
  LogOut,
  Heart,
  Calendar,
  Settings,
  ChevronDown,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { CursorMode } from '../types';
import { useApp } from '../context/AppContext';
import nimaPhoto from '../assets/images/nima_nabizada.jpg';

interface NavbarProps {
  setCursorMode: (mode: CursorMode) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onReplayInvitation?: () => void;
}

export function Navbar({
  setCursorMode,
  onNavigate,
  activeSection,
  onReplayInvitation,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detailsMenuOpen, setDetailsMenuOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    audioPlaying,
    toggleAudio,
    savedDishIds,
    currentUser,
    setIsAuthModalOpen,
    openProfileWithTab,
    logout,
    activeReservation,
    setIsContactModalOpen,
    t,
  } = useApp();

  const isDari = language === 'fa';

  // Handle scroll detection for glass navbar effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close details dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setDetailsMenuOpen(false);
      }
    };
    if (detailsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [detailsMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'hero', label: t.nav.home },
    { id: 'philosophy', label: t.nav.experience },
    { id: 'signature', label: t.nav.signature },
    { id: 'menu', label: t.nav.menu },
    { id: 'ingredients', label: t.nav.terroir },
    { id: 'chef', label: t.nav.chef },
    { id: 'gallery', label: t.nav.atmosphere },
    { id: 'reservation', label: t.nav.reserve },
  ];

  // Essential 4 tabs for medium/laptop screens to prevent any overflow
  const compactNavItems = [
    { id: 'hero', label: t.nav.home },
    { id: 'signature', label: t.nav.signature },
    { id: 'menu', label: t.nav.menu },
    { id: 'reservation', label: t.nav.reserve },
  ];

  const handleLogoutClick = () => {
    logout();
    setMobileMenuOpen(false);
    setDetailsMenuOpen(false);
  };

  const handleOpenDetailTab = (tab: 'profile' | 'favorites' | 'reservations' | 'settings') => {
    openProfileWithTab(tab);
    setDetailsMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const handleReplayIntro = () => {
    setDetailsMenuOpen(false);
    setMobileMenuOpen(false);
    if (onReplayInvitation) {
      onReplayInvitation();
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full max-w-[100vw] overflow-x-clip ${
        scrolled
          ? theme === 'dark'
            ? 'py-2 sm:py-2.5 bg-[#090807]/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.85)]'
            : 'py-2 sm:py-2.5 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
          : 'py-2.5 sm:py-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
        {/* 1. LOGO & FOUNDER CONTACT: THE ROYAL CROWN */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-left rtl:text-right shrink-0">
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('hero')}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center bg-gradient-to-br from-[#1A1612] to-[#0A0806] hover:border-[#D4AF37] transition-all duration-300 shadow-md shrink-0 focus:outline-none"
            title="The Royal Crown"
          >
            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 filter blur-xs hover:bg-[#D4AF37]/30 transition-all" />
          </button>

          <div className="min-w-0">
            {/* Logo Name & 3-Star Rating */}
            <div
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-1 cursor-pointer group"
            >
              <span className="font-serif tracking-[0.1em] sm:tracking-[0.14em] text-xs sm:text-sm md:text-base font-bold group-hover:text-gold-gradient transition-all whitespace-nowrap">
                {isDari ? 'رویال کراون' : 'ROYAL CROWN'}
              </span>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] px-1 py-0.2 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] font-mono font-bold bg-[#D4AF37]/10 shrink-0">
                3★
              </span>
            </div>

            {/* USER REQUIREMENT: "under the royal crown name at the top of the page add a contact info about me like a button and when the button clicked details should appear" */}
            <button
              id="owner-contact-top-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsContactModalOpen(true);
              }}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              title={isDari ? 'درباره من و ارتباط مستقیم • نیما نبی‌زاده (+93797355027)' : 'About Me & Direct Contact • Nima Nabizada (+93797355027)'}
              className="mt-0.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#D4AF37]/60 bg-gradient-to-r from-[#D4AF37]/25 via-[#D4AF37]/10 to-transparent hover:border-[#FFEAA7] hover:from-[#D4AF37]/40 text-[#FFEAA7] text-[8px] sm:text-[9.5px] font-mono font-bold tracking-wide shadow-[0_0_10px_rgba(212,175,55,0.25)] hover:shadow-[0_0_16px_rgba(212,175,55,0.5)] transition-all group/owner cursor-pointer"
            >
              <img
                src={nimaPhoto}
                alt="Nima Nabizada"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover border border-[#D4AF37] shadow-xs shrink-0 group-hover/owner:scale-110 transition-transform"
              />
              <span className="whitespace-nowrap">
                {isDari ? 'درباره من • نیما نبی‌زاده' : 'About Me • Nima Nabizada'}
              </span>
              <Sparkles className="w-2 h-2 text-[#FFEAA7] animate-pulse shrink-0" />
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION TABS: RESPONSIVE DUAL-TIER */}
        {/* Tier A: Wide Desktop / LCD displays (>= 1280px): ALL 8 TABS */}
        <nav
          id="desktop-nav-tabs"
          className="hidden xl:flex items-center justify-center gap-1 2xl:gap-2.5 shrink-0 mx-auto"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className={`relative px-2 py-1 text-[11px] 2xl:text-xs tracking-[0.08em] 2xl:tracking-[0.12em] font-serif font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${
                  isActive
                    ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10'
                    : theme === 'dark'
                    ? 'text-[#C5BBAF] hover:text-[#FAF6EE] hover:bg-white/5'
                    : 'text-[#5E5244] hover:text-[#1F1A16] hover:bg-black/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Tier B: Compact Laptops / Minimized Windows (1024px to 1279px): 4 CORE TABS to avoid overflow */}
        <nav
          id="laptop-compact-nav-tabs"
          className="hidden lg:flex xl:hidden items-center justify-center gap-1 shrink-0 mx-auto"
        >
          {compactNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-compact-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className={`relative px-2 py-1 text-[11px] tracking-[0.08em] font-serif font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${
                  isActive
                    ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10'
                    : theme === 'dark'
                    ? 'text-[#C5BBAF] hover:text-[#FAF6EE] hover:bg-white/5'
                    : 'text-[#5E5244] hover:text-[#1F1A16] hover:bg-black/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1.5 right-1.5 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. RIGHT ACTION CONTROLS: NEVER OVERFLOW ON ANY PLATFORM */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          {/* Quick Theme Toggle (Visible on sm+ screens; on mobile available inside Details) */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleTheme}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            title={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
            className={`hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full border items-center justify-center transition-all shrink-0 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/25 bg-[#171411]/80 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#B8860B] hover:border-[#B8860B] shadow-sm'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Language Toggle (Always visible, compact) */}
          <button
            id="nav-lang-toggle-btn"
            onClick={toggleLanguage}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            title={isDari ? 'Switch to English' : 'تغییر زبان به دری'}
            className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-semibold transition-all shrink-0 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#171411]/85 text-[#FAF6EE] hover:border-[#D4AF37]'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#1F1A16] hover:border-[#B8860B] shadow-sm'
            }`}
          >
            <Globe className="w-3 h-3 text-[#D4AF37]" />
            <span className="font-bold">
              {isDari ? 'EN' : 'دری'}
            </span>
          </button>

          {/* Gentle Relaxing Acoustic Soundscape Toggle (Visible on sm+ screens) */}
          <button
            id="audio-toggle-btn"
            onClick={toggleAudio}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            title={audioPlaying ? 'Mute calm chimes' : 'Enable whisper-soft calm chimes'}
            className={`hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full border items-center justify-center transition-all shrink-0 ${
              audioPlaying
                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                : theme === 'dark'
                ? 'border-[#D4AF37]/25 bg-[#171411]/80 text-[#A69B89] hover:border-[#D4AF37]/60'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#736859] hover:border-[#D4AF37] shadow-sm'
            }`}
            aria-label="Toggle Audio"
          >
            {audioPlaying ? (
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#8A8072]" />
            )}
          </button>

          {/* 4. THE PROMINENT DETAILS BUTTON WITH COMPREHENSIVE VIP DROPDOWN */}
          <div className="relative" ref={detailsRef}>
            <button
              id="nav-details-btn"
              onClick={() => setDetailsMenuOpen(!detailsMenuOpen)}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              title={isDari ? 'منوی جزئیات و خدمات سلطنتی' : 'Royal VIP Details & Options'}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-all text-xs font-serif font-semibold shrink-0 shadow-sm ${
                detailsMenuOpen
                  ? 'border-[#D4AF37] bg-[#D4AF37]/25 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                  : theme === 'dark'
                  ? 'border-[#D4AF37]/45 bg-[#161310]/95 text-[#E6DEC8] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/15'
                  : 'border-[#D4AF37]/50 bg-white text-[#5E5244] hover:border-[#B8860B] hover:text-[#B8860B]'
              }`}
              aria-expanded={detailsMenuOpen}
              aria-haspopup="true"
            >
              <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
              <span className="hidden xs:inline text-[11px] sm:text-xs tracking-wider font-bold">
                {t.nav.details || (isDari ? 'جزئیات' : 'Details')}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-[#D4AF37] transition-transform duration-200 ${
                  detailsMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* DETAILS LUXURY POP-OVER MENU (Guaranteed width within screen) */}
            {detailsMenuOpen && (
              <div
                id="nav-details-dropdown"
                className={`absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-[340px] rounded-2xl border p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark'
                    ? 'bg-[#0E0C0A]/98 border-[#D4AF37]/40 text-[#FAF6EE] shadow-[0_15px_45px_rgba(0,0,0,0.85)]'
                    : 'bg-[#FAF8F5]/98 border-[#D4AF37]/50 text-[#1F1A16] shadow-[0_15px_40px_rgba(0,0,0,0.15)]'
                }`}
              >
                {/* Mobile Quick Utility Bar (Theme & Audio toggles for mobile view) */}
                <div className="sm:hidden flex items-center justify-between p-2 mb-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-xs">
                  <span className="font-serif font-semibold text-[11px] text-[#D4AF37]">
                    {isDari ? 'کنترل‌های سریع' : 'Quick Ambience'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleTheme}
                      className="px-2 py-1 rounded-lg border border-[#D4AF37]/30 flex items-center gap-1 text-[10px] font-mono bg-black/20"
                    >
                      {theme === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3" />}
                      <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                    <button
                      onClick={toggleAudio}
                      className="px-2 py-1 rounded-lg border border-[#D4AF37]/30 flex items-center gap-1 text-[10px] font-mono bg-black/20"
                    >
                      {audioPlaying ? <Volume2 className="w-3 h-3 text-[#D4AF37]" /> : <VolumeX className="w-3 h-3" />}
                      <span>{audioPlaying ? 'Mute' : 'Sound'}</span>
                    </button>
                  </div>
                </div>

                {/* User Info Header / Patron Status */}
                {currentUser.isAuthenticated ? (
                  <div className="p-3 mb-2 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 via-[#D4AF37]/5 to-transparent border border-[#D4AF37]/30">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Crown className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span className="font-serif font-bold text-xs truncate">
                          {currentUser.name}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#D4AF37] font-mono font-bold shrink-0 border border-[#D4AF37]/40">
                        VIP
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#A69B89]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] text-[#D4AF37] font-mono">
                      <span>{currentUser.memberId || 'RC-VIP-8829'}</span>
                      <span>{currentUser.points ? `${currentUser.points} Pts` : 'Royal Patron'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 mb-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-serif font-bold">
                        {isDari ? 'مهمان سلطنتی' : 'Royal Guest'}
                      </p>
                      <p className="text-[10px] text-[#A69B89]">
                        {isDari ? 'وارد حساب خود شوید' : 'Sign in to access VIP perks'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setDetailsMenuOpen(false);
                      }}
                      className="px-2.5 py-1 text-[10px] font-serif font-bold rounded-lg bg-[#D4AF37] text-black hover:bg-[#F3E5AB] transition-colors"
                    >
                      {t.nav.signIn}
                    </button>
                  </div>
                )}

                {/* OPTIONS LIST */}
                <div className="space-y-1">
                  {/* Option 1: Profile */}
                  <button
                    onClick={() => handleOpenDetailTab('profile')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#D4AF37]/15 transition-all group text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-serif font-semibold">{t.nav.myProfile}</div>
                        <div className="text-[10px] text-[#8A8072]">
                          {isDari ? 'مشاهده شناسه و امتیازات VIP' : 'Member credentials & status'}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Saved Favorites */}
                  <button
                    onClick={() => handleOpenDetailTab('favorites')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#D4AF37]/15 transition-all group text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-serif font-semibold">{t.nav.favorites}</div>
                        <div className="text-[10px] text-[#8A8072]">
                          {isDari ? 'غذاهای برگزیده برای چشیدن' : 'Dishes saved for dining'}
                        </div>
                      </div>
                    </div>
                    {savedDishIds.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-[#D4AF37] font-mono font-bold">
                        {savedDishIds.length}
                      </span>
                    )}
                  </button>

                  {/* Option 3: Table Reservations */}
                  <button
                    onClick={() => handleOpenDetailTab('reservations')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#D4AF37]/15 transition-all group text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-serif font-semibold">{t.nav.reservations}</div>
                        <div className="text-[10px] text-[#8A8072]">
                          {isDari ? 'بررسی بلیت رزرو میز شما' : 'Active seating passes'}
                        </div>
                      </div>
                    </div>
                    {activeReservation && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                        {isDari ? 'فعال' : 'Active'}
                      </span>
                    )}
                  </button>

                  {/* Option 4: Settings & Ambience */}
                  <button
                    onClick={() => handleOpenDetailTab('settings')}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#D4AF37]/15 transition-all group text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                        <Settings className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-serif font-semibold">{t.nav.settings}</div>
                        <div className="text-[10px] text-[#8A8072]">
                          {isDari ? 'صدای چنگ، نرخ ارز و روشنایی' : 'Sound presets & live currency'}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Option 5: Replay Video Invitation */}
                  {onReplayInvitation && (
                    <button
                      onClick={handleReplayIntro}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#D4AF37]/15 transition-all group text-left rtl:text-right"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-serif font-semibold">{t.nav.replayIntro}</div>
                          <div className="text-[10px] text-[#8A8072]">
                            {isDari ? 'انیمیشن پاکت و نشان اختصاصی R' : 'Opening envelope animation'}
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Option 6: Direct Contact Nima Nabizada (Founder & Creator) */}
                  <button
                    onClick={() => {
                      setIsContactModalOpen(true);
                      setDetailsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-[#D4AF37]/15 transition-all group text-left rtl:text-right"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#D4AF37]/50 shrink-0">
                        <img
                          src={nimaPhoto}
                          alt="Nima Nabizada"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-serif font-semibold text-[#D4AF37] group-hover:text-gold-gradient">
                          {isDari ? 'تماس با موسس • نیما نبی‌زاده' : 'Contact Founder • Nima Nabizada'}
                        </div>
                        <div className="text-[10px] text-[#8A8072] font-mono">
                          (+93797355027)
                        </div>
                      </div>
                    </div>
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                </div>

                {/* Option 7: EXPLICIT LOGOUT / SIGN OUT OPTION */}
                {currentUser.isAuthenticated ? (
                  <div className="mt-2 pt-2 border-t border-[#D4AF37]/20">
                    <button
                      id="details-logout-btn"
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-serif font-bold text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 transition-all shadow-sm"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>{t.nav.logout || (isDari ? 'خروج از حساب سلطنتی' : 'Logout of Royal Account')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-[#D4AF37]/20">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setDetailsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-serif font-bold text-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 transition-all"
                    >
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{t.nav.signIn}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. DIRECT LOGOUT BUTTON (Visible on md+ screens when authenticated) */}
          {currentUser.isAuthenticated && (
            <button
              id="nav-logout-btn"
              onClick={handleLogoutClick}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              title={isDari ? 'خروج از حساب سلطنتی' : 'Logout of Royal Account'}
              className={`hidden md:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-all text-xs font-serif font-semibold shrink-0 ${
                theme === 'dark'
                  ? 'border-red-500/35 bg-red-950/35 text-red-300 hover:border-red-400 hover:bg-red-900/50'
                  : 'border-red-300 bg-red-50 text-red-700 hover:border-red-400 shadow-sm'
              }`}
            >
              <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
              <span className="hidden lg:inline text-[11px] font-bold">
                {t.nav.logout || (isDari ? 'خروج' : 'Logout')}
              </span>
            </button>
          )}

          {/* 6. PRIMARY CTA: RESERVE TABLE BUTTON */}
          <button
            id="nav-reserve-btn"
            onClick={() => onNavigate('reservation')}
            onMouseEnter={() => setCursorMode('reserve')}
            onMouseLeave={() => setCursorMode('default')}
            className="relative group overflow-hidden rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-serif tracking-[0.1em] sm:tracking-[0.12em] font-semibold text-[#080706] bg-gradient-to-r from-[#F7E7B4] via-[#D4AF37] to-[#B38728] shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_22px_rgba(212,175,55,0.6)] transition-all duration-200 shrink-0 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#080706]" />
              <span className="hidden xs:inline">{t.nav.reserve}</span>
              <span className="xs:hidden text-[9px] font-bold">★</span>
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {/* 7. HAMBURGER MENU TOGGLE (Visible on all screens < xl, e.g. tablets, phones, and minimized windows) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1 sm:p-1.5 text-inherit focus:outline-none shrink-0 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* FULL RESPONSIVE DRAWER (Opens on any device < xl: mobile, tablet, or minimized window) */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden absolute top-full left-0 right-0 p-4 sm:p-6 flex flex-col gap-3 shadow-2xl border-b animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto ${
            theme === 'dark'
              ? 'bg-[#0E0C0A]/98 backdrop-blur-xl border-[#D4AF37]/25 text-[#FAF6EE]'
              : 'bg-[#FAF8F5]/98 backdrop-blur-xl border-[#D4AF37]/35 text-[#1F1A16]'
          }`}
        >
          {/* Section Navigation Links */}
          <div className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-mono px-2 font-bold flex items-center justify-between">
            <span>{isDari ? 'بخش‌های قصر رویال' : 'Restaurant Sections'}</span>
            <span className="text-[9px] font-normal text-[#A69B89]">8 Imperial Experiences</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left rtl:text-right py-2 px-3 rounded-xl text-xs sm:text-sm font-serif tracking-wide font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                    : theme === 'dark'
                    ? 'text-[#C5BBAF] hover:bg-white/5 bg-[#14110E]'
                    : 'text-[#615444] hover:bg-black/5 bg-[#F0EDE6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Ambient Controls for Tablet / Mobile */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs">
            <span className="font-serif font-bold text-xs text-[#D4AF37]">
              {isDari ? 'تنظیمات روشنایی و صدا' : 'Theme & Sound'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 flex items-center gap-1.5 text-[11px] font-mono bg-black/20"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={toggleAudio}
                className="px-2.5 py-1 rounded-lg border border-[#D4AF37]/30 flex items-center gap-1.5 text-[11px] font-mono bg-black/20"
              >
                {audioPlaying ? <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{audioPlaying ? 'Mute' : 'Play Sound'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Details & VIP Options Section */}
          <div className="pt-2 border-t border-[#D4AF37]/20">
            <div className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-mono px-2 mb-2 font-bold">
              {t.nav.vipMenu}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOpenDetailTab('profile')}
                className="py-2 px-3 rounded-xl text-xs font-serif font-medium bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">{t.nav.myProfile}</span>
              </button>

              <button
                onClick={() => handleOpenDetailTab('favorites')}
                className="py-2 px-3 rounded-xl text-xs font-serif font-medium bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="truncate">{t.nav.favorites}</span>
                </div>
                {savedDishIds.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/30 text-[#D4AF37] font-mono">
                    {savedDishIds.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleOpenDetailTab('reservations')}
                className="py-2 px-3 rounded-xl text-xs font-serif font-medium bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">{t.nav.reservations}</span>
              </button>

              <button
                onClick={() => handleOpenDetailTab('settings')}
                className="py-2 px-3 rounded-xl text-xs font-serif font-medium bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">{t.nav.settings}</span>
              </button>
            </div>

            {/* Direct Contact Founder Button in Mobile Drawer */}
            <button
              onClick={() => {
                setIsContactModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="mt-2 w-full py-2 px-3 rounded-xl text-xs font-serif font-bold text-[#D4AF37] bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/35 flex items-center justify-center gap-2"
            >
              <img
                src={nimaPhoto}
                alt="Nima Nabizada"
                className="w-4 h-4 rounded-full object-cover border border-[#D4AF37]"
              />
              <span>{isDari ? 'تماس با موسس • نیما نبی‌زاده' : 'Contact Founder • Nima Nabizada'}</span>
              <Sparkles className="w-3 h-3 text-[#FFEAA7]" />
            </button>

            {onReplayInvitation && (
              <button
                onClick={handleReplayIntro}
                className="mt-2 w-full py-2 px-3 rounded-xl text-xs font-serif font-medium bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.nav.replayIntro}</span>
              </button>
            )}

            {currentUser.isAuthenticated ? (
              <button
                id="mobile-nav-logout-btn"
                onClick={handleLogoutClick}
                className="mt-3 py-2.5 px-3 rounded-xl text-xs font-serif font-bold text-red-400 bg-red-950/40 border border-red-500/30 flex items-center justify-center gap-2 w-full"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>{t.nav.logout || (isDari ? 'خروج از حساب سلطنتی' : 'Logout of Royal Account')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="mt-3 py-2.5 px-3 rounded-xl text-xs font-serif font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center gap-2 w-full"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.nav.signIn}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
