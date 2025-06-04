import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useEffect, useState } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prizeImages = raffle.images && raffle.images?.length > 0 ? raffle.images.map((value, index) => {
    return { url: value.url, description: "", alt: `Imagen ${index}` }
  }) : [{url: '', description: '', alt: ''}]
 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  function goToNext() {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % prizeImages.length);
  }
  
  function goToPrev() {
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? prizeImages.length - 1 : prev - 1
    );
  }
  
    const variants = {
      enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        position: 'absolute',
      }),
      center: {
        x: 0,
        opacity: 1,
        position: 'absolute',
      },
      exit: (direction) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        position: 'absolute',
      }),
    };

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
            <div className="md:w-1/2 text-center sm:text-left p-6 sm:p-8 flex flex-col justify-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-primaryRaffle mb-3 sm:mb-4 justify-center sm:justify-start flex items-center">
                <Gift className="h-7 w-7 sm:h-8 sm:w-8 mr-3" />
                1° Lugar
              </CardTitle>
              <p className="text-xl sm:text-xl font-semibold text-colorRaffle mb-1 sm:mb-2">{raffle.title}</p>
              <p className="text-base sm:text-base text-colorRaffle-300">
               {raffle.description}
              </p>
            </div>
            <div className="md:w-1/2 relative md:h-[400px] bg-gray-200 h-[400px] overflow-hidden">
            {prizeImages.map((img, index) => {
                    const isCurrent = index === currentImageIndex;
                    const isPrevious =
                      index === (currentImageIndex - 1 + prizeImages.length) % prizeImages.length;



                    return (
                      <img
                        key={img.url}
                        src={img.url}
                        alt={img.alt}
                        className="absolute top-0 -left-[100%] w-full h-full object-cover"
                        style={{
                          animation: isCurrent ? 'slideInFromLeft 0.5s ease-in-out forwards' : isPrevious && 'slideOut 0.5s ease-in-out forwards'
                        }}
                      />
                    );
                  })}
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center">
        {raffle.additionalPrizes && raffle.additionalPrizes?.map((prize, index) => (
             <PrizeInfo
             key={index}
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