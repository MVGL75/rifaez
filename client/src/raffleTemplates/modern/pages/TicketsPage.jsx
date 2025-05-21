
import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { motion } from 'framer-motion';
import { Ticket, CalendarDays, DollarSign } from 'lucide-react';

const ticketOptions = [
  { 
    id: 1, 
    name: "Boleto General", 
    price: "$50", 
    description: "Acceso general al evento principal. Disfruta de todas las áreas comunes y actividades.",
    icon: <Ticket className="h-8 w-8 text-primaryRaffle mb-2" />,
    features: ["Acceso al evento", "Áreas comunes", "Actividades programadas"] 
  },
  { 
    id: 2, 
    name: "Boleto VIP", 
    price: "$120", 
    description: "Experiencia premium con acceso exclusivo, asientos preferenciales y obsequios.",
    icon: <CalendarDays className="h-8 w-8 text-primaryRaffle mb-2" />,
    features: ["Todo en General", "Acceso VIP Lounge", "Asientos preferenciales", "Bebidas de cortesía"]
  },
  { 
    id: 3, 
    name: "Pase de Temporada", 
    price: "$300", 
    description: "Acceso ilimitado a todos los eventos de la temporada. La mejor opción para los verdaderos fanáticos.",
    icon: <DollarSign className="h-8 w-8 text-primaryRaffle mb-2" />,
    features: ["Acceso a todos los eventos", "Descuentos en mercancía", "Invitaciones especiales"]
  },
];

const TicketsPage = () => {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="text-center">
        <h1 className="text-4xl font-bold text-primaryRaffle mb-4">Adquiere tus Boletos</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Selecciona el tipo de boleto que mejor se adapte a tus necesidades y prepárate para una experiencia inolvidable.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ticketOptions.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <CardHeader className="items-center text-center">
                {ticket.icon}
                <CardTitle className="text-2xl text-primaryRaffle">{ticket.name}</CardTitle>
                <CardDescription className="text-3xl font-bold text-gray-800">{ticket.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-4">{ticket.description}</p>
                <ul className="space-y-1 text-sm text-gray-500">
                  {ticket.features.map(feature => <li key={feature} className="flex items-center"><Ticket className="h-4 w-4 mr-2 text-green-500" />{feature}</li>)}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full">
                  Seleccionar Boleto
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-semibold text-primaryRaffle mb-3">Información Importante</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
            <li>Los precios están sujetos a cambios sin previo aviso.</li>
            <li>Todos los boletos son intransferibles y no reembolsables.</li>
            <li>Se aplican términos y condiciones adicionales.</li>
            <li>Para grupos grandes o consultas especiales, contáctanos.</li>
        </ul>
        <div className="h-48 w-full bg-gray-200 mt-4 rounded flex items-center justify-center text-gray-500">
            <img  alt="Placeholder para imagen de información de boletos" className="object-cover w-full h-full rounded" src="https://images.unsplash.com/photo-1560243668-caf0e9776725" />
        </div>
      </section>
    </motion.div>
  );
};

export default TicketsPage;
  