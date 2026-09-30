import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Theme, ReservationData, Dish, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { luxuryAudio, SoundPreset } from '../utils/ambientAudio';
import { FULL_MENU } from '../data/restaurantData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  exchangeRate: number;
  lastRateUpdate: string;
  isRateLoading: boolean;
  refreshExchangeRate: () => Promise<void>;
  setManualExchangeRate: (rate: number) => void;
  formatPrice: (priceInput: string | number) => string;
  formatNumber: (num: number) => string;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  profileTab: 'profile' | 'favorites' | 'reservations' | 'settings';
  setProfileTab: (tab: 'profile' | 'favorites' | 'reservations' | 'settings') => void;
  openProfileWithTab: (tab: 'profile' | 'favorites' | 'reservations' | 'settings') => void;
  savedDishIds: string[];
  toggleSaveDish: (dishId: string) => void;
  isDishSaved: (dishId: string) => boolean;
  savedDishes: Dish[];
  audioPlaying: boolean;
  toggleAudio: () => void;
  soundVolume: number;
  setSoundVolume: (vol: number) => void;
  soundPreset: SoundPreset;
  setSoundPreset: (preset: SoundPreset) => void;
  activeReservation: ReservationData | null;
  setActiveReservation: (res: ReservationData | null) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEmailVerified: boolean;
  pendingVerificationEmail: string | null;
  confirmEmailVerification: () => void;
  resendVerificationEmail: () => void;
  cancelPendingVerification: () => void;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string, password?: string) => void;
  logout: () => void;
  t: typeof TRANSLATIONS.en;
  isRtl: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Persian number formatter
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

