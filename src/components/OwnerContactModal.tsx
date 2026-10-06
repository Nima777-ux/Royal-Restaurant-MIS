import { useState, useEffect } from 'react';
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
  Linkedin,
  Github,
  Globe,
  Camera,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import defaultNimaPhoto from '../assets/images/nima_nabizada.jpg';

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
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('owner_custom_photo');
      if (saved) setCustomAvatar(saved);
    } catch {
      // Ignore local storage error
    }
  }, []);

  if (!isOpen) return null;

  const ownerInfo = {
    name: isDari ? 'نیما نبی‌زاده' : 'Nima Nabizada',
    title: isDari
      ? 'سازنده، مهندس ارشد و موسس رویال کراون'
      : 'Creator, Lead Engineer & Founder of The Royal Crown',
    email: 'nimaalkantra7@gmail.com',
    phone: '(+93797355027)',
    phoneRaw: '+93797355027',
    linkedin: 'https://www.linkedin.com/in/nima-nabizada-b14b5240b',
    github: 'https://github.com/Nima777-ux',
    portfolio: 'https://portfolio-rho-five-5gh5l9nihn.vercel.app',
    location: isDari ? 'کابل • پاریس • پورتال جهانی مهندسی' : 'Global Engineering • Paris & Kabul',
    bio: isDari
      ? 'سلام! من نیما نبی‌زاده هستم؛ طراح، توسعه‌دهنده و معمار ارشد رویال کراون. برای بررسی پروژه‌ها، همکاری‌های مهندسی یا رزروهای اختصاصی می‌توانید از طریق راه‌های ارتباطی زیر مستقیماً با من در تماس باشید.'
      : 'Hello! I am Nima Nabizada, creator and lead engineer of The Royal Crown. Welcome to this gastronomic and digital sanctuary. Connect with me directly for inquiries, engineering collaborations, or bespoke reservations.',
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ownerInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ownerInfo.phoneRaw);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomAvatar(result);
          try {
            localStorage.setItem('owner_custom_photo', result);
          } catch {
            // storage limit
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Direct mailto link fallback
    const subject = encodeURIComponent(`Message for Nima Nabizada from ${senderName || 'Visitor'}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${senderName || 'VIP Guest'}`);
    window.location.href = `mailto:${ownerInfo.email}?subject=${subject}&body=${body}`;

    setSentSuccess(true);
    setTimeout(() => {
      setMessage('');
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  const activePhoto = customAvatar || defaultNimaPhoto;

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
          className={`relative w-full max-w-xl rounded-3xl overflow-hidden border shadow-[0_30px_100px_rgba(0,0,0,0.95)] my-auto transition-colors duration-300 ${
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
              className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#FAF6EE] hover:text-[#D4AF37] hover:border-[#D4AF37] flex items-center justify-center transition-all z-20 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* VIP Crest Badge */}
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#D4AF37] uppercase font-bold px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/40 backdrop-blur-sm flex items-center gap-1.5 shadow">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                {isDari ? 'درباره من • نیما نبی‌زاده' : 'ABOUT ME • NIMA NABIZADA'}
              </span>
            </div>
          </div>

          {/* Avatar & Profile Card Overlap */}
          <div className="px-5 sm:px-7 pt-0 pb-6 relative">
            <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
              {/* Photo Avatar of Nima Nabizada (Replaces "N") */}
              <div className="relative group/avatar">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-[#D4AF37] p-1 bg-[#1A1612] shadow-[0_12px_30px_rgba(0,0,0,0.7)] overflow-hidden">
                  <img
                    src={activePhoto}
                    alt="Nima Nabizada"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <label className="text-[9px] font-mono text-[#FFEAA7] cursor-pointer flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full border border-[#D4AF37]/50">
                      <Camera className="w-3 h-3 text-[#D4AF37]" />
                      <span>{isDari ? 'تغییر عکس' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg border-2 border-[#1A1612]">
                  <ShieldCheck className="w-4 h-4 text-black" />
                </div>
              </div>

              <div className="text-right rtl:text-left space-y-1">
                <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isDari ? 'آنلاین / در دسترس' : 'Online & Available'}
                </span>
                <p className="text-[10px] font-mono text-[#A69B89]">
                  {ownerInfo.location}
                </p>
              </div>
            </div>

            {/* Name & Titles */}
            <div className="mb-4">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient">
                {ownerInfo.name}
              </h3>
              <p className="text-xs font-mono text-[#D4AF37] font-semibold mt-0.5">
                {ownerInfo.title}
              </p>
            </div>

            {/* Founder Statement */}
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-[13px] leading-relaxed font-sans mb-5 shadow-xs ${
                theme === 'dark'
                  ? 'bg-[#15120F] border-[#D4AF37]/25 text-[#D4CBBE]'
                  : 'bg-[#F4EFE6] border-[#D4AF37]/35 text-[#54483B]'
              }`}
            >
              <p className="italic">"{ownerInfo.bio}"</p>
            </div>

            {/* SOCIAL & PORTFOLIO LINKS (LinkedIn, GitHub, Portfolio) */}
            <div className="space-y-2 mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block font-bold">
                {isDari ? 'شبکه‌های اجتماعی و پورتفولیو مهندسی:' : 'OFFICIAL PORTFOLIO & PROFILES'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* LinkedIn Link */}
                <a
                  href={ownerInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#D4AF37]/30 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-serif font-bold text-[#E8EDF2] group-hover:text-white truncate">LinkedIn</div>
                      <div className="text-[9px] font-mono text-[#8C9AA6] truncate">/in/nima-nabizada</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C9AA6] group-hover:text-white shrink-0 ml-1" />
                </a>

                {/* GitHub Link */}
                <a
                  href={ownerInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#D4AF37]/30 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#24292e] text-white flex items-center justify-center shrink-0 border border-white/20 shadow-sm">
                      <Github className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-serif font-bold text-[#FAF6EE] group-hover:text-[#D4AF37] truncate">GitHub</div>
                      <div className="text-[9px] font-mono text-[#8C9AA6] truncate">@Nima777-ux</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8C9AA6] group-hover:text-white shrink-0 ml-1" />
                </a>

                {/* Portfolio Link */}
                <a
                  href={ownerInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 hover:border-[#FFEAA7] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shrink-0 shadow-sm">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-serif font-bold text-[#FFEAA7] group-hover:text-white truncate">Portfolio</div>
                      <div className="text-[9px] font-mono text-[#D4AF37] truncate">Live Vercel Site</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-white shrink-0 ml-1" />
                </a>
              </div>
            </div>

            {/* Direct Contact Action Cards */}
            <div className="space-y-2.5 mb-5">
              {/* Phone Card with (+93797355027) */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'bg-[#120F0D] border-[#D4AF37]/35 shadow-sm'
                    : 'bg-white border-[#D4AF37]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997922] text-black flex items-center justify-center shrink-0 shadow">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#A69B89] block">
                      {isDari ? 'شماره تماس مستقیم و واتساپ' : 'Direct Phone Number / WhatsApp'}
                    </span>
                    <a
                      href={`tel:${ownerInfo.phoneRaw}`}
                      dir="ltr"
                      className="font-mono text-sm sm:text-base font-bold text-[#D4AF37] hover:underline truncate block"
                    >
                      {ownerInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyPhone}
                    className="px-2.5 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`https://wa.me/93797355027`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1 shadow"
                    title="WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${ownerInfo.phoneRaw}`}
                    className="p-2 rounded-xl bg-[#D4AF37] text-black text-xs font-mono hover:bg-[#FFEAA7] transition-all"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  theme === 'dark'
                    ? 'bg-[#120F0D] border-[#D4AF37]/35 shadow-sm'
                    : 'bg-white border-[#D4AF37]/40 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#A69B89] block">
                      {isDari ? 'ایمیل مستقیم نیما نبی‌زاده' : 'Direct Email Address'}
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
                    className="px-2.5 py-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono flex items-center gap-1 transition-all cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedEmail ? 'Copied' : 'Copy'}</span>
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
            </div>

            {/* Quick Interactive Direct Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#A69B89] flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                  <span>{isDari ? 'ارسال پیام مستقیم به نیما نبی‌زاده' : 'Send Quick Note to Nima Nabizada'}</span>
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
                      ? 'پیام خود را بنویسید (مثلاً پیشنهاد پروژه یا هماهنگی رزرو)...'
                      : 'Type your message (e.g. project collaboration or VIP booking)...'
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
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all shrink-0 active:scale-95 cursor-pointer"
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
