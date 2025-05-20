import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import RaffleNotFound from "./RaffleNotFound"
import setCustomRaffle from "./utils/setCustomRaffle";
import Navbar from "./components/Navbar";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5050",
  withCredentials: true,
});
import Footer from "./components/Footer";

function RaffleLanding() {
  const { id } = useParams();
  const [raffleData, setRaffle] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [notFound, setNotFound] = useState(null);
  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const res = await api.get(`/raffle/${id}`);
        if (res.data.status === 200) {
          if (isFirstVisit) {
            const res = await api.post(`/raffle/${id}/view`);
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

  return (
    <div className="min-h-screen bg-backgroundRaffle text-colorRaffle">
      <Navbar raffle={raffleData} />
      <div className="pt-16">
        <Outlet context={raffleData} />
      </div>
      <Footer raffle={raffleData} />
    </div>
  );
}

export default RaffleLanding;
