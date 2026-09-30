import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, Users, CheckCircle2, User } from 'lucide-react';
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

  const [formData, setFormData] = useState<ReservationData>({
    date: '2026-10-15',
    time: '20:00',
    guests: 2,
    seatingArea: "Chef's Counter",
    name: currentUser.name || 'Lord Nima Al-Kantara',
    email: currentUser.email || 'nima@epicurean.vip',
    phone: currentUser.phone || '+33 6 12 34 56 78',
    dietaryNotes: preselectedDish ? `Specially requesting: ${preselectedDish}` : '',
  });

  const [confirmedBooking, setConfirmedBooking] = useState<ReservationData | null>(null);

  // Sync user updates if logged in
  useEffect(() => {
    if (currentUser.isAuthenticated && currentUser.name) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
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
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      {/* Warm ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(59,38,19,0.25)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-serif tracking-[0.25em] uppercase mb-4 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#161310]/80 text-[#D4AF37]'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#B8860B] shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.reservation.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {t.reservation.title}{' '}
            <span className="text-gold-gradient italic font-serif">
              {t.reservation.titleHighlight}
            </span>
          </motion.h2>

          <p
            className={`mt-4 text-sm sm:text-base font-editorial italic max-w-xl ${
              theme === 'dark' ? 'text-[#B3A89B]' : 'text-[#615444]'
            }`}
          >
            {t.reservation.subtitle}
          </p>

          <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6" />
        </div>

        {/* RESERVATION EXPERIENCE FORM / CONFIRMATION VIP PASS */}
        <AnimatePresence mode="wait">
          {!confirmedBooking ? (
            <motion.form
              key="booking-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className={`p-6 sm:p-12 rounded-3xl border shadow-2xl space-y-8 ${
                theme === 'dark'
                  ? 'bg-[#120F0D]/95 border-[#D4AF37]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)]'
                  : 'bg-white border-[#D4AF37]/45 shadow-[0_25px_80px_rgba(0,0,0,0.08)]'
              }`}
            >
              {/* STEP 1: PARTY, SEATING & DATE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Guests count */}
                <div className="space-y-2">
                  <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.reservation.guests}
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                      theme === 'dark'
                        ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                        : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                    }`}
                  >
                    {[1, 2, 3, 4, 6, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {isDari ? 'مهمان (ظرفیت کامل میز)' : `Guest${num > 1 ? 's' : ''} (Full Table)`}
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
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-2xl border font-sans text-sm focus:outline-none focus:border-[#D4AF37] ${
                      theme === 'dark'
                        ? 'bg-[#1A1612] border-[#D4AF37]/25 text-[#FAF6EE]'
                        : 'bg-[#FAF8F5] border-[#D4AF37]/35 text-[#1F1A16]'
                    }`}
                  />
                </div>

                {/* Seating Area / Saloon Selection (BILINGUAL TRANSLATION IN DARI) */}
                <div className="space-y-2">
                  <label className="text-xs font-serif tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {t.reservation.area}
                  </label>
                  <select
                    value={formData.seatingArea}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seatingArea: e.target.value as any,
                      })
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#D4AF37]/15">
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
                className="w-full py-5 rounded-full bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] text-black font-serif font-bold text-xs tracking-[0.25em] shadow-[0_4px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_45px_rgba(212,175,55,0.7)] transition-all flex items-center justify-center gap-3 active:scale-98"
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
