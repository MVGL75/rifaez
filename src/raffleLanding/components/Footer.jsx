
import React from "react";
import { Facebook, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-backgroundRaffle text-[#646464] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:text-primaryRaffle">
              <Facebook size={24} />
            </a>
            <a href="tel:6673877638" className="hover:text-primaryRaffle">
              <Phone size={24} />
            </a>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">PREGUNTAS AL WHATSAPP</p>
            <a href="tel:6673877638" className="text-xl hover:text-primaryRaffle">
              (667) 387 7638
            </a>
          </div>
          <div className="text-center text-sm text-[#646464] mt-4">
            <p>Sitio desarrollado por</p>
            <a href="/privacy" className="hover:text-primaryRaffle">
              Aviso de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
