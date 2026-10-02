import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, Users, CheckCircle2, User, Crown, ShieldCheck, Edit3 } from 'lucide-react';
import { ReservationData, CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface ReservationSectionProps {
  setCursorMode: (mode: CursorMode) => void;
  preselectedDish?: string;
}

interface SaloonOption {
  id: 'Chef’s Counter' | 'Atrium' | 'Private Mezzanine' | 'Terrace';
  value: 'Chef\'s Counter' | 'Atrium' | 'Private Mezzanine' | 'Terrace';
  labelEn: string;
  labelFa: string;
  badgeEn: string;
  badgeFa: string;
}

export function ReservationSection({ setCursorMode, preselectedDish }: ReservationSectionProps) {
  const { t, formatPrice, language, theme, setActiveReservation, openProfileWithTab, currentUser } = useApp();
  const isDari = language === 'fa';
  const [isEditingContact, setIsEditingContact] = useState(false);

  const saloonOptions: SaloonOption[] = [
    {
      id: 'Chef’s Counter',
      value: "Chef's Counter",
      labelEn: "Chef's Counter (Front-Row Live Pass)",
      labelFa: "پیشخوان سرآشپز سلطنتی (Chef’s Counter - نمای زنده)",
      badgeEn: 'Front Row',
      badgeFa: 'نمای زنده',
    },
    {
      id: 'Atrium',
      value: 'Atrium',
      labelEn: 'Royal Crystal Atrium (Grand Palace Floor)',
      labelFa: 'تالار بزرگ آتریوم شیشه‌ای (Royal Atrium - فضای اصلی)',
      badgeEn: 'Grand Hall',
      badgeFa: 'تالار اصلی',
    },
    {
      id: 'Private Mezzanine',
      value: 'Private Mezzanine',
      labelEn: 'Private Imperial Mezzanine (VIP Balcony View)',
      labelFa: 'بالکن مزانین اختصاصی VIP (Private Mezzanine)',
      badgeEn: 'Private VIP',
      badgeFa: 'مزانین اختصاصی',
    },
    {
      id: 'Terrace',
      value: 'Terrace',
      labelEn: 'Imperial Moonlit Garden Terrace',
      labelFa: 'تراس مهتابی باغ سلطنتی (Garden Terrace)',
      badgeEn: 'Open Air',
      badgeFa: 'تراس روباز',
    },
  ];

  const getSaloonLabel = (value: string) => {
    const found = saloonOptions.find((s) => s.value === value || s.id === value);
    if (!found) return value;
    return isDari ? found.labelFa : found.labelEn;
  };

  const [formData, setFormData] = useState<ReservationData>(() => ({
    date: '2026-10-15',
    time: '20:00',
    guests: 2,
    seatingArea: "Chef's Counter",
    name: currentUser?.name || 'Lord Nima Al-Kantara',
    email: currentUser?.email || 'nimaalkantra7@gmail.com',
    phone: currentUser?.phone || '+33 6 12 34 56 78',
    dietaryNotes: preselectedDish ? `Specially requesting: ${preselectedDish}` : '',
  }));

  const [confirmedBooking, setConfirmedBooking] = useState<ReservationData | null>(null);

  // Sync user updates if logged in
  useEffect(() => {
    if (currentUser.isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (preselectedDish) {
      setFormData((prev) => ({
        ...prev,
        dietaryNotes: `Specially requesting: ${preselectedDish}`,
      }));
    }
  }, [preselectedDish]);

  const timeSlots = ['18:00', '18:45', '19:30', '20:15', '21:00', '21:45'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookingRef = `RC-${Math.floor(1000 + Math.random() * 9000)}-VIP`;
    const booking = {
      ...formData,
      bookingRef,
    };
    setConfirmedBooking(booking);
    setActiveReservation(booking);
  };

  // Fixed per guest course rate is $180 (converted dynamically into USD or AFN based on market rate)
  // Total is strictly calculated for the entire desk (all guests combined):
  const totalDeskPriceUsd = 180 * formData.guests;
  const estimatedTotal = formatPrice(totalDeskPriceUsd);

  return (
    <section
      id="reservation"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-28 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.reservation.badge}
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {t.reservation.title}
          </h2>
          <p className="text-sm sm:text-base font-sans text-[#A69B89] max-w-xl mx-auto leading-relaxed">
            {t.reservation.subtitle}
          </p>
        </div>

        {/* BOOKING FORM OR CONFIRMATION */}
        <AnimatePresence mode="wait">
          {!confirmedBooking ? (
            <motion.form
              key="booking-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              onSubmit={handleSubmit}
              className={`p-6 sm:p-10 rounded-3xl border shadow-xl space-y-8 backdrop-blur-md ${
                theme === 'dark'
                  ? 'bg-[#120F0D]/90 border-[#D4AF37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
                  : 'bg-white/95 border-[#D4AF37]/45 shadow-[0_20px_60px_rgba(0,0,0,0.06)]'
              }`}
            >
              {/* STEP 1: PARTY SIZE, DATE & SALOON SELECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.reservation.guests}
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                      theme === 'dark'
                        ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                        : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                    }`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {isDari ? 'مهمان سلطنتی' : num === 1 ? 'Royal Guest' : 'Royal Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.reservation.date}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                      theme === 'dark'
                        ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                        : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                    }`}
                  />
                </div>

                {/* Seating Saloon */}
                <div className="space-y-2">
                  <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.reservation.area}
                  </label>
                  <select
                    value={formData.seatingArea}
                    onChange={(e) =>
                      setFormData({ ...formData, seatingArea: e.target.value as ReservationData['seatingArea'] })
                    }
                    className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                      theme === 'dark'
                        ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                        : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                    }`}
                  >
                    {saloonOptions.map((saloon) => (
                      <option key={saloon.value} value={saloon.value}>
                        {isDari ? saloon.labelFa : saloon.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STEP 2: TIME SLOTS */}
              <div className="space-y-3">
                <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {t.reservation.time}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = formData.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={`py-3 rounded-2xl border text-xs font-mono tracking-wider font-bold transition-all ${
                          isSelected
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg scale-102'
                            : theme === 'dark'
                            ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#C5BBAF] hover:border-[#D4AF37]'
                            : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#5E5244] hover:border-[#D4AF37]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: CONTACT INFORMATION */}
              <div className="pt-4 border-t border-[#D4AF37]/15">
                {currentUser.isAuthenticated ? (
                  /* AUTHENTICATED USER: NO NEED TO ENTER EMAIL & DETAILS AGAIN */
                  <div
                    className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                      theme === 'dark'
                        ? 'bg-[#171410] border-[#D4AF37]/45 text-[#FAF6EE]'
                        : 'bg-[#F9F5EE] border-[#D4AF37]/50 text-[#1F1A16]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-xs sm:text-sm tracking-wider text-gold-gradient block">
                            {isDari ? 'پاترون سلطنتی تأیید شده' : 'AUTHENTICATED ROYAL PATRON'}
                          </span>
                          <span className="text-[10px] text-[#A69B89] font-mono block">
                            {currentUser.memberId || 'RC-VIP-MEMBER'}
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDari ? 'اتصال خودکار به حساب کاربری' : 'Auto-Linked to Logged-in Account'}</span>
                      </div>
                    </div>

                    {/* Pre-filled Account Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 text-left rtl:text-right">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#A69B89] uppercase block font-semibold mb-0.5">
                          {t.reservation.name}
                        </span>
                        <p className="font-serif text-sm font-bold truncate">
                          {formData.name || currentUser.name}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#A69B89] uppercase block font-semibold mb-0.5">
                          {t.reservation.email}
                        </span>
                        <p className="font-mono text-xs sm:text-sm text-[#D4AF37] font-semibold break-all truncate">
                          {formData.email || currentUser.email}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#A69B89] uppercase block font-semibold mb-0.5">
                          {t.reservation.phone}
                        </span>
                        <p className="font-mono text-xs sm:text-sm truncate">
                          {formData.phone || currentUser.phone || '+33 6 12 34 56 78'}
                        </p>
                      </div>
                    </div>

                    {/* Optional Toggle to Edit details for this specific booking */}
                    <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-[#D4AF37]/15">
                      <span className="text-[11px] text-[#8C8173]">
                        {isDari
                          ? 'اطلاعات شما به صورت خودکار برای تأیید رزرو بارگذاری شد.'
                          : 'Your verified VIP credentials are automatically applied. No re-entry required.'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingContact(!isEditingContact)}
                        className="text-[#D4AF37] hover:underline font-serif text-[11px] flex items-center gap-1 font-semibold"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditingContact ? (isDari ? 'بستن ویرایش' : 'Close edit') : (isDari ? 'تغییر برای این رزرو' : 'Edit for this booking')}</span>
                      </button>
                    </div>

                    {/* Inline editor only if user explicitly requested to edit */}
                    {isEditingContact && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-3 border-t border-[#D4AF37]/20"
                      >
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#A69B89] block mb-1">{t.reservation.name}</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/30 text-xs bg-black/20 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#A69B89] block mb-1">{t.reservation.email}</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/30 text-xs bg-black/20 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-[#A69B89] block mb-1">{t.reservation.phone}</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/30 text-xs bg-black/20 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  /* GUEST INPUTS */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase block font-semibold">
                        {t.reservation.name}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                          theme === 'dark'
                            ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                            : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase block font-semibold">
                        {t.reservation.email}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                          theme === 'dark'
                            ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                            : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase block font-semibold">
                        {t.reservation.phone}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                          theme === 'dark'
                            ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                            : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dietary Notes */}
              <div className="space-y-2">
                <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase block font-semibold">
                  {t.reservation.notes}
                </label>
                <textarea
                  rows={2}
                  value={formData.dietaryNotes}
                  onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                  placeholder={
                    isDari
                      ? 'ملاحظات غذایی، حساسیت‌ها، سالگرد یا درخواست میز خاص...'
                      : 'Allergies, anniversary, or preferred seating notes...'
                  }
                  className={`w-full px-4 py-3 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                    theme === 'dark'
                      ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                      : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                  }`}
                />
              </div>

              {/* ESTIMATE BANNER (STRICTLY TOTAL FOR THE WHOLE DESK RESERVED) */}
              <div
                className={`p-5 sm:p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  theme === 'dark'
                    ? 'bg-[#181410] border-[#D4AF37]/35 shadow-inner'
                    : 'bg-[#FAF7F2] border-[#D4AF37]/45 shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-serif text-[#D4AF37] font-bold text-sm tracking-wide">
                      {t.reservation.deskTotalEstimate}:
                    </span>
                  </div>
                  <p className="text-xs font-sans leading-relaxed text-[#8F8474]">
                    {isDari
                      ? `هزینه کامل برای کل میز اختصاصی (${formData.guests} صندلی مهمان) • دربرگیرنده تمامی ۷ مرحله منوی دگوستاسیون، نوشیدنی‌های خاص و تشریفات درباری`
                      : `Total estimated cost for the whole reserved desk (${formData.guests} guests) • Inclusive of 7-course degustation, wine pairing & imperial hospitality`}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-gradient block">
                    {estimatedTotal}
                  </span>
                  <span className="text-[11px] font-mono text-[#D4AF37]/90 font-semibold block mt-0.5">
                    {isDari
                      ? `کل هزینه میز برای ${formData.guests} مهمان`
                      : `Complete Table for ${formData.guests} Guests`}
                  </span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-4 sm:py-5 rounded-full bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.2em] uppercase shadow-[0_4px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_45px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-3 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>{t.reservation.submit}</span>
              </button>
            </motion.form>
          ) : (
            /* CONFIRMED VIP TICKET PASS */
            <motion.div
              key="confirmed-pass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 sm:p-12 rounded-3xl border shadow-2xl space-y-8 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-[#120F0D] border-[#D4AF37]/60 shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
                  : 'bg-white border-[#D4AF37]/60 shadow-[0_30px_90px_rgba(0,0,0,0.1)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-gold-gradient">
                      {t.reservation.confirmedTitle}
                    </h3>
                    <p className="text-xs text-[#A69B89]">{t.reservation.confirmedSub}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase block">
                    {t.reservation.bookingRef}
                  </span>
                  <span className="font-mono text-xl font-bold">{confirmedBooking.bookingRef}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-b border-[#D4AF37]/20 text-xs">
                <div>
                  <span className="text-[#8F8474] font-mono uppercase">{t.reservation.name}</span>
                  <p className="font-bold text-sm mt-1">{confirmedBooking.name}</p>
                </div>
                <div>
                  <span className="text-[#8F8474] font-mono uppercase">{t.reservation.date}</span>
                  <p className="font-bold text-sm mt-1">{confirmedBooking.date}</p>
                </div>
                <div>
                  <span className="text-[#8F8474] font-mono uppercase">{t.reservation.time}</span>
                  <p className="font-bold text-sm mt-1">{confirmedBooking.time}</p>
                </div>
                <div>
                  <span className="text-[#8F8474] font-mono uppercase">{t.reservation.guests}</span>
                  <p className="font-bold text-sm mt-1">
                    {confirmedBooking.guests} {isDari ? 'مهمان' : 'Guests'}
                  </p>
                </div>
              </div>

              {/* Seating Area Saloon (BILINGUAL) & Desk Total Details on Ticket Pass */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-xs">
                <div>
                  <span className="text-[#8F8474] font-mono uppercase block">{t.reservation.area}</span>
                  <p className="font-serif font-bold text-sm text-[#D4AF37] mt-1">
                    {getSaloonLabel(confirmedBooking.seatingArea)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[#8F8474] font-mono uppercase block">
                    {t.reservation.deskTotalEstimate}
                  </span>
                  <p className="font-serif font-bold text-lg text-gold-gradient mt-1">
                    {estimatedTotal}
                  </p>
                </div>
              </div>

              {/* View in Profile Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                <button
                  onClick={() => openProfileWithTab('reservations')}
                  className="px-6 py-3 rounded-full border border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-serif text-xs font-bold tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{isDari ? 'مشاهده در پروفایل VIP' : 'View Pass in VIP Profile'}</span>
                </button>

                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="px-6 py-3 rounded-full text-xs font-serif tracking-wider text-[#A69B89] hover:text-[#D4AF37] transition-colors"
                >
                  {t.reservation.bookAnother}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
