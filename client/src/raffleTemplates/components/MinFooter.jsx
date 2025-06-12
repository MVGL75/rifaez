
import React from "react";
import {Link} from "react-router-dom";
import { Facebook, Phone } from "lucide-react";

const Footer = ({raffle}) => {
  const setPhoneFormat = (phone) => {
    const digits = phone?.replace(/\D/g, ''); 

    const parts = [];

    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    if (digits?.length >= 4) {
      parts[0] += ') ';
      parts.push(digits.substring(3, Math.min(6, digits.length)));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10));
    }

    return parts.join('');
  }
  return (
    <footer className="bg-headerRaffle w-screen text-headerRaffle-foreground underline">
        <div className="flex flex-col items-center w-full">
          <div className="text-center w-full bg-borderRaffle px-3 py-3">
            <p className="text-xl font-bold">PREGUNTAS AL WHATSAPP</p>
            <a href={`tel:${raffle.phone}`} className="text-xl">
              {setPhoneFormat(raffle.phone)}
            </a>
          </div>
          <div className="text-center text-base px-3 py-3 ">
            <a href="https://rifaez.com">Sistema desarrollado - Rifaez</a>
          </div>
          <div className="mb-5">
            <Link to="/contact">Contacto</Link>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
