import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Sparkles, User, Sun, Moon, Globe, Crown, LogOut } from 'lucide-react';
import { CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  setCursorMode: (mode: CursorMode) => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export function Navbar({ setCursorMode, onNavigate, activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    audioPlaying,
    toggleAudio,
    setIsProfileOpen,
    savedDishIds,
    currentUser,
    setIsAuthModalOpen,
    logout,
    t,
  } = useApp();

  const isDari = language === 'fa';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: t.nav.home },
    { id: 'philosophy', label: t.nav.experience },
    { id: 'signature', label: t.nav.signature },
    { id: 'menu', label: t.nav.menu },
    { id: 'ingredients', label: t.nav.terroir },
    { id: 'chef', label: t.nav.chef },
    { id: 'gallery', label: t.nav.atmosphere },
  ];

  const handleLogoutClick = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? theme === 'dark'
            ? 'py-2.5 sm:py-3.5 bg-[#090807]/94 backdrop-blur-xl border-b border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.85)]'
            : 'py-2.5 sm:py-3.5 bg-[#FAF7F2]/94 backdrop-blur-xl border-b border-[#D4AF37]/35 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
          : 'py-3 sm:py-5 bg-gradient-to-b from-black/60 via-black/25 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 flex items-center justify-between gap-2 sm:gap-4">
        {/* LOGO: THE ROYAL CROWN RESTAURANT */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('hero')}
          onMouseEnter={() => setCursorMode('hover')}
          onMouseLeave={() => setCursorMode('default')}
          className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D4AF37]/60 flex items-center justify-center bg-gradient-to-br from-[#1A1612] to-[#0A0806] group-hover:border-[#D4AF37] transition-all duration-500 shadow-lg shrink-0">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/15 filter blur-sm group-hover:bg-[#D4AF37]/30 transition-all" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-serif tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base lg:text-lg font-bold group-hover:text-gold-gradient transition-all whitespace-nowrap">
                {isDari ? 'رویال کراون' : 'THE ROYAL CROWN'}
              </span>
              <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] tracking-wider font-mono font-bold bg-[#D4AF37]/10 shrink-0">
                3★
              </span>
            </div>
            <p className="text-[8px] sm:text-[9px] tracking-[0.2em] text-[#A69B89] uppercase font-sans -mt-0.5 hidden md:block truncate">
              {t.brand.tagline}
            </p>
          </div>
        </button>

        {/* DESKTOP NAV LINKS (Responsive: visible only on 2xl where there is plenty of space, so tabs NEVER go outside) */}
        <nav className="hidden 2xl:flex items-center gap-5 shrink-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className={`relative py-1 text-xs tracking-[0.16em] font-serif font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-[#D4AF37] font-bold'
                    : theme === 'dark'
                    ? 'text-[#C5BBAF] hover:text-[#FAF6EE]'
                    : 'text-[#5E5244] hover:text-[#1F1A16]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Theme Toggle (Light / Dark Mode) */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleTheme}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            title={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/25 bg-[#171411]/80 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#B8860B] hover:border-[#B8860B] shadow-sm'
            }`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Language Toggle: English & Dari */}
          <button
            id="nav-lang-toggle-btn"
            onClick={toggleLanguage}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            title={isDari ? 'Switch to English' : 'تغییر زبان به دری'}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border text-[11px] font-mono font-semibold transition-all shrink-0 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#171411]/85 text-[#FAF6EE] hover:border-[#D4AF37]'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#1F1A16] hover:border-[#B8860B] shadow-sm'
            }`}
          >
            <Globe className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[10px] sm:text-[11px] font-bold">
              {isDari ? 'EN' : 'دری'}
            </span>
          </button>

          {/* Gentle Relaxing Acoustic Soundscape Toggle */}
          <button
            id="audio-toggle-btn"
            onClick={toggleAudio}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            title={audioPlaying ? 'Mute calm chimes' : 'Enable whisper-soft calm chimes'}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full border transition-all text-xs shrink-0 ${
              audioPlaying
                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]'
                : theme === 'dark'
                ? 'border-[#D4AF37]/25 bg-[#171411]/80 text-[#A69B89] hover:border-[#D4AF37]/60'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#736859] hover:border-[#D4AF37] shadow-sm'
            }`}
          >
            {audioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span className="text-[10px] hidden lg:inline text-[#D4AF37] font-semibold">
                  {t.nav.soundOn}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8A8072]" />
                <span className="text-[10px] hidden lg:inline text-[#8A8072]">
                  {t.nav.soundOff}
                </span>
              </>
            )}
          </button>

          {/* ROYAL SIGN IN / VIP PROFILE BUTTON */}
          {currentUser.isAuthenticated ? (
            <button
              id="nav-profile-btn"
              onClick={() => setIsProfileOpen(true)}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              title={t.nav.profile}
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all group shrink-0 ${
                theme === 'dark'
                  ? 'border-[#D4AF37]/50 bg-[#1A1612]/95 hover:border-[#D4AF37] hover:bg-[#D4AF37]/15'
                  : 'border-[#D4AF37]/60 bg-white hover:border-[#B8860B] shadow-sm'
              }`}
              aria-label="Open Royal VIP Profile"
            >
              <div className="relative">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                {savedDishIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-serif font-bold hidden sm:inline tracking-wider max-w-[85px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[8px] px-1 py-0.2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono hidden md:inline font-bold">
                VIP
              </span>
            </button>
          ) : (
            <button
              id="nav-signin-btn"
              onClick={() => setIsAuthModalOpen(true)}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              title={isDari ? 'ورود به حساب کاربری سلطنتی' : 'Sign In to Royal VIP Club'}
              className={`relative flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all text-xs font-serif font-bold shrink-0 ${
                theme === 'dark'
                  ? 'border-[#D4AF37]/40 bg-[#161310] text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/20'
                  : 'border-[#D4AF37]/50 bg-white text-[#B8860B] hover:border-[#B8860B] shadow-sm'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">{isDari ? 'ورود / عضویت' : 'Sign In'}</span>
            </button>
          )}

          {/* EXPLICIT LOGOUT BUTTON ON MAIN PAGE (As specifically requested by user) */}
          {currentUser.isAuthenticated && (
            <button
              id="nav-logout-btn"
              onClick={handleLogoutClick}
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              title={isDari ? 'خروج از حساب سلطنتی' : 'Logout of Royal Account'}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all text-xs font-serif font-semibold shrink-0 ${
                theme === 'dark'
                  ? 'border-red-500/30 bg-red-950/30 text-red-300 hover:border-red-400 hover:bg-red-900/40'
                  : 'border-red-300 bg-red-50 text-red-700 hover:border-red-400 shadow-sm'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline text-[11px]">{t.nav.logout || (isDari ? 'خروج' : 'Logout')}</span>
            </button>
          )}

          {/* Primary CTA: RESERVE */}
          <button
            id="nav-reserve-btn"
            onClick={() => onNavigate('reservation')}
            onMouseEnter={() => setCursorMode('reserve')}
            onMouseLeave={() => setCursorMode('default')}
            className="relative group overflow-hidden rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-serif tracking-[0.15em] font-semibold text-[#080706] bg-gradient-to-r from-[#F7E7B4] via-[#D4AF37] to-[#B38728] shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.6)] transition-all duration-300 shrink-0 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-3 h-3 text-[#080706]" />
              <span className="hidden sm:inline">{t.nav.reserve}</span>
              <span className="sm:hidden text-[10px] font-bold">★</span>
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* MOBILE & TABLET MENU TOGGLE (Visible below 2xl) */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="2xl:hidden p-1.5 sm:p-2 text-inherit focus:outline-none shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div
          className={`2xl:hidden absolute top-full left-0 right-0 p-5 sm:p-6 flex flex-col gap-3 shadow-2xl border-b animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto ${
            theme === 'dark'
              ? 'bg-[#0E0C0A]/98 backdrop-blur-2xl border-[#D4AF37]/25 text-[#FAF6EE]'
              : 'bg-[#FAF8F5]/98 backdrop-blur-2xl border-[#D4AF37]/35 text-[#1F1A16]'
          }`}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left rtl:text-right py-2 text-sm tracking-[0.16em] font-serif border-b transition-colors ${
                theme === 'dark' ? 'border-[#24201B]' : 'border-[#EAE1D3]'
              } ${activeSection === item.id ? 'text-[#D4AF37] font-bold' : ''}`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Profile Link */}
          <button
            onClick={() => {
              setIsProfileOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 py-2 text-sm font-serif text-[#D4AF37] font-bold"
          >
            <Crown className="w-4 h-4" />
            <span>{t.profileModal.title}</span>
          </button>

          {/* Mobile Logout Button */}
          {currentUser.isAuthenticated ? (
            <button
              id="mobile-nav-logout-btn"
              onClick={handleLogoutClick}
              className="flex items-center gap-2 py-2 text-sm font-serif text-red-400 font-bold border-t border-[#D4AF37]/20 pt-3"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>{isDari ? 'خروج از حساب کاربری سلطنتی' : 'Logout of Royal Account'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 text-sm font-serif text-[#D4AF37] font-bold border-t border-[#D4AF37]/20 pt-3"
            >
              <User className="w-4 h-4" />
              <span>{isDari ? 'ورود به حساب کاربری' : 'Sign In to Account'}</span>
            </button>
          )}

          <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#D4AF37]/20">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-xs text-[#A69B89]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D4AF37]" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs text-[#A69B89]"
            >
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span>{isDari ? 'English' : 'دری'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
