import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Toaster } from '@/components/TicketPanel/ui/toaster';
// Pages
import HomePage from "@/pages/Home";
import StatsPage from "@/pages/Stats";
import CreateRafflePage from "@/pages/CreateRaffle";
import EditRafflePage from "@/pages/EditRaffle";
import RaffleEditPage from "@/pages/RaffleEdit";
import SettingsPage from "@/pages/Settings";
import NotificationsPage from "./pages/Notifications";
import RaffleLanding from "@/raffleTemplates/RaffleLanding";

import TicketDetails from "@/pages/TicketDetails";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import axios from "axios";
import PricingPlan from "@/pages/PricingPlan";
import { CheckoutForm, Return } from "@/pages/Stripe";
import AppError from "./AppError";
import PopError from "./PopError";
import AppNotFound from "./AppNotFound";
import RaffleNotFound from "./raffleTemplates/RaffleNotFound";
import HomePromotional from "./HomePromotional";
import RifaezVerification from "./RifaezVerification";
import NoRaffle from "./components/NoRaffle";
import SpinningLogo from "./components/spinner";
import RecoverPass from "./pages/RecoverPass";
import PrivacyPolicy from "./PrivacyPolicy";
import RaffleFinished from "./components/RaffleFinished";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, // same as fetch's credentials: 'include'
});

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};
const RaffleSelected = ({ children, selectedRaffle }) => {
  if (selectedRaffle === "null") {
    return <NoRaffle/>;
  } else if (selectedRaffle){
      return children;
  }
  return null;
};
const RaffleFinalizedCheck = ({children, selectedRaffle}) => {
  const [ viewStatistics, setViewStatistics ] = useState(false)
  const isExpired = (endDate) => new Date(endDate) < new Date();
    if(isExpired(selectedRaffle.endDate) && !viewStatistics){
        return <RaffleFinished setViewStatistics={setViewStatistics} raffle={selectedRaffle}/>
    }
    return children;
}
const CheckPlan = ({ children, userJustCreated }) => {
  const {user} = useAuth()
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(false)

  const planRaffleAmount = {
    basic : 1,
    pro: 3,
    business: "unlimited",
  }

  useEffect(() => {
    if (!userJustCreated) {
      const permission = planRaffleAmount[user.currentPlan];

      if (permission && permission !== "unlimited") {
        const activeRaffles = user.raffles?.filter(r => r.isActive);
        const notAllowed = activeRaffles.length >= permission;

        if (notAllowed) {
          return navigate("/pricing-plan", {
            state: {
              message: "Has alcanzado tu límite de rifas activas. Mejora tu plan para crear más o desactiva otra rifa.",
              from: "/create",
            }
          });
        }
      }
    }
    setHasPermission(true)
  }, []);
  if(hasPermission){
    return children;
  }
};
const RedirectHome = () => {
  return <Navigate to="/raffle-admin" />;
};
const AppContent = () => {

  const isCustomDomain = !window.location.host.endsWith("rifaez.com");

  if(isCustomDomain || window.location.host !== "rifaez.com"){
    return (
      <Routes>
        <Route path="/:id/*" element={<RaffleLanding />}></Route>
      </Routes>
    )
  }

  const { user, setUser, appError, popError } = useAuth();
  const [userJustCreated, setUserJustCreated] = useState(false)
  useEffect(() => {
    const themePreference = window.matchMedia("(prefers-color-scheme: dark)");
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && themePreference.matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const handleChange = (e) => {
      if (e.matches && !("theme" in localStorage)) {
        document.documentElement.classList.add("dark");
      } else if (!("theme" in localStorage)) {
        document.documentElement.classList.remove("dark");
      }
    };
    themePreference.addEventListener("change", handleChange);
  }, []);

  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedRaffle, setSelectedRaffle] = useState(false);
  const hasFetchedRef = useRef(false);
  const fetchUser = async () => {
    if (hasFetchedRef.current || user) return;
    hasFetchedRef.current = true;
    try {
      try {
        const res = await api.get("/auth/user");
        if (res.data?.status === 401) return;
        const user = res.data;
        const raffles = user?.raffles?.length > 0 ? user?.raffles : [null];
        setSelectedRaffle(raffles[0]);
        setUser(user);
      } catch (error) {
        return;
      }
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };
  useEffect(() => {
    if (!user) fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const raffles = user?.raffles?.length > 0 ? user?.raffles : ["null"];
      setSelectedRaffle(raffles[0]);
    }
  }, [user]);



  if (loadingUser)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <SpinningLogo className="h-40 w-40" />
      </div>
    );

  if (!user) {
    return (
      <Routes>
        {appError ? <Route path="*" element={<AppError />} /> : (
        <>
        <Route path="/" element={<HomePromotional/>} />
        <Route path="/verification" element={<RifaezVerification/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/reset-password" element={<RecoverPass/>}/>
        <Route path="/raffle/:id/*" element={<RaffleLanding />}>
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
        </>
        )}
      </Routes>
    );

  }

  
  if(selectedRaffle && user){
    return (
      <>
        <Routes>
        <Route path="/" element={<HomePromotional/>} />
        <Route path="/verification" element={<RifaezVerification/>} />
          <Route
            path="/raffle-admin"
            element={
              <MainLayout
                selectedRaffle={selectedRaffle}
                setSelectedRaffle={setSelectedRaffle}
              />
            }
          >
            {appError ? (
              <Route path="*" element={<AppError />} />
            ) : (
              <>
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <RaffleSelected selectedRaffle={selectedRaffle}>
                        <RaffleFinalizedCheck selectedRaffle={selectedRaffle}>
                          <HomePage selectedRaffle={selectedRaffle} />
                          </RaffleFinalizedCheck>
                      </RaffleSelected>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="stats"
                  element={
                    <ProtectedRoute>
                      <RaffleSelected selectedRaffle={selectedRaffle}>
                      <RaffleFinalizedCheck selectedRaffle={selectedRaffle}>
                        <StatsPage selectedRaffle={selectedRaffle} />
                        </RaffleFinalizedCheck>
                      </RaffleSelected>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create"
                  element={
                    <ProtectedRoute>
                      <CheckPlan userJustCreated={userJustCreated}>
                        <CreateRafflePage userJustCreated={userJustCreated} setUserJustCreated={setUserJustCreated} />
                      </CheckPlan>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit"
                  element={
                    <ProtectedRoute>
                      <EditRafflePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit/:id"
                  element={
                    <ProtectedRoute>
                      <RaffleEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="notifications" setSelectedRaffle={setSelectedRaffle} element={<ProtectedRoute><NotificationsPage/></ProtectedRoute>}/>
                <Route
                  path="ticket/:raffleID/:transactionID"
                  element={
                    <ProtectedRoute>
                      <TicketDetails />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<AppNotFound />} />
              </>
            )}
          </Route>
          <Route path="/login" element={<RedirectHome />} />
            <Route path="/register" element={<RedirectHome />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
            <Route path="/reset-password" element={<RecoverPass/>}/>
          <Route path="/pricing-plan" element={<PricingPlan />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/checkout/return" element={<Return setUserJustCreated={setUserJustCreated} />} />
          <Route path="/raffle/:id/*" element={<RaffleLanding />}></Route>
        </Routes>
        {popError && <PopError message={popError.message} status={popError.status} />}
      </>
    );
  } 
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
};

export default App;
