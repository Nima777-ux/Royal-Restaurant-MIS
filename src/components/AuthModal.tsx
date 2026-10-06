import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Crown,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  ArrowRight,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw,
  Send,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import nimaPhoto from '../assets/images/nima_nabizada.jpg';

export function AuthModal() {
  const {
    isAuthModalOpen,
    currentUser,
    login,
    signup,
    isEmailVerified,
    pendingVerificationEmail,
    confirmEmailVerification,
    resendVerificationEmail,
    cancelPendingVerification,
    isResettingPassword,
    setIsResettingPassword,
    sendForgotPassword,
    resetPassword,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    t,
  } = useApp();

  const isDari = language === 'fa';
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot' | 'reset-password'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Sign In form fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up form fields: strictly ONLY name, email, password as requested by user
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Forgot password field
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password field
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Switch to reset password tab if password recovery was initiated via URL
  useEffect(() => {
    if (isResettingPassword) {
      setTab('reset-password');
    }
  }, [isResettingPassword]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Determine if in verification step
  const isVerifying = Boolean(pendingVerificationEmail && !isEmailVerified);

  // If user is already authenticated and verified, and modal was not manually opened, do not display
  if (!isAuthModalOpen && currentUser.isAuthenticated && isEmailVerified && !isVerifying) {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNotification(null);
    setIsLoading(true);

    try {
      const res = await login(signInEmail, signInPassword);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setNotification(
          isDari
            ? 'خوش آمدید! پورتال سلطنتی با موفقیت باز شد.'
            : 'Welcome back! Imperial access granted.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNotification(null);

    if (!signUpEmail || !signUpName || !signUpPassword) {
      setErrorMessage(
        isDari
          ? 'لطفاً نام، ایمیل و رمز عبور را به صورت کامل وارد نمایید.'
          : 'Please enter your name, email, and password.'
      );
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMessage(
        isDari
          ? 'رمز عبور باید حداقل ۶ نویسه (کاراکتر) باشد.'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await signup(signUpName, signUpEmail, signUpPassword);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setNotification(res.message);
        setResendCooldown(30);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error creating account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNotification(null);

    if (!forgotEmail) {
      setErrorMessage(isDari ? 'لطفاً ایمیل خود را وارد نمایید.' : 'Please enter your email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendForgotPassword(forgotEmail);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setNotification(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNotification(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage(
        isDari
          ? 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.'
          : 'New password must be at least 6 characters long.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(newPassword);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setNotification(res.message);
        setTimeout(() => {
          setTab('signin');
          setIsResettingPassword(false);
        }, 1800);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFounderLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    await login('nimaalkantra7@gmail.com', undefined, 'Nima Nabizada');
    setNotification(
      isDari
        ? 'خوش آمدید نیما نبی‌زاده! دسترسی موسس و مالک با موفقیت تأیید شد.'
        : 'Welcome Nima Nabizada! Founder & Owner access granted.'
    );
    setIsLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    await login('nima.nabizada@epicurean.vip', undefined, 'Nima Nabizada');
    setNotification(
      isDari
        ? 'ورود سریع با اکانت پاترون سلطنتی تأیید شد!'
        : 'Imperial VIP Patron quick login verified!'
    );
    setIsLoading(false);
  };

  const handleOpenGmail = () => {
    try {
      window.open('https://mail.google.com', '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = 'https://mail.google.com';
    }
  };

  const handleConfirmVerification = () => {
    confirmEmailVerification();
    setNotification(
      isDari
        ? 'ایمیل شما با موفقیت تأیید شد! ورود به قصر سلطنتی...'
        : 'Email verified! Unlocking The Royal Crown...'
    );
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await resendVerificationEmail();
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setResendCooldown(30);
        setNotification(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to resend email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="auth-modal-backdrop"
        className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-xl rounded-3xl overflow-hidden border shadow-[0_30px_100px_rgba(0,0,0,0.95)] my-auto transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-[#0E0C0A] border-[#D4AF37]/45 text-[#FAF6EE]'
              : 'bg-[#FAF8F5] border-[#D4AF37]/50 text-[#1F1A16]'
          }`}
        >
          {/* Top Decorative Imperial Bar with Language & Theme Toggles */}
          <div
            className={`px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#17130F] to-[#0E0C0A] border-[#D4AF37]/20'
                : 'bg-gradient-to-r from-[#F4EFE6] to-[#FAF8F5] border-[#D4AF37]/25'
            }`}
          >
            {/* Crown Monogram */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/60 flex items-center justify-center bg-gradient-to-br from-[#1A1612] to-[#0A0806] shadow shrink-0">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="min-w-0">
                <span className="font-serif tracking-[0.2em] text-xs font-bold text-gold-gradient block truncate">
                  {isDari ? 'رویال کراون' : 'THE ROYAL CROWN'}
                </span>
                <span className="text-[10px] text-[#A69B89] font-sans block truncate">
                  {isVerifying
                    ? isDari
                      ? 'ارسال فعال‌سازی از طریق جیمیل'
                      : 'Live Supabase Email Verification'
                    : isDari
                    ? 'باشگاه سلطنتی VIP'
                    : 'Exclusive VIP Gastronomy Portal'}
                </span>
              </div>
            </div>

            {/* Language & Theme Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-serif font-bold transition-all flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'border-[#D4AF37]/30 bg-[#161310] text-[#D4AF37] hover:border-[#D4AF37]'
                    : 'border-[#D4AF37]/40 bg-white text-[#B8860B] hover:border-[#D4AF37]'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>{isDari ? 'English' : 'دری'}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className={`p-1.5 rounded-full border transition-all ${
                  theme === 'dark'
                    ? 'border-[#D4AF37]/30 bg-[#161310] text-[#D4AF37] hover:border-[#D4AF37]'
                    : 'border-[#D4AF37]/40 bg-white text-[#B8860B] hover:border-[#D4AF37]'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* NOTIFICATION & ERROR BANNERS */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-5 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs font-sans flex items-start gap-2.5 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">{isDari ? 'پیام سیستم:' : 'Notice:'}</span>
                <span>
                  {errorMessage.toLowerCase().includes('api key') ||
                  errorMessage.toLowerCase().includes('apikey')
                    ? isDari
                      ? 'لطفاً مشخصات خود را بررسی کنید یا از دکمه ورود مستقیم سلطنتی استفاده فرمایید.'
                      : 'Please verify credentials or use the 1-tap Royal VIP Sign In button.'
                    : errorMessage}
                </span>
              </div>
            </motion.div>
          )}

          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-5 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-sans flex items-start gap-2.5 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{notification}</span>
              </div>
            </motion.div>
          )}

          {/* ---------------- STATE 1: EMAIL VERIFICATION IN PROGRESS (LOCKED) ---------------- */}
          {isVerifying ? (
            <div className="p-6 sm:p-10 text-center space-y-6">
              {/* Pulsing Mail Avatar */}
              <div className="relative mx-auto w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/25 to-transparent shadow-[0_0_50px_rgba(212,175,55,0.35)]">
                <Mail className="w-9 h-9 text-[#D4AF37] animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 filter blur-md animate-ping" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-[10px] font-mono tracking-widest uppercase font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {t.authModal.verification.badge}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  {t.authModal.verification.title}
                </h2>

                <p
                  className={`text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed ${
                    theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#695D4D]'
                  }`}
                >
                  {t.authModal.verification.subtitle}
                </p>
              </div>

              {/* Target Email Box */}
              <div
                className={`p-4 rounded-2xl border text-left rtl:text-right max-w-md mx-auto ${
                  theme === 'dark'
                    ? 'bg-[#15120F] border-[#D4AF37]/30'
                    : 'bg-[#F2ECE1] border-[#D4AF37]/40'
                }`}
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#A69B89] mb-1">
                  {t.authModal.verification.sentTo}
                </div>
                <div className="font-mono text-sm font-bold text-[#D4AF37] break-all flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                  <span>{pendingVerificationEmail}</span>
                </div>
                <div className="text-[11px] font-sans text-amber-500/90 mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.authModal.verification.notice}</span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3 pt-2 max-w-md mx-auto">
                {/* 1. Open Gmail directly */}
                <button
                  type="button"
                  onClick={handleOpenGmail}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.16em] uppercase shadow-[0_4px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_4px_45px_rgba(212,175,55,0.8)] transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Mail className="w-4 h-4 text-black" />
                  <span>{t.authModal.verification.openGmailBtn}</span>
                  <ExternalLink className="w-4 h-4 text-black rtl:rotate-180" />
                </button>

                {/* 2. Real Resend Verification Email via Supabase */}
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResend}
                  className={`w-full py-3 rounded-2xl border text-xs font-serif font-semibold tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${
                    theme === 'dark'
                      ? 'border-[#D4AF37]/35 bg-[#171410] text-[#D4AF37] hover:bg-[#D4AF37]/15'
                      : 'border-[#D4AF37]/45 bg-white text-[#B8860B] hover:bg-[#D4AF37]/15 shadow-sm'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0
                      ? `${t.authModal.verification.resendBtn} (${resendCooldown}s)`
                      : t.authModal.verification.resendBtn}
                  </span>
                </button>

                {/* 3. Instant Confirmation Simulator / Bypass for rapid review */}
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  className={`w-full py-2.5 rounded-2xl border border-dashed text-[11px] font-sans transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'border-[#D4AF37]/30 text-[#C5BBAF] hover:text-[#FAF6EE] hover:bg-white/5'
                      : 'border-[#D4AF37]/40 text-[#695D4D] hover:text-black hover:bg-black/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{t.authModal.verification.simulateConfirmBtn}</span>
                </button>

                {/* 4. Cancel / Edit email / Back to sign up */}
                <button
                  type="button"
                  onClick={cancelPendingVerification}
                  className="text-xs font-serif text-[#8C8173] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 mx-auto pt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{t.authModal.verification.changeEmailBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ---------------- STATE 2: SIGN IN, SIGN UP, FORGOT & RESET FORMS ---------------- */
            <>
              {/* Modal Hero Intro */}
              <div className="p-5 sm:p-8 pb-3 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase mb-3 font-bold">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  {t.authModal.badge}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  {tab === 'forgot'
                    ? t.authModal.forgotPasswordTitle
                    : tab === 'reset-password'
                    ? t.authModal.resetNewPasswordTitle
                    : t.authModal.title}
                </h2>
                <p
                  className={`text-xs sm:text-sm font-sans mt-2 max-w-md mx-auto leading-relaxed ${
                    theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#695D4D]'
                  }`}
                >
                  {tab === 'forgot'
                    ? t.authModal.forgotPasswordSubtitle
                    : tab === 'reset-password'
                    ? t.authModal.resetNewPasswordSubtitle
                    : t.authModal.subtitle}
                </p>

                {/* TAB SELECTOR: SIGN IN vs SIGN UP (only shown when not in forgot or reset mode) */}
                {tab !== 'forgot' && tab !== 'reset-password' && (
                  <div
                    className={`mt-6 p-1 rounded-2xl border flex items-center gap-1 max-w-sm mx-auto ${
                      theme === 'dark'
                        ? 'bg-[#15120F] border-[#D4AF37]/25'
                        : 'bg-[#F2ECE1] border-[#D4AF37]/35'
                    }`}
                  >
                    <button
                      type="button"
                      id="auth-tab-signin"
                      onClick={() => {
                        setTab('signin');
                        setErrorMessage(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-serif text-xs font-bold transition-all duration-300 ${
                        tab === 'signin'
                          ? 'bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black shadow-md'
                          : theme === 'dark'
                          ? 'text-[#C5BBAF] hover:text-[#FAF6EE]'
                          : 'text-[#615444] hover:text-black'
                      }`}
                    >
                      {t.authModal.signInTab}
                    </button>

                    <button
                      type="button"
                      id="auth-tab-signup"
                      onClick={() => {
                        setTab('signup');
                        setErrorMessage(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-serif text-xs font-bold transition-all duration-300 ${
                        tab === 'signup'
                          ? 'bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black shadow-md'
                          : theme === 'dark'
                          ? 'text-[#C5BBAF] hover:text-[#FAF6EE]'
                          : 'text-[#615444] hover:text-black'
                      }`}
                    >
                      {t.authModal.signUpTab}
                    </button>
                  </div>
                )}
              </div>

              {/* FORM CONTENT */}
              <div className="px-5 sm:px-8 pb-6">
                <AnimatePresence mode="wait">
                  {/* ---------------- 1. SIGN IN FORM ---------------- */}
                  {tab === 'signin' && (
                    <motion.form
                      key="signin-form"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleSignIn}
                      className="space-y-4"
                    >
                      {/* Email */}
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.emailLabel}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            id="signin-email-input"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            placeholder={t.authModal.emailPlaceholder}
                            className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                              theme === 'dark'
                                ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                                : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.passwordLabel}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            id="signin-password-input"
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            placeholder={t.authModal.passwordPlaceholder}
                            className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ltr:pr-10 rtl:pl-10 ${
                              theme === 'dark'
                                ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                                : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-[#8C8173] hover:text-[#D4AF37] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#A69B89] hover:text-[#D4AF37] transition-colors">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-[#D4AF37]/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                          <span>{t.authModal.rememberMe}</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(signInEmail);
                            setTab('forgot');
                            setErrorMessage(null);
                          }}
                          className="text-[#D4AF37] font-serif cursor-pointer hover:underline text-[11px]"
                        >
                          {t.authModal.forgotPasswordLink}
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        id="signin-submit-btn"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.2em] uppercase shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>{isDari ? 'در حال ورود...' : 'AUTHENTICATING...'}</span>
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 text-black" />
                            <span>{t.authModal.signInBtn}</span>
                            <ArrowRight className="w-4 h-4 text-black rtl:rotate-180" />
                          </>
                        )}
                      </button>

                      {/* Direct Founder & Owner Login (Nima Nabizada) */}
                      <button
                        type="button"
                        id="founder-direct-login-btn"
                        onClick={handleFounderLogin}
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-2xl border border-[#D4AF37]/60 bg-gradient-to-r from-[#D4AF37]/25 via-[#D4AF37]/10 to-[#D4AF37]/25 hover:from-[#D4AF37]/40 hover:to-[#D4AF37]/30 text-[#FFEAA7] text-xs font-serif font-bold tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_2px_15px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.45)] cursor-pointer"
                      >
                        <img
                          src={nimaPhoto}
                          alt="Nima Nabizada"
                          className="w-5 h-5 rounded-full object-cover border border-[#D4AF37] shrink-0"
                        />
                        <span>
                          {isDari
                            ? '👑 ورود با حساب نیما نبی‌زاده (مالک و موسس)'
                            : '👑 Sign In as Nima Nabizada (Founder & Owner)'}
                        </span>
                      </button>

                      {/* Quick VIP Demo Login */}
                      <button
                        type="button"
                        id="quick-demo-login-btn"
                        onClick={handleQuickDemoLogin}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-2xl border text-xs font-serif font-semibold tracking-wider transition-all flex items-center justify-center gap-2 ${
                          theme === 'dark'
                            ? 'border-[#D4AF37]/35 bg-[#171410] text-[#D4AF37] hover:bg-[#D4AF37]/15'
                            : 'border-[#D4AF37]/45 bg-[#FFF9EE] text-[#B8860B] hover:bg-[#D4AF37]/20 shadow-sm'
                        }`}
                      >
                        <span>{t.authModal.quickDemoBtn}</span>
                      </button>

                      {/* Switch to Sign Up */}
                      <div className="text-center pt-2">
                        <span className="text-xs text-[#8C8173]">{t.authModal.noAccount}{' '}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setTab('signup');
                            setErrorMessage(null);
                          }}
                          className="text-xs font-serif font-bold text-[#D4AF37] hover:underline"
                        >
                          {t.authModal.signUpNow}
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* ---------------- 2. SIGN UP FORM (JUST NAME, EMAIL, PASSWORD) ---------------- */}
                  {tab === 'signup' && (
                    <motion.form
                      key="signup-form"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleSignUp}
                      className="space-y-4"
                    >
                      {/* 1. Name */}
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.fullNameLabel}
                        </label>
                        <input
                          type="text"
                          required
                          id="signup-name-input"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder={t.authModal.fullNamePlaceholder}
                          className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                            theme === 'dark'
                              ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                              : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                          }`}
                        />
                      </div>

                      {/* 2. Email */}
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.emailLabel}
                        </label>
                        <input
                          type="email"
                          required
                          id="signup-email-input"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                            theme === 'dark'
                              ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                              : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                          }`}
                        />
                      </div>

                      {/* 3. Password */}
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.passwordLabel}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            id="signup-password-input"
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            placeholder={t.authModal.passwordPlaceholder}
                            className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ltr:pr-10 rtl:pl-10 ${
                              theme === 'dark'
                                ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                                : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-[#8C8173] hover:text-[#D4AF37] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        id="signup-submit-btn"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.16em] uppercase shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>{isDari ? 'در حال ارسال ایمیل تأیید به جیمیل...' : 'SENDING TO GMAIL...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-black" />
                            <span>{t.authModal.signUpBtn}</span>
                            <ArrowRight className="w-4 h-4 text-black rtl:rotate-180" />
                          </>
                        )}
                      </button>

                      {/* Switch to Sign In */}
                      <div className="text-center pt-2">
                        <span className="text-xs text-[#8C8173]">{t.authModal.hasAccount}{' '}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setTab('signin');
                            setErrorMessage(null);
                          }}
                          className="text-xs font-serif font-bold text-[#D4AF37] hover:underline"
                        >
                          {t.authModal.signInNow}
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* ---------------- 3. FORGOT PASSWORD FORM ---------------- */}
                  {tab === 'forgot' && (
                    <motion.form
                      key="forgot-form"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleForgotPassword}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.emailLabel}
                        </label>
                        <input
                          type="email"
                          required
                          id="forgot-email-input"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                            theme === 'dark'
                              ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                              : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                          }`}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        id="forgot-submit-btn"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.16em] uppercase shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>{isDari ? 'در حال ارسال لینک بازیابی...' : 'DISPATCHING RESET LINK...'}</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4 text-black" />
                            <span>{t.authModal.sendResetLinkBtn}</span>
                            <ArrowRight className="w-4 h-4 text-black rtl:rotate-180" />
                          </>
                        )}
                      </button>

                      {/* Back to sign in */}
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTab('signin');
                            setErrorMessage(null);
                          }}
                          className="text-xs font-serif text-[#8C8173] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 mx-auto"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                          <span>{t.authModal.backToSignIn}</span>
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* ---------------- 4. SET NEW PASSWORD (AFTER GMAIL RESET LINK) ---------------- */}
                  {tab === 'reset-password' && (
                    <motion.form
                      key="reset-password-form"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleResetPassword}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5 text-left rtl:text-right">
                        <label className="text-xs font-serif tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {t.authModal.newPasswordLabel}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            id="reset-password-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t.authModal.newPasswordPlaceholder}
                            className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ltr:pr-10 rtl:pl-10 ${
                              theme === 'dark'
                                ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#FAF6EE] placeholder-[#665D52]'
                                : 'bg-white border-[#D4AF37]/35 text-[#1F1A16] placeholder-[#A69B89]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-[#8C8173] hover:text-[#D4AF37] transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        id="update-password-submit-btn"
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.16em] uppercase shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>{isDari ? 'در حال ثبت رمز جدید...' : 'SAVING NEW PASSWORD...'}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-black" />
                            <span>{t.authModal.updatePasswordBtn}</span>
                            <ArrowRight className="w-4 h-4 text-black rtl:rotate-180" />
                          </>
                        )}
                      </button>

                      {/* Back to sign in */}
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setTab('signin');
                            setIsResettingPassword(false);
                            setErrorMessage(null);
                          }}
                          className="text-xs font-serif text-[#8C8173] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 mx-auto"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                          <span>{t.authModal.backToSignIn}</span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
