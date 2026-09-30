import { useState, useEffect } from 'react';
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
import { Footer } from './components/Footer';
import { Dish, CursorMode } from './types';
import { AppProvider, useApp } from './context/AppContext';

function MainAppContent() {
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [reservedDishName, setReservedDishName] = useState<string | undefined>(undefined);

  const { theme, isRtl, currentUser, isEmailVerified } = useApp();

  // User requirement: "and until we didn't confirm the email from gmail the page shouldn't load"
  const isAccessLocked = !currentUser.isAuthenticated || !isEmailVerified;

  // Mouse coordinate tracker (-1 to 1 for Three.js WebGL & 3D Parallax)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll Progress and Active Section Tracker
  useEffect(() => {
    if (isAccessLocked) return;

    const handleScroll = () => {
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
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
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
      className={`relative min-h-screen overflow-x-hidden film-grain transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-[#080706] text-[#FAF6EE] selection:bg-[#D4AF37]/30 selection:text-[#FFF5DC]'
          : 'bg-[#FAF7F2] text-[#1F1A16] selection:bg-[#D4AF37]/40 selection:text-[#3D2C04]'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 3D LUXURY RESTAURANT AMBIENCE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LuxuryBackground mousePos={mousePos} />
        <Simple3DBackground mousePos={mousePos} theme={theme} />
      </div>

      {isAccessLocked ? (
        /* LOCKED STATE: PAGE DOES NOT LOAD UNTIL AUTHENTICATED & EMAIL CONFIRMED FROM GMAIL */
        <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
          <AuthModal />
        </div>
      ) : (
        /* UNLOCKED RESTAURANT EXPERIENCE */
        <>
          {/* FLOATING GLASS NAVIGATION */}
          <Navbar
            setCursorMode={setCursorMode}
            onNavigate={scrollToSection}
            activeSection={activeSection}
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

            {/* 5. INGREDIENTS CONSTELLATION ("THE IMPERIAL TERROIR & PROVENANCE ATLAS") */}
            <IngredientsShowcase
              setCursorMode={setCursorMode}
              onSelectDish={(dish) => setSelectedDish(dish)}
            />

            {/* 6. CHEF SECTION ("MASTER CHEF FARID SHAH") */}
            <ChefSection setCursorMode={setCursorMode} />

            {/* 7. RESTAURANT ATMOSPHERE (ASYMMETRIC MASONRY GALLERY) */}
            <AtmosphereGallery setCursorMode={setCursorMode} />

            {/* 8. RESERVATION EXPERIENCE ("YOUR TABLE IS WAITING") */}
            <ReservationSection
              setCursorMode={setCursorMode}
              preselectedDish={reservedDishName}
            />
          </main>

          {/* 9. CINEMATIC FOOTER */}
          <Footer setCursorMode={setCursorMode} onNavigate={scrollToSection} />

          {/* 360 3D DISH INSPECTION MODAL */}
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
