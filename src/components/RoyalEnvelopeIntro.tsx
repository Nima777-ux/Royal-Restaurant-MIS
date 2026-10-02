import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown } from 'lucide-react';

interface RoyalEnvelopeIntroProps {
  onOpenComplete: () => void;
}

export function RoyalEnvelopeIntro({ onOpenComplete }: RoyalEnvelopeIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Play gentle luxury acoustic chime on open using Web Audio
  const playEnvelopeChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Ascending harp celestial chime notes: E5, G#5, B5, E6, G#6, B6
      const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 2.4);
      });
    } catch {
      // Audio autoplay blocked or unsupported
    }
  };

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setHasInteracted(true);
    setIsOpening(true);
    playEnvelopeChime();

    // Flap unfolds, gold light expands
    setTimeout(() => {
      setIsOpen(true);
    }, 1300);

    // Fade out and unveil website
    setTimeout(() => {
      onOpenComplete();
    }, 2400);
  };

  return (
    <div
      id="royal-envelope-portal"
      onClick={handleOpenEnvelope}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-[#070605] overflow-hidden select-none cursor-pointer"
      style={{ perspective: '1800px' }}
    >
      {/* 1. WARM AMBIENT CINEMATIC BACKDROP */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Golden candlelight glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] sm:w-[1300px] h-[900px] sm:h-[1300px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22)_0%,rgba(180,115,35,0.1)_40%,transparent_70%)] animate-[pulse_5s_ease-in-out_infinite]" />

        {/* Ambient atmospheric bokeh light spots */}
        <div className="absolute top-[10%] left-[15%] w-80 h-80 rounded-full bg-amber-600/20 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-[15%] right-[12%] w-96 h-96 rounded-full bg-yellow-500/20 filter blur-3xl animate-pulse" />

        {/* Floating golden sparkle dust */}
        <div className="absolute inset-0">
          {[
            { top: '12%', left: '18%', size: '3px', delay: '0s' },
            { top: '22%', left: '78%', size: '4px', delay: '1s' },
            { top: '58%', left: '12%', size: '3px', delay: '2s' },
            { top: '72%', left: '85%', size: '4px', delay: '0.5s' },
            { top: '88%', left: '38%', size: '2px', delay: '1.5s' },
            { top: '38%', left: '89%', size: '3px', delay: '2.5s' },
            { top: '8%', left: '50%', size: '3px', delay: '1.2s' },
            { top: '82%', left: '18%', size: '4px', delay: '0.8s' },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#FFE5A3] shadow-[0_0_12px_rgba(212,175,55,0.95)] animate-pulse"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size,
                animationDelay: dot.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. DYNAMIC GOLDEN "SOUL" EXPANSION WAVE (USER REQUIREMENT: "when we click that golden should move like soul in the page like when we click the golden border goes wide from around the R to go to screen border") */}
      {isOpening && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {/* Primary Golden Soul Ring expanding to screen borders */}
          <motion.div
            initial={{ scale: 0.6, opacity: 1 }}
            animate={{
              scale: [0.6, 3, 12, 32, 55],
              opacity: [1, 0.95, 0.7, 0.35, 0],
            }}
            transition={{
              duration: 2.1,
              ease: [0.12, 0.8, 0.2, 1],
            }}
            className="w-36 h-36 rounded-full border-[4px] border-[#FFF2C4] shadow-[0_0_100px_rgba(255,234,167,1),0_0_50px_rgba(212,175,55,0.9),inset_0_0_40px_rgba(255,223,128,0.8)] filter blur-[0.5px]"
          />

          {/* Secondary Golden Soul Aura Wave expanding with delay */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{
              scale: [0.4, 2.5, 9, 24, 45],
              opacity: [0.9, 0.8, 0.5, 0.2, 0],
            }}
            transition={{
              duration: 2.0,
              delay: 0.12,
              ease: [0.16, 0.85, 0.25, 1],
            }}
            className="w-48 h-48 rounded-full border-[3px] border-[#D4AF37] bg-[radial-gradient(circle,rgba(255,234,167,0.4)_0%,rgba(212,175,55,0.2)_40%,transparent_70%)] shadow-[0_0_120px_rgba(212,175,55,0.95)]"
          />

          {/* Third Golden Soul Pulse */}
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{
              scale: [0.2, 2, 7, 18, 38],
              opacity: [1, 0.85, 0.4, 0.1, 0],
            }}
            transition={{
              duration: 1.9,
              delay: 0.22,
              ease: [0.18, 0.9, 0.3, 1],
            }}
            className="w-56 h-56 rounded-full border-[2px] border-[#FFEAA7]/80 shadow-[0_0_80px_rgba(255,220,100,0.8)]"
          />

          {/* Golden Light Screen-Wide Sweep Wave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.75, 0.3, 0],
            }}
            transition={{
              duration: 1.8,
              ease: 'easeOut',
            }}
            className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/35 via-[#FFEAA7]/25 to-[#D4AF37]/20 pointer-events-none"
          />
        </div>
      )}

      {/* 3. THE GRAND EMBOSSED ROYAL WELCOME MESSAGE ENVELOPE (USER REQUIREMENT: "that should be a welcom message and also it's small in the page I think make the design better") */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 25 }}
        animate={
          isOpen
            ? { opacity: 0, scale: 1.08, y: -25, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } }
            : { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
        }
        className="relative w-[360px] sm:w-[490px] md:w-[600px] lg:w-[660px] max-w-[95vw] h-[520px] sm:h-[640px] md:h-[720px] lg:h-[760px] max-h-[87vh] rounded-3xl shadow-[0_40px_110px_rgba(0,0,0,0.98),0_18px_50px_rgba(0,0,0,0.7)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Envelope Base Card (Heavy Pearlescent Ivory Paper with Embossed Damask) */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2] to-[#EAE0D0] border-2 border-[#D4AF37]/50 shadow-inner">
          {/* Paper grain and blind-embossed floral lace overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Blind-embossed floral damask filigree pattern (SVG vector lace) */}
          <div className="absolute inset-0 p-6 pointer-events-none opacity-55">
            <svg
              viewBox="0 0 400 600"
              className="w-full h-full stroke-[#B89748] fill-none"
              style={{
                filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.9)) drop-shadow(-1px -1px 0px rgba(180,150,110,0.35))',
              }}
            >
              {/* Ornate border frame */}
              <rect x="15" y="15" width="370" height="570" rx="16" strokeWidth="1" strokeDasharray="3 5" />
              <rect x="24" y="24" width="352" height="552" rx="12" strokeWidth="0.7" />

              {/* Corner floral arabesques */}
              <g strokeWidth="0.8">
                <path d="M 32,32 Q 75,37 65,80 Q 90,48 115,32" />
                <circle cx="70" cy="54" r="3" fill="#D4AF37" fillOpacity="0.4" />
                <path d="M 368,32 Q 325,37 335,80 Q 310,48 285,32" />
                <circle cx="330" cy="54" r="3" fill="#D4AF37" fillOpacity="0.4" />
                <path d="M 32,568 Q 75,563 65,520 Q 90,552 115,568" />
                <circle cx="70" cy="546" r="3" fill="#D4AF37" fillOpacity="0.4" />
                <path d="M 368,568 Q 325,563 335,520 Q 310,552 285,568" />
                <circle cx="330" cy="546" r="3" fill="#D4AF37" fillOpacity="0.4" />
              </g>

              {/* Damask Lace central medallion behind seal */}
              <g strokeWidth="0.6" opacity="0.6">
                <circle cx="200" cy="300" r="110" strokeDasharray="4 6" />
                <circle cx="200" cy="300" r="90" />
                <circle cx="200" cy="300" r="68" strokeDasharray="2 4" />
                <path d="M 200,180 Q 200,260 200,420" strokeDasharray="2 4" />
                <path d="M 90,300 Q 160,300 310,300" strokeDasharray="2 4" />
              </g>
            </svg>
          </div>

          {/* INNER ROYAL WELCOME MESSAGE CARD (USER REQUIREMENT: "that's not an invitition you wrote invitition that should be a welcom message") */}
          <div className="absolute inset-4 sm:inset-6 rounded-2xl bg-gradient-to-b from-[#1C1814] via-[#120F0C] to-[#0A0806] border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col items-center justify-center p-6 sm:p-10 text-center overflow-hidden">
            {/* Radiant golden light burst rays shining from inside */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,223,128,0.35)_0%,rgba(212,175,55,0.18)_35%,transparent_70%)] animate-pulse" />

            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-gradient-to-br from-[#2A2218] to-[#0D0B09] shadow-[0_0_30px_rgba(212,175,55,0.55)]">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase block font-bold">
                  ROYAL WELCOME MESSAGE • پیام خیرمقدم شاهانه
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-gold-gradient mt-2">
                  THE ROYAL CROWN
                </h2>
                <p className="text-[11px] sm:text-xs font-mono tracking-widest text-[#C5BBAA] mt-1.5 uppercase">
                  Haute Gastronomie • 3 Michelin Stars
                </p>
              </div>

              <div className="w-32 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

              <div className="space-y-2 max-w-md mx-auto">
                <p className="font-serif italic text-sm sm:text-lg text-[#F0E6D5] leading-relaxed">
                  «Welcome to our gastronomic palace. Partake in an imperial culinary journey orchestrated for distinguished patrons.»
                </p>
                <p className="font-serif text-xs sm:text-sm text-[#D4AF37]/90 leading-relaxed font-medium">
                  خوش آمدید به قصر سلطنتی رویال کراون؛ ضیافتی بی‌بدیل در اوج هنر آشپزی سه ستاره میشلن.
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/20 text-[#FFEAA7] text-xs sm:text-sm font-mono tracking-widest font-bold shadow-[0_0_20px_rgba(212,175,55,0.35)]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  SANCTUARY UNLOCKED • ورود به کاخ شاهی
                </span>
              </div>
            </div>
          </div>

          {/* LOWER FOLD / BOTTOM FLAP (Embossed triangle rising to center) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#E2D6C4] via-[#EDE3D4] to-[#FAF7F2] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] origin-bottom transition-all duration-700"
            style={{
              clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
              transform: isOpening ? 'translateY(15%) rotateX(-15deg)' : 'none',
              opacity: isOpening ? 0.7 : 1,
            }}
          >
            {/* Embossed lace on bottom flap */}
            <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-45">
              <svg viewBox="0 0 300 150" className="w-64 stroke-[#B89748] fill-none">
                <path d="M 20,130 Q 150,40 280,130" strokeWidth="0.8" />
                <path d="M 50,130 Q 150,60 250,130" strokeWidth="0.6" strokeDasharray="3 4" />
                <circle cx="150" cy="80" r="4" fill="#D4AF37" fillOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* LEFT & RIGHT EMBOSSED SIDE FOLDS */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[50%] bg-gradient-to-r from-[#DFD2C0] to-transparent pointer-events-none opacity-40"
            style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-[50%] bg-gradient-to-l from-[#DFD2C0] to-transparent pointer-events-none opacity-40"
            style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }}
          />

          {/* 3D TOP FOLDING FLAP */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isOpening ? 180 : 0,
              zIndex: isOpening ? 10 : 30,
            }}
            transition={{
              duration: 1.25,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute top-0 left-0 right-0 h-[52%] origin-top"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'visible',
            }}
          >
            {/* Front of Top Flap */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#F4ECE0] to-[#E5D8C6] border-t border-[#D4AF37]/50 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Rich floral lace relief on top flap */}
              <div className="absolute inset-0 flex items-start justify-center pt-4 opacity-65">
                <svg
                  viewBox="0 0 300 200"
                  className="w-full h-full stroke-[#B89748] fill-none"
                  style={{
                    filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.9)) drop-shadow(-1px -1px 0px rgba(180,150,110,0.35))',
                  }}
                >
                  <path d="M 20,10 Q 150,160 280,10" strokeWidth="1" />
                  <path d="M 40,10 Q 150,135 260,10" strokeWidth="0.6" strokeDasharray="3 5" />
                  <path d="M 70,10 Q 150,110 230,10" strokeWidth="0.5" />
                  <circle cx="150" cy="115" r="4" fill="#D4AF37" fillOpacity="0.5" />
                  <circle cx="140" cy="105" r="2.5" fill="#D4AF37" fillOpacity="0.4" />
                  <circle cx="160" cy="105" r="2.5" fill="#D4AF37" fillOpacity="0.4" />
                  <circle cx="150" cy="95" r="3" fill="#D4AF37" fillOpacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Backside of Top Flap */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#221B13] via-[#D4AF37]/40 to-[#120F0C] border-t border-[#D4AF37]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                transform: 'rotateY(180deg) rotateZ(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>
        </div>

        {/* 4. THE LUXURY GOLDEN WAX SEAL WITH MONOGRAM "R" & CIRCLING SHINING BORDER (USER REQUIREMENT: "around the R in the center there should be a golden shining border circling before we click") */}
        <motion.div
          animate={
            isOpening
              ? {
                  scale: [1, 1.35, 0.2],
                  opacity: [1, 1, 0],
                  y: [-10, -50, -100],
                  rotateZ: [0, 15, 35],
                  transition: { duration: 1.0, ease: 'easeOut' },
                }
              : {
                  scale: [1, 1.04, 1],
                  transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                }
          }
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-40"
        >
          {/* CIRCLING SHINING GOLDEN BORDERS AROUND THE "R" */}
          {/* Layer 1: Radiant Golden Outer Circling Orbit Ring (Smooth Clockwise) */}
          <div className="absolute -inset-8 sm:-inset-11 rounded-full border-[2.5px] border-dashed border-[#FFEAA7] opacity-90 animate-[spin_8s_linear_infinite] shadow-[0_0_20px_rgba(255,234,167,0.7)]" />

          {/* Layer 2: Radiant Golden Swirling Gradient Border (Smooth Clockwise with drop shadow) */}
          <div
            className="absolute -inset-6 sm:-inset-8 rounded-full border-[3px] border-transparent animate-[spin_5s_linear_infinite]"
            style={{
              background: 'linear-gradient(45deg, #FFE7A3, transparent 35%, #D4AF37, transparent 75%, #FFF5D6) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
              filter: 'drop-shadow(0 0 15px rgba(255, 223, 128, 1)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))',
            }}
          />

          {/* Layer 3: Counter-rotating Golden Beaded Ring */}
          <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-dotted border-[#FFF8E0] opacity-85 animate-[spin_10s_linear_infinite_reverse]" />

          {/* Layer 4: Orbiting Golden Shimmer Star 1 (Top) */}
          <div className="absolute -inset-8 sm:-inset-11 rounded-full animate-[spin_4.5s_linear_infinite] pointer-events-none">
            <div className="w-4 h-4 rounded-full bg-[#FFFBEB] shadow-[0_0_20px_#FFE7A3,0_0_35px_#D4AF37,0_0_50px_#FFF] absolute -top-2 left-1/2 -translate-x-1/2 border border-[#FFEAA7]" />
          </div>

          {/* Layer 5: Orbiting Golden Shimmer Star 2 (Bottom) */}
          <div className="absolute -inset-8 sm:-inset-11 rounded-full animate-[spin_6.5s_linear_infinite_reverse] pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-[#FFEAA7] shadow-[0_0_15px_#D4AF37,0_0_25px_#FFE7A3] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
          </div>

          {/* Pulsing seal golden aura halo */}
          <div className="absolute -inset-7 rounded-full bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] opacity-50 filter blur-xl animate-pulse" />

          {/* Organic Scalloped Golden Wax Stamp Disc (Larger & More Grand) */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#FFF5D6] via-[#D4AF37] to-[#8C6314] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.85)] flex items-center justify-center p-2.5 border-[3px] border-[#FFE7A3]">
            {/* Wavy melted wax stamp border edge */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FFF2C4]/90 opacity-90" />

            {/* Inner stamped medallion well */}
            <div className="w-full h-full rounded-full bg-gradient-to-tl from-[#7D5811] via-[#D4AF37] to-[#FFF8E0] shadow-inner flex items-center justify-center border border-[#6B4B0E]">
              {/* Concentric engraved stamp bead line */}
              <div className="w-[85%] h-[85%] rounded-full border border-dotted border-[#FFE8A3] flex items-center justify-center relative">
                {/* STYLISH CALLIGRAPHY MONOGRAM "R" */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-16 h-16 sm:w-20 sm:h-20 fill-[#4A3408] filter drop-shadow(2px 2px 0px #FFF7D9) drop-shadow(-1px -1px 0px #2D1F03)"
                >
                  <path d="M 28,24 C 34,22 45,22 55,23 C 68,24 76,30 76,41 C 76,51 68,57 57,59 C 64,65 71,73 78,82 C 73,83 67,83 62,81 C 55,73 49,66 43,60 L 38,60 L 38,80 C 34,81 30,81 26,80 C 26,70 27,45 28,24 Z M 38,32 L 38,51 L 52,51 C 60,51 66,48 66,41 C 66,35 61,32 52,32 Z" />
                  <path
                    d="M 22,25 Q 16,18 24,14 Q 35,10 32,23"
                    stroke="#4A3408"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d="M 62,81 Q 72,86 82,78 Q 88,72 84,65"
                    stroke="#4A3408"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="50" cy="14" r="3" />
                  <circle cx="43" cy="16" r="2.2" />
                  <circle cx="57" cy="16" r="2.2" />
                </svg>

                {/* Diagonal light sheen reflection sweeping across seal */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/45 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 5. TAP TO UNVEIL INSTRUCTION HINT (Updated from invitation to welcome) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isOpening ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 sm:mt-10 text-center relative z-30 px-4"
      >
        <div className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#D4AF37]/70 bg-black/75 backdrop-blur-md shadow-[0_4px_35px_rgba(212,175,55,0.4)] text-[#F5E6B3] hover:border-[#D4AF37] hover:bg-black/90 transition-all group">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse group-hover:scale-110 transition-transform" />
          <span className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-gold-gradient">
            {hasInteracted ? 'OPENING ROYAL WELCOME MESSAGE...' : 'CLICK TO ENTER THE ROYAL CROWN • کلیک برای ورود'}
          </span>
        </div>
        <p className="text-[11px] font-sans text-[#A69B89] tracking-wider mt-2.5 uppercase font-medium">
          Haute Gastronomie Sanctuary • 3 Michelin Stars
        </p>
      </motion.div>
    </div>
  );
}
