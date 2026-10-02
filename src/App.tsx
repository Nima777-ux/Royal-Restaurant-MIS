import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Simple3DBackground } from './components/Simple3DBackground';
import { LuxuryBackground } from './components/LuxuryBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PhilosophySection } from './components/PhilosophySection';
import { SignatureDishes } from './components/SignatureDishes';
import { InteractiveMenu } from './components/InteractiveMenu';
import { IngredientsShowcase } from './components/IngredientsShowcase';
import { ChefSection } from './components/ChefSection';
import { AtmosphereGallery } from './components/AtmosphereGallery';
import { ReservationSection } from './components/ReservationSection';
import { DishModal } from './components/DishModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { OwnerContactModal } from './components/OwnerContactModal';
import { Footer } from './components/Footer';
import { RoyalEnvelopeIntro } from './components/RoyalEnvelopeIntro';
import { Dish, CursorMode } from './types';
import { AppProvider, useApp } from './context/AppContext';

function MainAppContent() {
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reservedDishName, setReservedDishName] = useState<string | undefined>(undefined);
  const [showEnvelopeIntro, setShowEnvelopeIntro] = useState<boolean>(true);

  const { theme, isRtl, currentUser, isEmailVerified, isContactModalOpen, setIsContactModalOpen } = useApp();

  // User requirement: "and until we didn't confirm the email from gmail the page shouldn't load"
  const isAccessLocked = !currentUser.isAuthenticated || !isEmailVerified;

  // Ultra-Lightweight Scroll Tracker (Throttled with requestAnimationFrame to prevent re-render lag)
  useEffect(() => {
    if (isAccessLocked) return;

    let ticking = false;
    const sections = [
      'hero',
      'philosophy',
      'signature',
      'menu',
      'ingredients',
      'chef',
      'gallery',
      'reservation',
    ];

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 250;
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const el = document.getElementById(section);
            if (el && scrollPos >= el.offsetTop) {
              setActiveSection((prev) => (prev !== section ? section : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAccessLocked]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReserveWithDish = (dishName: string) => {
    setReservedDishName(dishName);
    scrollToSection('reservation');
  };

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden film-grain transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#080706] text-[#FAF6EE] selection:bg-[#D4AF37]/30 selection:text-[#FFF5DC]'
          : 'bg-[#FAF7F2] text-[#1F1A16] selection:bg-[#D4AF37]/40 selection:text-[#3D2C04]'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 1. ROYAL ENVELOPE INVITATION OPENING (Shown on start of website, opens upon click) */}
      <AnimatePresence>
        {showEnvelopeIntro && (
          <RoyalEnvelopeIntro onOpenComplete={() => setShowEnvelopeIntro(false)} />
        )}
      </AnimatePresence>

      {/* 2. 3D LUXURY RESTAURANT AMBIENCE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LuxuryBackground />
        <Simple3DBackground theme={theme} />
      </div>

      {isAccessLocked ? (
        /* LOCKED STATE: PAGE DOES NOT LOAD UNTIL AUTHENTICATED & EMAIL CONFIRMED FROM GMAIL */
        <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
          <AuthModal />
        </div>
      ) : (
        /* UNLOCKED RESTAURANT EXPERIENCE */
        <>
          {/* FLOATING GLASS NAVIGATION WITH PROMINENT TABS */}
          <Navbar
            setCursorMode={setCursorMode}
            onNavigate={scrollToSection}
            activeSection={activeSection}
            onReplayInvitation={() => setShowEnvelopeIntro(true)}
          />

          {/* MAIN SECTIONS */}
          <main className="relative z-10 w-full overflow-hidden">
            {/* 1. HERO SECTION */}
            <HeroSection
              setCursorMode={setCursorMode}
              onExploreMenu={() => scrollToSection('menu')}
              onReserveTable={() => scrollToSection('reservation')}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />

            {/* 2. RESTAURANT INTRODUCTION ("MORE THAN A RESTAURANT") */}
            <PhilosophySection setCursorMode={setCursorMode} />

            {/* 3. SIGNATURE DISHES 3D PRODUCT SHOWCASE */}
            <SignatureDishes
              setCursorMode={setCursorMode}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />

            {/* 4. INTERACTIVE 3D MENU */}
            <InteractiveMenu
              setCursorMode={setCursorMode}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />

            {/* 5. CULINARY INGREDIENTS & TERROIR */}
            <IngredientsShowcase setCursorMode={setCursorMode} />

            {/* 6. CHEF & CULINARY BRIGADE */}
            <ChefSection setCursorMode={setCursorMode} />

            {/* 7. ATMOSPHERE & ARCHITECTURE GALLERY */}
            <AtmosphereGallery setCursorMode={setCursorMode} />

            {/* 8. ROYAL TABLE RESERVATION SYSTEM */}
            <ReservationSection
              setCursorMode={setCursorMode}
              preselectedDish={reservedDishName}
            />
          </main>

          {/* FOOTER */}
          <Footer setCursorMode={setCursorMode} onNavigate={scrollToSection} />

          {/* DISH 3D INSPECTION MODAL */}
          <DishModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
            setCursorMode={setCursorMode}
            onReserveWithDish={handleReserveWithDish}
          />

          {/* VIP MEMBER PROFILE & SETTINGS MODAL */}
          <ProfileModal
            onReserveWithDish={handleReserveWithDish}
            onNavigateToReservation={() => scrollToSection('reservation')}
            onReplayInvitation={() => setShowEnvelopeIntro(true)}
          />

          {/* OWNER / FOUNDER CONTACT MODAL */}
          <OwnerContactModal
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />

          {/* ROYAL VIP AUTHENTICATION MODAL */}
          <AuthModal />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
