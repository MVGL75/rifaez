import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import Logo from '../Logo';
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});
import { useAuth } from '../contexts/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const CheckoutForm = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState(null);
  const priceId = searchParams.get("price_id")
  const fetchClientSecret = useCallback(async () => {
    const res = await api.post('/stripe/create-checkout-session', {priceId, customerEmail: user.username}, { withCredentials: true });
    return res.data.clientSecret;
  }, [priceId]);

  const loadCheckout = useCallback(async () => {
    const secret = await fetchClientSecret();
    console.log("Client Secret:", secret);
    setClientSecret(secret);
  }, [fetchClientSecret]);

  useEffect(() => {
    if(priceId){
      loadCheckout();
    }
  }, [priceId, loadCheckout]);


  return (
    <div style={{ padding: '2rem' }}>
      <header className='mx-auto w-fit mb-10'>
        <Link to="/">
          <Logo className='w-10 h-10'/>
        </Link>
      </header>
      {clientSecret && (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}

export const Return = () => {
  const navigate = useNavigate()
  const { setAppError, setUser } = useAuth()
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const redirectUrl = searchParams.get("redirect_url");
  const frontUrl = searchParams.get("front_url");
  const [checkoutStatus, setCheckoutStatus] = useState(null)

  useEffect(() => {
    if (sessionId) {
      const fetchStatus = async () => {
        try {
          const res = await api.get(`/stripe/session-status?session_id=${sessionId}`, { withCredentials: true });
          setCheckoutStatus({...res.data})
          if(redirectUrl && (res.data.status === "complete")){
            const pending = sessionStorage.getItem("pendingForm");
            if (pending) {
              const parsed = JSON.parse(pending);
              const newFormData = new FormData();
        
              Object.entries(parsed.fields).forEach(([key, value]) => {
                newFormData.append(key, value);
              });
              try {
                const res = await api.post(`${redirectUrl}`, newFormData, { withCredentials: true });
                setUser(res.data.user)
                console.log(`${frontUrl}?success=true&link=${res.data.link}`)
                return navigate(`${frontUrl}?success=true&link=${res.data.link}`)
              } catch (error) {
                setAppError(error)
              } 
          } 
        }
        } catch (error) {
          setAppError(error)
        } 
      }
      fetchStatus();
    }
  }, [sessionId]);
  if(!checkoutStatus) return null;
  return(
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='bg-card shadow-lg px-5 py-5 flex flex-col gap-3'>
      <div className='flex items-center gap-3'>
          <span className='w-16'>Email</span>
          <span>{checkoutStatus.customer_email}</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='w-16'>Plan Name</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='w-16'>Status</span>
          <span>{checkoutStatus.status}</span>
        </div>
      </div>
    </div>
  )
}