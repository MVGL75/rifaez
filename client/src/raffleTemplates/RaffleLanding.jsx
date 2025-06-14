import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classicLanding from "./classic/Landing"
import modernLanding from "./modern/Landing";
import minimalistLanding from "./minimalist/Landing";
import RaffleNotFound from "./RaffleNotFound"
import setCustomRaffle from "./utils/setCustomRaffle";
import RaffleFinalized from "./RaffleFinalized";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});
import Spinner from "../components/spinner";

const TEMPLATES = {
  classic: classicLanding,
  modern: modernLanding,
  popular: minimalistLanding,
}

const dataTemplate = {
  additionalPrizes: [],
  availableTickets: Array.from({ length: 10000 }, (_, i) => i + 1).filter(n => ![33, 35, 67, 109, 844, 1203].includes(n)), // assuming tickets missing were 33,35,67
  border_corner: "round",
  business_name: "Rifaez",
  colorPalette: {
    header: 'black',
    background: 'white',
    accent: '#3782f2',
    borders: '#3782f2',
    color: 'black',
  },
  countdown: "off",
  description: "",
  email: "ejemplo@gmail.com",
  endDate: "2025-08-01T00:00:00.000Z",
  extraInfo: `Con tu boleto liquidado participas por:

CHALLENGER 2016 - 10 JUNIO

BONO:

PIDIENDO Y PAGANDO EN LAS

PRIMERAS 24 HORAS DE

LANZAR EL AUTO:

$10,000 MXN EXTRAS

BONO FORÁNEO:

$5,000 MXN

PRONTO PAGO`,
  facebookUrl: "https://facebook.com/rifaezmx",
  font: "Poppins",
  images: [
    {
      url: '/challenger2016.jpg',
    },
    {
      url: '/challenger2016_2.jpg',
    },
  ],
  isActive: true,
  logo: {
    url: '/RifaezLogo.png',
    public_id: 'uploads/zchgelxpvqx1bhuntts0',
    _id: '684c882f8c1698c4eacdcf55',
  },
  logo_display_name: true,
  logo_position: "center",
  logo_size: "lg",
  logo_type: "on",
  maxParticipants: 10000,
  paymentMethods: [
    {
      bank: "BBVA",
      person: "Juan Pérez",
      number: "1234567890",
      clabe: "012345678901234567",
      instructions: "Envía tu comprobante al WhatsApp una vez realizado el pago.",
    },
    {
      bank: "Santander",
      person: "Laura Gómez",
      number: "0987654321",
      clabe: "765432109876543210",
      instructions: "Envía tu comprobante al WhatsApp una vez realizado el pago.",
    },
  ],
  phone: "6711132200",
  price: 100,
  purchasedTicketDisplay: "cross",
  template: "popular",
  timeLimitPay: 2,
  title: "Dodge Challenger 2016",
};

function RaffleLanding() {
  const { id } = useParams();
  const [raffleData, setRaffle] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [modeTest, setModeTest] = useState(false)
  const [isRaffleOver, setRaffleOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(null);
  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/raffle/${id}`);
        if (res.data.status === 200) {
          const raffle = res.data.raffle;
          const now = new Date();
          const endDate = new Date(raffle.endDate);
          if (now > endDate) {
            setLoading(false)
            setRaffleOver(true)
            return;
          }
          if (isFirstVisit) {
            const res = await api.post(`/api/raffle/${id}/view`);
            setIsFirstVisit(false);
          }
          setLoading(false)
          setCustomRaffle(raffle);
          setRaffle(raffle);
        } else {
          setNotFound(true);
          setLoading(false)
        }
        
      } catch (err) {
        console.log(err)
        setNotFound(true);
        setLoading(false)
      } 
    };
    if(id === "template_classic"){
      const raffle = {...dataTemplate, template: "classic"}
      setCustomRaffle(raffle);
      setModeTest(true)
      setRaffle(raffle)
    } else if(id === "template_popular"){
      const raffle = {...dataTemplate, template: "popular"}
      setCustomRaffle(raffle);
      setModeTest(true)
      setRaffle(raffle)
    } else if (id === "template_modern"){
      const raffle = {...dataTemplate, template: "modern"}
      setCustomRaffle(raffle);
      setModeTest(true)
      setRaffle(raffle)
    } else {
      fetchRaffle();
    }

  }, [id]);
  if(loading) return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Spinner className="w-40 h-40"/>
    </div>
  )
  if(isRaffleOver) return <RaffleFinalized />;
  if(notFound) return <RaffleNotFound />;
  if (!raffleData) return null;
  const Layout = TEMPLATES[raffleData.template] || classicLanding;
  return (
    <Layout raffle={raffleData} test={modeTest}/>
  );
}

export default RaffleLanding;
