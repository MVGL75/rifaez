import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import setCustomRaffle from "./utils/setCustomRaffle";
import Navbar from "./components/Navbar";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5050",
  withCredentials: true,
});
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

function RaffleLanding() {
  const { id } = useParams();
  const [raffleData, setRaffle] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [notFound, setNotFound] = useState(null);
  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        if (isFirstVisit) {
          const res = await api.post(`/raffle/${id}/view`);
          setIsFirstVisit(false);
        }
        const res = await api.get(`/raffle/${id}`);
        if (res.data.status === 400) {
          setNotFound(true);
          return;
        }
        const raffle = res.data.raffle;
        console.log(raffle);
        setCustomRaffle(raffle);
        setRaffle(raffle);
      } catch (err) {
        console.error("Error fetching raffle:", err);
      } finally {
      }
    };

    fetchRaffle();
  }, [id]);

  if (!raffleData) return null;

  return (
    <div className="min-h-screen bg-backgroundRaffle text-colorRaffle">
      <Navbar raffle={raffleData} />
      <div className="pt-16">
        <Outlet context={raffleData} />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default RaffleLanding;
