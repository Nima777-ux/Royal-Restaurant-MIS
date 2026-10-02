export function LuxuryBackground() {
  // Ultra-lightweight: pure CSS, zero WebGL, zero GPU heat, 0 re-render overhead
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      {/* 1. Deep Restaurant Vignette & Warm Candlelight Atmosphere */}
      <div className="absolute inset-0">
        {/* Soft amber candlelight glow in hero right-center */}
        <div className="absolute top-[18%] right-[10%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.07)_0%,rgba(180,115,35,0.03)_40%,transparent_70%)] animate-[pulse_8s_ease-in-out_infinite]" />

        {/* Subtle warm hearth glow in left midground */}
        <div className="absolute top-[55%] left-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,90,30,0.04)_0%,transparent_65%)]" />

        {/* Vintage cellar warm cognac glow towards bottom */}
        <div className="absolute bottom-[5%] right-[20%] w-[600px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      </div>

      {/* 2. Delicate Haute Cuisine Astrolabe Filigree (Pure SVG, zero CPU) */}
      <div className="absolute top-[12%] right-[4%] w-[480px] h-[480px] opacity-[0.12] hidden md:block">
        <svg viewBox="0 0 500 500" className="w-full h-full stroke-[#D4AF37] fill-none">
          <circle cx="250" cy="250" r="230" strokeWidth="0.75" strokeDasharray="4 8" />
          <circle cx="250" cy="250" r="200" strokeWidth="1" />
          <circle cx="250" cy="250" r="160" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="250" cy="250" r="120" strokeWidth="0.75" />
          <circle cx="250" cy="250" r="80" strokeWidth="0.5" />
          <line x1="250" y1="10" x2="250" y2="490" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.6" />
          <line x1="10" y1="250" x2="490" y2="250" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.6" />
          <line x1="80" y1="80" x2="420" y2="420" strokeWidth="0.5" opacity="0.4" />
          <line x1="420" y1="80" x2="80" y2="420" strokeWidth="0.5" opacity="0.4" />
          <polygon points="250,225 256,244 275,250 256,256 250,275 244,256 225,250 244,244" fill="#D4AF37" opacity="0.25" />
        </svg>
      </div>

      {/* 3. Pure CSS Champagne Gold Dust Embers (Pure CSS hardware accelerated) */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '20%', size: '3px', delay: '0s', duration: '9s' },
          { top: '28%', left: '75%', size: '4px', delay: '1.5s', duration: '11s' },
          { top: '42%', left: '85%', size: '2px', delay: '3s', duration: '8s' },
          { top: '60%', left: '15%', size: '3px', delay: '2s', duration: '10s' },
          { top: '75%', left: '60%', size: '3px', delay: '4s', duration: '12s' },
          { top: '20%', left: '50%', size: '4px', delay: '2.5s', duration: '13s' },
          { top: '82%', left: '80%', size: '3px', delay: '1.8s', duration: '10s' },
        ].map((ember, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#FFE5A3] shadow-[0_0_8px_rgba(212,175,55,0.7)] animate-pulse"
            style={{
              top: ember.top,
              left: ember.left,
              width: ember.size,
              height: ember.size,
              animationDelay: ember.delay,
              animationDuration: ember.duration,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}
