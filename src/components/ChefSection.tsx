import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Award, Star, Quote } from 'lucide-react';
import { CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface ChefSectionProps {
  setCursorMode: (mode: CursorMode) => void;
}

export function ChefSection({ setCursorMode }: ChefSectionProps) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { t, theme } = useApp();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!portraitRef.current) return;
    const rect = portraitRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setCursorMode('default');
  };

  return (
    <section
      id="chef"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(51,34,18,0.25)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* LEFT: 3D PORTRAIT WITH CHIAROSCURO LIGHTING */}
          <div className="lg:col-span-6 perspective-1000">
            <motion.div
              ref={portraitRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setCursorMode('view')}
              style={{
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1)',
              }}
              className={`relative group rounded-3xl overflow-hidden border shadow-2xl transform-style-3d cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#0C0A09] border-[#D4AF37]/35 shadow-[0_30px_80px_rgba(0,0,0,0.95)]'
                  : 'bg-white border-[#D4AF37]/45 shadow-[0_30px_80px_rgba(0,0,0,0.12)]'
              }`}
            >
              {/* Chef Portrait Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85"
                  alt="Master Chef Nima"
                  className="w-full h-full object-cover object-top contrast-115 brightness-95 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Overlapping Glass Accolade Ribbon */}
              <div
                className={`absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 p-4 sm:p-6 rounded-2xl border backdrop-blur-xl ${
                  theme === 'dark'
                    ? 'bg-[#120F0D]/90 border-[#D4AF37]/30 text-[#FAF6EE]'
                    : 'bg-white/95 border-[#D4AF37]/40 text-[#1F1A16]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                    <span className="text-[10px] font-mono tracking-widest font-bold ml-1">
                      {t.brand.stars}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-semibold">
                    PARIS • GLOBAL
                  </span>
                </div>
                <h4 className="font-serif text-xl font-bold">
                  {t.chef.titleHighlight}
                </h4>
                <p className="text-xs text-[#D4AF37] font-serif italic">
                  Executive Chef & Culinary Director
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: CHEF NARRATIVE & MANIFESTO */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-serif tracking-[0.25em] uppercase w-fit ${
                theme === 'dark'
                  ? 'border-[#D4AF37]/30 bg-[#161310]/80 text-[#D4AF37]'
                  : 'border-[#D4AF37]/40 bg-white/90 text-[#B8860B] shadow-sm'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              {t.chef.badge}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight uppercase"
            >
              {t.chef.title}{' '}
              <span className="text-gold-gradient italic font-serif">
                {t.chef.titleHighlight}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`font-editorial text-lg sm:text-xl italic leading-relaxed border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#D4AF37] pl-4 rtl:pl-0 rtl:pr-4 py-1 ${
                theme === 'dark' ? 'text-[#FAF6EE]' : 'text-[#1F1A16]'
              }`}
            >
              <Quote className="w-5 h-5 text-[#D4AF37] inline -mt-2 mr-1" />
              {t.chef.quote}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`text-xs sm:text-sm font-sans leading-relaxed ${
                theme === 'dark' ? 'text-[#B8ADA0]' : 'text-[#5E5244]'
              }`}
            >
              {t.chef.bio}
            </motion.p>

            {/* Accolade List */}
            <div
              className={`pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs ${
                theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-[#14110E] border-[#D4AF37]/20'
                    : 'bg-white border-[#D4AF37]/30 shadow-sm'
                }`}
              >
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block mb-1">
                  ACCOLADE
                </span>
                <p className="font-serif font-bold text-xs">{t.chef.award1}</p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-[#14110E] border-[#D4AF37]/20'
                    : 'bg-white border-[#D4AF37]/30 shadow-sm'
                }`}
              >
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block mb-1">
                  SCORE
                </span>
                <p className="font-serif font-bold text-xs">{t.chef.award2}</p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-[#14110E] border-[#D4AF37]/20'
                    : 'bg-white border-[#D4AF37]/30 shadow-sm'
                }`}
              >
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase block mb-1">
                  HONOR
                </span>
                <p className="font-serif font-bold text-xs">{t.chef.award3}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
