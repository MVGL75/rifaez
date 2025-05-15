
import {useState, useEffect} from "react";
import { motion } from "framer-motion";
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, Share2 } from "lucide-react";
import axios from "axios";

const RaffleLanding = () => {
  const {id} = useParams()
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/raffle/${id}`);
        setRaffle(res.data.raffle);
      } catch (err) {
        console.error('Error fetching raffle:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRaffle();
  }, [id]);
  
  if (loading || !raffle) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              {raffle.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {raffle.description}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                className="w-full h-[400px] object-cover"
                alt="Premio de la rifa"
               src="https://images.unsplash.com/photo-1590568630833-c75090853b10" />
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  label="Participantes"
                  value={`${raffle.currentParticipants.length}/${raffle.maxParticipants}`}
                />
                <StatCard
                  icon={<Clock className="w-5 h-5" />}
                  label="Finaliza"
                  value={new Date(raffle.endDate).toLocaleDateString()}
                />
              </div>

              {/* Price and Action */}
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Precio por ticket</p>
                  <p className="text-3xl font-bold">${raffle.price}</p>
                </div>
                <Button className="w-full text-lg py-6" size="lg">
                  Participar Ahora
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{Math.round((raffle.currentParticipants.length / raffle.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${(raffle.currentParticipants.length / raffle.maxParticipants) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Share */}
              <div className="flex justify-center pt-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Compartir</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Rules Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-card rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-primary" />
              Reglas y Condiciones
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>• El ganador será seleccionado de manera aleatoria entre todos los participantes.</p>
              <p>• El sorteo se realizará en la fecha indicada mediante un sistema automatizado.</p>
              <p>• El ganador será contactado por email y tendrá 48 horas para reclamar su premio.</p>
              <p>• El premio será enviado en un plazo máximo de 15 días hábiles.</p>
              <p>• La participación implica la aceptación de estas condiciones.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-card rounded-lg p-4 shadow-lg">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-primary/10 rounded-full text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export default RaffleLanding;
