
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
  function convertVisitStatsToLocalTime(dailyVisitStats) {
    const localStatsMap = new Map();
  
    dailyVisitStats.forEach(({ date, time }) => {
      time.forEach(({ hour, count }) => {
        const utcDateTimeStr = `${date}T${hour}:00Z`;
        const localDateTime = new Date(utcDateTimeStr);
        
        const localDateStr = localDateTime.toLocaleDateString(undefined, {
          year: 'numeric', month: '2-digit', day: '2-digit'
        });
  
        const localHourStr = localDateTime.toLocaleTimeString(undefined, {
          hour: '2-digit', minute: '2-digit', hour12: false
        }).slice(0, 5); // Format like "14:00"
  
        if (!localStatsMap.has(localDateStr)) {
          localStatsMap.set(localDateStr, {});
        }
  
        const hourMap = localStatsMap.get(localDateStr);
        hourMap[localHourStr] = (hourMap[localHourStr] || 0) + count;
      });
    });
  
    // Convert back to array for use
    return Array.from(localStatsMap.entries()).map(([date, hourMap]) => ({
      date,
      time: Object.entries(hourMap).map(([hour, count]) => ({ hour, count }))
    }));
  }
  function processDailyVisitStats(dailyVisitStats) {
    const localStatsMap = new Map();
    const now = new Date();
    
    // Format for today (e.g., "05/25/2025" depending on locale)
    const todayStr = now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  
    let todayTotal = 0;
  
    dailyVisitStats.forEach(({ date, time }) => {
      time.forEach(({ hour, count }) => {
        const utcDateTimeStr = `${date}T${hour}:00Z`;
        const localDateTime = new Date(utcDateTimeStr);
  
        const localDateStr = localDateTime.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
  
        const localHourStr = localDateTime.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).slice(0, 5); // e.g., "14:00"
  
        // Track today's total
        if (localDateStr === todayStr) {
          todayTotal += count;
        }
  
        // Build grouped structure
        if (!localStatsMap.has(localDateStr)) {
          localStatsMap.set(localDateStr, {});
        }
  
        const hourMap = localStatsMap.get(localDateStr);
        hourMap[localHourStr] = (hourMap[localHourStr] || 0) + count;
      });
    });
  
    // Convert grouped data back to array
    const formattedStats = Array.from(localStatsMap.entries()).map(([date, hourMap]) => ({
      date,
      time: Object.entries(hourMap).map(([hour, count]) => ({ hour, count }))
    }));
  
    return {
      formattedStats, // full grouped data
      todayTotal      // number of visits today in local time
    };
  }
  
  useEffect(() => {
    if (!selectedRaffle) return;
    const date = new Date();
    const getTodayIso = date.toISOString();
    const getToday = getTodayIso.split("T")[0];
    const dailyArray = selectedRaffle?.stats?.dailyVisitStats;
    const dailyV = (dailyArray && dailyArray.length > 0) ? processDailyVisitStats(dailyArray).todayTotal : 0;
    const dailyS = selectedRaffle?.stats?.dailySales?.find(stat => stat.date === getToday)?.count || 0;
    setTodayStats({
      visits: dailyV,
      sales: dailyS,
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
    navigator.clipboard.writeText(`${import.meta.env.VITE_CURRENT_HOST}/raffle/${id}`)
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
        <div className="bg-background p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm text-blue-900 font-medium">Visitas Hoy</p>
              <p className="text-xl font-bold text-blue-700">{todayStats.visits}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
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
