import Logo from "./Logo"
import { Button } from "./raffleTemplates/components/ui/button"
import { Line } from "react-chartjs-2";
import { ChevronRight, Shuffle, Search, Ticket, Check, Router } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
export default function HomePromotional(){
    const navigate = useNavigate()
    const [domainAnimateText, setDomainAnimateText] = useState("")
    const pricing = useRef(null)
    const chartData = {
        labels: ["11:00", "12:00", "13:00", "14:00", "15:00"],
        datasets: [
          {
            label: "Visitas",
            data: [1200, 1900, 1500, 2500, 2200, 3000],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Ventas",
            data: [800, 1200, 1000, 1800, 1600, 2200],
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4
          }
        ]
      }
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
      const plans = [
        {
          id: "basic",
          name: "Plan Básico",
          price_id: import.meta.env.VITE_PRICE_ID_BASIC, 
          price: "$125",
          features: [
            "1 Rifas Activas",
            "1 Plantilla Disponibleo",
            "2 Trabajadores",
            "Dominio personalizado",
          ]
        },
        {
          id: "pro",
          name: "Plan Pro",
          price_id: import.meta.env.VITE_PRICE_ID_PRO,
          price: "$250",
          features: [
            "3 Rifas Activas",
            "2 Plantilla Disponible",
            "5 Trabajadores",
            "Dominio personalizado",
          ]
        },
        {
          id: "business",
          name: "Plan Empresarial",
          price_id: import.meta.env.VITE_PRICE_ID_BUSINESS,
          price: "$500",
          features: [
            "Rifas Ilimitadas",
            "3 Plantilla Disponible",
            "10 Trabajadores",
            "Dominio personalizado",
          ]
        }
      ];
      const [visibleTickets, setVisibleTickets] = useState(60);

      useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 640) {
            setVisibleTickets(30); // small screen
          } else {
            setVisibleTickets(60); // sm and up
          }
        };

        handleResize(); // check on load
        window.addEventListener('resize', handleResize); // watch window size
        return () => window.removeEventListener('resize', handleResize);
      }, []);
      const domainText = "rifaez.com"
    
      
  
      const intervalRef = useRef(null); // keep track of interval

      const scrollPricing = () => {
        document.getElementById("pricing").scrollIntoView({ behavior: 'smooth' });
      }

      useEffect(() => {
        const startAnimation = () => {
          setDomainAnimateText(""); // reset
          intervalRef.current = setInterval(() => {
            setDomainAnimateText(prev => {
              const nextChar = domainText[prev.length];
              if (prev.length >= domainText.length) {
                domainTimeout()
                return prev;
              }
              return prev + nextChar;
            });
          }, 250);
        };

        const domainTimeout = () => {
          setTimeout(() => {
            clearInterval(intervalRef.current); 
            startAnimation();         // restart
          }, 2000);
        }
    
        startAnimation(); // Start on mount
    
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
      }, []);
    
    return (
        <div className="bg-[#FBFCFF] w-[100vw] min-h-[100vh] text-[#242426]">
            <header>
                <div className="mx-auto py-4 max-w-[100vw] sm:px-14 px-6 w-[1400px]">
                    <nav className="w-full flex justify-between">
                        <Logo className="w-8 h-8"/>
                        <button onClick={()=>{navigate("/login")}} className="bg-primary text-white text-sm flex items-center rounded-full gap-1 px-4 py-1.5">
                            <span>Login</span>
                            <ChevronRight className="w-4 h-4"/>                   
                        </button>
                    </nav>
                </div>
            </header>
            <section className="mx-auto mt-12 py-4 max-w-[100vw] sm:px-14 px-6 w-[1300px]">
                <div className="flex items-center flex-col gap-10">
                    <div className="p-4 rounded-lg shadow-md">
                        <Logo className="w-10 h-10"/> 
                    </div>
                    <div className="space-y-6 text-center max-w-[700px]">
                        <h1 className="sm:text-4xl text-2xl">Comparte tus rifas con Rifaez: tú las manejas, nosotros las alojamos.</h1>
                        <p className="sm:text-base text-sm">Con Rifaez crea, administra y controla todas tus rifas en páginas personalizadas alojadas por nosotros.</p>
                    </div>
                    <button onClick={()=>{navigate("/register")}} className="rounded-full px-5 py-2 shadow-sm shadow-primary">Comienza Hoy</button>
                </div>
            </section>
            <section className="w-[700px] relative max-w-[100vw] sm:px-14 px-6 mt-12 mx-auto">
                <div className="rounded-lg border border-gray-900 bg-white shadow-sm bg-white max-w-full">
                    <div className="space-y-1.5 py-3 px-5 border-b border-gray-900">
                    <div className="  flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                        <div className="relative flex-grow w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <div className="pl-10 w-full h-10 sm:h-11 bg-transparent flex h-10 w-full rounded-md border border-gray-900 px-3 py-2 text-sm">
                        
                        </div>
                        </div>
                        <Button 
                        onClick={null} 
                        variant="outline" 
                        className="w-full sm:w-auto border-gray-900 text-gray-900  h-10 sm:h-11 text-sm"
                        >
                        <Shuffle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Elegir al Azar
                        </Button>
                    </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 sm:gap-2">
                        {Array.from({ length: visibleTickets }, (_, i) => i + 1).map((ticket) => (
                            <div key={ticket} className="bg-white text-gray-900 border-gray-900 cursor-pointer p-2 border rounded-md text-center font-medium transform text-xs sm:text-sm">
                                {ticket}
                            </div>
                            
                        ))}
                        </div>
                    </div>
                </div>  
                <div>
                {/* <div className="bg-white absolute p-6 shadow-lg rounded-lg -right-20 -top-10">
                    <img src="/fakePhone.png" className="w-24" alt="" />
                    <button className="absolute left-1/2 -translate-x-1/2 shadow-lg w-[200px]">
                        <span className="bg-primary text-sm text-white py-3 px-4 rounded-xl">Crear Nueva Rifa</span>
                    </button>
                </div> */}
                
                    
                </div>
            </section>
            <section className="mx-auto py-20 max-w-[100vw] sm:px-14 px-8 w-[700px] customLg:w-[1400px]">
                <div className="flex flex-col customLg:flex-row h-full max-w-full justify-between customLg:items-center gap-10">
                    <div className="w-[500px] max-w-full">
                        <div className="flex items-center mb-10 justify-center w-24 h-24 shadow-lg rounded-full">
                                <Ticket className="w-12 h-12 text-primary"/>
                        </div>
                    
                        <div className="max-w-[500px]">
                            <h1 className="max-w-[420px] sm:text-3xl text-2xl mb-8 sm:leading-[42px] leading-[35px] ">Administra todos tus datos desde el panel administrativo de Rifaez.</h1>
                            <p className="mb-6">Usa el panel administrativo para crear, editar y borrar rifas, puedes manejar todos los pagos y tienes estadisticas para analizar tu rifa.</p>
                            <button className="py-1.5 px-4 rounded-full bg-primary text-sm text-white " onClick={scrollPricing}>Ver Planes</button>
                        </div>
                        <div className="flex justify-evenly">
                            
                        </div>
                    </div>
                      <div className="border max-w-full w-[640px] h-[320px] flex justify-center items-center p-5 border-input rounded-xl overflow-hidden shadow-lg">
                      <Line className="" options={chartOptions} data={chartData} />
                      </div>
                </div>
            </section>  
            <section className="bg-white border-t border-b border-input">
                    <div className="mx-auto py-20 max-w-[100vw] sm:px-14 px-6 w-[1300px] ">
                        <div className="flex flex-col items-center">
                          <div className="flex flex-col gap-3 items-center mb-6">
                            <h1 className="sm:text-3xl text-2xl">Conecta tu dominio</h1>
                            <p className="text-gray-700">Rapido y Facil</p>
                          </div>
                          <div className="shadow-lg max-w-full flex gap-3 items-center border border-gray-100 rounded-xl bg-white p-4 mb-8">
                            <div className="h-[32px] w-[48px] flex items-center justify-center">
                              <Router className="text-primary h-[30px] w-[30px]"/>

                            </div>
                              <div className="w-[320px] text-base text-gray-800 rounded-xl bg-[#F2F3FA] py-2 px-4 h-[45px]">
                                {domainAnimateText}
                              </div>
                          </div>
                          <div className="bg-primary text-white text-sm rounded-xl px-5 py-2 relative">
                            Conectar
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-[70%] top-[50%]" width="89" height="86" viewBox="0 0 89 86" fill="none">
                              <g filter="url(#filter0_d_45_299)">
                                <circle cx="19" cy="15" r="15" fill="#F4F4F4"/>
                              </g>
                              <g filter="url(#filter1_d_45_299)">
                                <path d="M23.7605 17.4388C22.2167 16.8481 20.6634 18.2788 21.1255 19.8658L37.2572 75.2748C37.8196 77.2064 40.5611 77.1922 41.1034 75.2548L48.4668 48.9517C48.6827 48.1804 49.338 47.6123 50.1321 47.5079L81.1704 43.429C83.2282 43.1585 83.5629 40.3197 81.6245 39.5781L23.7605 17.4388Z" fill="white"/>
                                <path d="M23.7605 17.4388C22.2167 16.8481 20.6634 18.2788 21.1255 19.8658L37.2572 75.2748C37.8196 77.2064 40.5611 77.1922 41.1034 75.2548L48.4668 48.9517C48.6827 48.1804 49.338 47.6123 50.1321 47.5079L81.1704 43.429C83.2282 43.1585 83.5629 40.3197 81.6245 39.5781L23.7605 17.4388Z" stroke="#E0E0E0"/>
                              </g>
                              <defs>
                                <filter id="filter0_d_45_299" x="0" y="0" width="38" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                  <feOffset dy="4"/>
                                  <feGaussianBlur stdDeviation="2"/>
                                  <feComposite in2="hardAlpha" operator="out"/>
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_45_299"/>
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_45_299" result="shape"/>
                                </filter>
                                <filter id="filter1_d_45_299" x="16.5419" y="16.8019" width="70.8688" height="68.4138" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                  <feOffset dy="4"/>
                                  <feGaussianBlur stdDeviation="2"/>
                                  <feComposite in2="hardAlpha" operator="out"/>
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_45_299"/>
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_45_299" result="shape"/>
                                </filter>
                              </defs>
                            </svg>
                          </div>
                        </div>
                    </div>
            </section>  
            <section className="mx-auto my-20 max-w-[100vw] sm:px-14 px-6 w-[1300px] min-h-[500px]">
            <div className="space-y-6">
            <h2 className="text-2xl text-center md:text-4xl font-medium text-gray-800 mb-12">
                Planes de Suscripción
            </h2>
            
            <div id="pricing" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-6 rounded-2xl bg-[#fff] border border-input h-[350px] flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-medium">{plan.name}</h3>
                    <p className="text-3xl font-semibold mt-2">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">por mes</p>
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                    <Button
                    onClick={()=>{navigate("/register")}}
                      className="w-full mt-auto"
                      variant="default"
                    >
                      Suscribir
                    </Button>

                
                </div>
              ))}
            </div>

          </div>
            </section>
            <footer className="border border-input w-screen h-[100px]"></footer>     
        </div>
    )
}