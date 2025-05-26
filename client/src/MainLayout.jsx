import {Link, useLocation, Outlet} from "react-router-dom";
import { useState, useEffect } from "react";
import RaffleSelector from "@/components/RaffleSelector";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/Logo";
import LogoName from "@/LogoName";
import { 
    Home, 
    BarChart2, 
    PlusCircle, 
    Edit, 
    Settings, 
    Bell
  } from "lucide-react";

export default function({selectedRaffle, setSelectedRaffle}){
    const {user} = useAuth()
    const location = useLocation();
    const [notificationsLength, setNotificationsLength] = useState([]);

    useEffect(() => {
    if (user?.raffles) {
        const all = user.raffles.reduce((acc, value) => acc + (value.notifications?.length || 0 ) ,0)
        setNotificationsLength(all)
    }
    }, [user.raffles]);
    const isActive = (path) => location.pathname === path;
      // Mobile navigation items
    const mobileNavItems = [
        { icon: <Home className="w-6 h-6" />, path: "/", label: "Inicio" },
        { icon: <BarChart2 className="w-6 h-6" />, path: "/stats", label: "Estadísticas" },
        { icon: <PlusCircle className="w-6 h-6" />, path: "/create", label: "Crear" },
        { icon: <Edit className="w-6 h-6" />, path: "/edit", label: "Editar" },
        { icon: <Settings className="w-6 h-6" />, path: "/settings", label: "Ajustes" }
    ];
    return(
            <div className="min-h-screen bg-background">
        {/* Desktop Navigation */}
        <nav className="hidden customLg:flex items-center justify-between px-8 py-4 bg-card border-b">
            <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-foreground">
                <LogoName className="w-10 h-10" />
            </Link>
            <div className="flex items-center space-x-4">
                <NavLink to="/" active={isActive("/")}>
                <Home className="w-4 h-4" />
                <span>Inicio</span>
                </NavLink>
                <NavLink to="/stats" active={isActive("/stats")}>
                <BarChart2 className="w-4 h-4" />
                <span>Estadísticas</span>
                </NavLink>
                <NavLink to="/create" active={isActive("/create")}>
                <PlusCircle className="w-4 h-4" />
                <span>Crear</span>
                </NavLink>
                <NavLink to="/edit" active={isActive("/edit")}>
                <Edit className="w-4 h-4" />
                <span>Editar</span>
                </NavLink>
            </div>
            </div>

            <div className="flex items-center space-x-4">
            {(location.pathname === "/" || location.pathname === "/stats") && (
                <div className="w-64">
                <RaffleSelector
                    raffles={user.raffles}
                    selectedRaffle={selectedRaffle}
                    onSelect={setSelectedRaffle}
                />
                </div>
            )}
            <Link to="/notifications" className="p-2 hover:bg-accent rounded-full relative">
                <Bell className="w-5 h-5" />
                {(notificationsLength > 0) &&
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                }
            </Link>
            <NavLink to="/settings" active={isActive("/settings")}>
                <Settings className="w-4 h-4" />
                <span>Ajustes</span>
            </NavLink>
            </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className="customLg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50">
            <div className="flex justify-around items-center p-2">
            {mobileNavItems.map((item) => (
                <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                    isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
                </Link>
            ))}
            </div>
        </nav>

        {/* Mobile Raffle Selector */}
        {(location.pathname === "/" || location.pathname === "/stats") && (
            <div className="customLg:hidden px-4 py-2 bg-card border-b">
            <RaffleSelector
                raffles={user.raffles}
                selectedRaffle={selectedRaffle}
                onSelect={setSelectedRaffle}
            />
            </div>
        )}

        {/* Main Content */}
        <main className="max-w-[1400px] mx-auto px-2 sm:px-4 pt-8 pb-20 customLg:pb-8">
            <Outlet/>
        </main>
        </div>
    )
}

const NavLink = ({ to, children, active = false, className }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );