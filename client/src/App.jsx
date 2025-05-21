import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import HomePage from "@/pages/Home";
import StatsPage from "@/pages/Stats";
import CreateRafflePage from "@/pages/CreateRaffle";
import EditRafflePage from "@/pages/EditRaffle";
import RaffleEditPage from "@/pages/RaffleEdit";
import SettingsPage from "@/pages/Settings";
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
import SpinningLogo from "./components/spinner";
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
  if (selectedRaffle !== false) {
    return children;
  }
  return null;
};
const RedirectHome = () => {
  return <Navigate to="/" />;
};
const AppContent = () => {
  const { user, setUser, appError, popError } = useAuth();
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
      const res = await api.get("/auth/user");
      if (res.data?.status === 401) return;
      const user = res.data;
      const raffles = user?.raffles?.length > 0 ? user?.raffles : [null];
      setSelectedRaffle(raffles[0]);
      setUser(user);
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
      const raffles = user?.raffles?.length > 0 ? user?.raffles : [null];
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/raffle/:id/*" element={<RaffleLanding />}>
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route
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
                path="/"
                element={
                  <ProtectedRoute>
                    <RaffleSelected selectedRaffle={selectedRaffle}>
                      <HomePage selectedRaffle={selectedRaffle} />
                    </RaffleSelected>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <RaffleSelected selectedRaffle={selectedRaffle}>
                      <StatsPage selectedRaffle={selectedRaffle} />
                    </RaffleSelected>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateRafflePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit"
                element={
                  <ProtectedRoute>
                    <EditRafflePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <RaffleEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ticket/:raffleID/:transactionID"
                element={
                  <ProtectedRoute>
                    <TicketDetails />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<RedirectHome />} />
              <Route path="/register" element={<RedirectHome />} />
              <Route path="*" element={<AppNotFound />} />
            </>
          )}
        </Route>
        <Route path="/pricing-plan" element={<PricingPlan />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/checkout/return" element={<Return />} />
        <Route path="/raffle/:id/*" element={<RaffleLanding />}></Route>
      </Routes>
      {popError && <PopError message={popError.message} />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
