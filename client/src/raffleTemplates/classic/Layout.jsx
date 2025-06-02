import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import WhatsWidget from "../components/WhatsWidget";
import "../noRadius.css";
function Layout({raffle}) {
    
  return (
    <div className={`${raffle.border_corner === "square" && "no-radius"} min-h-screen bg-backgroundRaffle text-colorRaffle font-fontRaffle`}>
    <Navbar raffle={raffle} />
    <div className="pt-16">
      <Outlet context={raffle} />
    </div>
    <WhatsWidget number={raffle.phone}/>
    <Footer raffle={raffle} />
    <div className="h-16 w-full"></div>
    </div>
  );
}

export default Layout;