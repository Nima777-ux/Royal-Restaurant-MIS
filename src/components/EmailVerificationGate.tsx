import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Crown,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ArrowLeft,
  Globe,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function EmailVerificationGate() {
  const {
    isEmailVerified,
    pendingVerificationEmail,
    confirmEmailVerification,
    resendVerificationEmail,
    cancelPendingVerification,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
  } = useApp();

  const isDari = language === 'fa';
  const [isSimulatingGmail, setIsSimulatingGmail] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // If email is verified or no pending verification, don't show the gate
  if (isEmailVerified || !pendingVerificationEmail) {
    return null;
  }

  const handleSimulateGmailConfirm = () => {
    setIsSimulatingGmail(true);
    setTimeout(() => {
      confirmEmailVerification();
      setIsSimulatingGmail(false);
    }, 1200);
  };

  const handleResend = () => {
    resendVerificationEmail();
    setResendStatus(
      isDari
        ? 'لینک جدید تأیید به صندوق ورودی جیمیل شما ارسال شد.'
        : 'Fresh verification link dispatched to your Gmail inbox.'
    );
    setTimeout(() => setResendStatus(null), 3500);
  };

  return (
    <AnimatePresence>
      <div
        id="email-verification-gate"
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-3xl overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 25 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-lg rounded-3xl overflow-hidden border shadow-[0_30px_100px_rgba(0,0,0,0.95)] my-auto transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-[#0E0C0A] border-[#D4AF37]/50 text-[#FAF6EE]'
              : 'bg-[#FAF8F5] border-[#D4AF37]/50 text-[#1F1A16]'
          }`}
        >
          {/* Top Decorative Header */}
          <div
            className={`px-6 py-4 flex items-center justify-between border-b ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#17130F] to-[#0E0C0A] border-[#D4AF37]/25'
                : 'bg-gradient-to-r from-[#F4EFE6] to-[#FAF8F5] border-[#D4AF37]/25'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37]/60 flex items-center justify-center bg-gradient-to-br from-[#1A1612] to-[#0A0806] shadow">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="font-serif tracking-[0.2em] text-xs font-bold text-gold-gradient">
                {isDari ? 'تأیید هویت شاهانه' : 'ROYAL VERIFICATION'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-serif font-bold transition-all flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'border-[#D4AF37]/30 bg-[#161310] text-[#D4AF37]'
                    : 'border-[#D4AF37]/40 bg-white text-[#B8860B]'
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
                    ? 'border-[#D4AF37]/30 bg-[#161310] text-[#D4AF37]'
                    : 'border-[#D4AF37]/40 bg-white text-[#B8860B]'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Gate Content */}
          <div className="p-6 sm:p-10 text-center space-y-6">
            {/* Animated Pulsing Mail Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-transparent shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <Mail className="w-9 h-9 text-[#D4AF37] animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 filter blur-md animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-[10px] font-mono tracking-widest uppercase font-bold">
                <ShieldAlert className="w-3 h-3" />
                {isDari ? 'دسترسی قفل است • نیازمند تأیید جیمیل' : 'System Locked • Gmail Confirmation Required'}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                {isDari ? 'ایمیل تأیید ارسال گردید' : 'Confirm Your Royal Email'}
              </h2>

              <p
                className={`text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed ${
                  theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#615444]'
                }`}
              >
                {isDari
                  ? 'یک ایمیل حاوی لینک فعال‌سازی به آدرس زیر ارسال شد. تا زمان تأیید ایمیل در جیمیل، دسترسی به صفحات قصر مسدود است:'
                  : 'A royal activation link has been sent to your email. The dining hall will remain locked until confirmed from your Gmail inbox:'}
              </p>
            </div>

            {/* Email Address Highlight Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 font-mono text-sm font-bold text-[#D4AF37] shadow-inner max-w-full break-all">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{pendingVerificationEmail}</span>
            </div>

            {/* Resend notification */}
            {resendStatus && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-serif text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{resendStatus}</span>
              </motion.div>
            )}

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              {/* 1. Simulator Button: Confirm from Gmail */}
              <button
                type="button"
                disabled={isSimulatingGmail}
                onClick={handleSimulateGmailConfirm}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.2em] uppercase shadow-[0_4px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_4px_45px_rgba(212,175,55,0.8)] transition-all flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-70"
              >
                {isSimulatingGmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>{isDari ? 'در حال تأیید لینک جیمیل...' : 'Verifying Gmail Link...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>
                      {isDari
                        ? 'تأیید حساب کاربری از طریق جیمیل (شبیه‌ساز)'
                        : 'Confirm Account from Gmail (Simulate Link)'}
                    </span>
                    <ExternalLink className="w-4 h-4 text-black rtl:rotate-180" />
                  </>
                )}
              </button>

              {/* 2. Resend Link button */}
              <button
                type="button"
                onClick={handleResend}
                className={`w-full py-3 rounded-2xl border text-xs font-serif font-semibold transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'border-[#D4AF37]/35 bg-[#171410] text-[#D4AF37] hover:bg-[#D4AF37]/15'
                    : 'border-[#D4AF37]/45 bg-white text-[#B8860B] hover:bg-[#D4AF37]/15 shadow-sm'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isDari ? 'ارسال مجدد ایمیل به جیمیل' : 'Resend Verification Email'}</span>
              </button>

              {/* 3. Cancel / Change email / Back to sign in */}
              <button
                type="button"
                onClick={cancelPendingVerification}
                className="text-xs font-serif text-[#8C8173] hover:text-[#D4AF37] transition-colors flex items-center justify-center gap-1.5 mx-auto pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{isDari ? 'تغییر ایمیل / بازگشت به ورود' : 'Change Email / Back to Sign In'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
