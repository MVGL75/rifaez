import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

function Layout({raffle}) {
    
  return (
    <div className="min-h-screen bg-backgroundRaffle text-colorRaffle font-fontRaffle">
    <Navbar raffle={raffle} />
    <div className="pt-16">
      <Outlet context={raffle} />
    </div>
    <Footer raffle={raffle} />
    </div>
  );
}

export default Layout;