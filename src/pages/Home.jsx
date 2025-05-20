
import React, { useState, useEffect } from "react";
import NoRaffle from "../components/NoRaffle";
import { motion } from "framer-motion";
import { 
  Bell,
  Calendar,
  Eye,
  Copy,
  Home,
  BarChart2,
  PlusCircle,
  Edit,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Plus
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomePage = ({ selectedRaffle }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeVisitors, setActiveVisitors] = useState(42);
  const [copiedClip, setCopiedClip] = useState(false);
  const [chartData, setChartData] = useState({
      labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
      datasets: [
        {
          label: "Visitas",
          data: [100000, 95000, 98000, 97000, 95000, 92000],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4
        },
        {
          label: "Ventas ($)",
          data: [90000, 92000, 93000, 95000, 97000, 100000],
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
          tension: 0.4
        }
      ]
  })
  // const [notifications, setNotifications] = []
  const [todayStats, setTodayStats] = useState({
    visits: 0,
    sales: 0,
    trend: {
      visits: "+12.5%",
      sales: "+8.1%"
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitors(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!selectedRaffle) return;
    const getTodayIso = new Date().toISOString()
    const getToday = getTodayIso.split("T")[0];
    const dailyV = selectedRaffle?.stats?.dailyVisitStats?.find(stat => stat.date === getToday)?.count || 0;
    const dailyS = selectedRaffle?.currentParticipants?.reduce((acc, participant) => {
      if(participant?.date.split("T")[0] === getToday){
        return acc + participant.amount;
      }
      return acc;
    }, 0)
    setTodayStats({
      visits: dailyV,
      sales: dailyS,
      trend: {
        visits: "+12.5%", // You can replace with real logic later
        sales: "+8.1%"
      }
    });
  
  }, [selectedRaffle]);

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
    const hourArray = [now.getHours() - 4 + ':00', now.getHours() - 3 + ':00', now.getHours() - 2 + ':00', now.getHours() - 1 + ':00', now.getHours() + ':00']
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
    console.log(dataSaleArray, dataViewArray)
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






  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const handleCopyLink = (id) => {
    navigator.clipboard.writeText(`localhost:3000/raffle/${id}`)
    setCopiedClip(true);
  }
  useEffect(()=>{
    if(copiedClip){
      const timer = setTimeout(() => {
        setCopiedClip(false); 
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [copiedClip])
  return (
    <div className="">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="bg-white p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600">{todayStats.trend.visits}</span>
              </div>
              <p className="text-sm text-blue-900 font-medium">Visitas Hoy</p>
              <p className="text-xl font-bold text-blue-700">{todayStats.visits}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600">{todayStats.trend.sales}</span>
              </div>
              <p className="text-sm text-green-900 font-medium">Ventas Hoy</p>
              <p className="text-xl font-bold text-green-700">${todayStats.sales}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xs:justify-between xs:items-center mb-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Visitas Activas: {activeVisitors}</span>
            </div>
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-8 p-1 text-sm rounded-md border border-input bg-background"
              />
            </div>
          </div>

          <div className="h-[200px] mb-4">
            <Line options={chartOptions} data={chartData} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium">Notificaciones</h2>
            </div>
            {selectedRaffle?.notifications && selectedRaffle.notifications.length > 0 ? (
              selectedRaffle.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded-lg ${
                    notification.type === "pending"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-muted/50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {notification.message}
                      {notification.type === "pending" && (
                        <span className="ml-2 text-yellow-600">
                          (Pendiente - {notification.amount})
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No tienes ninguna notificación.</div>
            )}

          </div>
        </div>
      </div>

      {/* Desktop View */}
      { !selectedRaffle ? 
        <NoRaffle/>
       :
      <div className="hidden md:block space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-foreground">
            {selectedRaffle.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            Panel de control y estadísticas
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900">Visitas Hoy</h3>
              </div>
              <span className="text-sm font-medium text-blue-600">{todayStats.trend.visits}</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">{todayStats.visits}</p>
            <p className="text-sm text-blue-600 mt-2">Visitantes únicos en las últimas 24 horas</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-900">Ventas Hoy</h3>
              </div>
              <span className="text-sm font-medium text-green-600">{todayStats.trend.sales}</span>
            </div>
            <p className="text-3xl font-bold text-green-700">${todayStats.sales}</p>
            <p className="text-sm text-green-600 mt-2">Ingresos totales del día</p>
          </div>
        </motion.div>

        <div className="flex justify-between items-center">
          <div className="items-center px-3 space-x-3 py-2 rounded-md border border-input bg-background flex">
            <Copy onClick={()=>{handleCopyLink(selectedRaffle._id)}} className="w-4 h-4"/>
            <span className="text-muted-foreground">{copiedClip ? "Copied to clipboard" : `/raffle/${selectedRaffle._id}`}</span>
          </div>
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
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Visitas y Ventas</h2>
          <div className="h-[300px]">
            <Line options={{...chartOptions, plugins: { legend: { display: true, position: "top" }}}} data={chartData} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Notificaciones</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            { selectedRaffle?.notifications && selectedRaffle.notifications.length > 0 ? (
            selectedRaffle?.notifications?.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${
                  notification.type === "pending" 
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-muted/50 border border-muted-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {notification.message}
                    {notification.type === "pending" && (
                      <span className="ml-2 text-yellow-600">
                        (Pendiente - {notification.amount})
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))) : (
              <div className="text-muted-foreground">No tienes ninguna notificación.</div>
            )
            }
          </div>
        </motion.div>
      </div>
}
    </div>
    
  );
};

const NavButton = ({ icon, active = false }) => (
  <button
    className={`p-2 rounded-lg ${
      active ? "text-primary" : "text-gray-500"
    }`}
  >
    {icon}
  </button>
);

export default HomePage;
