
import { Route, Routes } from "react-router-dom";
import HomeRaffle from "./pages/HomePage";
import ContactRaffle from "./pages/ContactPage";
import PaymentRaffle from "./pages/PaymentPage";
import TicketVerificationRaffle from "./pages/AvailableTicketsPage";
import TicketRaffle from "./pages/TicketsPage";
import Layout from "./Layout"
import RaffleNotFound from "../RaffleNotFound"
import { useEffect, useState } from "react";

function Landing({raffle}) {
  const [availableTickets, setAvailableTickets] = useState(raffle.availableTickets || [])

  return (
    <>
       <Routes>
        <Route path="/" element={<Layout raffle={raffle} />}>
          <Route index  element={<TicketVerificationRaffle availableTickets={availableTickets} />} />
          <Route path="contacto"  element={<ContactRaffle />} />
          <Route path="verificar"  element={<TicketRaffle />} />
          <Route path="pago"  element={<PaymentRaffle setAvailableTickets={setAvailableTickets} />} />
          <Route path="*" element={<RaffleNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default Landing;