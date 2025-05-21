
import { Route, Routes } from "react-router-dom";
import HomeRaffle from "./pages/Home";
import ContactRaffle from "./pages/Contact";
import PaymentRaffle from "./pages/Payment";
import TicketVerificationRaffle from "./pages/TicketVerification";
import Layout from "./Layout"
import RaffleNotFound from "../RaffleNotFound"
import { useEffect } from "react";

function Landing({raffle}) {
  return (
    <>
       <Routes>
        <Route path="/" element={<Layout raffle={raffle} />}>
          <Route index element={<HomeRaffle />} />
          <Route path="verify" element={<TicketVerificationRaffle />} />
          <Route path="contact" element={<ContactRaffle />} />
          <Route path="payment" element={<PaymentRaffle />} />
          <Route path="*" element={<RaffleNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default Landing;