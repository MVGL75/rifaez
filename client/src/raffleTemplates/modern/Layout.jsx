import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Aperture } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const navLinks = [
  { to: ".", label: "Boletos Disponibles" },
  { to: "pago", label: "Pago" },
  { to: "contacto", label: "Contacto" },
];

const Layout = ({raffle}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClasses = "bg-primaryRaffle text-colorRaffle-foreground";
  const inactiveLinkClasses = "text-colorRaffle hover:bg-blue-100 hover:text-primaryRaffle";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-backgroundRaffle to-lightColorTint font-fontRaffle">
      <header className="sticky top-0 z-50 bg-lightTint backdrop-blur-md shadow-sm">
        <div className="max-w-[calc(100vw-64px)] w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <NavLink to="" className="flex-shrink-0 flex items-center space-x-2">
                <Aperture className="h-8 w-8 text-primaryRaffle" />
                <span className="font-bold text-xl text-primaryRaffle">MiSitioWeb</span>
              </NavLink>
            </div>
            <nav className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    cn(linkClasses, isActive ? activeLinkClasses : inactiveLinkClasses)
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Abrir menú">
                {isMobileMenuOpen ? <X className="h-6 w-6 text-primaryRaffle" /> : <Menu className="h-6 w-6 text-primaryRaffle" />}
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden bg-backgroundRaffle shadow-lg absolute w-full"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn("block px-3 py-2 rounded-md text-base font-medium", isActive ? activeLinkClasses : inactiveLinkClasses)
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow max-w-[calc(100vw-64px)] w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
             <Outlet context={raffle} />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-backgroundRaffle border-t border-borderRaffle">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Rifaez. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;