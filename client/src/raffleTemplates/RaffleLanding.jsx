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
import Spinner from "../components/spinner";

const TEMPLATES = {
  classic: classicLanding,
  modern: modernLanding,
  minimalist: minimalistLanding,
}

function RaffleLanding() {
  const { id } = useParams();
  const [raffleData, setRaffle] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(null);
  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/api/raffle/${id}`);
        if (res.data.status === 200) {
          if (isFirstVisit) {
            const res = await api.post(`/api/raffle/${id}/view`);
            setIsFirstVisit(false);
          }
          const raffle = res.data.raffle;
          setCustomRaffle(raffle);
          setLoading(false)
          setRaffle(raffle);
        } else {
          setNotFound(true);
          setLoading(false)
        }
        
      } catch (err) {
        setNotFound(true);
        setLoading(fakse)
      } 
    };

    fetchRaffle();
  }, [id]);
  if(loading) return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Spinner className="w-40 h-40"/>
    </div>
  )
  if(notFound) return <RaffleNotFound />;
  if (!raffleData) return null;
  const Layout = TEMPLATES[raffleData.template] || classicLanding;
  return (
    <Layout raffle={raffleData}/>
  );
}

export default RaffleLanding;
