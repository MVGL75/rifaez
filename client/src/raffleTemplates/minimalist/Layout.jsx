import { Outlet } from "react-router-dom";
import Navbar from "../components/MinNavbar";
import Footer from "../components/MinFooter";
import { useEffect } from "react";
import "../noRadius.css";
import WhatsWidget from "../components/WhatsWidget";

function Layout({raffle}) {
    
  return (
    <div className={`${raffle.border_corner === "square" && "no-radius"} flex flex-col min-h-screen bg-backgroundRaffle text-colorRaffle font-fontRaffle`}>
    <Navbar raffle={raffle} />
    <div className="bg-headerRaffle h-[80px] lg:h-[120px]"></div>
    <div className="">
      <Outlet context={raffle} />
    </div>
    <WhatsWidget number={raffle.phone}/>
    <Footer raffle={raffle} />
    </div>
  );
}

export default Layout;