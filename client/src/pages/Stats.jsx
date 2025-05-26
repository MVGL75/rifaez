
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion";
import NoRaffle from "../components/NoRaffle";
import { useNavigate } from "react-router-dom";
import { 
  BarChart2, 
  Calendar,
  Eye,
  AlertTriangle,
  DollarSign,
  Search,
  Clock,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MessageSquare,
  Check,
  Phone,
  MapPin,
  User,
  Edit,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_CURRENT_HOST,
  withCredentials: true, 
});

const StatsPage = ({ selectedRaffle }) => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notesOpen, setNotesOpen] = useState({})
  const [chartData, setChartData] = useState({
    labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"],
    datasets: [
      {
        label: "Visitas",
        data: [1200, 1900, 1500, 2500, 2200, 3000, 2800, 3200],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Ventas",
        data: [800, 1200, 1000, 1800, 1600, 2200, 2000, 2400],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  })
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(selectedRaffle?.currentParticipants);
  const getTimeLeft = (target)=>{
    const now = new Date();
    const end = new Date(target?.endDate);
    const diffMs = end - now;

    if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(selectedRaffle))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(selectedRaffle));
    }, 1000);
  
    return () => clearInterval(interval);
  }, [selectedRaffle]);
  
  // Mock data for tickets
  const createDataChart = (hourArray, array) => {
    let dataArray = []
    const localTimeArray = array.time?.map(visit => {
      const utcHour = visit.hour; 
      const utcDate = new Date(`2023-01-01T${utcHour}:00Z`); 
      const localHour = utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      return {hour: localHour, count: visit.count};
    })
    for (let i = 0; i < hourArray.length; i++) {
      const found = localTimeArray.find(visit => visit.hour === hourArray[i])
      if(found){
        dataArray.push(found.count)
      } else {
        dataArray.push(0)
      }
    }
    return dataArray
  }

  useEffect(() => {
    if(!selectedRaffle) return;
    const now = new Date();
    const minutes = now.getMinutes();
    if (minutes >= 30) {
      now.setHours(now.getHours() + 1); 
    }
    now.setMinutes(0, 0, 0);
    const nowHours = now.getHours()
    let hourArray = []
    for (let i = 0; i < 5; i++) {
        const hourData = ((nowHours - 4) + i )
        if(hourData >= 0){
          hourArray[i] = hourData + ':00'
        } else {
          hourArray[i] = (24 + hourData) + ':00'
        }
    }
    const todayVisits = selectedRaffle.stats.dailyVisitStats?.find(visit => visit.date === selectedDate)
    const todaySales = selectedRaffle.stats.dailySales?.find(visit => visit.date === selectedDate)
    let dataViewArray = []
    let dataSaleArray = []
    if(todayVisits){
      dataViewArray = createDataChart(hourArray, todayVisits)
    } else {
      dataViewArray = [0, 0, 0, 0, 0]
    }
    if(todaySales){
      dataSaleArray = createDataChart(hourArray, todaySales)
    } else {
      dataSaleArray = [0, 0, 0, 0, 0]
    }
    setChartData({
      labels: hourArray,
      datasets: [
        {
          label: "Visitas",
          data: [...dataViewArray],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4
        },
        {
          label: "Ventas ($)",
          data: [...dataSaleArray],
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.4
        }
      ]
  })
  }, [selectedDate, selectedRaffle]);

  const toggleNotes = (id) => {
    setNotesOpen(prev => ({...prev, [id]: !prev[id] }));
  }

  const setPhoneFormat = (phone) => {
    const digits = phone?.toString()?.replace(/\D/g, '');
  
    const parts = [];
  
    if (digits?.length > 0) {
      parts.push('(' + digits.substring(0, 3) + ')'); 
    }
    if (digits?.length >= 4) {
      parts.push(' ' + digits.substring(3, 6));
    }
    if (digits?.length >= 7) {
      parts.push('-' + digits.substring(6, 10)); 
    }
  
    return parts.join('');
  };
  

  const searchTicket = (e) => {
    const searchQ = e.target.value
    const searchLower = searchQ.toLowerCase();
    const newFilteredTickets = selectedRaffle?.currentParticipants?.filter(ticket => 
        ticket.phone.toString().includes(searchLower) ||
        ticket.name.toLowerCase().includes(searchLower) ||
        ticket.state.toLowerCase().includes(searchLower) ||
        ticket.amount.toString().includes(searchLower) ||
        ticket.transactionID.toLowerCase().includes(searchLower) ||
        ticket.status.toLowerCase().includes(searchLower) ||
        ticket.tickets.find(ticket_num => ticket_num.toString().includes(searchLower))
      );
    setSearchQuery(searchQ)
    setFilteredTickets(newFilteredTickets)
  }



  const handleMarkAsPaid = async (ticketId) => {
    const res = await api.post(`/api/raffle/${selectedRaffle._id}/${ticketId}/mark_paid`)
    if(res.data.status === 200){
      setFilteredTickets(prev => prev.map(ticket => {
          if(ticketId === ticket._id){
            ticket.status = "paid";
          }
          return ticket
      }))
      setUser(res.data.user)
    }
  };

  



  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top"
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };


  return  (
    <div className="space-y-8">
        <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-foreground">
          Estadísticas de {selectedRaffle.title}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Análisis detallado de la rifa
        </p>
      </motion.div>

      <div className="flex justify-end">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 p-2 rounded-md border border-input bg-background"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          title="Visitas Totales"
          value={selectedRaffle.totalVisits}
          trend=""
          positive
        />
        <StatCard
          icon={<Ticket className="w-5 h-5" />}
          title="Boletos Vendidos"
          value={`${selectedRaffle?.currentParticipants?.reduce((acc, current) => acc + current?.tickets?.length, 0) || 0} / ${selectedRaffle.maxParticipants} `}
          trend=""
          positive
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          title="Pagos Pendientes"
          value={selectedRaffle?.currentParticipants?.length - selectedRaffle?.stats?.paidParticipants}
          trend=""
          positive={false}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Ingresos"
          value={selectedRaffle?.currentParticipants?.reduce((acc, current) => acc + current.amount, 0) || 0}
          trend=""
          positive
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Tiempo Restante
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <TimeBlock label="Días" value={timeLeft.days} />
            <TimeBlock label="Horas" value={timeLeft.hours} />
            <TimeBlock label="Minutos" value={timeLeft.minutes} />
            <TimeBlock label="Segundos" value={timeLeft.seconds} />
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Estado de Boletos
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total de Boletos</span>
              <span className="font-semibold">{selectedRaffle.maxParticipants}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Boletos Pagados</span>
              <span className="font-semibold">{selectedRaffle?.stats?.paidParticipants}</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Boletos Pendientes</span>
              <span className="font-semibold">{selectedRaffle?.currentParticipants?.length - selectedRaffle?.stats?.paidParticipants}</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>Boletos Disponibles</span>
              <span className="font-semibold">{selectedRaffle?.maxParticipants - selectedRaffle?.currentParticipants?.length}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Visitas y Ventas</h2>
        <div className="h-[300px] max-h-fit">
          <Line options={chartOptions} data={chartData} />
        </div>
      </motion.div>

      {/* Tickets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-lg px-4 py-6 sm:px-6 shadow-lg"
      >
        <div className="flex gap-4 md:items-center flex-col justify-between mb-6 md:flex-row">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Boletos Vendidos</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por número o comprador..."
              value={searchQuery}
              onChange={searchTicket}
              className="pl-10 p-2 rounded-md border border-input bg-background w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTickets && filteredTickets.length > 0 ? (
          filteredTickets.map((participant) => (
            <div
              key={participant.transactionID}
              className="bg-muted/50 rounded-lg p-4"
            >
              <div className="flex gap-6 flex-col items-start sm:flex-row sm:justify-between ">
                <div className="space-y-5 w-full sm:w-auto sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <div className="flex items-center grow justify-between sm:justify-start gap-3">
                      <h3 className="font-medium">Transacción #{participant.transactionID}</h3>
                      {participant.tickets.length > 0 && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                          {participant.tickets.length} boletos
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 items-start md:items-center sm:flex-row text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{participant.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{participant.state}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{setPhoneFormat(participant.phone)}</span>
                    </div>
                  </div>

                  {participant.tickets.length > 0 && (
                    <div className="sm:mt-3 pl-8 border-l-2 border-primary/20">
                      <div className="text-sm text-muted-foreground mb-2">
                        Boletos:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {participant.tickets.map((ticket) => (
                          <span
                            key={ticket}
                            className="px-2 py-1 text-sm bg-background rounded-md"
                          >
                            #{ticket}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-col items-left sm:w-auto sm:flex-row sm:items-center gap-2">
                  {participant.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsPaid(participant._id)}
                      className="flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Marcar como Pagado</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/ticket/${selectedRaffle._id}/${participant.transactionID}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>

              <div className="flex  items-center justify-between mt-4 pt-4 border-t border-muted">
                <div className="flex flex-col-reverse items-left sm:flex-row sm:items-center gap-4">
                  <span className={`px-2 py-1 rounded-full w-fit text-xs font-medium ${
                    participant.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {participant.status === "paid" ? "Pagado" : "Pendiente"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {participant.date}
                  </span>
                  <span className="text-sm font-medium">
                    ${participant.amount}
                  </span>
                </div>

                {participant.notes.length > 0 && (
                  <div onClick={()=>{toggleNotes(participant.transactionID)}} className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{participant.notes.length} notas</span>
                  </div>
                )}
              </div>
              {notesOpen[participant.transactionID] && (
                <div className="mt-5 pt-2 border-t-2 border-primary/20">
                  <div className="pl-4 text-sm text-gray-500">Notas</div>
                  <div className="flex flex-col gap-2 py-1 mt-2 pl-8 border-l-2 border-primary/20">
                  { participant.notes?.map((note, index) => (
                      <div key={index} className="text-sm">- {note}</div>
                    ))} 
                  </div>
                </div>
              )}
            </div>
          ))) : (
             <div className="text-muted-foreground">No haz vendido ningun boleto.</div>
          )
        }
        </div>
      </motion.div>
      </>
  
      </div>
   )
  ;
};

const StatCard = ({ icon, title, value, trend, positive }) => (
  <div className="bg-card rounded-lg p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
    </div>
    <h3 className="text-lg font-semibold mt-4">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const TimeBlock = ({ label, value }) => (
  <div className="bg-primary/5 rounded-lg p-2">
    <p className="text-xl font-bold">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default StatsPage;
