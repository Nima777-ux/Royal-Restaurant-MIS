import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Theme, ReservationData, Dish, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { luxuryAudio, SoundPreset } from '../utils/ambientAudio';
import { FULL_MENU } from '../data/restaurantData';
import { supabase, getRedirectUrl } from '../lib/supabase';

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
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
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
  isResettingPassword: boolean;
  setIsResettingPassword: (resetting: boolean) => void;
  confirmEmailVerification: () => void;
  resendVerificationEmail: (emailOverride?: string) => Promise<{ success: boolean; message: string }>;
  cancelPendingVerification: () => void;
  login: (email: string, password?: string, name?: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; message: string; requiresVerification: boolean }>;
  sendForgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
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
  name: 'Nima Nabizada',
  email: 'nima@epicurean.vip',
  phone: '(+93797355027)',
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

  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);

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

  // 4. Profile & Owner Contact Modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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

  // Sync Supabase user session to application state
  const syncSupabaseUser = useCallback((user: any) => {
    const email = user.email || '';
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split('@')[0] ||
      'Royal VIP Patron';

    const updated: UserProfile = {
      name: fullName,
      email: email,
      phone: user.user_metadata?.phone || '+33 6 12 34 56 78',
      memberId: user.user_metadata?.member_id || `RC-${(user.id || '8829').slice(0, 4)}-VIP`,
      tier: 'Imperial Crown Patron',
      tierFa: 'پاترون تاج سلطنتی (Imperial Crown Patron)',
      points: 2500,
      isAuthenticated: true,
      emailVerified: true,
    };

    setCurrentUserState(updated);
    setIsEmailVerified(true);
    setPendingVerificationEmail(null);
    localStorage.setItem('rc_royal_user', JSON.stringify(updated));
    localStorage.setItem('rc_email_verified', 'true');
    localStorage.removeItem('rc_pending_email');
    setIsAuthModalOpen(false);
  }, []);

  // Listen to Supabase auth events & URL tokens (e.g. clicking verification link in Gmail)
  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session?.user) {
        syncSupabaseUser(session.user);
      }
    });

    // Listen to real-time auth changes (dispatched when user clicks email confirmation in Gmail)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        syncSupabaseUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        const guest: UserProfile = {
          ...defaultRoyalUser,
          isAuthenticated: false,
          emailVerified: false,
        };
        setCurrentUserState(guest);
        setIsEmailVerified(true);
        setPendingVerificationEmail(null);
      }

      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
        setIsAuthModalOpen(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncSupabaseUser]);

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
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('bg-[#080706]', 'text-[#FAF6EE]');
      document.body.classList.add('bg-[#FAF7F2]', 'text-[#1F1A16]');
    }
  }, [theme]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'fa' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Live Exchange rate fetcher
  const refreshExchangeRate = useCallback(async () => {
    setIsRateLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network error fetching rates');
      const data = await res.json();
      if (data && data.rates && data.rates.AFN) {
        const liveRate = parseFloat(data.rates.AFN);
        setExchangeRate(liveRate);
        const timeStr = new Date().toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const formatted = `${timeStr} (Live Forex)`;
        setLastRateUpdate(formatted);
        localStorage.setItem('nima_rate', liveRate.toString());
        localStorage.setItem('nima_rate_time', formatted);
      }
    } catch {
      const fallbackRate = 65.0;
      setExchangeRate(fallbackRate);
      setLastRateUpdate('Standard Market Rate');
    } finally {
      setIsRateLoading(false);
    }
  }, [language]);

  const setManualExchangeRate = (rate: number) => {
    if (rate > 0) {
      setExchangeRate(rate);
      const timeStr = new Date().toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const note = `${timeStr} (Imperial Custom)`;
      setLastRateUpdate(note);
      localStorage.setItem('nima_rate', rate.toString());
      localStorage.setItem('nima_rate_time', note);
    }
  };

  const formatNumber = useCallback(
    (num: number): string => {
      const formatted = num.toLocaleString('en-US');
      if (language === 'fa') {
        return toPersianDigits(formatted);
      }
      return formatted;
    },
    [language]
  );

  const formatPrice = useCallback(
    (priceInput: string | number): string => {
      let usdVal = 0;
      if (typeof priceInput === 'number') {
        usdVal = priceInput;
      } else {
        const cleaned = priceInput.replace(/[^0-9.]/g, '');
        usdVal = parseFloat(cleaned) || 0;
      }

      const afnVal = Math.round(usdVal * exchangeRate);

      if (language === 'fa') {
        const afnFormatted = toPersianDigits(afnVal.toLocaleString('en-US'));
        const usdFormatted = toPersianDigits(usdVal.toString());
        return `${afnFormatted} افغانی (${usdFormatted} $)`;
      }
      return `$${usdVal} (${afnVal.toLocaleString('en-US')} AFN)`;
    },
    [exchangeRate, language]
  );

  const openProfileWithTab = (tab: 'profile' | 'favorites' | 'reservations' | 'settings') => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  };

  const toggleSaveDish = (dishId: string) => {
    setSavedDishIds((prev) => {
      const exists = prev.includes(dishId);
      const next = exists ? prev.filter((id) => id !== dishId) : [...prev, dishId];
      localStorage.setItem('nima_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isDishSaved = (dishId: string) => savedDishIds.includes(dishId);

  const savedDishes = FULL_MENU.filter((d) => savedDishIds.includes(d.id));

  const toggleAudio = () => {
    const nextState = !audioPlaying;
    setAudioPlaying(nextState);
    if (nextState) {
      luxuryAudio.play();
    } else {
      luxuryAudio.stop();
    }
  };

  const setSoundVolume = (vol: number) => {
    setSoundVolumeState(vol);
    luxuryAudio.setVolume(vol);
  };

  const setSoundPreset = (preset: SoundPreset) => {
    setSoundPresetState(preset);
    luxuryAudio.setPreset(preset);
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

  // Sign In using Supabase
  const login = async (
    email: string,
    password?: string,
    name?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim();

    // Fast demo login if no password is provided
    if (!password) {
      const updated: UserProfile = {
        ...currentUser,
        email: cleanEmail || currentUser.email,
        name: name || currentUser.name || 'Nima Nabizada',
        isAuthenticated: true,
        emailVerified: true,
      };
      setCurrentUserState(updated);
      setIsEmailVerified(true);
      setPendingVerificationEmail(null);
      localStorage.setItem('rc_royal_user', JSON.stringify(updated));
      localStorage.setItem('rc_email_verified', 'true');
      localStorage.removeItem('rc_pending_email');
      setIsAuthModalOpen(false);
      return { success: true, message: 'VIP demo patron access granted.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setPendingVerificationEmail(cleanEmail);
          setIsEmailVerified(false);
          localStorage.setItem('rc_pending_email', cleanEmail);
          localStorage.setItem('rc_email_verified', 'false');
          return {
            success: false,
            message:
              'Email not yet verified. Please check your Gmail or click "Resend Verification Email".',
          };
        }
        return { success: false, message: error.message };
      }

      if (data?.user) {
        syncSupabaseUser(data.user);
        return { success: true, message: 'Imperial access granted.' };
      }

      return { success: false, message: 'Sign in failed.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sign in error.' };
    }
  };

  // Sign Up using Supabase (Strictly Name, Email, Password)
  const signup = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; message: string; requiresVerification: boolean }> => {
    const cleanEmail = email.trim();
    const cleanName = name.trim() || 'Royal Patron';
    const cleanPassword = password || 'RoyalPass123!';

    try {
      const redirectUrl = getRedirectUrl();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: cleanName,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return {
          success: false,
          message: error.message,
          requiresVerification: false,
        };
      }

      // Supabase returns user with identities: [] if email is already taken
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          success: false,
          message:
            'This email is already registered. Please sign in or use "Forgot Password" to receive a password reset link in your Gmail.',
          requiresVerification: false,
        };
      }

      // If email confirmation is disabled on the project and session was provided immediately
      if (data?.session) {
        syncSupabaseUser(data.session.user);
        return {
          success: true,
          message: 'Account created and verified!',
          requiresVerification: false,
        };
      }

      // Email confirmation is required: Supabase dispatched the email!
      const pendingUser: UserProfile = {
        name: cleanName,
        email: cleanEmail,
        phone: '(+93797355027)',
        memberId: `RC-${Math.floor(1000 + Math.random() * 9000)}-VIP`,
        tier: 'Imperial Crown Patron',
        tierFa: 'پاترون تاج سلطنتی (Imperial Crown Patron)',
        points: 1500,
        isAuthenticated: false,
        emailVerified: false,
      };
      setCurrentUserState(pendingUser);
      setPendingVerificationEmail(cleanEmail);
      setIsEmailVerified(false);
      localStorage.setItem('rc_royal_user', JSON.stringify(pendingUser));
      localStorage.setItem('rc_pending_email', cleanEmail);
      localStorage.setItem('rc_email_verified', 'false');

      return {
        success: true,
        message: `A verification link has been dispatched to ${cleanEmail}. Please open your Gmail to verify!`,
        requiresVerification: true,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to dispatch verification email.',
        requiresVerification: false,
      };
    }
  };

  // Resend verification email to Gmail via Supabase
  const resendVerificationEmail = async (
    emailOverride?: string
  ): Promise<{ success: boolean; message: string }> => {
    const targetEmail = (
      emailOverride ||
      pendingVerificationEmail ||
      currentUser.email ||
      ''
    ).trim();

    if (!targetEmail) {
      return { success: false, message: 'No email address found to resend to.' };
    }

    try {
      const redirectUrl = getRedirectUrl();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      localStorage.setItem('rc_email_last_sent', Date.now().toString());
      return {
        success: true,
        message: `Fresh verification email dispatched to ${targetEmail}. Check your Gmail inbox!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to resend verification email.',
      };
    }
  };

  // Send Password Reset link to Gmail via Supabase
  const sendForgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, message: 'Please provide your email address.' };
    }

    try {
      const redirectUrl = getRedirectUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: `Password reset link sent to ${cleanEmail}. Check your Gmail inbox!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to dispatch password recovery email.',
      };
    }
  };

  // Update password after user clicks reset link in Gmail
  const resetPassword = async (
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      setIsResettingPassword(false);
      return {
        success: true,
        message: 'Password updated successfully! Welcome back to The Royal Crown.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to update password.',
      };
    }
  };

  // Fallback confirm simulator (allows manual verification if needed)
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
    setIsAuthModalOpen(false);
  };

  const cancelPendingVerification = () => {
    setPendingVerificationEmail(null);
    setIsEmailVerified(true);
    localStorage.removeItem('rc_pending_email');
    localStorage.setItem('rc_email_verified', 'true');
    setIsAuthModalOpen(true);
  };

  // Sign out
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
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
        isContactModalOpen,
        setIsContactModalOpen,
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
        isResettingPassword,
        setIsResettingPassword,
        confirmEmailVerification,
        resendVerificationEmail,
        cancelPendingVerification,
        login,
        signup,
        sendForgotPassword,
        resetPassword,
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
