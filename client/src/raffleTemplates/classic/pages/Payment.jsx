
import React, { useEffect, useState, useRef} from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true,
});

const Payment = () => {
  const raffle = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [success, setSuccess] =  useState(false)
  const [noTickets, setNoTickets] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const topRef = useRef(null);

  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('selectedTickets') || '[]');
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (!tickets.length) {
      return;
    }
    setNoTickets(false)
    setSelectedTickets(tickets);
    setUserInfo(user);
    
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [navigate]);

  const setPhoneFormat = (phone) => {
    const digits = phone.replace(/\D/g, ''); 

    const parts = [];

    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, Math.min(3, digits.length)));
    }
    if (digits?.length >= 4) {
      parts[0] += ') ';
      parts.push(digits.substring(3, Math.min(6, digits.length)));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10));
    }

    return parts.join('');
  }

  const paymentMethods = raffle.paymentMethods.map(method => (
    {
      bank: method.bank,
      accountHolder: method.person,
      accountNumber: method.number,
      clabe: method.clabe,
    }
  ));
  const finalizePayment = async () => {
    const res = await api.post(`/api${location.pathname}`, {...userInfo, tickets: [...selectedTickets]})
    if(res.data.status === 200){
      localStorage.removeItem('selectedTickets');
      localStorage.removeItem('userInfo');
      setSuccess(true)
    } 
  }
  const goToParent = () => {
    const segments = location.pathname.split("/").filter(Boolean); 
    const parentPath = "/" + segments.slice(0, -1).join("/"); 
    navigate(parentPath);
  };

  const formatMethodNumber = (input) => {
    const digits = String(input).replace(/\D/g, '');
  
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
  function formatCLABE(clabe) {
    if (!clabe) return "";
  
    const digits = clabe.replace(/\D/g, '').slice(0, 18);
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,11})(\d{0,1})$/);
  
    if (!match) return digits;
  
    // Destructure the match array and ignore the full match at index 0
    const [, bank, branch, account, control] = match;
  
    return [bank, branch, account, control].filter(Boolean).join(' ');
  }

  const handleCopyNumber = (number) => {
    navigator.clipboard.writeText(number);
    toast({
      title: "¡Número Copiado!",
      description: "El número de cuenta ha sido copiado al portapapeles.",
    });
  };
  if(success) return (
    <div className="flex items-center justify-center text-colorRaffle box-border mx-auto max-w-3xl w-[1400px] max-w-[100vw] h-[calc(100vh-280px)] min-h-[500px] py-4">
      <div className="bg-cardRaffle px-8 py-10 border border-gray-800 rounded-lg flex-col justify-center space-y-6 flex">
        <div className="text-3xl">Transaccion Exitosa</div>
        <div className="flex flex-col space-y-4">
          <span>Nombre: {userInfo.name}</span>
          <span>Telefono: {setPhoneFormat(userInfo.phone)}</span>
          <span>Estado: {userInfo.state}</span>
          <span>Boletos:</span>
          <div className="flex flex-wrap gap-2">
                  {selectedTickets.map(ticket => (
                    <span key={ticket} className="bg-primaryRaffle text-colorRaffle-foreground px-3 py-1 rounded-full">
                      #{ticket}
                    </span>
                  ))}
            </div>
        </div>
        <p className="text-base text-colorRaffle-300">Tus boletos han sido adquiridos, pero el pago sigue pendiente hasta que el organizador de la rifa revise tu comprobante y confirme la transacción.</p>
        <button onClick={goToParent} className="text-colorRaffle-foreground rounded-[50px] w-fit bg-primaryRaffle flex justify-center items-center px-6 py-3">Regresar a pagina de rifa</button>
        </div>
    </div>
  );
  if(noTickets) return (
    <div className="text-colorRaffle box-border mx-auto max-w-2xl w-[1400px] max-w-[100vw] min-h-[calc(100vh-280px)] py-4">
      <div className="h-[500px] flex-col justify-center text-center space-y-6 flex items-center">
        <div className="text-3xl">No haz seleccionado un boleto de la rifa</div>
        <p className="text-base text-colorRaffle-300">Debes seleccionar al menos un boleto de la rifa y llenar tu informacion para poder accesar los metodos de pago</p>
        <button onClick={goToParent} className="text-colorRaffle-foreground rounded-[50px] w-fit ml-auto mr-auto bg-primaryRaffle flex justify-center items-center px-6 py-3">Regresar a pagina de rifa</button>
        </div>
      </div>
  );
  return (
    <div className="w-[1400px] max-w-[100vw] mx-auto px-4 py-8" ref={topRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-cardRaffle p-6 rounded-lg mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Purchase Summary */}
            <div>
              <h2 className="text-xl font-bold text-colorRaffle mb-4">Resumen de Compra</h2>
              <div className="space-y-2 text-colorRaffle-300">
                <p><span className="font-bold">Nombre:</span> {userInfo.name}</p>
                <p><span className="font-bold">Teléfono:</span> {setPhoneFormat(userInfo.phone)}</p>
                <p><span className="font-bold">Estado:</span> {userInfo.state}</p>
                <p><span className="font-bold">Boletos Seleccionados:</span></p>
                <div className="flex flex-wrap gap-2">
                  {selectedTickets.map(ticket => (
                    <span key={ticket} className="bg-primaryRaffle text-colorRaffle-foreground px-3 py-1 rounded-full">
                      #{ticket}
                    </span>
                  ))}
                </div>
                <p className="text-xl mt-4">
                  <span className="font-bold">Total a Pagar:</span> ${selectedTickets.length * raffle.price} MXN
                </p>
              </div>
            </div>

            {/* Important Instructions */}
            <div className="bg-primaryRaffle p-4 rounded-lg text-colorRaffle-foreground">
              <p className="text-lg font-bold mb-2">
                ¡IMPORTANTE!
              </p>
              <p className="mb-5">
                Una vez realizado el pago, envía tu comprobante por WhatsApp al{" "}
                <a
                href={`https://wa.me/521${raffle.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline">
                  {setPhoneFormat(raffle.phone)}
                </a>
                {" "}indicando tus números de boleto.
              </p>
              <p>Cuando ya termines eso presiona donde dice <b>Apartar Boletos</b> para apartar tus boletos.</p>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-colorRaffle mb-8 text-center">
          Métodos de Pago
        </h1>
        
        <div className="space-y-6 mb-8">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cardRaffle p-6 rounded-lg text-colorRaffle"
            >
              <h2 className="text-xl font-bold text-colorRaffle mb-4">
                {method.bank}
              </h2>
              <div className="space-y-4">
                <p>
                  <span className="font-semibold">Titular:</span>{" "}
                  {method.accountHolder}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Número de Cuenta:</p>
                  <div
                    onClick={() => handleCopyNumber(method.accountNumber)}
                    variant="outline"
                    size="sm"
                    className="text-colorRaffle hover:text-colorRaffle-600"
                  >
                    {formatMethodNumber(method.accountNumber)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Clabe:</p>
                  <div
                    onClick={() => handleCopyNumber(method.clabe)}
                    variant="outline"
                    size="sm"
                    className="text-colorRaffle hover:text-colorRaffle-600"
                  >
                    {formatCLABE(method.clabe)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <button onClick={finalizePayment} className="text-colorRaffle-foreground rounded-[50px] w-fit ml-auto mr-auto bg-primaryRaffle flex justify-center items-center px-4 py-2 "><span>Apartar Boletos</span></button>
      </motion.div>
    </div>
  );
};

export default Payment;
