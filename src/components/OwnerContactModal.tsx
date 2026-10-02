import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Phone,
  Crown,
  Sparkles,
  Check,
  Copy,
  Send,
  MapPin,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface OwnerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OwnerContactModal({ isOpen, onClose }: OwnerContactModalProps) {
  const { theme, language } = useApp();
  const isDari = language === 'fa';

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const ownerInfo = {
    name: isDari ? 'لرد نیما الکانترا' : 'Lord Nima Al-Kantara',
    title: isDari
      ? 'موسس، مدیر و مالک عالی‌مقام قصر سلطنتی رویال کراون'
      : 'Founder, Grand Patron & Creator of The Royal Crown',
    email: 'nimaalkantra7@gmail.com',
    phone: '+33 6 12 34 56 78',
    location: isDari ? 'پاریس • لندن • کابل (پورتال جهانی)' : 'Paris • London • Global Concierge',
    bio: isDari
      ? 'خوش آمدید. من نیما هستم، سازنده و معمار این پناهگاه باشکوه غذایی سه ستاره میشلن. برای هرگونه هماهنگی رزرو خصوصی، همکاری‌های دیپلماتیک یا پرسش مستقیم با من در تماس باشید.'
      : 'Welcome to The Royal Crown. I am Nima, founder and architect of this private three-Michelin-star gastronomic sanctuary. Reach out directly for private salon reservations, bespoke degustation inquiries, or direct patron requests.',
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ownerInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ownerInfo.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Direct mailto link fallback
    const subject = encodeURIComponent(`VIP Inquiry from ${senderName || 'Distinguished Patron'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${senderName || 'VIP Guest'}`);
    window.location.href = `mailto:${ownerInfo.email}?subject=${subject}&body=${body}`;

    setSentSuccess(true);
    setTimeout(() => {
      setMessage('');
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div
        id="owner-contact-modal-backdrop"
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-lg rounded-3xl overflow-hidden border shadow-[0_30px_100px_rgba(0,0,0,0.95)] my-auto transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-[#0E0C0A] border-[#D4AF37]/45 text-[#FAF6EE]'
              : 'bg-[#FAF8F5] border-[#D4AF37]/50 text-[#1F1A16]'
          }`}
        >
          {/* Header Ambient Banner */}
          <div className="relative h-28 sm:h-32 bg-gradient-to-r from-[#1E1812] via-[#2A2015] to-[#120F0D] border-b border-[#D4AF37]/25 overflow-hidden flex items-end p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#FAF6EE] hover:text-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center transition-all z-20"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* VIP Crest Badge */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/40 backdrop-blur-sm flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-[#D4AF37]" />
                {isDari ? 'پروفایل مدیر و مالک قصر' : 'DIRECT FOUNDER CONTACT'}
              </span>
            </div>
          </div>

          {/* Avatar & Profile Card Overlap */}
          <div className="px-5 sm:px-7 pt-0 pb-6 relative">
            <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#D4AF37] p-1 bg-[#1A1612] shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#2D2419] to-[#0A0806] flex items-center justify-center border border-[#D4AF37]/40">
                  <span className="font-serif text-3xl font-extrabold text-gold-gradient">N</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                </div>
              </div>

              <div className="text-right rtl:text-left">
                <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isDari ? 'آنلاین / در دسترس' : 'Online & Available'}
                </span>
              </div>
            </div>

            {/* Name & Titles */}
            <div className="mb-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-gradient">
                {ownerInfo.name}
              </h3>
              <p className="text-xs font-mono text-[#D4AF37] font-semibold mt-0.5">
                {ownerInfo.title}
              </p>
              <p className="text-[11px] text-[#A69B89] flex items-center gap-1.5 mt-1 font-sans">
                <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                <span>{ownerInfo.location}</span>
              </p>
            </div>

            {/* Founder Statement */}
            <div
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed font-sans mb-5 ${
                theme === 'dark'
                  ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#D4CBBE]'
                  : 'bg-[#F4EFE6] border-[#D4AF37]/35 text-[#54483B]'
              }`}
            >
              <p className="font-editorial italic text-sm">{ownerInfo.bio}</p>
            </div>

            {/* Direct Contact Action Cards */}
            <div className="space-y-2.5 mb-5">
              {/* Email Card */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'bg-[#120F0D] border-[#D4AF37]/30'
                    : 'bg-white border-[#D4AF37]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#A69B89] block">
                      {isDari ? 'ایمیل مستقیم نیما' : 'Direct Email Address'}
                    </span>
                    <a
                      href={`mailto:${ownerInfo.email}`}
                      className="font-mono text-xs sm:text-sm font-semibold text-[#D4AF37] hover:underline truncate block"
                    >
                      {ownerInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono flex items-center gap-1 transition-all"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline text-[10px]">{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`mailto:${ownerInfo.email}`}
                    className="p-2 rounded-xl bg-[#D4AF37] text-black text-xs font-mono hover:bg-[#FFEAA7] transition-all"
                    title="Open Mail"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'bg-[#120F0D] border-[#D4AF37]/30'
                    : 'bg-white border-[#D4AF37]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#A69B89] block">
                      {isDari ? 'شماره تماس مستقیم و واتساپ' : 'Direct VIP Telephone / WhatsApp'}
                    </span>
                    <a
                      href={`tel:${ownerInfo.phone}`}
                      dir="ltr"
                      className="font-mono text-xs sm:text-sm font-semibold text-[#D4AF37] hover:underline truncate block"
                    >
                      {ownerInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono flex items-center gap-1 transition-all"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline text-[10px]">{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`tel:${ownerInfo.phone}`}
                    className="p-2 rounded-xl bg-[#D4AF37] text-black text-xs font-mono hover:bg-[#FFEAA7] transition-all"
                    title="Call Line"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Interactive Direct Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#A69B89] flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                  <span>{isDari ? 'ارسال پیام مستقیم به نیما' : 'Send Quick Note to Lord Nima'}</span>
                </label>
                {sentSuccess && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {isDari ? 'پیام هدایت شد!' : 'Opening mail client!'}
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder={isDari ? 'نام شما (اختیاری)' : 'Your Name (optional)'}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#D4AF37] ${
                  theme === 'dark'
                    ? 'bg-[#14110E] border-[#D4AF37]/30 text-[#FAF6EE]'
                    : 'bg-white border-[#D4AF37]/40 text-[#1F1A16]'
                }`}
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={
                    isDari
                      ? 'پیام خود را بنویسید (مثلاً هماهنگی رزرو خاص)...'
                      : 'Type your message (e.g. VIP seating inquiry)...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#D4AF37] ${
                    theme === 'dark'
                      ? 'bg-[#14110E] border-[#D4AF37]/30 text-[#FAF6EE]'
                      : 'bg-white border-[#D4AF37]/40 text-[#1F1A16]'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all shrink-0 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isDari ? 'ارسال' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
