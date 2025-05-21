import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Award, Gift } from 'lucide-react';

const PrizeInfo = ({ place, title, description, icon }) => {
  const IconComponent = icon || Award;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: place * 0.1 }}
      className="flex-1 min-w-[260px] sm:min-w-[280px]"
    >
      <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 bg-backgroundRaffle">
        <CardHeader className="p-3">
          <div className="flex items-center">
            <IconComponent className={`h-6 w-6 ${place === 1 ? 'text-yellow-500' : 'text-primaryRaffle'} mr-2`} />
            <CardTitle className={`text-lg sm:text-xl ${place === 1 ? 'text-primaryRaffle font-bold' : 'text-colorRaffle-300'}`}>
              {place}° Lugar: {title}
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};


const PrizeSection = ({raffle}) => {
  return (
    <section className="px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Card className="shadow-xl overflow-hidden bg-gradient-to-br from-backgroundRaffle to-lightColorTint border-primaryRaffle border-t-4">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-primaryRaffle mb-3 sm:mb-4 flex items-center">
                <Gift className="h-7 w-7 sm:h-8 sm:w-8 mr-3" />
                Premio Principal
              </CardTitle>
              <p className="text-lg sm:text-xl font-semibold text-colorRaffle mb-1 sm:mb-2">{raffle.title}</p>
              <p className="text-sm sm:text-base text-colorRaffle-300">
               {raffle.description}
              </p>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto bg-gray-200">
               <img  className="w-full h-full object-cover" alt="Playa paradisíaca en Cancún con aguas turquesas y arena blanca" src={raffle.images[0].url} />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center">
        {raffle.additionalPrizes && raffle.additionalPrizes?.map(prize => (
             <PrizeInfo
             place={prize.place}
             title={prize.prize}
           />
        ))
}
      </div>
    </section>
  );
};

export default PrizeSection;