
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import { Search } from "lucide-react";

const TicketVerification = () => {
  const [ticketNumber, setTicketNumber] = useState("");
  const raffle = useOutletContext();

  const handleVerification = (e) => {
    e.preventDefault();
    toast({
      title: "Verificación de Boleto",
      description: "Este boleto está disponible para compra.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <img  alt="Rifas El Tomate Logo" className="w-32 h-32 mx-auto mb-6" src="https://images.unsplash.com/photo-1701500096464-da0c875f2e2e" />
          <h1 className="text-3xl font-bold text-colorRaffle mb-4">
            VERIFICADOR DE BOLETOS
          </h1>
          <p className="text-xl text-colorRaffle">
            {raffle.title}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cardRaffle p-8 rounded-lg shadow-xl"
        >
          <p className="text-colorRaffle text-center mb-8">
            Introduce tu BOLETO, FOLIO ó CELULAR y haz click en "Verificar"
          </p>

          <form onSubmit={handleVerification} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full bg-transparent p-4 rounded text-colorRaffle border-2 border-borderRaffle text-center text-lg"
                placeholder="Escribe Boleto, Folio ó Celular"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primaryRaffle hover:bg-primaryRaffle-400 text-lg py-6"
            >
              Verificar
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-gray-400"
        >
          <p>
            ¿Tienes dudas? Contáctanos por WhatsApp al{" "}
            <a href="tel:6673877638" className="text-colorRaffle">
              (667) 387 7638
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketVerification;
