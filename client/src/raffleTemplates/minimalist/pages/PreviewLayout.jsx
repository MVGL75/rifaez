import HomePreview from "./HomePreview";
import "../../noRadius.css";
import WhatsWidget from "../../components/WhatsWidget";
import React, { useState } from "react";
import DefaultLogo from "../../components/ui/default-logo";
import { Menu, X, Facebook, Phone, BadgeCheck } from "lucide-react";
import Logo from "../../../Logo";


function VerifiedFooter(){
    return (
        <div className="bg-backgroundRaffle border-t-2 w-full max-w-full border-borderRaffle text-colorRaffle flex gap-3 items-center justify-center px-3 p-3">
            <BadgeCheck />
            Estas Rifas Son Seguras
        </div>
    )
}
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
    <footer className="bg-headerRaffle w-full text-headerRaffle-foreground">
        <div className="flex flex-col items-center w-full">
          
          <div className="text-center underline flex flex-col items-center gap-2 w-full bg-borderRaffle px-3 py-3">
          { raffle.facebookUrl &&
              <a href={raffle.facebookUrl} className="hover:text-primaryRaffle">
                <Facebook size={24} />
              </a>
            }
            <p className="text-xl font-bold">PREGUNTAS AL WHATSAPP</p>
            <a href={`tel:${raffle.phone}`} className="text-xl">
              {setPhoneFormat(raffle.phone)}
            </a>
          </div>
          <div className="text-center text-base px-3 py-3 ">
          <div className="flex items-center gap-4 ">
              <p className="no-underline mt-1">Sitio desarrollado por</p>
              <span>
                <Logo/>
              </span>
            </div>
          </div>
          <div className="mb-5 underline">
            <span>Contacto</span>
          </div>
      </div>
    </footer>
  );
};

const Navbar = ({raffle, logo}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-headerRaffle border-y-[12.5px] shadow-lg border-borderRaffle text-headerRaffle-foreground absolute w-full top-0 z-[150]'>
      <div className="w-full max-w-full box-border mx-auto px-5">
        <div className='flex justify-between items-center h-[45px]'>
          {/* Mobile menu button */}
          <div className={`flex w-full h-full items-center justify-between ${raffle.logo_position === "right" && "flex-row-reverse"}`}>
          <div className={`${raffle.logo_position === "center" && "absolute left-1/2 -translate-x-1/2"} h-[64px] flex gap-2 items-center`}>
            <span className={`${raffle.logo_size === "sm" && "h-12"} ${raffle.logo_size === "md" && "h-14 "} ${raffle.logo_size === "lg" && "h-[85px]"} ${raffle.logo_type === "on" && " round-must border-borderRaffle border-2 rounded-full object-cover aspect-square overflow-hidden"} flex-shrink-0 flex items-center space-x-2 ${raffle.logo_size === "lg" && "translate-y-[10px]"}`}>
              {logo?.url ?
                <img alt="logo" className="h-full" src={logo.url}   />
                : <DefaultLogo className="h-full"/> }
              </span>
            </div>

            <span
                className="block text-center font-medium uppercase leading-[14px] text-xs px-3 py-2"
              >
                Métodos <br/> de Pago
              </span>
              <span
                to="verify"
                className="block text-center font-medium uppercase leading-[14px] text-xs px-3  py-2"
              >
                Boletos <br/> Disponibles
              </span>
          </div>

          
        </div>

      
      </div>
    </nav>
  );
};



function PreviewLayout({raffle, previews, phone, verified, logo}) {
    
  return (
    <div className={`${raffle.border_corner === "square" && "no-radius"} relative w-full h-full max-w-full text-colorRaffle font-fontRaffle max-h-full`}>
        <Navbar raffle={raffle} logo={logo} />
        <div className="overflow-scroll w-full h-full max-w-full max-h-full">
            <div className='flex flex-col min-h-screen w-full bg-backgroundRaffle'>
            <div className="bg-headerRaffle h-[80px]"></div>
            <div className="">
            <HomePreview previews={previews} raffle={raffle} />
            </div>
            
            <Footer raffle={raffle} />
            <div className='w-full sticky bottom-0 right-0'>
                <WhatsWidget number={phone}/>
                {verified &&
                <VerifiedFooter />
                }
            </div>
            </div>
        </div>
    </div>
  );
}

export default PreviewLayout;