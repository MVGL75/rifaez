import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import classicLanding from "./classic/Landing"
import modernLanding from "./modern/Landing";
import minimalistLanding from "./minimalist/Landing";
import RaffleNotFound from "./RaffleNotFound"
import setCustomRaffle from "./utils/setCustomRaffle";
import Navbar from "./components/Navbar";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});
import Footer from "./components/Footer";

const TEMPLATES = {
  classic: classicLanding,
  modern: modernLanding,
  minimalist: minimalistLanding,
}

function RaffleLanding() {
  const { id } = useParams();
  const [raffleData, setRaffle] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [notFound, setNotFound] = useState(null);
  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const res = await api.get(`/api/raffle/${id}`);
        if (res.data.status === 200) {
          if (isFirstVisit) {
            const res = await api.post(`/api/raffle/${id}/view`);
            setIsFirstVisit(false);
          }
          const raffle = res.data.raffle;
          setCustomRaffle(raffle);
          setRaffle(raffle);
        } else {
          setNotFound(true);
        }
        
      } catch (err) {
        setNotFound(true);
      } 
    };

    fetchRaffle();
  }, [id]);

  if(notFound) return <RaffleNotFound />;
  if (!raffleData) return null;
  const Layout = TEMPLATES[raffleData.template] || classicLanding;
  
  return (
    <Layout raffle={raffleData}/>
  );
}

export default RaffleLanding;
