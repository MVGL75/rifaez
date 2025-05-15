
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({raffle}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`${raffle.header === "on" ? "bg-primaryRaffle text-colorRaffle-foreground" : "bg-backgroundRaffle text-colorRaffle"} fixed w-full top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo centered */}
          {raffle.logo_position === "center" &&
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="">
              <img alt="Rifas El Tomate Logo" className="h-14 w-14 rounded-full object-cover" src="https://images.unsplash.com/photo-1701500096464-da0c875f2e2e" />
            </Link>
          </div>
          }
          {/* Desktop Navigation */}
          <div className={`hidden w-full ${raffle.logo_position === "right" && "flex-row-reverse"} md:flex md:items-center md:gap-8`}>
          {raffle.logo_position !== "center" &&
            <Link to="">
              <img alt="Rifas El Tomate Logo" className="h-14 w-14 rounded-full object-cover" src="https://images.unsplash.com/photo-1701500096464-da0c875f2e2e" />
            </Link>
          }
            <div className="text-[15px] hidden md:flex md:items-center md:space-x-4">
              <Link to="payment" className="hover:text-gray-200">Métodos de Pago</Link>
              <Link to="verify" className="hover:text-gray-200">Boletos Disponibles</Link>
              <Link to="contact" className="hover:text-gray-200">Contacto</Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="text-[15px] md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="payment"
                className="block px-3 py-2 text-white hover:bg-[#ff0000]/80"
                onClick={() => setIsOpen(false)}
              >
                Métodos de Pago
              </Link>
              <Link
                to="verify"
                className="block px-3 py-2 text-white hover:bg-[#ff0000]/80"
                onClick={() => setIsOpen(false)}
              >
                Boletos Disponibles
              </Link>
              <Link
                to="contact"
                className="block px-3 py-2 text-white hover:bg-[#ff0000]/80"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
