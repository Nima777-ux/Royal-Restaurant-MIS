import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Utensils, Feather, Flame } from 'lucide-react';
import { CursorMode } from '../types';
import { useApp } from '../context/AppContext';

interface PhilosophySectionProps {
  setCursorMode: (mode: CursorMode) => void;
}

export function PhilosophySection({ setCursorMode }: PhilosophySectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { t, theme, language } = useApp();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setCursorMode('default');
  };

  return (
    <section
      id="philosophy"
      className={`relative min-h-screen w-full py-16 sm:py-24 md:py-32 px-4 sm:px-8 md:px-12 lg:px-20 flex items-center justify-center overflow-hidden border-t ${
        theme === 'dark' ? 'border-[#D4AF37]/15' : 'border-[#D4AF37]/25'
      }`}
    >
      {/* Background luxury gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(56,38,19,0.25)_0%,transparent_70%)]" />
        <div className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(26,22,18,0.4)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* SECTION EYEBROW */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-xs font-serif tracking-[0.25em] uppercase mb-4 ${
              theme === 'dark'
                ? 'border-[#D4AF37]/30 bg-[#161310]/80 text-[#D4AF37]'
                : 'border-[#D4AF37]/40 bg-white/90 text-[#B8860B] shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {t.philosophy.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase"
          >
            {t.philosophy.title}{' '}
            <span className="text-gold-gradient italic font-serif">
              {t.philosophy.titleHighlight}
            </span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-6"
          />
        </div>

        {/* OVERLAPPING 3D CINEMATIC COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT: 3D INTERACTIVE TILT IMAGE STAGE */}
          <div className="lg:col-span-6 perspective-1000">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setCursorMode('view')}
              style={{
                transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)',
              }}
              className={`relative group rounded-3xl overflow-hidden border shadow-2xl transform-style-3d cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#100D0B] border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
                  : 'bg-white border-[#D4AF37]/45 shadow-[0_25px_60px_rgba(0,0,0,0.1)]'
              }`}
            >
              {/* Main Cinematic Imagery */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85"
                  alt="Nima Haute Dining Room"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Floating Overlap Badge */}
              <div
                className={`absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 p-4 sm:p-6 rounded-2xl border backdrop-blur-xl ${
                  theme === 'dark'
                    ? 'bg-[#120F0D]/90 border-[#D4AF37]/35 text-[#FAF6EE]'
                    : 'bg-white/95 border-[#D4AF37]/45 text-[#1F1A16]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-serif text-[#D4AF37] uppercase font-bold">
                    {t.philosophy.cardSubtitle}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#8C8173]">
                    {t.brand.established.split('•')[0]}
                  </span>
                </div>
                <p className="font-editorial text-sm sm:text-lg italic">
                  {t.philosophy.cardQuote}
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: PHILOSOPHY CONTENT & THREE PILLARS */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:pl-6">
            {/* PILLAR 1 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-[#120F0D]/70 border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                  : 'bg-white border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold tracking-wider">
                  {t.philosophy.pillar1Title}
                </h3>
              </div>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  theme === 'dark' ? 'text-[#B8ADA0]' : 'text-[#5E5244]'
                }`}
              >
                {t.philosophy.pillar1Desc}
              </p>
            </motion.div>

            {/* PILLAR 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-[#120F0D]/70 border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                  : 'bg-white border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold tracking-wider">
                  {t.philosophy.pillar2Title}
                </h3>
              </div>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  theme === 'dark' ? 'text-[#B8ADA0]' : 'text-[#5E5244]'
                }`}
              >
                {t.philosophy.pillar2Desc}
              </p>
            </motion.div>

            {/* PILLAR 3 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                theme === 'dark'
                  ? 'bg-[#120F0D]/70 border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                  : 'bg-white border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
                  <Feather className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold tracking-wider">
                  {t.philosophy.pillar3Title}
                </h3>
              </div>
              <p
                className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  theme === 'dark' ? 'text-[#B8ADA0]' : 'text-[#5E5244]'
                }`}
              >
                {t.philosophy.pillar3Desc}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
