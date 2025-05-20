import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { Button } from "@/components/ui/button";
import { 
    Link as LinkIcon, 
    Check, 
    X, 
    CreditCard as PaymentIcon, 
    Wallet as Bank,
  } from 'lucide-react';
import axios from "axios";
const api = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true,
});



function PricingPlan(){
    const navigate = useNavigate()
    const { setAppError, user, setUser } = useAuth()

    const handleSubscribe = (priceId) => {
        navigate(`/checkout?price_id=${priceId}`);
    }
    const handleSubscribeChange = async (priceId) => {
      try {
        const res = await api.post("/stripe/update-plan", {newPriceId: priceId});
        if(res.data){
          setUser(res.data)
        }
      } catch (error) {
        console.log(error)
        setAppError(error)
      }
    }
    const handleCancelSubscription = async () => {
      try {
        const res = await api.post("/stripe/cancel-subscription");
        if(res.data){
          setUser(res.data)
        }
      } catch (error) {
        console.log(error)
        setAppError(error)
      }
    }
    const plans = [
        {
          id: "basic",
          name: "Plan Básico",
          price_id: import.meta.env.VITE_PRICE_ID_BASIC, 
          price: "$9.99",
          features: [
            "Hasta 5 rifas activas",
            "Soporte básico",
            "Estadísticas básicas"
          ]
        },
        {
          id: "pro",
          name: "Plan Pro",
          price_id: import.meta.env.VITE_PRICE_ID_PRO,
          price: "$19.99",
          features: [
            "Rifas ilimitadas",
            "Soporte prioritario",
            "Estadísticas avanzadas",
            "Dominio personalizado"
          ]
        },
        {
          id: "business",
          name: "Plan Empresarial",
          price_id: import.meta.env.VITE_PRICE_ID_BUSINESS,
          price: "$49.99",
          features: [
            "Todo lo del Plan Pro",
            "API access",
            "Soporte 24/7",
            "Múltiples dominios"
          ]
        }
      ];
    return (
        <>
        <header className='mx-auto w-fit mt-12'>
            <Link to="/">
                <Logo className='w-10 h-10'/>
            </Link>
        </header>
        <div className="max-w-[1400px] mt-[40px] bg-card shadow-lg mx-auto px-8 py-10">
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Suscripción</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-lg border 
                    ${plan.id === user.currentPlan ?
                     "border-primary bg-primary/5" : 
                     "border-input"}  h-[350px] flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-3xl font-bold mt-2">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">por mes</p>
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {user.currentPlan ? (
                    <Button
                      onClick={user.currentPlan === plan.id ? undefined : () => handleSubscribeChange(plan.price_id)}
                      className="w-full mt-auto"
                      variant={user.currentPlan === plan.id ? "outline" : "default"}
                      disabled={user.currentPlan === plan.id} // Optional for UX
                    >
                      {user.currentPlan === plan.id ? "Plan Actual" : "Cambiar Plan"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.price_id)}
                      className="w-full mt-auto"
                      variant="default"
                    >
                      Suscribir
                    </Button>
                  )}

                
                </div>
              ))}
            </div>

            {(user.currentPlan && (user.planStatus === "active")) && (
            
            <div className="mt-8">
              <Button
                variant="destructive"
                className="flex items-center space-x-2"
                onClick={()=>{handleCancelSubscription()}}
              >
                <X className="w-4 h-4" />
                <span>Cancelar Suscripción</span>
              </Button>
            </div> )}
            {(user.currentPlan && (user.planStatus === "canceled")) && (
            
            <div className="mt-8">
              <Button
                variant="destructive"
                className="flex items-center space-x-2"
                onClick={null}
              >
                <X className="w-4 h-4" />
                <span>Suscripcion Cancelada</span>
              </Button>
            </div> )}
          </div>
        </div>
        </>
    )
}

export default PricingPlan