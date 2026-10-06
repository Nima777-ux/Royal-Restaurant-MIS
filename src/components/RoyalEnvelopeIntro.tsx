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

    // Doors slide and unfold, gold light expands
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
      id="royal-welcome-portal"
      onClick={handleOpenEnvelope}
      className="fixed inset-0 z-[250] w-full h-full min-h-[100dvh] bg-[#070605] overflow-hidden select-none cursor-pointer flex flex-col justify-between"
      style={{ perspective: '2000px' }}
    >
      {/* 1. FULL-SCREEN AMBIENT CINEMATIC BACKDROP */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Golden candlelight glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] sm:w-[1500px] h-[1000px] sm:h-[1500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.24)_0%,rgba(180,115,35,0.09)_45%,transparent_70%)] animate-[pulse_5s_ease-in-out_infinite]" />

        {/* Ambient atmospheric bokeh light spots */}
        <div className="absolute top-[8%] left-[10%] w-96 h-96 rounded-full bg-amber-600/20 filter blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] rounded-full bg-yellow-500/20 filter blur-3xl animate-pulse" />

        {/* Floating golden sparkle dust */}
        <div className="absolute inset-0">
          {[
            { top: '10%', left: '15%', size: '3px', delay: '0s' },
            { top: '20%', left: '80%', size: '4px', delay: '1s' },
            { top: '55%', left: '10%', size: '3px', delay: '2s' },
            { top: '75%', left: '88%', size: '4px', delay: '0.5s' },
            { top: '90%', left: '35%', size: '2px', delay: '1.5s' },
            { top: '35%', left: '92%', size: '3px', delay: '2.5s' },
            { top: '7%', left: '52%', size: '3px', delay: '1.2s' },
            { top: '80%', left: '16%', size: '4px', delay: '0.8s' },
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

      {/* 2. DYNAMIC GOLDEN "SOUL" EXPANSION WAVE (Moves like soul to the screen borders) */}
      {isOpening && (
        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {/* Primary Golden Soul Ring expanding to screen borders */}
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{
              scale: [0.5, 3, 14, 38, 65],
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
            initial={{ scale: 0.35, opacity: 0.9 }}
            animate={{
              scale: [0.35, 2.5, 10, 28, 52],
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
              scale: [0.2, 2, 8, 22, 45],
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

      {/* 3. FULL-SCREEN INNER ROYAL SANCTUARY CHAMBER (Z-10: Revealed as the gates part) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 sm:p-12 text-center overflow-hidden">
        {/* Radiant golden light burst rays shining from inside */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,223,128,0.3)_0%,rgba(212,175,55,0.14)_40%,transparent_75%)] animate-pulse pointer-events-none" />

        {/* Ambient stardust veil */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FFEAA7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.8, scale: 0.96, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-7"
        >
          {/* Imperial Crest Medallion */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-gradient-to-br from-[#2A2218] to-[#0D0B09] shadow-[0_0_40px_rgba(212,175,55,0.6)]">
            <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37]" />
          </div>

          <div>
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.35em] text-[#D4AF37] uppercase block font-bold">
              ROYAL WELCOME MESSAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-gold-gradient mt-2.5">
              THE ROYAL CROWN
            </h2>
            <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-[#C5BBAA] mt-2 uppercase">
              Haute Gastronomie • 3 Michelin Stars
            </p>
          </div>

          <div className="w-40 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

          <div className="space-y-2 max-w-lg mx-auto px-4">
            <p className="font-serif italic text-base sm:text-xl text-[#F0E6D5] leading-relaxed">
              «Welcome to our gastronomic palace. Partake in an imperial culinary journey orchestrated for distinguished patrons.»
            </p>
          </div>

          <div className="pt-3">
            <span className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/20 text-[#FFEAA7] text-xs sm:text-sm font-mono tracking-widest font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              SANCTUARY UNLOCKED • ENTERING THE PALACE
            </span>
          </div>
        </motion.div>
      </div>

      {/* 4. FULL-SCREEN MONOLITHIC PALACE GATES (Z-20: Left & Right Gates filling 100% of the screen) */}
      {/* 4A. LEFT PALACE GATE (Spans from Left 0% to Center 50%, 100% of screen height) */}
      <motion.div
        initial={false}
        animate={{
          x: isOpening ? '-102%' : '0%',
          rotateY: isOpening ? -35 : 0,
          opacity: isOpening ? 0 : 1,
        }}
        transition={{
          duration: 1.4,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="absolute top-0 bottom-0 left-0 w-1/2 h-full z-20 origin-left overflow-hidden shadow-[20px_0_60px_rgba(0,0,0,0.95)] border-r border-[#FFEAA7]/40"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Obsidian Lacquer and Velvet Marble Base */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120C] via-[#100D09] to-[#0A0806]" />

        {/* Ambient Stippled Gold Leaf Striae */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Architectural Left Fluted Column Border */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-14 md:w-20 bg-gradient-to-r from-[#2B2217] via-[#1E1710] to-[#0E0B08] border-r border-[#D4AF37]/35 flex flex-col justify-between py-8 items-center">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] shadow" />
          <div className="w-[1px] h-[70%] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] shadow" />
        </div>

        {/* Left Gate Intricate Baroque Inlay & Heraldic Panel */}
        <div className="absolute inset-4 sm:inset-8 ml-9 sm:ml-16 md:ml-24 border-2 border-[#D4AF37]/50 rounded-2xl p-4 sm:p-8 flex flex-col justify-between pointer-events-none">
          {/* Top Baroque Corner Inscription */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/35 pb-3">
            <span className="font-mono text-[9px] sm:text-xs text-[#D4AF37] tracking-[0.3em] font-bold uppercase">
              THE ROYAL CROWN
            </span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
            </div>
          </div>

          {/* Center Monolithic Gate Engraving */}
          <div className="my-auto py-4 flex flex-col items-center justify-center opacity-85">
            <svg viewBox="0 0 200 360" className="w-36 sm:w-56 md:w-64 stroke-[#D4AF37] fill-none">
              {/* Outer double molding */}
              <rect x="15" y="15" width="170" height="330" rx="12" strokeWidth="1.2" strokeDasharray="4 5" />
              <rect x="25" y="25" width="150" height="310" rx="8" strokeWidth="0.8" />
              {/* Classical Arch Head */}
              <path d="M 25,120 C 25,60 175,60 175,120" strokeWidth="1" />
              <circle cx="100" cy="85" r="18" strokeWidth="0.8" />
              <circle cx="100" cy="85" r="6" fill="#D4AF37" fillOpacity="0.4" />
              {/* Central Diamond Rosette */}
              <path d="M 100,140 L 150,180 L 100,220 L 50,180 Z" strokeWidth="0.9" />
              <circle cx="100" cy="180" r="14" strokeWidth="0.6" strokeDasharray="2 3" />
              <path d="M 100,230 L 100,310" strokeWidth="0.7" strokeDasharray="3 4" />
            </svg>
          </div>

          {/* Bottom Baroque Footer */}
          <div className="flex items-center justify-between border-t border-[#D4AF37]/35 pt-3">
            <span className="font-mono text-[8px] sm:text-[10px] text-[#A69B89] tracking-widest uppercase">
              HAUTE SANCTUARY
            </span>
            <span className="font-serif text-[10px] sm:text-xs text-[#D4AF37] font-bold">
              3★ MICHELIN
            </span>
          </div>
        </div>

        {/* Center Meeting Edge Gilded Astragal Highlight */}
        <div className="absolute top-0 bottom-0 right-0 w-[4px] bg-gradient-to-b from-[#FFF2C4] via-[#D4AF37] to-[#7D5811] shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
      </motion.div>

      {/* 4B. RIGHT PALACE GATE (Spans from Center 50% to Right 100%, 100% of screen height) */}
      <motion.div
        initial={false}
        animate={{
          x: isOpening ? '102%' : '0%',
          rotateY: isOpening ? 35 : 0,
          opacity: isOpening ? 0 : 1,
        }}
        transition={{
          duration: 1.4,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="absolute top-0 bottom-0 right-0 w-1/2 h-full z-20 origin-right overflow-hidden shadow-[-20px_0_60px_rgba(0,0,0,0.95)] border-l border-[#FFEAA7]/40"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Obsidian Lacquer and Velvet Marble Base */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#17120C] via-[#100D09] to-[#0A0806]" />

        {/* Ambient Stippled Gold Leaf Striae */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Architectural Right Fluted Column Border */}
        <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-14 md:w-20 bg-gradient-to-l from-[#2B2217] via-[#1E1710] to-[#0E0B08] border-l border-[#D4AF37]/35 flex flex-col justify-between py-8 items-center">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] shadow" />
          <div className="w-[1px] h-[70%] bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-[#D4AF37]/40 border border-[#D4AF37] shadow" />
        </div>

        {/* Right Gate Intricate Baroque Inlay & Heraldic Panel */}
        <div className="absolute inset-4 sm:inset-8 mr-9 sm:mr-16 md:mr-24 border-2 border-[#D4AF37]/50 rounded-2xl p-4 sm:p-8 flex flex-col justify-between pointer-events-none">
          {/* Top Baroque Corner Inscription */}
          <div className="flex items-center justify-between border-b border-[#D4AF37]/35 pb-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            </div>
            <span className="font-mono text-[9px] sm:text-xs text-[#D4AF37] tracking-[0.3em] font-bold uppercase">
              PARIS & MONTE-CARLO
            </span>
          </div>

          {/* Center Monolithic Gate Engraving */}
          <div className="my-auto py-4 flex flex-col items-center justify-center opacity-85">
            <svg viewBox="0 0 200 360" className="w-36 sm:w-56 md:w-64 stroke-[#D4AF37] fill-none">
              {/* Outer double molding */}
              <rect x="15" y="15" width="170" height="330" rx="12" strokeWidth="1.2" strokeDasharray="4 5" />
              <rect x="25" y="25" width="150" height="310" rx="8" strokeWidth="0.8" />
              {/* Classical Arch Head */}
              <path d="M 25,120 C 25,60 175,60 175,120" strokeWidth="1" />
              <circle cx="100" cy="85" r="18" strokeWidth="0.8" />
              <circle cx="100" cy="85" r="6" fill="#D4AF37" fillOpacity="0.4" />
              {/* Central Diamond Rosette */}
              <path d="M 100,140 L 150,180 L 100,220 L 50,180 Z" strokeWidth="0.9" />
              <circle cx="100" cy="180" r="14" strokeWidth="0.6" strokeDasharray="2 3" />
              <path d="M 100,230 L 100,310" strokeWidth="0.7" strokeDasharray="3 4" />
            </svg>
          </div>

          {/* Bottom Baroque Footer */}
          <div className="flex items-center justify-between border-t border-[#D4AF37]/35 pt-3">
            <span className="font-serif text-[10px] sm:text-xs text-[#D4AF37] font-bold">
              3★ MICHELIN
            </span>
            <span className="font-mono text-[8px] sm:text-[10px] text-[#A69B89] tracking-widest uppercase">
              IMPERIAL GUEST
            </span>
          </div>
        </div>

        {/* Center Meeting Edge Gilded Astragal Highlight */}
        <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b from-[#FFF2C4] via-[#D4AF37] to-[#7D5811] shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
      </motion.div>

      {/* 5. THE CENTRAL LUXURY GOLDEN WAX SEAL WITH MONOGRAM "R" & CIRCLING SHINING BORDERS & TWO CIRCLING POINTS */}
      {/* (CRITICAL REQUIREMENT PRESERVED EXACTLY: "don't make the R and it's two points circling around it change") */}
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
      >
        {/* CIRCLING SHINING GOLDEN BORDERS AROUND THE "R" */}
        {/* Layer 1: Radiant Golden Outer Circling Orbit Ring (Smooth Clockwise) */}
        <div className="absolute -inset-8 sm:-inset-11 rounded-full border-[2.5px] border-dashed border-[#FFEAA7] opacity-90 animate-[spin_8s_linear_infinite] shadow-[0_0_20px_rgba(255,234,167,0.7)]" />

        {/* Layer 2: Radiant Golden Swirling Gradient Border (Smooth Clockwise with drop shadow) */}
        <div
          className="absolute -inset-6 sm:-inset-8 rounded-full border-[3px] border-transparent animate-[spin_5s_linear_infinite]"
          style={{
            background:
              'linear-gradient(45deg, #FFE7A3, transparent 35%, #D4AF37, transparent 75%, #FFF5D6) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
            filter:
              'drop-shadow(0 0 15px rgba(255, 223, 128, 1)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))',
          }}
        />

        {/* Layer 3: Counter-rotating Golden Beaded Ring */}
        <div className="absolute -inset-4 sm:-inset-6 rounded-full border border-dotted border-[#FFF8E0] opacity-85 animate-[spin_10s_linear_infinite_reverse]" />

        {/* Layer 4: Orbiting Golden Shimmer Star 1 (Top Point - circling smoothly) */}
        <div className="absolute -inset-8 sm:-inset-11 rounded-full animate-[spin_4.5s_linear_infinite] pointer-events-none">
          <div className="w-4 h-4 rounded-full bg-[#FFFBEB] shadow-[0_0_20px_#FFE7A3,0_0_35px_#D4AF37,0_0_50px_#FFF] absolute -top-2 left-1/2 -translate-x-1/2 border border-[#FFEAA7]" />
        </div>

        {/* Layer 5: Orbiting Golden Shimmer Star 2 (Bottom Point - circling smoothly) */}
        <div className="absolute -inset-8 sm:-inset-11 rounded-full animate-[spin_6.5s_linear_infinite_reverse] pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-[#FFEAA7] shadow-[0_0_15px_#D4AF37,0_0_25px_#FFE7A3] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>

        {/* Pulsing seal golden aura halo */}
        <div className="absolute -inset-7 rounded-full bg-gradient-to-r from-[#F5E6B3] via-[#D4AF37] to-[#B38728] opacity-50 filter blur-xl animate-pulse" />

        {/* Organic Scalloped Golden Wax Stamp Disc */}
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

      {/* 6. TOP PALACE BANNER (Fixed Header Trim across all devices) */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={isOpening ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-30 pt-4 sm:pt-6 px-4 text-center pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-black/60 backdrop-blur-md text-[9px] sm:text-[11px] font-mono tracking-[0.25em] text-[#FFEAA7] uppercase font-semibold shadow-lg">
          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>THE ROYAL CROWN PALACE • 3 MICHELIN STARS</span>
        </div>
      </motion.div>

      {/* 7. BOTTOM INTERACTIVE PROMPT (Fixed Action Hint across all devices) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isOpening ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="relative z-30 pb-6 sm:pb-8 px-4 text-center pointer-events-none"
      >
        <div className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full border border-[#D4AF37]/75 bg-black/80 backdrop-blur-md shadow-[0_4px_35px_rgba(212,175,55,0.45)] text-[#F5E6B3] group">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-gold-gradient">
            {hasInteracted ? 'OPENING ROYAL SANCTUARY...' : 'CLICK ANYWHERE TO ENTER THE ROYAL CROWN'}
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] font-mono text-[#A69B89] tracking-widest mt-2 uppercase">
          Touch or click to unseal the grand palace doors
        </p>
      </motion.div>
    </div>
  );
}
