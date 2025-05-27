
import { Route, Routes } from "react-router-dom";
import HomeRaffle from "./pages/Home";
import ContactRaffle from "./pages/Contact";
import PaymentRaffle from "./pages/Payment";
import TicketVerificationRaffle from "./pages/TicketVerification";
import Layout from "./Layout"
import RaffleNotFound from "../RaffleNotFound"
import { useEffect, useState } from "react";

function Landing({raffle}) {
  const [availableTickets, setAvailableTickets] = useState(raffle.availableTickets || [])
  return (
    <>
       <Routes>
        <Route path="/" element={<Layout raffle={raffle} />}>
          <Route index element={<HomeRaffle availableTickets={availableTickets} />} />
          <Route path="verify" element={<TicketVerificationRaffle />} />
          <Route path="contact" element={<ContactRaffle />} />
          <Route path="payment" element={<PaymentRaffle  setAvailableTickets={setAvailableTickets} />} />
          <Route path="*" element={<RaffleNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default Landing;