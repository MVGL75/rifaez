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

function RaffleLanding() {
  const { id } = useParams();
  const [raffleData, setRaffle] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
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

    fetchRaffle();
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
    <Layout raffle={raffleData}/>
  );
}

export default RaffleLanding;
