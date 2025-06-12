import { useEffect, useState } from 'react';

export default function Countdown({targetDate}){

    const calculateTimeLeft = () => {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      };
    
      const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => clearInterval(timer);
      }, [targetDate]);

    return  (
                <div className="w-full flex text-headerRaffle-foreground">
                    <div className="flex flex-col-reverse items-center relative">
                        <div className="text-xs">Dias</div>
                        <div className="rounded-lg flex items-center justify-center text-2xl font-semibold">{timeLeft.days}</div>
                        
                    </div>
                    <div className="grow flex items-center h-[60px] justify-center">
                        <span className="text-lg">:</span>
                    </div>
                    <div className="flex flex-col-reverse items-center">
                        <div className=" text-xs">Horas</div>
                        <div className="rounded-lg flex items-center justify-center text-2xl font-semibold">{timeLeft.hours}</div>
                    </div>
                    <div className="grow flex items-center h-[60px] justify-center">
                        <span className="text-lg">:</span>
                    </div>
                    <div className="flex flex-col-reverse items-center">
                        <div className=" text-xs">Minutos</div>
                        <div className="rounded-lg flex items-center justify-center text-2xl font-semibold">{timeLeft.minutes}</div>
                    </div>
                    <div className="grow flex items-center h-[60px] justify-center">
                        <span className="text-lg">:</span>
                    </div>
                    <div className="flex flex-col-reverse items-center">
                        <div className=" text-xs">Segundos</div>
                        <div className="rounded-lg flex items-center justify-center text-2xl font-semibold">{timeLeft.seconds}</div>
                    </div>
                </div>
    )

}