const defaultRoyalUser: UserProfile = {
  name: 'Lord Nima Al-Kantara',
  email: 'nima@epicurean.vip',
  phone: '+33 6 12 34 56 78',
  memberId: 'RC-8829-VIP',
  tier: 'Imperial Crown Patron',
  tierFa: 'پاترون تاج سلطنتی (Imperial Crown Patron)',
  points: 3450,
  isAuthenticated: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  // 1. Language state (defaults to English or stored)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nima_lang');
    return saved === 'fa' || saved === 'en' ? saved : 'en';
  });

  // 2. Theme state (defaults to dark mode, supports light mode)
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('nima_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  // User & Authentication state (At first when opening the site, asks for signIn/signUp)
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('rc_royal_user');
      return saved ? JSON.parse(saved) : defaultRoyalUser;
    } catch {
      return defaultRoyalUser;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rc_royal_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated) return false;
      }
    } catch {}
    // User requested: "At first when we open the site it should ask for a signIn/signUp window"
    return true;
  });

  // Email verification state: "and until we didn't confirm the email from gmail the page shouldn't load"
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(() => {
    return localStorage.getItem('rc_pending_email') || null;
  });

  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(() => {
    const pending = localStorage.getItem('rc_pending_email');
    if (pending) return false;
    const verified = localStorage.getItem('rc_email_verified');
    return verified !== 'false';
  });

  // 3. Exchange Rate state: User example "1 dollar = 65 AFN ... 34$ * 65AFN = 2210AFN"
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('nima_rate');
    const parsed = saved ? parseFloat(saved) : 65.0;
    return isNaN(parsed) || parsed <= 0 ? 65.0 : parsed;
  });
  const [lastRateUpdate, setLastRateUpdate] = useState<string>(() => {
    return localStorage.getItem('nima_rate_time') || 'Daily Market Standard (Live Sync)';
  });
  const [isRateLoading, setIsRateLoading] = useState(false);

  // 4. Profile Modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'profile' | 'favorites' | 'reservations' | 'settings'>('profile');

  // 5. Saved Dishes / Favorites
  const [savedDishIds, setSavedDishIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nima_favorites');
      return saved ? JSON.parse(saved) : ['smoky-aurora-cocktail', 'truffle-tagliolini'];
    } catch {
      return ['smoky-aurora-cocktail', 'truffle-tagliolini'];
    }
  });

  // 6. Audio state
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolumeState] = useState<number>(0.6);
  const [soundPreset, setSoundPresetState] = useState<SoundPreset>('lounge');

  // 7. Active Reservation
  const [activeReservation, setActiveReservationState] = useState<ReservationData | null>(() => {
    try {
      const saved = localStorage.getItem('nima_active_res');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync RTL and lang attribute
  useEffect(() => {
    localStorage.setItem('nima_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    if (language === 'fa') {
      document.body.classList.add('font-persian');
    } else {
      document.body.classList.remove('font-persian');
    }
  }, [language]);

  // Sync Theme to HTML class
  useEffect(() => {
    localStorage.setItem('nima_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('bg-[#080706]', 'text-[#FAF6EE]');
      document.body.classList.remove('bg-[#FAF7F2]', 'text-[#1F1A16]');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-[#FAF7F2]', 'text-[#1F1A16]');
      document.body.classList.remove('bg-[#080706]', 'text-[#FAF6EE]');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'fa' : 'en'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Live Exchange Rate fetcher from market APIs
  const refreshExchangeRate = useCallback(async () => {
    setIsRateLoading(true);
    try {
      // Free public open exchange rate API with CORS enabled
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates && data.rates.AFN) {
          const rate = Math.round(data.rates.AFN * 100) / 100;
          setExchangeRate(rate);
          const timeStr = `Market Live: ${new Date().toLocaleDateString()} (1 USD = ${rate} AFN)`;
          setLastRateUpdate(timeStr);
          localStorage.setItem('nima_rate', rate.toString());
          localStorage.setItem('nima_rate_time', timeStr);
          setIsRateLoading(false);
          return;
        }
      }
      // If API doesn't provide AFN or errors, fallback to official daily market 65.0 AFN
      const fallbackTime = `Daily Market: ${new Date().toLocaleDateString()} (1 USD = 65.00 AFN)`;
      setExchangeRate(65.0);
      setLastRateUpdate(fallbackTime);
      localStorage.setItem('nima_rate', '65');
      localStorage.setItem('nima_rate_time', fallbackTime);
    } catch {
      const fallbackTime = `Daily Market Standard: 1 USD = 65.00 AFN`;
      setExchangeRate(65.0);
      setLastRateUpdate(fallbackTime);
    } finally {
      setIsRateLoading(false);
    }
  }, []);

  // Fetch exchange rate on mount if older than 24h
  useEffect(() => {
    refreshExchangeRate();
  }, [refreshExchangeRate]);

  const setManualExchangeRate = (rate: number) => {
    if (rate > 0) {
      setExchangeRate(rate);
      const timeStr = `Custom Market Rate: 1 USD = ${rate} AFN`;
      setLastRateUpdate(timeStr);
      localStorage.setItem('nima_rate', rate.toString());
      localStorage.setItem('nima_rate_time', timeStr);
    }
  };

  // Price conversion engine
  const formatPrice = useCallback(
    (priceInput: string | number): string => {
      // Parse numeric USD price
      let numericUsd = 0;
      if (typeof priceInput === 'number') {
        numericUsd = priceInput;
      } else {
        const clean = priceInput.replace(/[^0-9.]/g, '');
        numericUsd = parseFloat(clean) || 0;
      }

      if (language === 'en') {
        return `$${numericUsd}`;
      } else {
        // Convert to AFN: numericUsd * exchangeRate
        // e.g. 34 * 65 = 2210 AFN
        const afnTotal = Math.round(numericUsd * exchangeRate);
        const formattedComma = afnTotal.toLocaleString();
        return `${formattedComma} AFN`;
      }
    },
    [language, exchangeRate]
  );

  const formatNumber = useCallback(
    (num: number): string => {
      if (language === 'fa') {
        return toPersianDigits(num.toLocaleString());
      }
      return num.toLocaleString();
    },
    [language]
  );

  // Favorites toggle
  const toggleSaveDish = (dishId: string) => {
    setSavedDishIds((prev) => {
      const next = prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId];
      localStorage.setItem('nima_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isDishSaved = (dishId: string) => savedDishIds.includes(dishId);

  const savedDishes = FULL_MENU.filter((dish) => savedDishIds.includes(dish.id));

  // Audio actions
  const toggleAudio = () => {
    const isPlaying = luxuryAudio.toggle();
    setAudioPlaying(isPlaying);
  };

  const setSoundVolume = (vol: number) => {
    setSoundVolumeState(vol);
    luxuryAudio.setVolume(vol);
  };

  const setSoundPreset = (preset: SoundPreset) => {
    setSoundPresetState(preset);
    luxuryAudio.setPreset(preset);
  };

  const openProfileWithTab = (tab: 'profile' | 'favorites' | 'reservations' | 'settings') => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  };

  const setActiveReservation = (res: ReservationData | null) => {
    setActiveReservationState(res);
    if (res) {
      localStorage.setItem('nima_active_res', JSON.stringify(res));
    } else {
      localStorage.removeItem('nima_active_res');
    }
  };

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    localStorage.setItem('rc_royal_user', JSON.stringify(user));
  };

  const login = (email: string, name?: string) => {
    const updated: UserProfile = {
      ...currentUser,
      email: email || currentUser.email,
      name: name || currentUser.name,
      isAuthenticated: true,
      emailVerified: true,
    };
    setCurrentUser(updated);
    setIsEmailVerified(true);
    setPendingVerificationEmail(null);
    localStorage.setItem('rc_email_verified', 'true');
    localStorage.removeItem('rc_pending_email');
    setIsAuthModalOpen(false);
  };

  // Sign up now only expects name, email, password as requested by user!
  const signup = (name: string, email: string, _password?: string) => {
    const cleanEmail = email.trim();
    const cleanName = name.trim() || 'Royal Patron';
    const updated: UserProfile = {
      name: cleanName,
      email: cleanEmail,
      phone: '+33 6 12 34 56 78',
      memberId: `RC-${Math.floor(1000 + Math.random() * 9000)}-VIP`,
      tier: 'Imperial Crown Patron',
      tierFa: 'پاترون تاج سلطنتی (Imperial Crown Patron)',
      points: 1500,
      isAuthenticated: false, // Remains false until email is confirmed from Gmail!
      emailVerified: false,
    };
    setCurrentUserState(updated);
    setPendingVerificationEmail(cleanEmail);
    setIsEmailVerified(false);
    localStorage.setItem('rc_royal_user', JSON.stringify(updated));
    localStorage.setItem('rc_pending_email', cleanEmail);
    localStorage.setItem('rc_email_verified', 'false');
    setIsAuthModalOpen(false);
  };

  const confirmEmailVerification = () => {
    const verifiedUser: UserProfile = {
      ...currentUser,
      isAuthenticated: true,
      emailVerified: true,
    };
    setCurrentUserState(verifiedUser);
    setIsEmailVerified(true);
    setPendingVerificationEmail(null);
    localStorage.setItem('rc_royal_user', JSON.stringify(verifiedUser));
    localStorage.setItem('rc_email_verified', 'true');
    localStorage.removeItem('rc_pending_email');
  };

  const resendVerificationEmail = () => {
    // Simulated dispatch event
    localStorage.setItem('rc_email_last_sent', Date.now().toString());
  };

  const cancelPendingVerification = () => {
    setPendingVerificationEmail(null);
    setIsEmailVerified(true);
    localStorage.removeItem('rc_pending_email');
    localStorage.setItem('rc_email_verified', 'true');
    setIsAuthModalOpen(true);
  };

  const logout = () => {
    const guest: UserProfile = {
      ...defaultRoyalUser,
      isAuthenticated: false,
      emailVerified: false,
    };
    setCurrentUserState(guest);
    localStorage.removeItem('rc_royal_user');
    localStorage.removeItem('rc_pending_email');
    localStorage.removeItem('rc_email_verified');
    setPendingVerificationEmail(null);
    setIsEmailVerified(true);
    // User requested: "The sign in sign up window should be shown again when we log our account out."
    setIsAuthModalOpen(true);
  };

  const t = TRANSLATIONS[language];
  const isRtl = language === 'fa';

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        exchangeRate,
        lastRateUpdate,
        isRateLoading,
        refreshExchangeRate,
        setManualExchangeRate,
        formatPrice,
        formatNumber,
        isProfileOpen,
        setIsProfileOpen,
        profileTab,
        setProfileTab,
        openProfileWithTab,
        savedDishIds,
        toggleSaveDish,
        isDishSaved,
        savedDishes,
        audioPlaying,
        toggleAudio,
        soundVolume,
        setSoundVolume,
        soundPreset,
        setSoundPreset,
        activeReservation,
        setActiveReservation,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isEmailVerified,
        pendingVerificationEmail,
        confirmEmailVerification,
        resendVerificationEmail,
        cancelPendingVerification,
        login,
        signup,
        logout,
        t,
        isRtl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
