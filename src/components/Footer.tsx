import { MapPin, Phone, Mail, Clock, User, Sparkles } from 'lucide-react';
import { CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface FooterProps {
  setCursorMode: (mode: CursorMode) => void;
  onNavigate: (sectionId: string) => void;
}

export function Footer({ setCursorMode, onNavigate }: FooterProps) {
  const { t, language, theme, setIsContactModalOpen } = useApp();
  const isDari = language === 'fa';

  return (
    <footer
      id="main-footer"
      className={`relative pt-24 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark'
          ? 'bg-[#060504] border-[#D4AF37]/20 text-[#FAF6EE]'
          : 'bg-[#F2ECE1] border-[#D4AF37]/30 text-[#1F1A16]'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* HUGE CINEMATIC STATEMENT */}
        <div
          className={`pb-20 border-b text-center ${
            theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
          }`}
        >
          <span className="text-xs font-serif tracking-[0.35em] text-[#D4AF37] uppercase block mb-4 font-bold">
            {t.footer.epilogue}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight leading-tight">
            {t.footer.statement.split('.')[0]}.{' '}
            <span className="text-gold-gradient italic block sm:inline">
              {t.footer.statement.split('.')[1] || ''}.
            </span>
          </h2>
        </div>

        {/* MAIN FOOTER COLUMNS */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-16 border-b ${
            theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
          }`}
        >
          {/* BRAND COLUMN */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/15">
                <span className="font-serif text-[#D4AF37] text-lg font-bold">R</span>
              </div>
              <span className="font-serif tracking-[0.2em] text-xl sm:text-2xl font-bold">
                {t.brand.name}
              </span>
            </div>
            <p
              className={`text-xs font-sans leading-relaxed font-light max-w-sm ${
                theme === 'dark' ? 'text-[#A69B89]' : 'text-[#5E5244]'
              }`}
            >
              {t.footer.about}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#D4AF37]">
              <span>PARIS • 8ÈME</span>
              <span>•</span>
              <span>18 SEATS ONLY</span>
            </div>
          </div>

          {/* CONTACT & LOCATION */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-4">
              {t.footer.addressTitle}
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{t.footer.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span dir="ltr">+33 1 42 68 55 00</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>concierge@nima-restaurant.com</span>
            </div>

            {/* Direct Contact Founder Button in Footer */}
            <div className="pt-2">
              <button
                id="footer-contact-owner-btn"
                onClick={() => setIsContactModalOpen(true)}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] hover:text-[#FFF5DC] text-xs font-mono font-bold transition-all shadow-sm group"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>{isDari ? 'تماس با موسس • نیما نبی‌زاده' : 'Contact Founder • Nima Nabizada'}</span>
                <Sparkles className="w-3 h-3 text-[#FFEAA7] animate-pulse" />
              </button>
            </div>
          </div>

          {/* SERVICE HOURS */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-4">
              {t.footer.hoursTitle}
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{t.footer.daysOpen}</p>
                <p className="text-[#8C8173]">{t.footer.hoursOpen}</p>
                <p className="font-medium mt-2">{t.footer.daysClosed}</p>
                <p className="text-[#8C8173]">{t.footer.hoursClosed}</p>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="lg:col-span-2 space-y-2">
            <h4 className="font-serif text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase mb-4">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-2 text-xs font-serif tracking-widest">
              {[
                { id: 'hero', label: t.nav.home },
                { id: 'philosophy', label: t.nav.experience },
                { id: 'signature', label: t.nav.signature },
                { id: 'menu', label: t.nav.menu },
                { id: 'chef', label: t.nav.chef },
                { id: 'gallery', label: t.nav.atmosphere },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C8173] font-mono gap-4">
          <p>© 2026 {t.footer.rights}</p>
          <div className="flex gap-6">
            <span>PARIS</span>
            <span>TOKYO</span>
            <span>DUBAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
